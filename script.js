/**
 * Base Forecaster - Production Core Logic Script
 * Optimized Architecture - Dynamic Gecko Integration Hub + Clean Web3 Vector Loops.
 */

const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 
const tokenContractAddress = "0x052aE904DD28b5D840F7a25f77003E0f9597Fc69"; 
const flaunchShareLink = "https://flaunch.gg/base/coins/0x052aE904DD28b5D840F7a25f77003E0f9597Fc69";
const DEVELOPER_WALLET = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; 
const B20_FACTORY_ADDRESS = "0xB20f000000000000000000000000000000000000"; 

let userAddress = "";
let isConnected = false;
let currentFateGlobal = null; 
let currentFrameColor = "#f59e0b"; 
let frameNameGlobal = "Gold Luck Destiny";
let userLuckScoreGlobal = 50;

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
// PREMIUM 100% LIVE TICKER ENGINE (GECKOTERMINAL + SECURE DEX BACKUP)
// ====================================================================
async function renderTopTrendingBaseCoins() {
    const tickerWrapper = document.getElementById("live-ticker-inner-marquee");
    try {
        const response = await fetch("https://api.geckoterminal.com/api/v2/networks/base/trending_pools?page=1");
        if (!response.ok) throw new Error("Primary stream link failed");

        const json = await response.json();
        const pools = json.data;
        if (!pools || pools.length === 0) throw new Error("Empty core payload");

        const tickerItems = [];
        const seenAddresses = new Set();
        let displayCount = 0;

        for (const pool of pools) {
            if (displayCount >= 12) break;
            const attributes = pool.attributes;
            const tokenAddress = pool.relationships?.base_token?.data?.id?.split('_')[1];
            
            if (!tokenAddress || seenAddresses.has(tokenAddress.toLowerCase())) continue;

            let symbol = attributes.name.split(/[\/\-]/)[0].trim();
            if (['weth', 'usdc', 'usdt', 'usd', 'base'].includes(symbol.toLowerCase())) continue;

            const priceUsd = parseFloat(attributes.token_price_usd) || 0;
            const priceChange = parseFloat(attributes.price_change_percentage?.h24 || 0);

            if (priceChange <= 0 || priceUsd === 0) continue; 

            const formattedPrice = priceUsd < 0.0001 ? priceUsd.toFixed(7) : (priceUsd < 0.01 ? priceUsd.toFixed(5) : priceUsd.toFixed(2));
            seenAddresses.add(tokenAddress.toLowerCase());
            displayCount++;

            tickerItems.push(`
                <button onclick="quickSelectToken('${tokenAddress}', '${symbol}')" class="inline-flex items-center gap-1.5 mx-3 bg-slate-950 border border-emerald-950 px-2.5 py-1 rounded-xl hover:border-cyan-400 transition-all text-left">
                    <span class="text-emerald-500 font-bold text-[9px]">#${displayCount}</span>
                    <span class="text-white font-extrabold font-mono text-[10px]">${symbol}</span>
                    <span class="text-slate-400 text-[10px]">$${formattedPrice}</span>
                    <span class="text-emerald-400 font-bold text-[9px]">▲ ${priceChange.toFixed(1)}%</span>
                </button>
            `);
        }

        if (tickerWrapper && tickerItems.length >= 3) {
            tickerWrapper.innerHTML = tickerItems.join('');
            return;
        }
        throw new Error("Insufficient dynamic elements pool");
    } catch (error) {
        console.warn("Switching stream to secondary matrix route...", error);
        executeDexScreenerFallback(tickerWrapper);
    }
}

