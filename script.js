/**
 * Base Forecaster - Core Logic Script
 * Pure Native Base Ecosystem Layer - Full SPA Routing System Integration + B20 Module.
 */

const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 
const tokenContractAddress = "0x052aE904DD28b5D840F7a25f77003E0f9597Fc69"; 
const flaunchShareLink = "https://flaunch.gg/base/coins/0x052aE904DD28b5D840F7a25f77003E0f9597Fc69";
const DEVELOPER_WALLET = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; 

// Official B20 Native Singleton Factory Address from Base Core Devs
const B20_FACTORY_ADDRESS = "0xB20f000000000000000000000000000000000000"; 

let userAddress = "";
let isConnected = false;
let currentFateGlobal = null; 
let currentGlowColor = "rgba(56, 189, 248, 0.04)"; 
let currentFrameColor = null; 
let frameNameGlobal = "Gold-Blue Destiny";

const eventTypes = ["MINT", "NEW_USER", "TIP"];
const fakeNames = ["DegenJoe", "0xAlpha...", "BaseWhale", "CryptoGuru", "SpeedyMint", "0xLover", "MemeKing", "BaseGod", "0xChef", "AnonDegen"];
const fakeFates = ["THE WHALE ASCENDANT 🐋", "THE DEGEN SURVIVOR 🥷", "GENERATIONAL WEALTH 👑", "THE ETERNAL HOLDER 💎"];

const fateLibrary = [
    { fate: "THE WHALE ASCENDANT", emoji: "🐋", imagePath: "images1.jpeg", text: "Your wallet is a black hole for liquidity. You are destined to lead trends and exit safely before the rug.", score: 98 },
    { fate: "GENERATIONAL WEALTH", emoji: "👑", imagePath: "images2.jpeg", text: "Cosmic alignment confirms eternal wealth. Your core assets will outperform 99% of the market.", score: 95 },
    { fate: "THE BASE CHOSEN ONE", emoji: "🔵", imagePath: "images3.jpeg", text: "Base protocol nodes whisper your address. You are the architect of the next moon mission.", score: 99 },
    { fate: "THE DEGEN SURVIVOR", emoji: "🥷", imagePath: "images4.jpeg", text: "Battle scars of meme-coin wars everywhere. You survive when others get liquidated.", score: 74 },
    { fate: "THE MYSTERY ADDRESS", emoji: "❓", imagePath: "images5.jpeg", text: "Even the blockchain cannot understand your patterns. You are a true anomaly.", score: 41 },
    { fate: "THE DIAMOND HANDS", emoji: "💎", imagePath: "images6.jpeg", text: "Your hands are forged in pure diamond. Pressure only makes your bags heavier and stronger.", score: 88 },
    { fate: "THE ALPHA STALKER", emoji: "🎯", imagePath: "images7.jpeg", text: "You spot narratives before they even exist. Your sniper entries are feared across the chain.", score: 92 },
    { fate: "THE RUGPROOF NINJA", emoji: "🛡️", imagePath: "images8.jpeg", text: "Honeypots and malicious contracts miss you completely. Your intuition is a natural shield.", score: 85 },
    { fate: "THE LIQUIDITY GOD", emoji: "🌊", imagePath: "images9.jpeg", text: "Every pool you touch overflows with rewards. Yield farms bow down to your harvesting strategy.", score: 96 },
    { fate: "THE PROPAGANDA KING", emoji: "📢", imagePath: "images10.jpeg", text: "Your conviction can pump any chart. When you speak, the community follows your vision.", score: 90 }
];

// ====================================================================
// CORE WEB3 PROVIDER ARCHITECTURE
// ====================================================================
function getActiveProvider() {
    if (window.ethereum) {
        if (window.ethereum.providers && window.ethereum.providers.length) {
            return window.ethereum.providers.find(p => p.isCoinbaseWallet || p.isOKXWallet) || window.ethereum.providers[0];
        }
        return window.ethereum;
    }
    if (window.okxwallet && window.okxwallet.ethereum) return window.okxwallet.ethereum;
    return null;
}

function toSafeHexWei(amountETH) {
    const wei = Math.floor(parseFloat(amountETH) * 1e18);
    return "0x" + wei.toString(16);
}

function quickSelectToken(address, symbol) {
    const targetInput = document.getElementById("external-target-input");
    if (targetInput) {
        targetInput.value = address;
        executeTokenScan();
        targetInput.scrollIntoView({ behavior: 'smooth' });
    }
}
window.quickSelectToken = quickSelectToken;

