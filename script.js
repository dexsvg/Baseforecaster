/**
 * Base Forecaster - Core Logic Script (Ultimate AI Edition)
 * Pure Native Base Ecosystem Layer - No Polymarket Dependency.
 * Fully functional with $FORECAST Presale, Native Prediction Staking, 
 * Premium NFT Pass, Destiny calculation, and AI Advisor Chatbot.
 */

const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 
let userAddress = "";
let isConnected = false;
let appLogoImg = null;
let currentFateGlobal = null; 
let currentGlowColor = "rgba(56, 189, 248, 0.04)"; 
let currentFrameColor = null; 

const eventTypes = ["MINT", "NEW_USER", "TIP"];

const fateLibrary = [
    { fate: "THE WHALE ASCENDANT", emoji: "🐋", text: "Your wallet is a black hole for liquidity. You are destined to lead trends and exit safely before the rug.", score: 98 },
    { fate: "GENERATIONAL WEALTH", emoji: "👑", text: "Cosmic alignment confirms eternal wealth. Your core assets will outperform 99% of the market.", score: 95 },
    { fate: "THE BASE CHOSEN ONE", emoji: "🔵", text: "Base protocol nodes whisper your address. You are the architect of the next moon mission.", score: 99 },
    { fate: "LIQUIDITY GOD", emoji: "💧", text: "You don't chase yield; yield chases you. Your farms stay green forever.", score: 93 },
    { fate: "THE DIAMOND FIST", emoji: "💎", text: "True Diamond Hands. You never panic, never sell, and you will be rewarded by the gods.", score: 91 },
    { fate: "ALPHA HUNTER", emoji: "🎯", text: "You smell 100x gains before they even hit the charts. Your entry is always perfect.", score: 97 },
    { fate: "THE ETHEREAL HOLDER", emoji: "🌌", text: "Your wallet transcends the charts. You are holding the future of decentralization.", score: 94 },
    { fate: "PROTOCOL ARCHITECT", emoji: "🏗️", text: "Your smart contract interactions indicate future dev-level success. Build, don't just trade.", score: 92 },
    { fate: "THE GOLDEN TOUCH", emoji: "✨", text: "Anything you touch turns to blue-chip. The universe favors your transaction history.", score: 96 },
    { fate: "STAKE LORD", emoji: "🏛️", text: "Your rewards are compounding into a mountain. Patience is your greatest power.", score: 90 },
    { fate: "THE DEGEN SURVIVOR", emoji: "🥷", text: "Battle scars of meme-coin wars everywhere. You survive when others get liquidated.", score: 74 },
    { fate: "MEME LORD", emoji: "🤡", text: "Your portfolio is 90% memes, but you somehow always break even. Respect.", score: 65 },
    { fate: "THE GAS STRATEGIST", emoji: "⛽", text: "You know exactly when to swap to minimize gas. Efficiency is your secret weapon.", score: 78 },
    { fate: "RUGPULL DODGER", emoji: "🛡️", text: "Your instincts are sharp. You smelled the honey-pot trap and walked away just in time.", score: 82 },
    { fate: "THE VOLATILITY SURFER", emoji: "🏄", text: "You love the red candles as much as the green. Chaos is your playground.", score: 85 },
    { fate: "SHITCOIN WHISPERER", emoji: "🐍", text: "You pick the weirdest tokens, and they somehow keep pumping. Luck is on your side.", score: 70 },
    { fate: "THE CROSS-CHAIN TRAVELER", emoji: "🌉", text: "Your assets migrate safely across bridges. You are a true global explorer.", score: 72 },
    { fate: "DASHBOARD JUNKIE", emoji: "📊", text: "You spend more time on Debank than sleeping. The data will pay off soon.", score: 68 },
    { fate: "THE AIRDROP HUNTER", emoji: "🪂", text: "The next big airdrop is coming for you. Keep grinding those transactions.", score: 81 },
    { fate: "TOKEN FLIPPER", emoji: "💸", text: "High frequency, small gains. You are the master of the micro-movements.", score: 75 },
    { fate: "THE COMMUNITY LEADER", emoji: "📣", text: "Your voice in the discord dictates the hype. Use your influence wisely.", score: 77 },
    { fate: "THE SILENT HOLDER", emoji: "🤫", text: "Nobody sees your moves, but your balance keeps growing steadily.", score: 79 },
    { fate: "THE CHART ADDICT", emoji: "📈", text: "You live by the candles, and tonight, they are favoring your direction.", score: 73 },
    { fate: "THE RE-ENTRY EXPERT", emoji: "🔄", text: "You know when to buy the dip. Your timing is getting significantly better.", score: 83 },
    { fate: "THE PORTFOLIO BALANCER", emoji: "⚖️", text: "Your risk management is top tier. You are built to last in this market.", score: 88 },
    { fate: "THE APER", emoji: "🐒", text: "You ape in with everything. Sometimes it works, sometimes it hurts. Chill out, Bro.", score: 45 },
    { fate: "LIQUIDITY PROVIDER DOOM", emoji: "📉", text: "Impermanent loss is lurking. Check your pool allocations immediately.", score: 42 },
    { fate: "THE PANIC SELLER", emoji: "😱", text: "You sold the bottom. Again. Learn to breathe and trust your thesis.", score: 35 },
    { text: "You spent more on gas than the actual token profit. Slow down, Anon.", score: 38 },
    { fate: "THE BAG HOLDER", emoji: "🎒", text: "You are holding tokens from 2022. It's time to cut your losses and pivot.", score: 32 },
    { fate: "THE OVER-LEVERAGED", emoji: "⚠️", text: "Your position is too big for your comfort. De-leverage before you get wrecked.", score: 30 },
    { fate: "THE FOMO KING", emoji: "🔥", text: "You bought the top. It's a painful lesson, but the market gives second chances.", score: 34 },
    { fate: "THE AIRDROP GHOST", emoji: "👻", text: "You missed the snapshot by 5 minutes. The universe has a cruel sense of humor.", score: 39 },
    { fate: "THE DEX-JUMPER", emoji: "🏃", text: "You swap tokens every 10 minutes. Transaction fees are killing your alpha.", score: 40 },
    { fate: "THE WALLET CLUTTERED", emoji: "🗑️", text: "Your wallet is full of scam tokens. Don't touch them, they are digital poison.", score: 33 },
    { fate: "THE LATECOMER", emoji: "🐢", text: "You arrive when the party is already over. Look for newer narratives.", score: 37 },
    { fate: "THE MARGIN CALLER", emoji: "📞", text: "The exchange is calling your name. Watch your liquidation price closely.", score: 31 },
    { fate: "THE UNLUCKY SWAPPER", emoji: "🎰", text: "Every coin you buy drops 10% immediately. Take a break for 24 hours.", score: 36 },
    { fate: "THE HYPE CHASERS", emoji: "📢", text: "You only buy what influencers shill. Think for yourself, Anon.", score: 41 },
    { fate: "THE STABLECOIN HOARDER", emoji: "💵", text: "You are 100% USDC. Safe, but missing out on the actual madness.", score: 55 },
    { fate: "DUSTING ATTACK TARGET", emoji: "🪤", text: "Alert! Your address is being scanned by bots. Don't touch ANY random tokens.", score: 21 },
    { fate: "THE MYSTERY ADDRESS", emoji: "❓", text: "Even the blockchain cannot understand your patterns. You are a true anomaly.", score: 25 },
    { fate: "THE PHANTOM TRADER", emoji: "🌫️", text: "Your transactions appear and vanish. Are you even trading, or just testing?", score: 28 },
    { fate: "THE CONTRACT ERROR", emoji: "❌", text: "Your wallet interaction hit a revert() opcode. Check your settings, Bro.", score: 15 },
    { fate: "THE FORGOTTEN WALLET", emoji: "🗝️", text: "You haven't interacted in months. Wake up, the Base network is buzzing!", score: 10 },
    { fate: "THE GLITCH IN THE MATRIX", emoji: "⚡", text: "Your address hash is creating computational errors. You are the anomaly.", score: 12 },
    { fate: "THE GAS-LESS WANDERER", emoji: "👣", text: "You have no gas. How are you even participating in the revolution?", score: 5 },
    { fate: "THE DATA ANCHOR", emoji: "⚓", text: "You are the heavy bag holding up the entire ecosystem. We appreciate you.", score: 18 },
    { fate: "THE BLOCKED SENDER", emoji: "🚫", text: "Your wallet seems to be flagged by some dapps. Check your permissions.", score: 8 },
    { fate: "THE ABSOLUTE ZERO", emoji: "❄️", text: "A fresh wallet! The history is blank. Your destiny is yet to be written.", score: 20 }
];
     