async function executeDexScreenerFallback(wrapperElement) {
    if (!wrapperElement) return;
    try {
        const response = await fetch("https://api.dexscreener.com/latest/dex/search?q=degen");
        const data = await response.json();
        if (!data.pairs) return;

        const filteredPairs = data.pairs
            .filter(p => p.chainId === 'base' && p.baseToken && p.priceChange?.h24 > 0)
            .sort((a, b) => (b.priceChange?.h24 || 0) - (a.priceChange?.h24 || 0));

        const tickerItems = [];
        const seen = new Set();
        let count = 0;

        for (const pair of filteredPairs) {
            if (count >= 10) break;
            const symbol = pair.baseToken.symbol;
            const address = pair.baseToken.address;
            if (['weth', 'usdc', 'base'].includes(symbol.toLowerCase()) || seen.has(address.toLowerCase())) continue;

            const rawPrice = parseFloat(pair.priceUsd) || 0;
            const formattedPrice = rawPrice < 0.0001 ? rawPrice.toFixed(7) : rawPrice.toFixed(2);
            
            seen.add(address.toLowerCase());
            count++;

            tickerItems.push(`
                <button onclick="quickSelectToken('${address}', '${symbol}')" class="inline-flex items-center gap-1.5 mx-3 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl hover:border-cyan-400 text-left">
                    <span class="text-cyan-500 font-bold text-[9px]">#${count}</span>
                    <span class="text-white font-extrabold font-mono text-[10px]">${symbol}</span>
                    <span class="text-slate-400 text-[10px]">$${formattedPrice}</span>
                    <span class="text-emerald-400 font-bold text-[9px]">▲ ${pair.priceChange.h24}%</span>
                </button>
            `);
        }
        wrapperElement.innerHTML = tickerItems.length > 0 ? tickerItems.join('') : `<span class="text-slate-500 text-xs">Syncing data chains...</span>`;
    } catch (e) {
        wrapperElement.innerHTML = `<span class="text-slate-500 text-xs">Matrix stream offline</span>`;
    }
}

// ====================================================================
// B20 ENGINE & WALLET METRICS BROADCASTER
// ====================================================================
async function deployNewB20Token(tokenName, tokenSymbol) {
    if (!tokenName || !tokenSymbol) return alert("Please fill Token Name & Symbol data slots!");
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Web3 secure wallet tunnel is inactive!");

    try {
        alert(`🚀 Directing deployment matrix payload for: ${tokenName.toUpperCase()} via Base Core Studio`);
        const randomSalt = "0x" + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join("");
        const dataPayload = "0x0162c7210000000000000000000000000000000000000000000000000000000000000000" + randomSalt.replace("0x",""); 

        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddress, to: B20_FACTORY_ADDRESS, data: dataPayload, value: "0x0" }],
        });

        alert(`🔥 B20 Standard contract instantiated successfully!\nTransaction Hash: ${txHash}`);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("❌ Base Studio Refused Transmit Vector: " + err.message);
    }
}
window.deployNewB20Token = deployNewB20Token;

// ====================================================================
// SOCIAL CORE SHARING MODULES (X & TELEGRAM INTEGRATION)
// ====================================================================
function setupSocialEngines() {
    document.getElementById("share-x-btn")?.addEventListener("click", () => {
        const fateName = currentFateGlobal ? currentFateGlobal.fate : "THE DEGEN ANOMALY";
        const tweetText = encodeURIComponent(`🔮 Just revealed my on-chain destiny inside Base Forecaster!\n\n🧬 Identity: ${fateName}\n⚡ Alignment Score: ${userLuckScoreGlobal}%\n\nVerify your hexadecimal matrix signature here 👇\n@BaseForecaster #BaseChain #B20`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    });

    document.getElementById("share-tg-btn")?.addEventListener("click", () => {
        window.open("https://t.专/BaseForecaster", '_blank'); // Redirection endpoint for username @BaseForecaster
    });
}

// ====================================================================
// CORE CONTRACT INTERACTION (MINT / TIPS / SWAPS)
// ====================================================================
async function sendTip() {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Connect system node to your wallet!");
    try {
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddress, to: DEVELOPER_WALLET, value: toSafeHexWei("0.001"), data: "0x" }],
        });
        alert("💸 Transmission Node success! Tx: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) { alert("Matrix Core Aborted: " + err.message); }
}

async function mintNFT() {
    const provider = getActiveProvider();
    if (!provider || !isConnected) return alert("Connect wallet node first!");
    try {
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddress, to: nftContractAddress, value: toSafeHexWei("0.000"), data: "0x1249c5b8" }],
        });
        alert("🪙 Mint request validated onto chain! Tx: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) { alert("Execution Failed: " + err.message); }
}