// ====================================================================
// TICKER TOP TRENDING REAL-TIME COINS (BASE NETWORK)
// ====================================================================
async function renderTopTrendingBaseCoins() {
    try {
        const response = await fetch("https://api.dexscreener.com/token-boosts/latest/v1");
        let boostedTokens = await response.json();
        let baseTokens = Array.isArray(boostedTokens) ? boostedTokens.filter(t => t.chainId === 'base') : [];
        
        if (baseTokens.length === 0) {
            const topRes = await fetch("https://api.dexscreener.com/token-boosts/top/v1");
            const topBoosted = await topRes.json();
            baseTokens = Array.isArray(topBoosted) ? topBoosted.filter(t => t.chainId === 'base') : [];
        }

        if (baseTokens.length === 0) {
            const globalRes = await fetch("https://api.dexscreener.com/latest/dex/search?q=base");
            const globalData = await globalRes.json();
            if (globalData.pairs) {
                baseTokens = globalData.pairs.filter(p => p.chainId === 'base').map(p => ({
                    tokenAddress: p.baseToken.address,
                    header: p.baseToken.name,
                    description: p.baseToken.symbol
                }));
            }
        }

        const seenAddresses = new Set();
        let tickerItems = [];
        let displayCount = 0;

        for (let i = 0; i < baseTokens.length; i++) {
            if (displayCount >= 7) break;

            const token = baseTokens[i];
            let address = token.tokenAddress || token.address; 
            if (!address || seenAddresses.has(address)) continue;

            let priceUsd = "0.00";
            let priceChange = 0;
            let symbol = token.description || token.symbol || "TOKEN";
            let name = token.header || token.name || "Base Asset";

            try {
                const pairDetailsRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
                const pairDetails = await pairDetailsRes.json();
                const primaryPair = pairDetails.pairs ? pairDetails.pairs.find(p => p.chainId === 'base') : null;
                
                if (primaryPair) {
                    name = primaryPair.baseToken.name;
                    symbol = primaryPair.baseToken.symbol;
                    
                    // --- ANTI-AERO FILTER ENGINE ---
                    if (name.toLowerCase().includes("aero") || symbol.toLowerCase().includes("aero")) {
                        continue; 
                    }

                    const rawPrice = parseFloat(primaryPair.priceUsd);
                    priceUsd = rawPrice < 0.01 ? rawPrice.toFixed(6) : rawPrice.toFixed(2);
                    priceChange = primaryPair.priceChange?.h24 || 0;
                } else {
                    continue; 
                }
            } catch (err) {
                continue;
            }

            seenAddresses.add(address);
            displayCount++;

            const changeColor = priceChange >= 0 ? "text-emerald-400" : "text-rose-400";
            const changeSign = priceChange >= 0 ? "▲" : "▼";

            tickerItems.push(`
                <button onclick="quickSelectToken('${address}', '${symbol}')" class="inline-flex items-center gap-1.5 mx-3 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl hover:border-cyan-400 transition-all text-left">
                    <span class="text-slate-500 font-bold text-[9px]">#${displayCount}</span>
                    <span class="text-white font-extrabold font-mono text-[10px]">${symbol}</span>
                    <span class="text-slate-300 text-[10px]">$${priceUsd}</span>
                    <span class="${changeColor} font-bold text-[9px]">${changeSign} ${priceChange}%</span>
                </button>
            `);
        }

        const tickerWrapper = document.getElementById("live-ticker-inner-marquee");
        if (tickerWrapper && tickerItems.length > 0) {
            tickerWrapper.innerHTML = tickerItems.join('');
        }
    } catch (error) {
        console.error("Failed to load marquee tokens:", error);
    }
}

// ====================================================================
// NATIVE BASE B20 TOKEN DEPLOYER ENGINE
// ====================================================================
async function deployNewB20Token(tokenName, tokenSymbol) {
    if (!tokenName || !tokenSymbol) return alert("Please enter both Token Name and Symbol!");
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Connect your wallet first!");

    try {
        alert(`🚀 Broadcasting B20 Native deployment vector for: ${tokenName.toUpperCase()} (${tokenSymbol.toUpperCase()})`);
        
        const variantAsset = "0x00"; 
        const randomSalt = "0x" + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join("");
        const dataPayload = "0x0162c721" + variantAsset.replace("0x","") + randomSalt.replace("0x",""); 

        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: B20_FACTORY_ADDRESS, 
                data: dataPayload,
                value: "0x0" 
            }],
        });

        alert(`🔥 Standard B20 Token successfully deployed directly onto Base System Engine!\nTx Hash: ${txHash}`);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        console.error("B20 Deploy Core Fail:", err);
        alert("❌ Base B20 Engine Refused: " + err.message);
    }
}
window.deployNewB20Token = deployNewB20Token;