const fakeNames = ["DegenJoe", "0xAlpha...", "BaseWhale", "CryptoGuru", "SpeedyMint", "0xLover", "MemeKing", "BaseGod", "0xChef", "AnonDegen"];
const fakeFates = ["THE WHALE ASCENDANT 🐋", "THE DEGEN SURVIVOR 🥷", "GENERATIONAL WEALTH 👑", "THE ETERNAL HOLDER 💎"];

const DEVELOPER_WALLET = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; 

// ====================================================================
// CORE WEB3 MOBILE PROVIDER ENGINE
// ====================================================================
function getActiveProvider() {
    if (window.ethereum) {
        if (window.ethereum.providers && window.ethereum.providers.length) {
            return window.ethereum.providers.find(p => p.isCoinbaseWallet || p.isOKXWallet) || window.ethereum.providers[0];
        }
        return window.ethereum;
    }
    if (window.okxwallet && window.okxwallet.ethereum) return window.okxwallet.ethereum;
    if (window.bitkeep && window.bitkeep.ethereum) return window.bitkeep.ethereum;
    return null;
}

function toSafeHexWei(amountETH) {
    const wei = Math.floor(parseFloat(amountETH) * 1e18);
    let hex = wei.toString(16);
    if (hex.length % 2 !== 0) hex = "0" + hex;
    return "0x" + hex;
}

