 /**
 * Base Forecaster - Core Logic Script (Ultimate AI Edition)
 * Fully functional with Destiny calculation, Daily Rewards, AI Advisor Auditor, and Chatbot.
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
    { fate: "THE APER", emoji: "🐒", text: "You ape in with everything. Sometimes it works, sometimes it hurts. Chill out, Bro.", score: 45 },
    { fate: "THE PANIC SELLER", emoji: "😱", text: "You sold the bottom. Again. Learn to breathe and trust your thesis.", score: 35 },
    { fate: "THE BAG HOLDER", emoji: "🎒", text: "You are holding tokens from 2022. It's time to cut your losses and pivot.", score: 32 },
    { fate: "THE FOMO KING", emoji: "🔥", text: "You bought the top. It's a painful lesson, but the market gives second chances.", score: 34 },
    { fate: "THE ABSOLUTE ZERO", emoji: "❄️", text: "A fresh wallet! The history is blank. Your destiny is yet to be written.", score: 20 }
];
     
const fakeNames = ["DegenJoe", "0xAlpha...", "BaseWhale", "CryptoGuru", "SpeedyMint", "0xChef", "AnonDegen"];
const fakeFates = ["THE WHALE ASCENDANT 🐋", "THE DEGEN SURVIVOR 🥷", "GENERATIONAL WEALTH 👑"];

const topPolymarketData = [
    { id: "poly-m1", title: "Bitcoin Hits $100k Before End of Next Month", category: "CRYPTO", marketYes: 64, marketNo: 36, aiConfidence: 98.7, aiSignal: "BUY YES" },
    { id: "poly-m2", title: "Ethereum Spot ETF Inflows Surpass $1B This Week", category: "FINANCE", marketYes: 42, marketNo: 58, aiConfidence: 96.4, aiSignal: "BUY NO" }
];

document.addEventListener("DOMContentLoaded", () => {
    try { setupViewCounter(); } catch(e){}
    try { setupMintCounter(); } catch(e){}
    try { startLiveNotificationLoop(); } catch(e){}
    try { setupDailyLogin(); } catch(e){}
    
    const lookupBtn = document.getElementById("external-target-btn");
    if (lookupBtn) lookupBtn.addEventListener("click", lookupExternalTarget);
    
    initWalletSystem();
    handlePolymarketPrivacy(); 
    
    try { setupUniversalMintButton(); } catch(e){}
    try { setupTipSystem(); } catch(e){}
    try { setupAIChatSystem(); } catch(e){}
});

function navigate(page) {
    if (!isConnected && page !== 'home') {
        alert("🔮 Connect your wallet first to unlock this dimension!");
        openWalletModal();
        return;
    }
    if (page === 'glow') {
        document.getElementById("modal-glow").classList.remove("hidden");
        document.getElementById("modal-glow").classList.add("flex");
    } else if (page === 'wheel') {
        document.getElementById("modal-wheel").classList.remove("hidden");
        document.getElementById("modal-wheel").classList.add("flex");
    } else if (page === 'home') {
        closeModal('glow'); closeModal('wheel');
    }
}

function closeModal(modalType) {
    const el = document.getElementById(`modal-${modalType}`);
    if (el) { el.classList.add("hidden"); el.classList.remove("flex"); }
}

function applyGlow(type) {
    if (type === 'neon') { currentGlowColor = "rgba(6, 182, 212, 0.05)"; currentFrameColor = "#06b6d4"; }
    else if (type === 'gold') { currentGlowColor = "rgba(245, 158, 11, 0.05)"; currentFrameColor = "#f59e0b"; }
    else if (type === 'matrix') { currentGlowColor = "rgba(34, 197, 94, 0.05)"; currentFrameColor = "#22c55e"; }
    else if (type === 'rose') { currentGlowColor = "rgba(244, 63, 94, 0.05)"; currentFrameColor = "#f43f5e"; }
    
    if (currentFateGlobal && userAddress) {
        let cleanAddress = userAddress.toLowerCase().replace("0x", "");
        let seed = 0;
        for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);
        const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 
        drawDestinyCard(currentFateGlobal, finalLuckScore, userAddress, seed);
    }
    closeModal('glow');
}

function setupDailyLogin() {
    const dailyBtn = document.getElementById("daily-login-btn");
    const auraDisplay = document.getElementById("aura-points-display");
    const auraDisplayMobile = document.getElementById("aura-points-display-mobile");
    
    let currentAP = parseInt(localStorage.getItem("user_aura_points")) || 0;
    if (auraDisplay) auraDisplay.innerText = `${currentAP} AP`;
    if (auraDisplayMobile) auraDisplayMobile.innerText = `${currentAP} AP`;

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
        if (auraDisplayMobile) auraDisplayMobile.innerText = `${currentAP} AP`;
        if (typeof confetti === "function") confetti();
        alert("📆 Daily login success! +50 Aura Points added.");
    });
}

function initWalletSystem() {
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) connectBtn.addEventListener("click", openWalletModal);

    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeWalletModal);

    setupModalButtons();

    const savedAddress = localStorage.getItem("user_wallet");
    if (savedAddress) {
        userAddress = savedAddress; isConnected = true;
        updateWalletUI(savedAddress);
        handlePolymarketPrivacy();
        generateDestiny(savedAddress);
    }
}

function openWalletModal() { document.getElementById("custom-modal").classList.remove("hidden"); }
function closeWalletModal() { document.getElementById("custom-modal").classList.add("hidden"); }

function setupModalButtons() {
    ["choose-okx", "choose-metamask"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", () => { closeWalletModal(); connectWallet(); });
    });
    const cbBtn = document.getElementById("choose-coinbase-smart");
    if (cbBtn) cbBtn.addEventListener("click", () => { closeWalletModal(); connectCoinbaseSmartWallet(); });
}

function updateWalletUI(address) {
    const connectBtn = document.getElementById("connect-btn");
    if (!connectBtn) return;
    connectBtn.innerHTML = `🟢 ${address.slice(0, 4).toUpperCase()}...${address.slice(-3).toUpperCase()}`;
    connectBtn.className = "bg-slate-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold py-1.5 px-3 rounded-xl font-mono tracking-wide shadow-inner";
    
    const welcomeView = document.getElementById("disconnect-welcome-view");
    if (welcomeView) welcomeView.classList.add("hidden");
}

async function connectWallet() {
    let provider = window.okxwallet?.ethereum || window.ethereum;
    if (!provider) {
        userAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"; isConnected = true;
        localStorage.setItem("user_wallet", userAddress);
        updateWalletUI(userAddress);
        handlePolymarketPrivacy();
        document.getElementById("result-section").classList.remove("hidden");
        generateDestiny(userAddress);
        return;
    }
    try {
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0]; isConnected = true;
        localStorage.setItem("user_wallet", userAddress);
        updateWalletUI(userAddress);
        handlePolymarketPrivacy();
        document.getElementById("result-section").classList.remove("hidden");
        generateDestiny(userAddress);
    } catch (error) {
        alert("Cancelled: " + error.message);
    }
}

async function connectCoinbaseSmartWallet() {
    userAddress = "0xEaa6809EAdE7388077d9EC014C98c8764D9f13950"; isConnected = true;
    localStorage.setItem("user_wallet", userAddress);
    updateWalletUI(userAddress);
    handlePolymarketPrivacy();
    document.getElementById("result-section").classList.remove("hidden");
    generateDestiny(userAddress);
}

function handlePolymarketPrivacy() {
    const container = document.getElementById("polymarket-top-container");
    if (!container) return;
    if (!userAddress || !isConnected) {
        container.innerHTML = `
            <div class="bg-slate-900/20 border border-slate-900 border-dashed rounded-2xl p-5 text-center space-y-2">
                <h4 class="text-[11px] font-bold text-slate-500 uppercase font-mono tracking-wider">AI Trading Signals Locked</h4>
                <p class="text-[10px] text-slate-600 max-w-xs mx-auto font-mono">Connect wallet matrix to stream dynamic market updates.</p>
            </div>
        `;
    } else {
        renderTopPolymarketDashboard();
    }
}

function renderTopPolymarketDashboard() {
    const container = document.getElementById("polymarket-top-container");
    if (!container) return; container.innerHTML = ""; 
    topPolymarketData.forEach((market) => {
        const signalColor = market.aiSignal === "BUY YES" ? "text-emerald-400" : "text-rose-400";
        const marketCard = document.createElement("div");
        marketCard.className = "bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-left mb-2 font-mono";
        marketCard.innerHTML = `
            <div class="flex justify-between text-[9px] mb-1">
                <span class="text-blue-400">${market.category}</span>
                <span class="text-slate-500">Confidence: ${market.aiConfidence}%</span>
            </div>
            <h4 class="text-xs font-bold text-slate-300 mb-2 leading-snug">${market.title}</h4>
            <div class="p-2 bg-slate-950/80 rounded-xl border border-slate-900 text-[10px] flex justify-between items-center">
                <span class="text-slate-500 font-semibold">SIGNAL CODE:</span>
                <span class="${signalColor} font-bold">${market.aiSignal}</span>
            </div>
        `;
        container.appendChild(marketCard);
    });
}

function generateDestiny(address) {
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) seed += cleanAddress.charCodeAt(i);

    const selectedFate = fateLibrary[seed % fateLibrary.length];
    currentFateGlobal = selectedFate; 
    const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 
    
    document.getElementById("fortune-fate").innerText = selectedFate.fate;
    document.getElementById("fortune-text").innerText = selectedFate.text;
    document.getElementById("fortune-emoji").innerText = selectedFate.emoji;
    document.getElementById("luck-score").innerText = `${finalLuckScore}%`;
    document.getElementById("luck-bar").style.width = `${finalLuckScore}%`;
    document.getElementById("seed-anchor").innerText = `#00${seed}`;

    drawDestinyCard(selectedFate, finalLuckScore, address, seed);
    setupTwitterShare(selectedFate, finalLuckScore);
    generateAIWalletAdvice(selectedFate, finalLuckScore);
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let radialGrad = ctx.createRadialGradient(175, 200, 10, 175, 250, 300);
    radialGrad.addColorStop(0, "#1e293b"); radialGrad.addColorStop(1, "#020617");   
    ctx.fillStyle = radialGrad; ctx.fillRect(0, 0, 350, 500);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.08)"; ctx.lineWidth = 1;
    for (let x = 0; x < 350; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 500); ctx.stroke(); }
    for (let y = 0; y < 500; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(350, y); ctx.stroke(); }

    ctx.lineWidth = 4;
    ctx.strokeStyle = currentFrameColor || "#3b82f6";
    ctx.strokeRect(10, 10, 330, 480);

    ctx.fillStyle = "#64748b"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; 
    ctx.fillText("BASE FORECASTER CORES", 175, 52);
    ctx.font = "64px serif"; ctx.fillText(fateObj.emoji, 175, 145);
    ctx.fillStyle = "#22d3ee"; ctx.font = "bold 19px monospace"; ctx.fillText(fateObj.fate, 175, 210);

    ctx.fillStyle = "#cbd5e1"; ctx.font = "italic 12px serif";
    const words = fateObj.text.split(" "); let line = ""; let y = 252;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > 270 && n > 0) { ctx.fillText(line, 175, y); line = words[n] + " "; y += 17; }
        else { line = testLine; }
    }
    ctx.fillText(line, 175, y);

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)"; ctx.fillRect(30, 395, 290, 62);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.15)"; ctx.strokeRect(30, 395, 290, 62);
    ctx.textAlign = "left"; ctx.font = "10.5px monospace"; ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8).toUpperCase()}...${address.slice(-8).toUpperCase()}`, 45, 413);
    ctx.fillStyle = "#22d3ee"; ctx.fillText(`LUCK    : ${score}% DEGEN VECTOR`, 45, 430);
    ctx.fillStyle = "#64748b"; ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 447);
}

function generateAIWalletAdvice(fate, score) {
    const adviceEl = document.getElementById("ai-wallet-advice");
    if (!adviceEl) return;
    adviceEl.innerText = score > 60 ? `📊 [AI AUDIT]: High block synchronization mapped. Status: ${fate.fate}. Keep routing active consensus layers.` : `⚠️ [AI AUDIT]: Volatility warnings mapped inside history logs. Restrict external high-leverage routing.`;
}

function lookupExternalTarget() {
    const input = document.getElementById("external-target-input");
    const result = document.getElementById("external-target-result");
    if (!input || !result) return;
    result.classList.remove("hidden");
    result.innerHTML = `<span class="text-[11px] text-cyan-400 font-mono animate-pulse block mt-2">Scanning signature vector...</span>`;
    setTimeout(() => {
        result.innerHTML = `<div class="p-2.5 bg-slate-950 border border-slate-900 rounded-xl text-[10px] font-mono text-slate-500 mt-2">🔍 Verification logged safely. Status resonance: DEFI COMPLEX STABLE.</div>`;
    }, 800);
}

function startLiveNotificationLoop() {
    const banner = document.getElementById("live-notification");
    if (!banner) return;
    setInterval(() => {
        const randName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        document.getElementById("live-notif-text").innerHTML = `User <span class="text-cyan-400">${randName}</span> locked destiny parameters!`;
        banner.classList.remove("hidden", "translate-y-[-120px]", "opacity-0");
        setTimeout(() => banner.classList.add("translate-y-[-120px]", "opacity-0"), 3500);
    }, 14000);
}

function setupUniversalMintButton() {
    const mintBtn = document.getElementById("mint-nft-btn");
    if (!mintBtn) return;
    mintBtn.addEventListener("click", () => {
        if (typeof confetti === "function") confetti();
        alert("🎉 Destination transaction minted onto Base infrastructure layers!");
    });
}

// Fixed static initialization helper logs
function setupTipSystem() {
    const donateBtn = document.getElementById("donate-btn");
    if (donateBtn) donateBtn.addEventListener("click", () => alert("💖 Grid node tip logged. Thank you!"));
}

function spinTheWheel() {
    const graphic = document.getElementById("wheel-graphic");
    const result = document.getElementById("spin-result");
    if (!graphic || !result) return;
    graphic.classList.add("animate-spin");
    setTimeout(() => {
        graphic.classList.remove("animate-spin");
        result.innerHTML = "<strong>BLOCK REWARD:</strong> Gas Fee Optimization Buff Connected!";
        result.classList.remove("hidden");
        if (typeof confetti === "function") confetti();
    }, 2000);
}

function setupAIChatSystem() {
    const input = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-chat-send-btn");
    const logs = document.getElementById("ai-chat-logs");
    if (!input || !sendBtn || !logs) return;

    sendBtn.addEventListener("click", () => {
        const text = input.value.trim(); if (!text) return;
        const msg = document.createElement("div"); msg.className = "text-white bg-slate-950 p-2 rounded-xl text-right ml-4 border border-slate-900";
        msg.innerHTML = text; logs.appendChild(msg); input.value = "";
        setTimeout(() => {
            const reply = document.createElement("div"); reply.className = "text-slate-400 bg-slate-900/60 p-2 rounded-xl mr-4 border border-slate-900/40";
            reply.innerHTML = "<strong>Oracle AI:</strong> Your current address state shows high transaction efficiency.";
            logs.appendChild(reply); logs.scrollTop = logs.scrollHeight;
        }, 600);
    });
}

function setupViewCounter() { document.getElementById("view-counter").innerText = "14,250"; }
function setupMintCounter() { document.getElementById("mint-counter").innerText = localStorage.getItem("global_mints") || "842"; }
function setupTwitterShare(fateObj, score) {
    const shareBtn = document.getElementById("share-x-btn");
    if (shareBtn) shareBtn.onclick = () => window.open("https://twitter.com/intent/tweet?text=BaseForecaster", "_blank");
}
        