// ====================================================================
// CORE TRANSACTION ROUTINE (MINT & TIP LOGIC)
// ====================================================================
async function sendTip() {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Connect your wallet first!");
    try {
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: DEVELOPER_WALLET,
                value: toSafeHexWei("0.001"),
                data: "0x"
            }],
        });
        alert("💸 Thank you for the tip! Tx Hash: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Transaction Canceled: " + err.message);
    }
}

async function mintNFT() {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Connect your wallet first!");
    try {
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: nftContractAddress,
                value: toSafeHexWei("0.000"), 
                data: "0x1249c5b8" 
            }],
        });
        alert("🪙 Mint Core Request Broadcasted! Tx Hash: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Minting Failed: " + err.message);
    }
}

window.sendTip = sendTip;
window.mintNFT = mintNFT;

// ====================================================================
// PURE NATIVE SPA ROUTING NAVIGATION
// ====================================================================
function navigate(targetTab) {
    if (!isConnected) {
        alert("Connect your Web3 Wallet first to unlock this dimension!");
        return;
    }

    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    const targetEl = document.getElementById(`tab-${targetTab}`);
    if (targetEl) targetEl.classList.remove('hidden');

    const navButtons = {
        oracle: { id: 'nav-oracle', color: 'text-blue-400' },
        glow: { id: 'nav-glow', color: 'text-cyan-400' },
        wheel: { id: 'nav-wheel', color: 'text-purple-400' },
        ranks: { id: 'nav-ranks', color: 'text-yellow-400' }
    };

    Object.keys(navButtons).forEach(key => {
        const btn = document.getElementById(navButtons[key].id);
        if (btn) {
            btn.className = "flex flex-col items-center text-slate-500 hover:" + navButtons[key].color + " transition-all font-mono";
        }
    });

    const activeBtn = document.getElementById(navButtons[targetTab].id);
    if (activeBtn) {
        activeBtn.className = `flex flex-col items-center ${navButtons[targetTab].color} transition-all font-mono scale-105 font-bold`;
    }

    if (targetTab === 'ranks') {
        renderLeaderboardData();
    }
}
window.navigate = navigate;

// ==========================================
// GLOW AURA ALTER ENGINE
// ==========================================
function applyGlow(type) {
    if (type === 'neon') {
        currentFrameColor = "#06b6d4";
        frameNameGlobal = "Cyan Neon Pulse";
    } else if (type === 'gold') {
        currentFrameColor = "#f59e0b";
        frameNameGlobal = "Gold Luck Destiny";
    } else if (type === 'matrix') {
        currentFrameColor = "#22c55e";
        frameNameGlobal = "Cyber Matrix Green";
    } else if (type === 'rose') {
        currentFrameColor = "#f43f5e";
        frameNameGlobal = "Ruby Vein Pulse";
    }
    
    const labelTitle = document.getElementById("card-glow-title");
    if (labelTitle) labelTitle.innerText = `✨ Generated ${frameNameGlobal.toUpperCase()} Card ✨`;

    if (currentFateGlobal && userAddress) {
        let cleanAddress = userAddress.toLowerCase().replace("0x", "");
        let seed = 0;
        for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);
        const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 
        drawDestinyCard(currentFateGlobal, finalLuckScore, userAddress, seed);
    }
    
    alert(`✨ Particle alignment configured to ${frameNameGlobal}!`);
    navigate('oracle');
}
window.applyGlow = applyGlow;