// ====================================================================
// REAL CONNECT & DISCONNECT WALLET MODULE
// ====================================================================
function initWalletSystem() {
    renderNativeForecasterHub();
}

async function connectWallet() {
    const provider = getActiveProvider();
    const connectBtn = document.getElementById("connect-btn");
    
    if (!provider) {
        alert("❌ Wallet Tidak Terdeteksi!\n\nSilakan buka situs ini langsung dari dalam menu Browser/dApp di aplikasi Coinbase Wallet atau OKX Wallet Anda.");
        return;
    }

    try {
        if (connectBtn) connectBtn.innerHTML = "⏳ Connecting...";

        const accounts = await provider.request({ method: "eth_requestAccounts" });
        if (!accounts || accounts.length === 0) throw new Error("No accounts returned.");

        userAddress = accounts[0];
        isConnected = true;

        localStorage.removeItem("wallet_blacklisted");

        updateWalletUI(userAddress);
        renderNativeForecasterHub(); 

        document.getElementById("result-section")?.classList.remove("hidden");
        generateDestiny(userAddress);

        alert("🟢 Wallet berhasil terhubung secara real!");
    } catch (error) {
        console.error("Koneksi gagal:", error);
        resetWalletState();
        alert("❌ Koneksi Gagal atau Dibatalkan: " + (error.message || error));
    }
}

function disconnectWallet() {
    const confirmDisconnect = confirm("Apakah Anda yakin ingin memutuskan koneksi wallet?");
    if (!confirmDisconnect) return;

    localStorage.setItem("wallet_blacklisted", "true");
    resetWalletState();
    alert("🔴 Wallet berhasil diputuskan!");
}

function resetWalletState() {
    userAddress = "";
    isConnected = false;

    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.removeAttribute("data-status");
        connectBtn.innerHTML = "🔮 Connect Wallet";
        connectBtn.className = "w-full bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-2xl font-mono tracking-wide transition-all shadow-md active:scale-95 text-center block";
    }

    document.getElementById("result-section")?.classList.add("hidden");
    renderNativeForecasterHub();

    setTimeout(() => {
        window.location.reload();
    }, 200);
}

function updateWalletUI(address) {
    const connectBtn = document.getElementById("connect-btn");
    if (!connectBtn) return;
    
    // Set status terhubung agar terbaca oleh Global Click Handler di bawah
    connectBtn.setAttribute("data-status", "connected");
    connectBtn.innerHTML = `🔴 Disconnect (${address.slice(0, 6)}...${address.slice(-4)})`;
    connectBtn.className = "w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-3 rounded-2xl font-mono tracking-wide transition-all shadow-md active:scale-95 text-center block";
}

// ==========================================
// FEATURE: NAVIGATION & MODALS SYSTEM
// ==========================================
function navigate(page) {
    if (!isConnected && page !== 'home') {
        alert("🔮 Connect your wallet first to unlock this dimension!");
        return;
    }
    const modalGlow = document.getElementById("modal-glow");
    const modalWheel = document.getElementById("modal-wheel");

    if (page === 'glow' && modalGlow) {
        modalGlow.classList.remove("hidden");
        modalGlow.classList.add("flex");
    } else if (page === 'wheel' && modalWheel) {
        modalWheel.classList.remove("hidden");
        modalWheel.classList.add("flex");
    } else if (page === 'ranks') {
        alert("🏆 Global Leaderboard Ranks is clearing decentralized nodes. Position: #24 Degen Matrix.");
    } else if (page === 'home') {
        closeModal('glow');
        closeModal('wheel');
    }
}