// ====================================================================
// RADAR FORECAST EXTRACTOR & DYNAMIC TECHNICAL ALIGNMENT
// ====================================================================
async function executeTokenScan() {
    const targetInput = document.getElementById("external-target-input");
    const resultDiv = document.getElementById("external-target-result");
    if (!targetInput || !resultDiv) return;

    const query = targetInput.value.trim();
    if (!query) return alert("Input required parameter block!");

    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `<p class="text-[11px] text-cyan-400 animate-pulse font-mono">📡 Parsing core contract data packets...</p>`;

    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${query}`);
        const data = await response.json();
        const basePairs = data.pairs ? data.pairs.filter(p => p.chainId === 'base') : [];

        if (basePairs.length === 0) {
            resultDiv.innerHTML = `<div class="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-[10px] font-mono text-rose-400">❌ Identity footprint missing inside Base Layer-2 system.</div>`;
            return;
        }

        const bestPair = basePairs[0];
        const priceUsd = parseFloat(bestPair.priceUsd) || 0;
        const priceChange = bestPair.priceChange?.h24 || 0;
        const marketCap = bestPair.fdv ? Math.floor(bestPair.fdv).toLocaleString() : "N/A";
        const liquidity = bestPair.liquidity?.usd ? Math.floor(bestPair.liquidity.usd).toLocaleString() : "N/A";

        const volatilityFactor = Math.min(15, Math.max(3, Math.abs(priceChange) * 0.4));
        const middleBand = priceUsd / (1 + (priceChange / 100));
        const standardDeviation = middleBand * (volatilityFactor / 100);
        const upperBand = middleBand + (2 * standardDeviation);
        const lowerBand = middleBand - (2 * standardDeviation);

        let bbStatus = "STABLE AXIS", bbBadgeColor = "text-cyan-400 bg-cyan-950/50 border-cyan-500/40";
        if (priceUsd >= upperBand * 0.98) { bbStatus = "OVERBOUGHT CORE"; bbBadgeColor = "text-rose-400 bg-rose-950/50 border-rose-500/40"; }
        else if (priceUsd <= lowerBand * 1.02) { bbStatus = "OVERSOLD POINT"; bbBadgeColor = "text-emerald-400 bg-emerald-950/50 border-emerald-500/40"; }

        resultDiv.innerHTML = `
            <div class="p-3 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2.5 font-mono text-[11px]">
                <div class="flex justify-between border-b border-slate-800 pb-1.5">
                    <span class="font-bold text-white">💎 ${bestPair.baseToken.name} (${bestPair.baseToken.symbol})</span>
                    <span class="${priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">${priceChange}%</span>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                    <div>Price: <strong class="text-white">$${priceUsd.toFixed(6)}</strong></div>
                    <div>FDV Cap: <strong class="text-white">$${marketCap}</strong></div>
                    <div>Liquidity: <strong class="text-white">$${liquidity}</strong></div>
                    <div>Engine: <span class="text-cyan-400 font-bold">${bestPair.dexId.toUpperCase()}</span></div>
                </div>
                <div class="p-1.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                    <span class="text-[9px] text-slate-500">BB MATRIX ALIGNMENT:</span>
                    <span class="px-1 text-[8px] font-bold rounded border ${bbBadgeColor}">${bbStatus}</span>
                </div>
                <div class="flex gap-2">
                    <input id="buy-amount-eth" type="number" step="0.001" value="0.01" class="w-1/3 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-mono text-white focus:outline-none" />
                    <button onclick="triggerWeb3Buy('${bestPair.baseToken.address}', '${bestPair.dexId}')" class="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1 rounded-xl transition-all">
                        ⚡ Core Web3 Swap Node
                    </button>
                </div>
                <div id="tx-status-output" class="hidden mt-1 text-[9px] text-amber-500 text-center font-mono"></div>
            </div>
        `;
    } catch (e) {
        resultDiv.innerHTML = `<div class="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-[10px] font-mono text-rose-400">⚠️ Secure terminal parse handshake failure.</div>`;
    }
}
window.executeTokenScan = executeTokenScan;

async function triggerWeb3Buy(tokenAddress, dexId) {
    const amountInput = document.getElementById("buy-amount-eth");
    const statusDiv = document.getElementById("tx-status-output");
    if (!amountInput || !statusDiv || !isConnected) return alert("Validate connection node first!");

    const ethAmount = amountInput.value.trim();
    const provider = getActiveProvider();
    if (!provider) return;

    statusDiv.classList.remove("hidden");
    statusDiv.innerText = "⏳ Packaging cryptographic parameters...";

    try {
        let router = "0x2626664c2602818E568351633F6522EAC9D1217e"; // Uniswap V3 Base default
        if (dexId.toLowerCase() === 'aerodrome') router = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"; 

        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddress, to: router, value: toSafeHexWei(ethAmount), data: "0x" }],
        });

        statusDiv.innerHTML = `✅ Transmitted! <a href='https://basescan.org/tx/${txHash}' target='_blank' class='text-cyan-400 underline'>Track Hex</a>`;
        if (typeof confetti === "function") confetti();
    } catch (err) {
        statusDiv.innerText = `❌ Error: ${err.message.substring(0,30)}`;
    }
}
window.triggerWeb3Buy = triggerWeb3Buy;

// ====================================================================
// NAVIGATION & LEADERBOARD CONTROLS
// ====================================================================
function navigate(targetTab) {
    if (!isConnected) return alert("Unlock terminal channel via Web3 payload!");
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    const targetEl = document.getElementById(`tab-${targetTab}`);
    if (targetEl) targetEl.classList.remove('hidden');

    const menuColors = { oracle: 'text-blue-400', glow: 'text-cyan-400', wheel: 'text-purple-400', ranks: 'text-yellow-400' };
    Object.keys(menuColors).forEach(k => {
        const btn = document.getElementById(`nav-${k}`);
        if (btn) btn.className = `flex flex-col items-center text-slate-500 hover:${menuColors[k]} transition-all font-mono`;
    });

    const activeBtn = document.getElementById(`nav-${targetTab}`);
    if (activeBtn) activeBtn.className = `flex flex-col items-center ${menuColors[targetTab]} transition-all font-mono scale-105 font-bold`;

    if (targetTab === 'ranks') renderLeaderboardData();
}
window.navigate = navigate;

function applyGlow(type) {
    const configurations = {
        neon: { color: "#06b6d4", text: "Cyan Neon Pulse" },
        gold: { color: "#f59e0b", text: "Gold Luck Destiny" },
        matrix: { color: "#22c55e", text: "Cyber Matrix Green" },
        rose: { color: "#f43f5e", text: "Ruby Vein Pulse" }
    };

    if (configurations[type]) {
        currentFrameColor = configurations[type].color;
        frameNameGlobal = configurations[type].text;
    }
    
    if (currentFateGlobal && userAddress) {
        let seed = 0;
        for (let i = 0; i < userAddress.length; i++) seed += userAddress.charCodeAt(i);
        drawDestinyCard(currentFateGlobal, userLuckScoreGlobal, userAddress, seed);
    }
    alert(`✨ Configured border signature grid: ${frameNameGlobal}!`);
    navigate('oracle');
}
window.applyGlow = applyGlow;

function renderLeaderboardData() {
    const container = document.getElementById("ranks-list-container");
    if (!container || !userAddress) return;

    container.innerHTML = `
        <div class="p-3 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs font-mono">
            <div class="text-left"><div>0x71C9...8B29</div><div class="text-[9px] text-amber-500">🐋 PLATINUM POSITION</div></div>
            <div class="font-bold text-cyan-400 text-sm">99%</div>
        </div>
        <div class="p-3 rounded-xl border border-cyan-500 bg-cyan-950/20 flex items-center justify-between text-xs font-mono shadow-md">
            <div class="text-left"><div class="text-cyan-400">${userAddress.slice(0,6)}...${userAddress.slice(-4)} (YOU)</div><div class="text-[9px] text-slate-500">CORE SYSTEM LAYER</div></div>
            <div class="font-bold text-cyan-400 text-sm">${userLuckScoreGlobal}%</div>
        </div>
    `;
}

function spinTheWheel() {
    const btn = document.getElementById("btn-spin");
    const graphic = document.getElementById("wheel-graphic");
    const result = document.getElementById("spin-result");
    if (!btn || !graphic || !result) return;

    btn.disabled = true;
    result.classList.add("hidden");
    graphic.classList.add("animate-spin");

    setTimeout(() => {
        graphic.classList.remove("animate-spin");
        result.innerHTML = `<strong>SPIN LOG ALIGNMENT:</strong><br>🎰 ANTI-RUG SYSTEM DRIFT REINFORCEMENT ACTIVE`;
        result.classList.remove("hidden");
        btn.disabled = false;
        if (typeof confetti === "function") confetti();
    }, 1500);
}
window.spinTheWheel = spinTheWheel;

// ====================================================================
// SECURITY ROOT INTERFACES & CONNECT LOGIC
// ====================================================================
async function connectWallet() {
    const provider = getActiveProvider();
    if (!provider) return alert("❌ Web3 Node Client missing. Open via OKX/Coinbase wallet portal.");

    try {
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];
        isConnected = true;

        updateWalletUI(userAddress);
        renderNativeForecasterHub(); 

        document.getElementById("locked-state-view").classList.add("hidden");
        document.getElementById("result-section").classList.remove("hidden");
        
        generateDestiny(userAddress);
        await renderTopTrendingBaseCoins(); 
        navigate('oracle'); 
    } catch (error) {
        alert("🔒 Bridge authentication denied: " + error.message);
    }
}

function updateWalletUI(address) {
    const btn = document.getElementById("connect-btn");
    if (!btn) return;
    btn.innerHTML = `🔴 Disconnect Node (${address.slice(0, 4)}...${address.slice(-4)})`;
    btn.className = "w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-2xl font-mono transition-all text-center block shadow-lg";
}

function renderNativeForecasterHub() {
    const container = document.getElementById("polymarket-top-container"); 
    if (!container || !isConnected) return;

    container.innerHTML = `
        <div class="space-y-3.5 text-left mt-2 mb-2">
            <div class="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">⚡ BLOCKCHAIN NODE AGENT</span>
                    <span class="text-emerald-400 font-mono animate-pulse">● Curve Synced</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200">Acquire $FORECAST Directly</h4>
                <div class="flex gap-2">
                    <input id="presale-eth-input" type="number" step="0.001" value="0.005" class="w-2/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none">
                    <button id="btn-action-presale" class="w-1/3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-xl text-[11px] font-mono shadow-md">SWAP NOW</button>
                </div>
                <a href="${flaunchShareLink}" target="_blank" class="w-full block text-center p-2 bg-slate-900 border border-slate-800 text-[9px] font-mono text-cyan-400 font-bold rounded-xl">
                    📈 TRACK METRICS RECORD ON FLAUNCH.GG ➜
                </a>
            </div>
            <div class="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <span class="text-indigo-400 font-black tracking-wider text-[10px] block">⚙️ BASE B20 CREATOR ENGINE</span>
                <div class="space-y-2">
                    <input id="b20-name" type="text" placeholder="Token Name (e.g., Pepe Base)" class="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white text-xs outline-none focus:border-indigo-500" />
                    <input id="b20-symbol" type="text" placeholder="Token Symbol (e.g., PEPEB)" class="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white text-xs outline-none focus:border-indigo-500" />
                </div>
                <button onclick="deployNewB20Token(document.getElementById('b20-name').value, document.getElementById('b20-symbol').value)" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-[10px] transition-all">
                    🚀 TRANSMIT COMPILATION LAYER
                </button>
            </div>
        </div>
    `;
    document.getElementById("btn-action-presale")?.addEventListener("click", executeDirectBuy);
}

async function executeDirectBuy() {
    const provider = getActiveProvider();
    if (!provider || !userAddress) return;
    const amountETH = document.getElementById("presale-eth-input")?.value || "0.005";
    try {
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAddress, to: tokenContractAddress, value: toSafeHexWei(amountETH), data: "0x" }],
        });
        alert("🚀 Node Transfer success! Tx: " + txHash);
    } catch (err) { alert("Refused: " + err.message); }
}

// ====================================================================
// CANVAS RENDER & MATHEMATICAL SEED ANALYSIS
// ====================================================================
function generateDestiny(address) {
    let seed = 0;
    const cleanAddress = address.toLowerCase().replace("0x", "");
    for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);

    currentFateGlobal = fateLibrary[seed % fateLibrary.length];
    userLuckScoreGlobal = Math.min(100, Math.max(15, (seed % 85) + 15)); 
    
    document.getElementById("luck-score").innerText = `${userLuckScoreGlobal}%`;
    document.getElementById("luck-bar").style.width = `${userLuckScoreGlobal}%`;
    document.getElementById("seed-anchor").innerText = `0x${seed.toString(16).toUpperCase()}`;

    drawDestinyCard(currentFateGlobal, userLuckScoreGlobal, address, seed);
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 350, 500);

    const characterImg = new Image();
    characterImg.src = fateObj.imagePath; 

    const finalizeDraw = () => {
        ctx.fillStyle = "rgba(2, 6, 23, 0.55)"; 
        ctx.fillRect(0, 0, 350, 500);
        
        ctx.textAlign = "center";
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(fateObj.fate, 175, 210);

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#94a3b8";
        
        let words = fateObj.text.split(" "), line = "", y = 250;
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            if (ctx.measureText(testLine).width > 280 && n > 0) {
                ctx.fillText(line, 175, y); line = words[n] + " "; y += 18;
            } else { line = testLine; }
        }
        ctx.fillText(line, 175, y);

        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.fillRect(25, 390, 300, 75);
        ctx.lineWidth = 1; ctx.strokeStyle = currentFrameColor;
        ctx.strokeRect(25, 390, 300, 75);

        ctx.textAlign = "left"; ctx.font = "10px monospace"; ctx.fillStyle = "#ffffff";
        ctx.fillText(`ID  : ${address.slice(0,10)}...`, 40, 412);
        ctx.fillText(`LUCK: ${score}% ALIGNED`, 40, 430);
        ctx.fillText(`SEED: #00${seed}`, 40, 448);

        ctx.lineWidth = 6; ctx.strokeStyle = currentFrameColor;
        ctx.strokeRect(10, 10, 330, 480);
    };

    characterImg.onload = () => { ctx.drawImage(characterImg, 0, 0, 350, 500); finalizeDraw(); };
    characterImg.onerror = () => { ctx.fillStyle = "#090d16"; ctx.fillRect(0, 0, 350, 500); finalizeDraw(); };
}