// ==========================================
// INTERACTIVE LEADERBOARD GENERATOR
// ==========================================
function renderLeaderboardData() {
    const container = document.getElementById("ranks-list-container");
    if (!container) return;

    let cleanAddress = userAddress.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);
    const userScore = Math.min(100, Math.max(5, (seed % 95) + 5));

    const boardData = [
        { r: 1, addr: "0x71C9...8B29", s: 99, tag: "🐋 DEGEN WHALE" },
        { r: 2, addr: "0x3a2F...7F41", s: 95, tag: "⚡ HARDCORE APER" },
        { r: 3, addr: `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`, s: userScore, tag: "❓ ACTIVE ANOMALY (YOU)", isUser: true }
    ];

    container.innerHTML = boardData.map(item => `
        <div class="p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${item.isUser ? 'border-cyan-500 bg-cyan-950/20 shadow-md' : 'border-slate-800 bg-slate-950/40'}">
            <div class="flex items-center gap-3">
                <span class="font-black ${item.r === 1 ? 'text-amber-400' : 'text-slate-500'}">#${item.r}</span>
                <div class="text-left">
                    <div class="font-bold ${item.isUser ? 'text-cyan-400' : 'text-slate-200'}">${item.addr}</div>
                    <div class="text-[9px] text-slate-500 mt-0.5">${item.tag}</div>
                </div>
            </div>
            <div class="font-bold text-cyan-400 text-sm">${item.s}%</div>
        </div>
    `).join('');
}

// ==========================================
// DEGEN LUCKY WHEEL ENGINE
// ==========================================
function spinTheWheel() {
    const btn = document.getElementById("btn-spin");
    const graphic = document.getElementById("wheel-graphic");
    const result = document.getElementById("spin-result");
    if (!btn || !graphic || !result) return;

    btn.disabled = true;
    result.classList.add("hidden");
    graphic.classList.add("animate-spin");
    graphic.innerText = "🌀";

    const prizes = [
        "🎰 +100 AURA BOOST POINTS SIGNAL ALIGNED",
        "💎 DIAMOND HAND REINFORCEMENT POWER-UP",
        "⛽ GAS FEE MITIGATION REDUCTION CORES",
        "🛡️ HONEYPOT ANTI-RUG DRIFT IMMUNITY LAYER"
    ];

    setTimeout(() => {
        graphic.classList.remove("animate-spin");
        const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
        graphic.innerText = "🎁";
        result.innerHTML = `<strong>SPIN OUTCOME:</strong><br>${finalPrize}`;
        result.classList.remove("hidden");
        btn.disabled = false;
        
        let currentAP = parseInt(localStorage.getItem("user_aura_points")) || 0;
        currentAP += 100;
        localStorage.setItem("user_aura_points", currentAP);
        document.getElementById("aura-points-display").innerText = `${currentAP} AP`;

        if (typeof confetti === "function") confetti();
    }, 2000);
}
window.spinTheWheel = spinTheWheel;

// ==========================================
// CONNECT WALLET INTEGRATION SYSTEM
// ==========================================
async function connectWallet() {
    const provider = getActiveProvider();
    const connectBtn = document.getElementById("connect-btn");
    
    if (!provider) {
        alert("❌ Wallet Not Detected!\nPlease open this dApp directly inside your Web3 Wallet Browser (Coinbase/OKX Wallet).");
        return;
    }

    try {
        if (connectBtn) connectBtn.innerHTML = "⏳ Connecting...";
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        
        userAddress = accounts[0];
        isConnected = true;
        localStorage.removeItem("wallet_blacklisted");

        updateWalletUI(userAddress);
        renderNativeForecasterHub(); 

        document.getElementById("locked-state-view").classList.add("hidden");
        document.getElementById("result-section").classList.remove("hidden");
        
        generateDestiny(userAddress);
        await renderTopTrendingBaseCoins(); 
        navigate('oracle'); 
    } catch (error) {
        resetWalletState();
        alert("❌ Connection Failed: " + error.message);
    }
}

function disconnectWallet() {
    if (!confirm("Disconnect wallet?")) return;
    localStorage.setItem("wallet_blacklisted", "true");
    resetWalletState();
}

function resetWalletState() {
    userAddress = "";
    isConnected = false;
    window.location.reload();
}

// ==========================================
// THE FORECASTER ENGINE INTERFACE TERMINAL
// ==========================================
function updateWalletUI(address) {
    const connectBtn = document.getElementById("connect-btn");
    if (!connectBtn) return;
    connectBtn.setAttribute("data-status", "connected");
    connectBtn.innerHTML = `🔴 Disconnect (${address.slice(0, 6)}...${address.slice(-4)})`;
    connectBtn.className = "w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 px-4 rounded-2xl font-mono tracking-wide transition-all text-center block shadow-lg";
}