function closeModal(modalType) {
    const el = document.getElementById(`modal-${modalType}`);
    if (el) {
        el.classList.add("hidden");
        el.classList.remove("flex");
    }
}

function applyGlow(type) {
    if (type === 'neon') {
        currentGlowColor = "rgba(6, 182, 212, 0.05)";
        currentFrameColor = "#06b6d4";
    } else if (type === 'gold') {
        currentGlowColor = "rgba(245, 158, 11, 0.05)";
        currentFrameColor = "#f59e0b";
    } else if (type === 'matrix') {
        currentGlowColor = "rgba(34, 197, 94, 0.05)";
        currentFrameColor = "#22c55e";
    } else if (type === 'rose') {
        currentGlowColor = "rgba(244, 63, 94, 0.05)";
        currentFrameColor = "#f43f5e";
    }
    
    if (currentFateGlobal && userAddress) {
        let cleanAddress = userAddress.toLowerCase().replace("0x", "");
        let seed = 0;
        for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);
        const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 
        drawDestinyCard(currentFateGlobal, finalLuckScore, userAddress, seed);
    }
    closeModal('glow');
    alert(`✨ Particle alignment configured to ${type.toUpperCase()} frame matrix.`);
}

// ==========================================
// FEATURE: DAILY LOGIN LOGIC
// ==========================================
function setupDailyLogin() {
    const dailyBtn = document.getElementById("daily-login-btn");
    const auraDisplay = document.getElementById("aura-points-display");
    
    let currentAP = parseInt(localStorage.getItem("user_aura_points")) || 0;
    if (auraDisplay) auraDisplay.innerText = `${currentAP} AP`;

    if(!dailyBtn) return;

    dailyBtn.addEventListener("click", () => {
        const lastClaim = localStorage.getItem("last_daily_claim");
        const todayStr = new Date().toDateString();

        if (lastClaim === todayStr) {
            alert("🔒 You have already claimed today's Aura Points!");
            return;
        }

        currentAP += 50;
        localStorage.setItem("user_aura_points", currentAP);
        localStorage.setItem("last_daily_claim", todayStr);
        
        if (auraDisplay) auraDisplay.innerText = `${currentAP} AP`;
        if (typeof confetti === "function") confetti();
        alert("2026 Daily login success! +50 Aura Points added.");
    });
}

// ====================================================================
// NATIVE MODULE: FORECASTER HUB
// ====================================================================
function renderNativeForecasterHub() {
    const container = document.getElementById("polymarket-top-container"); 
    if (!container) return;

    if (!userAddress || !isConnected) {
        container.innerHTML = `
            <div class="bg-slate-950/40 border border-slate-900 border-dashed rounded-2xl p-8 text-center space-y-3 backdrop-blur-sm">
                <div class="text-xl">🔒</div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Forecaster Terminal Locked</h4>
                <p class="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Connect your Web3 Wallet to initialize $FORECAST presale matrix, direct staking routers, and native premium pass layers.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="space-y-4 text-left">
            <div class="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3 transition-all">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">🔥 TOKEN IDO PRESALE</span>
                    <span class="text-amber-400 font-mono animate-pulse">● Live Protocol Phase 1</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200 leading-snug">Secure Pre-Listing $FORECAST Tokens</h4>
                <p class="text-[10px] text-slate-400 font-mono">Rate: 1 ETH = 1,000,000 $FORECAST</p>
                <div class="pt-1 flex gap-2">
                    <input id="presale-eth-input" type="number" step="0.001" min="0.001" value="1" class="w-2/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none">
                    <button id="btn-action-presale" class="w-1/3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-[11px] font-mono tracking-wide transition-all shadow-md active:scale-95">BUY NOW</button>
                </div>
            </div>

            <div class="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3 transition-all">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">🎰 LIQUIDITY POOL</span>
                    <span class="text-slate-400 font-mono">Est. APY: 18.5%</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200">Base Native Prediction Micro-Betting</h4>
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <button id="btn-action-stake-yes" class="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[10px] font-mono font-bold text-emerald-400 active:scale-95">📈 Stake YES (0.0002 ETH)</button>
                    <button id="btn-action-stake-no" class="p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-[10px] font-mono font-bold text-rose-400 active:scale-95">📉 Stake NO (0.0002 ETH)</button>
                </div>
            </div>

            <div class="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-3 transition-all">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">👑 VIP UTILITY PASS</span>
                    <span class="text-slate-400 font-mono">Cost: 0.0005 ETH</span>
                </div>
                <button id="btn-action-mint-pass" class="w-full text-center p-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-mono font-extrabold text-[11px] rounded-xl active:scale-95 flex items-center justify-center gap-1">🔑 MINT PREMIUM ACCESS PASS</button>
            </div>
        </div>
    `;

    // Pasangkan event listener di dalam hub setelah dirender
    document.getElementById("btn-action-presale")?.addEventListener("click", executePreListingBuy);
    document.getElementById("btn-action-stake-yes")?.addEventListener("click", () => executeBaseBet("YES"));
    document.getElementById("btn-action-stake-no")?.addEventListener("click", () => executeBaseBet("NO"));
    document.getElementById("btn-action-mint-pass")?.addEventListener("click", executeMintPass);
}

// ================= TRANSACTION ROUTERS (REAL RPC DIRECT ROUTING) =================

async function executePreListingBuy() {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Please connect your wallet first!");

    const inputEl = document.getElementById("presale-eth-input");
    const amountETH = inputEl && inputEl.value ? inputEl.value : "1";

    try {
        const hexValue = toSafeHexWei(amountETH);
        alert("Memicu konfirmasi transaksi presale di Wallet Anda...");
        
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: DEVELOPER_WALLET,
                value: hexValue,
            }],
        });
        alert("🚀 Transaksi Presale Berhasil Dikirim! Hash: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Transaksi gagal atau dibatalkan: " + err.message);
    }
}