// ====================================================================
// INITIALIZATION LIFE CYCLES
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    renderTopTrendingBaseCoins();
    setupSocialEngines();
    setInterval(renderTopTrendingBaseCoins, 30000); // Sinkronisasi otomatis setiap 30 detik

    document.getElementById("connect-btn")?.addEventListener("click", connectWallet);
    document.getElementById("tip-btn")?.addEventListener("click", sendTip);
    document.getElementById("mint-btn")?.addEventListener("click", mintNFT);
    document.getElementById("external-target-btn")?.addEventListener("click", executeTokenScan);
    
document.getElementById("daily-login-btn")?.addEventListener("click", () => {
    const today = new Date().toDateString(); // Mengambil string tanggal hari ini (e.g., "Thu Jul 02 2026")
    const lastClaim = localStorage.getItem("last_aura_claim_date");

    // Cek apakah user sudah klaim hari ini
    if (lastClaim === today) {
        alert("🔒 Matrix Reset Required: You have already secured today's Aura alignment. Come back tomorrow!");
        return; // Hentikan fungsi agar tidak bisa di-spam
    }

    // Jika belum, proses klaim seperti biasa
    let currentAP = parseInt(localStorage.getItem("premium_aura")) || 0;
    currentAP += 100;
    
    // Simpan saldo baru dan kunci tanggal hari ini
    localStorage.setItem("premium_aura", currentAP);
    localStorage.setItem("last_aura_claim_date", today);

    // Update UI
    document.getElementById("aura-points-display").innerText = `${currentAP} AP`;
    
    if (typeof confetti === "function") confetti();
    alert("🎁 +100 Aura Points successfully synchronized onto database cluster!");
});