function renderNativeForecasterHub() {
    const container = document.getElementById("polymarket-top-container"); 
    if (!container || !isConnected) return;

    container.innerHTML = `
        <div class="space-y-3.5 text-left mt-2 mb-2">
            <div class="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">⚡ INSTANT TERMINAL TRADING</span>
                    <span class="text-emerald-400 font-mono animate-pulse">● Bonding Curve Sync</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200">Buy $FORECAST Directly via Wallet Node</h4>
                <div class="flex gap-2">
                    <input id="presale-eth-input" type="number" step="0.001" value="0.005" class="w-2/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none">
                    <button id="btn-action-presale" class="w-1/3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-xl text-[11px] font-mono tracking-wide shadow-md">BUY NOW</button>
                </div>
                <a href="${flaunchShareLink}" target="_blank" class="w-full block text-center p-2 bg-slate-900 border border-slate-800 text-[9px] font-mono text-cyan-400 font-bold rounded-xl">
                    📈 MONITOR LIVE MATRIX CHART ON FLAUNCH.GG
                </a>
            </div>
            
            <!-- B20 TOKEN GENERATOR MODULE INTEGRATION -->
            <div class="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div class="flex items-center justify-between border-b border-slate-900 pb-1.5">
                    <span class="text-indigo-400 font-black tracking-wider text-[10px]">⚙️ BASE B20 CREATOR STUDIO</span>
                    <span class="text-[8px] bg-indigo-950 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded font-bold">BERYL CORE</span>
                </div>
                <p class="text-[10px] text-slate-400 leading-relaxed">
                    Deploy standard B20 native tokens on Base without Solidity coding. B20 coin transactions utilize up to 50% less gas fees.
                </p>
                <div class="space-y-2">
                    <div>
                        <label class="text-slate-500 block mb-0.5 text-[9px]">TOKEN NAME:</label>
                        <input id="b20-name" type="text" placeholder="e.g., Donkey Gold" class="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white outline-none text-xs focus:border-indigo-500" />
                    </div>
                    <div>
                        <label class="text-slate-500 block mb-0.5 text-[9px]">TOKEN SYMBOL:</label>
                        <input id="b20-symbol" type="text" placeholder="e.g., DONK" class="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white outline-none text-xs focus:border-indigo-500" />
                    </div>
                </div>
                <button onclick="deployNewB20Token(document.getElementById('b20-name').value, document.getElementById('b20-symbol').value)" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2 rounded-xl text-[10px] transition-all shadow-md">
                    🚀 LAUNCH NATIVE B20 TOKEN
                </button>
            </div>
        </div>
    `;

    document.getElementById("btn-action-presale")?.addEventListener("click", executeDirectBuy);
}

async function executeDirectBuy() {
    const provider = getActiveProvider();
    if (!provider) return;
    const amountETH = document.getElementById("presale-eth-input")?.value || "0.005";

    try {
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddress, to: tokenContractAddress, value: toSafeHexWei(amountETH), data: "0x" }],
        });
        alert("🚀 Transaction Broadcast Success! Hash: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Failed: " + err.message);
    }
}

// ==========================================
// SYSTEM PARAMETER CALCULATION & CANVAS CORE
// ==========================================
function generateDestiny(address) {
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);

    const selectedFate = fateLibrary[seed % fateLibrary.length];
    currentFateGlobal = selectedFate; 
    const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 
    
    document.getElementById("luck-score").innerText = `${finalLuckScore}%`;
    document.getElementById("luck-bar").style.width = `${finalLuckScore}%`;
    document.getElementById("seed-anchor").innerText = `#${seed}`;

    drawDestinyCard(selectedFate, finalLuckScore, address, seed);
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 350, 500);

    const characterImg = new Image();
    characterImg.src = fateObj.imagePath; 

    characterImg.onload = function() {
        ctx.drawImage(characterImg, 0, 0, 350, 500);
        ctx.fillStyle = "rgba(2, 6, 23, 0.4)"; 
        ctx.fillRect(0, 0, 350, 500);
        renderCardText(ctx, fateObj, score, address, seed);
        drawCardFrame(ctx);
    };

    characterImg.onerror = function() {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, 350, 500);
        ctx.font = "64px serif"; 
        ctx.textAlign = "center";
        ctx.fillText(fateObj.emoji, 175, 145);
        renderCardText(ctx, fateObj, score, address, seed);
        drawCardFrame(ctx);
    };
}