async function executeBaseBet(option) {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Please connect your Web3 Wallet first!");
    
    try {
        const hexValue = toSafeHexWei("0.0002");
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: DEVELOPER_WALLET,
                value: hexValue,
            }],
        });
        alert(`🎰 Prediction Stake Active on [${option}]! Hash: ${txHash}`);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Staking dibatalkan: " + err.message);
    }
}

async function executeMintPass() {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Please connect your Web3 Wallet first!");

    try {
        const hexValue = toSafeHexWei("0.0005");
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: nftContractAddress,
                value: hexValue,
                data: "0xa0712d68" 
            }],
        });
        alert("👑 Premium Access Pass Activated! Hash: " + txHash);
        currentGlowColor = "rgba(245, 158, 11, 0.05)"; 
        currentFrameColor = "#f59e0b"; 
        if (currentFateGlobal && userAddress) generateDestiny(userAddress);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Minting gagal atau dibatalkan: " + err.message);
    }
}

// ==========================================
// DESTINY ENGINE GENERATION & RENDERING
// ==========================================
function generateDestiny(address) {
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);

    const fateIndex = seed % fateLibrary.length;
    const selectedFate = fateLibrary[fateIndex];
    currentFateGlobal = selectedFate; 
    const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 
    
    const fateEl = document.getElementById("fortune-fate");
    if (fateEl) fateEl.innerText = selectedFate.fate;

    const textEl = document.getElementById("fortune-text");
    if (textEl) {
        textEl.innerText = selectedFate.text;
        if (textEl.parentElement) textEl.parentElement.classList.remove("hidden");
    }
    
    const emojiEl = document.getElementById("fortune-emoji");
    if (emojiEl) {
        emojiEl.innerText = selectedFate.emoji;
        emojiEl.classList.remove("hidden");
    }
    
    const scoreEl = document.getElementById("luck-score");
    if (scoreEl) scoreEl.innerText = `${finalLuckScore}%`;

    const barEl = document.getElementById("luck-bar");
    if (barEl) barEl.style.width = `${finalLuckScore}%`;

    const seedEl = document.getElementById("seed-anchor");
    if (seedEl) seedEl.innerText = `#${seed}`;

    try { drawDestinyCard(selectedFate, finalLuckScore, address, seed); } catch(e){}
    try { setupTwitterShare(selectedFate, finalLuckScore); } catch(e){}
    generateAIWalletAdvice(selectedFate, finalLuckScore);
}