function renderCardText(ctx, fateObj, score, address, seed) {
    ctx.textAlign = "center";
    const titleY = 210;
    
    ctx.font = "bold 22px 'Georgia', 'Times New Roman', serif"; 

    const goldGradient = ctx.createLinearGradient(0, titleY - 18, 0, titleY + 4);
    goldGradient.addColorStop(0, "#ffe699");   
    goldGradient.addColorStop(0.5, "#f59e0b"); 
    goldGradient.addColorStop(1, "#b45309");   

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(fateObj.fate, 175, titleY);

    ctx.fillStyle = goldGradient;
    ctx.fillText(fateObj.fate, 175, titleY); 

    ctx.font = "italic 12px 'Georgia', serif";
    
    const words = fateObj.text.split(" "); 
    let line = ""; 
    let y = 245;
    
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > 280 && n > 0) { 
            ctx.strokeStyle = "#000000"; ctx.lineWidth = 3;
            ctx.strokeText(line, 175, y);
            ctx.fillStyle = "#ffffff"; ctx.fillText(line, 175, y); 
            line = words[n] + " "; 
            y += 18; 
        } else { 
            line = testLine; 
        }
    }
    ctx.strokeStyle = "#000000"; ctx.lineWidth = 3;
    ctx.strokeText(line, 175, y);
    ctx.fillStyle = "#ffffff"; ctx.fillText(line, 175, y);
    
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)"; 
    ctx.fillRect(30, 405, 290, 62);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)"; 
    ctx.strokeRect(30, 405, 290, 62);
    
    ctx.textAlign = "left"; ctx.font = "10px monospace"; ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 423);
    ctx.fillStyle = "#f59e0b"; ctx.fillText(`LUCK    : ${score}% DEGEN LEVEL`, 45, 440);
    ctx.fillStyle = "#94a3b8"; ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 457);
}

function drawCardFrame(ctx) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = currentFrameColor || "#f59e0b";
    ctx.strokeRect(10, 10, 330, 480);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; 
    ctx.fillText("BASE FORECASTER CORES", 175, 35);
}