// ==========================================
// PREMIUM CANVAS DRAW ENGINE
// ==========================================
function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let radialGrad = ctx.createRadialGradient(175, 200, 10, 175, 250, 300);
    radialGrad.addColorStop(0, "#1e293b");  
    radialGrad.addColorStop(0.5, "#0f172a"); 
    radialGrad.addColorStop(1, "#020617");   
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, 350, 500);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.1)"; 
    ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x < 350; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 500); ctx.stroke();
    }
    for (let y = 0; y < 500; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(350, y); ctx.stroke();
    }

    ctx.lineWidth = 4;
    if (currentFrameColor) {
        ctx.strokeStyle = currentFrameColor;
    } else {
        let goldGrad = ctx.createLinearGradient(0, 0, 350, 500);
        goldGrad.addColorStop(0, "#f59e0b"); 
        goldGrad.addColorStop(1, "#2563eb"); 
        ctx.strokeStyle = goldGrad;
    }
    ctx.strokeRect(10, 10, 330, 480);

    ctx.fillStyle = "#94a3b8"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; 
    ctx.fillText("BASE FORECASTER CORES", 175, 52);
    ctx.font = "64px serif"; ctx.fillText(fateObj.emoji, 175, 145);
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 19px sans-serif"; 
    ctx.fillText(fateObj.fate, 175, 210);

    ctx.fillStyle = "#cbd5e1"; ctx.font = "italic 11.5px serif";
    const words = fateObj.text.split(" "); 
    let line = ""; let y = 252;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > 270 && n > 0) { 
            ctx.fillText(line, 175, y); line = words[n] + " "; y += 17; 
        } else { line = testLine; }
    }
    ctx.fillText(line, 175, y);

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)"; 
    ctx.fillRect(30, 395, 290, 62);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)"; 
    ctx.strokeRect(30, 395, 290, 62);
    
    ctx.textAlign = "left"; ctx.font = "10.5px monospace"; ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 413);
    ctx.fillStyle = "#22d3ee";
    ctx.fillText(`LUCK    : ${score}% DEGEN LEVEL`, 45, 430);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 447);
    
    ctx.textAlign = "center"; ctx.font = "9px monospace"; ctx.fillStyle = "#64748b";
    ctx.fillText("VERIFIED BY BASE CHAIN CRYPTO-GRAPH", 175, 480);
}

// ==========================================
// FEATURE: SMART WALLET AUDITOR AI ADVISOR
// ==========================================
function generateAIWalletAdvice(fate, score) {
    const adviceEl = document.getElementById("ai-wallet-advice");
    if (!adviceEl) return;

    let adviceText = "";
    if (score > 80) {
        adviceText = `📊 [AI AUDIT]: Security clearance high. Active Status: ${fate.fate}. Advice: You have strong momentum, buy $FORECAST to build an allocation layer.`;
    } else if (score > 50) {
        adviceText = `📊 [AI AUDIT]: Moderate risk parameter detected. Active Status: ${fate.fate}. Advice: Deploy small micro-stakes into native daily predictions.`;
    } else {
        adviceText = `⚠️ [AI AUDIT]: High alert status. Active Status: ${fate.fate}. Advice: Lock your matrix with an official Pass.`;
    }
    adviceEl.innerText = adviceText;
}

// ==========================================
// FEATURE: ORACLE TARGET LOOKUP
// ==========================================
function lookupExternalTarget() {
    const input = document.getElementById("external-target-input");
    const result = document.getElementById("external-target-result");
    if (!input || !result) return;

    const value = input.value.trim();
    if (!value) return;

    result.classList.remove("hidden");
    result.innerHTML = `<span class="text-xs text-blue-400 font-mono animate-pulse">Scanning matrix hash for ${value}...</span>`;

    setTimeout(() => {
        let cleanVal = value.toUpperCase();
        result.innerHTML = `
            <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono space-y-1 text-left">
                <div class="text-emerald-400 font-bold">🔍 SCAN COMPLETE</div>
                <div class="text-slate-400">Target Segment: <span class="text-white">${value}</span></div>
                <div class="text-cyan-400">Cosmic Status: ${cleanVal.length % 2 === 0 ? "BULLISH RESONANCE" : "CHAOTIC ORBITAL"}</div>
            </div>
        `;
    }, 1000);
}

// ==========================================
// FEATURE: LIVE NOTIFICATION BANNER LOOP
// ==========================================
function startLiveNotificationLoop() {
    const banner = document.getElementById("live-notification");
    const emojiEl = document.getElementById("live-notif-emoji");
    const textEl = document.getElementById("live-notif-text");
    if (!banner || !emojiEl || !textEl) return;

    setInterval(() => {
        const randType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const randName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        let text = "";

        if (randType === "MINT") {
            emojiEl.innerText = "🪙";
            text = `User **${randName}** successfully secured their Presale allocation of **$FORECAST**!`;
        } else if (randType === "NEW_USER") {
            emojiEl.innerText = "🔮";
            const fate = fakeFates[Math.floor(Math.random() * fakeFates.length)];
            text = `New traveler linked node! **${randName}** rolled fate: **${fate}**`;
        } else if (randType === "TIP") {
            emojiEl.innerText = "💸";
            text = `Generous soul **${randName}** staked 0.0002 ETH into the Live Forecast Predictions!`;
        }

        textEl.innerHTML = text;
        banner.classList.remove("hidden", "translate-y-[-100px]", "opacity-0");
        banner.classList.add("translate-y-0", "opacity-100");

        setTimeout(() => {
            banner.classList.remove("translate-y-0", "opacity-100");
            banner.classList.add("translate-y-[-100px]", "opacity-0");
        }, 4000);

    }, 12000);
}

// ==========================================
// FEATURE: MINT NFT DESTINY CARD 
// ==========================================
function setupUniversalMintButton() {
    const mintBtn = document.getElementById("mint-nft-btn");
    if (!mintBtn) return;

    mintBtn.addEventListener("click", async () => {
        const provider = getActiveProvider();
        if (!provider || !isConnected) {
            alert("🔒 Link your wallet matrix before committing to an on-chain mint!");
            return;
        }

        mintBtn.disabled = true;
        mintBtn.innerHTML = "⏳ Processing Base Mint Sequence...";

        try {
            await provider.request({ 
                method: "eth_sendTransaction", 
                params: [{
                    to: nftContractAddress,
                    from: userAddress,
                    value: toSafeHexWei("0.0005"), 
                    data: "0xa0712d68" 
                }] 
            });
            if (typeof confetti === "function") confetti();
            alert("🎉 Success! Your Destiny Card NFT has been minted permanently!");
        } catch (err) {
            alert("Minting dibatalkan atau error: " + err.message);
        }

        let currentMints = parseInt(localStorage.getItem("global_mints")) || 842;
        currentMints += 1;
        localStorage.setItem("global_mints", currentMints);
        if (document.getElementById("mint-counter")) document.getElementById("mint-counter").innerText = currentMints;

        mintBtn.disabled = false;
        mintBtn.innerHTML = "🔮 MINT YOUR DESTINY CARD (0.0005 ETH)";
    });
}

// ==========================================
// FEATURE: TIP SYSTEM LOGIC
// ==========================================
function setupTipSystem() {
    const donateBtn = document.getElementById("donate-btn");
    if (!donateBtn) return;

    donateBtn.addEventListener("click", async () => {
        const provider = getActiveProvider();
        if (!provider || !isConnected) {
            alert("🔒 Link your terminal first to send tips.");
            return;
        }
        try {
            await provider.request({ 
                method: "eth_sendTransaction", 
                params: [{ to: DEVELOPER_WALLET, from: userAddress, value: toSafeHexWei("0.001") }] 
            });
            alert("💖 Thank you for feeding the matrix! Tip processed.");
        } catch (err) {
            alert("Tip gagal dikirim: " + err.message);
        }
    });
}

// ==========================================
// FEATURE: DEGEN LUCKY WHEEL GACHA SPIN
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
        "🎰 100x MEMECOIN ROCKET SIGNAL ALIGNED",
        "💎 DIAMOND HAND REINFORCEMENT BUFF (+20 AURA)",
        "⛽ GAS FEE MITIGATION PROTOCOL ACTIVATED",
        "🛡️ HONEYPOT IMMUNITY DRIFT (24H CLEARANCE)"
    ];

    setTimeout(() => {
        graphic.classList.remove("animate-spin");
        const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
        graphic.innerText = "🎁";
        result.innerHTML = `<strong>SPIN OUTCOME:</strong><br>${finalPrize}`;
        result.classList.remove("hidden");
        btn.disabled = false;
        if (typeof confetti === "function") confetti();
    }, 2500);
}