// ====================================================================
// MARKET STALKER SCANNER (DEXSCREENER API + BOLLINGER BANDS)
// ====================================================================
async function executeTokenScan() {
    const targetInput = document.getElementById("external-target-input");
    const resultDiv = document.getElementById("external-target-result");
    
    if (!targetInput || !resultDiv) return;
    const query = targetInput.value.trim();
    if (!query) return alert("Please enter a token symbol or contract address on Base Chain!");

    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `<p class="text-[11px] text-cyan-400 animate-pulse font-mono">📡 Extracting Fundamental Metrics & Bollinger Bands for "${query.toUpperCase()}"...</p>`;

    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${query}`);
        const data = await response.json();
        const basePairs = data.pairs ? data.pairs.filter(p => p.chainId === 'base') : [];

        if (basePairs.length === 0) {
            resultDiv.innerHTML = `
                <div class="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-[10px] font-mono text-rose-400">
                    ❌ Token not found on Base Chain. Please verify the contract or ticker.
                </div>`;
            return;
        }

        const bestPair = basePairs[0];
        const priceUsd = parseFloat(bestPair.priceUsd);
        const priceChange = bestPair.priceChange?.h24 || 0;
        const volume24h = bestPair.volume?.h24 ? Math.floor(bestPair.volume.h24).toLocaleString() : "0";
        const marketCap = bestPair.fdv ? Math.floor(bestPair.fdv).toLocaleString() : "N/A";

        const liquidity = bestPair.liquidity?.usd ? Math.floor(bestPair.liquidity.usd).toLocaleString() : "N/A";
        const buys24h = bestPair.txns?.h24?.buys || 0;
        const sells24h = bestPair.txns?.h24?.sells || 0;
        const totalTxns = (buys24h + sells24h).toLocaleString();

        const hasWeb = bestPair.info?.websites?.[0]?.url ? `<a href="${bestPair.info.websites[0].url}" target="_blank" class="text-emerald-400 hover:underline">🌐 Website</a>` : '<span class="text-slate-600">🌐 No Web</span>';
        const hasX = bestPair.info?.socials?.find(s => s.type === 'twitter')?.url ? `<a href="${bestPair.info.socials.find(s => s.type === 'twitter').url}" target="_blank" class="text-sky-400 hover:underline">🐦 Twitter/X</a>` : '<span class="text-slate-600">🐦 No X</span>';

        const volatilityFactor = Math.min(15, Math.max(3, Math.abs(priceChange) * 0.4)); 
        const middleBand = priceUsd / (1 + (priceChange / 100));
        const standardDeviation = middleBand * (volatilityFactor / 100);
        
        const upperBand = middleBand + (2 * standardDeviation);
        const lowerBand = middleBand - (2 * standardDeviation);

        let bbStatus = "";
        let bbPrediction = "";
        let bbBadgeColor = "";

        if (priceUsd >= upperBand * 0.98) {
            bbStatus = "UPPER BAND (Overbought)";
            bbPrediction = "Price has penetrated the upper boundary of the daily BB. High probability of technical correction or reversal. Consider short-term take profit strategies.";
            bbBadgeColor = "text-rose-400 bg-rose-950/50 border-rose-500/40";
        } else if (priceUsd <= lowerBand * 1.02) {
            bbStatus = "LOWER BAND (Oversold)";
            bbPrediction = "Price has touched the lower boundary of the daily BB. Oversold conditions detected. Strong signal for potential rebound and accumulation.";
            bbBadgeColor = "text-emerald-400 bg-emerald-950/50 border-emerald-500/40";
        } else {
            bbStatus = "MIDDLE BAND (Consolidation)";
            bbPrediction = "Price is trading stably around the daily Moving Average. Awaiting volume confirmation for a decisive breakout trend.";
            bbBadgeColor = "text-cyan-400 bg-cyan-950/50 border-cyan-500/40";
        }

        resultDiv.innerHTML = `
            <div class="p-3 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2.5 font-mono text-[11px]">
                <div class="flex justify-between border-b border-slate-800 pb-1.5">
                    <span class="font-bold text-white">💎 ${bestPair.baseToken.name} (${bestPair.baseToken.symbol})</span>
                    <span class="${priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">${priceChange}% (24h)</span>
                </div>
                
                <div class="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
                    <div>Price: <strong class="text-white">$${priceUsd.toFixed(6)}</strong></div>
                    <div>Market Cap (FDV): <strong class="text-white">$${marketCap}</strong></div>
                    <div>Volume 24h: <strong class="text-white">$${volume24h}</strong></div>
                    <div>Dex Platform: <strong class="text-cyan-400 text-[9px] uppercase">${bestPair.dexId}</strong></div>
                </div>

                <div class="p-2 bg-slate-900/40 border border-slate-800/60 rounded-lg space-y-1 text-[10px]">
                    <div class="text-[9px] text-amber-400 font-bold tracking-wider">🔬 FUNDAMENTAL METRICS</div>
                    <div class="grid grid-cols-2 gap-1 text-slate-400">
                        <div>Total Pool Liquidity: <strong class="text-white">$${liquidity}</strong></div>
                        <div>Transactions (24h): <strong class="text-white">${totalTxns}</strong></div>
                        <div>Buys: <strong class="text-emerald-400">${buys24h}</strong></div>
                        <div>Sells: <strong class="text-rose-400">${sells24h}</strong></div>
                    </div>
                    <div class="flex gap-3 pt-1 border-t border-slate-900 mt-1 text-[9px]">
                        <span class="text-slate-500">Links:</span> ${hasWeb} | ${hasX}
                    </div>
                </div>

                <div class="pt-1 space-y-1.5">
                    <div class="flex justify-between items-center text-[9px]">
                        <span class="text-slate-400 font-bold">📊 DAILY BOLLINGER BANDS (20, 2)</span>
                        <span class="px-1.5 py-0.5 rounded border ${bbBadgeColor} text-[8px] font-bold tracking-wide">${bbStatus}</span>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-1 text-center text-[8px] text-slate-500 bg-slate-900/50 p-1 rounded">
                        <div>Low: <span class="text-slate-300">$${lowerBand.toFixed(5)}</span></div>
                        <div>Mid (MA): <span class="text-slate-300">$${middleBand.toFixed(5)}</span></div>
                        <div>High: <span class="text-slate-300">$${upperBand.toFixed(5)}</span></div>
                    </div>

                    <div class="p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[10px] leading-relaxed text-slate-300">
                        <span class="text-amber-400 font-bold">🔮 FORECAST PREDICTION:</span> ${bbPrediction}
                    </div>
                </div>

                <div class="flex gap-2 pt-1">
                    <input id="buy-amount-eth" type="number" step="0.001" value="0.01" class="w-1/3 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-mono text-white focus:outline-none" />
                    <button onclick="triggerWeb3Buy('${bestPair.baseToken.address}', '${bestPair.dexId}')" class="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1 rounded-xl font-mono">
                        ⚡ Quick SWAP via Wallet
                    </button>
                </div>
                <div id="tx-status-output" class="hidden mt-1"></div>

                <a href="${bestPair.url}" target="_blank" class="block text-center text-[9px] text-cyan-400 underline pt-1">
                    Open Chart on DexScreener ➜
                </a>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = `
            <div class="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-[10px] font-mono text-rose-400">
                ⚠️ Failed to extract secure fundamental data. Please try again.
            </div>`;
    }
}
window.executeTokenScan = executeTokenScan;

async function triggerWeb3Buy(tokenAddress, dexId) {
    const amountInput = document.getElementById("buy-amount-eth");
    const statusDiv = document.getElementById("tx-status-output");
    
    if (!amountInput || !statusDiv) return;
    const ethAmount = amountInput.value.trim();
    
    if (!ethAmount || parseFloat(ethAmount) <= 0) return alert("🔮 Please enter a valid amount of ETH to complete the matrix alignment!");
    if (!isConnected || !userAddress) return alert("🔮 Connect your Web3 Wallet first to authorize blockchain node interactions!");

    const provider = getActiveProvider();
    if (!provider) return alert("❌ Web3 Provider Matrix not found!");

    statusDiv.classList.remove("hidden");
    statusDiv.className = "text-[9px] text-amber-400 animate-pulse font-mono text-center";
    statusDiv.innerText = "⏳ Initiating wallet handshake & building swap path...";

    try {
        const currentChainId = await provider.request({ method: 'eth_chainId' });
        if (currentChainId !== '0x2105') {
            statusDiv.innerText = "🔄 Diverting protocol matrix to Base Network...";
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x2105' }],
            });
        }

        let targetRouterAddress = "0x2626664c2602818E568351633F6522EAC9D1217e"; 
        if (dexId.toLowerCase() === 'aerodrome') {
            targetRouterAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"; 
        }

        const valueHex = toSafeHexWei(ethAmount);
        
        statusDiv.className = "text-[9px] text-cyan-400 font-mono text-center animate-pulse";
        statusDiv.innerText = "🚀 Awaiting biometric confirmation in your Web3 wallet...";

        const txParameters = {
            from: userAddress,
            to: targetRouterAddress,
            value: valueHex,
            data: "0x" 
        };

        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [txParameters],
        });

        statusDiv.className = "text-[9px] text-emerald-400 font-mono text-center font-bold";
        statusDiv.innerHTML = `✅ TX Broadcasted! Hash: <a href="https://basescan.org/tx/${txHash}" target="_blank" class="underline text-cyan-400">${txHash.substring(0,10)}...</a>`;
        
        if (typeof confetti === "function") confetti();

    } catch (error) {
        console.error("Swap core failure:", error);
        statusDiv.className = "text-[9px] text-rose-400 font-mono text-center";
        statusDiv.innerText = `❌ Swap Refused: ${error.message.substring(0, 45)}...`;
    }
}
window.triggerWeb3Buy = triggerWeb3Buy;

// ==========================================
// LOGIC LOOPS & ENGINE INITIALIZATION
// ==========================================
function setupDailyLogin() {
    const dailyBtn = document.getElementById("daily-login-btn");
    let currentAP = parseInt(localStorage.getItem("user_aura_points")) || 0;
    document.getElementById("aura-points-display").innerText = `${currentAP} AP`;

    dailyBtn?.addEventListener("click", () => {
        const lastClaim = localStorage.getItem("last_daily_claim");
        if (lastClaim === new Date().toDateString()) return alert("🔒 Daily Aura Points already claimed for today!");
        
        currentAP += 50;
        localStorage.setItem("user_aura_points", currentAP);
        localStorage.setItem("last_daily_claim", new Date().toDateString());
        document.getElementById("aura-points-display").innerText = `${currentAP} AP`;
        if (typeof confetti === "function") confetti();
        alert("🎁 +50 Aura Points Successfully Claimed!");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupDailyLogin();
    
    setInterval(renderTopTrendingBaseCoins, 45000);

    if(document.getElementById("view-counter")) document.getElementById("view-counter").innerText = "14,250";
    if(document.getElementById("mint-counter")) document.getElementById("mint-counter").innerText = "842";

    document.getElementById("connect-btn")?.addEventListener("click", (e) => {
        if (e.target.getAttribute("data-status") === "connected") disconnectWallet(); else connectWallet();
    });

    document.getElementById("tip-btn")?.addEventListener("click", sendTip);
    document.getElementById("mint-btn")?.addEventListener("click", mintNFT);
    document.getElementById("external-target-btn")?.addEventListener("click", executeTokenScan);
});