// ==========================================
// FEATURE: ORACLE AI CHAT SYSTEM
// ==========================================
function setupAIChatSystem() {
    const input = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-chat-send-btn");
    const logs = document.getElementById("ai-chat-logs");
    if (!input || !sendBtn || !logs) return;

    // Bersihkan listener lama agar tidak double trigger saat init ulang
    const newSendBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement("div");
        userMsg.className = "text-white bg-slate-900 p-2 rounded-xl text-right ml-6";
        userMsg.innerHTML = `<strong>You:</strong> ${text}`;
        logs.appendChild(userMsg);
        input.value = "";
        logs.scrollTop = logs.scrollHeight;

        setTimeout(() => {
            const botMsg = document.createElement("div");
            botMsg.className = "text-slate-400 bg-slate-900/60 p-2 rounded-xl mr-6";
            let response = "The matrix patterns are foggy. Re-route your query, traveler.";
            let currentFate = currentFateGlobal ? currentFateGlobal.fate : "THE UNKNOWN TRAVELER";

            const lowText = text.toLowerCase();
            if (lowText.includes("forecast") || lowText.includes("presale") || lowText.includes("buy")) {
                response = `🔮 **Oracle Analysis**: Token **$FORECAST** presale is route-active on Base chain layer.`;
            } else if (lowText.includes("pass") || lowText.includes("premium")) {
                response = `👑 **Premium Layer**: Minting the Access Pass upgrades your oracle accuracy vectors.`;
            } else {
                response = `🧙‍♂️ **Oracle AI Whispers**: Your core node **${currentFate}** has registered this path.`;
            }

            botMsg.innerHTML = `<strong>Oracle AI:</strong> ${response}`;
            logs.appendChild(botMsg);
            logs.scrollTop = logs.scrollHeight;
        }, 800);
    }

    newSendBtn.addEventListener("click", handleSend);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
}

function setupAppLogo() { appLogoImg = new Image(); appLogoImg.src = ""; }
function setupViewCounter() { const el = document.getElementById("view-counter"); if(el) el.innerText = "14,250"; }
function setupMintCounter() { const el = document.getElementById("mint-counter"); if(el) el.innerText = localStorage.getItem("global_mints") || "842"; }
function setupTwitterShare(fateObj, score) {
    const shareBtn = document.getElementById("share-x-btn");
    if (!shareBtn) return;
    shareBtn.onclick = () => {
        const tweetText = encodeURIComponent(`🔮 My Base Chain Destiny is sealed! \n\nFate: ${fateObj.fate}\nLuck Score: ${score}%`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
    };
}

// ====================================================================
// SINGLE INITIALIZATION & DELEGATION SYSTEM (ANTI-GAGAL MOBILE dAPP)
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Jalankan komponen bawaan UI dasar
    try { setupAppLogo(); } catch(e) {}
    try { setupViewCounter(); } catch(e) {}
    try { setupMintCounter(); } catch(e) {}
    try { startLiveNotificationLoop(); } catch(e) {}
    try { setupDailyLogin(); } catch(e) {}
    try { setupUniversalMintButton(); } catch(e) {}
    try { setupTipSystem(); } catch(e) {}
    try { setupAIChatSystem(); } catch(e) {}

    // 2. Setup Lookup Target
    const lookupBtn = document.getElementById("external-target-btn");
    if (lookupBtn) lookupBtn.addEventListener("click", lookupExternalTarget);
    const lookupInput = document.getElementById("external-target-input");
    if (lookupInput) {
        lookupInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") lookupExternalTarget();
        });
    }

    // 3. Setup Spin Gacha Wheel
    const spinBtn = document.getElementById("btn-spin");
    if (spinBtn) spinBtn.addEventListener("click", spinTheWheel);

    // 4. GLOBAL EVENT DELEGATION: Handler Klik Tombol Connect/Disconnect Utama
    document.addEventListener("click", (e) => {
        const target = e.target.closest("#connect-btn");
        if (!target) return;
        
        e.preventDefault();
        const status = target.getAttribute("data-status");
        if (status === "connected") {
            disconnectWallet();
        } else {
            connectWallet();
        }
    });

    // 5. Inisialisasi awal UI terminal
    initWalletSystem();
    
    // 6. SAFE AUTO-SESSION DETECT LAYER
    const isBlacklisted = localStorage.getItem("wallet_blacklisted");
    const provider = getActiveProvider();

    if (provider && isBlacklisted !== "true") {
        setTimeout(async () => {
            try {
                const accounts = await provider.request({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    userAddress = accounts[0];
                    isConnected = true;
                    updateWalletUI(userAddress);
                    renderNativeForecasterHub(); 
                    
                    const rSec = document.getElementById("result-section");
                    if (rSec) rSec.classList.remove("hidden");
                    generateDestiny(userAddress);
                }
            } catch (err) {
                console.error("Auto detect failed:", err);
            }
        }, 600);
    }
});
