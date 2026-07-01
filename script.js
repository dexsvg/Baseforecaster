/**
 * Base Forecaster - Core Logic Script (Ultimate AI Edition)
 * Pure Native Base Ecosystem Layer - Full SPA Routing System Integration.
 */

const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 
const tokenContractAddress = "0x052aE904DD28b5D840F7a25f77003E0f9597Fc69"; 
const flaunchShareLink = "https://flaunch.gg/base/coins/0x052aE904DD28b5D840F7a25f77003E0f9597Fc69";
const DEVELOPER_WALLET = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; 

let userAddress = "";
let isConnected = false;
let currentFateGlobal = null; 
let currentGlowColor = "rgba(56, 189, 248, 0.04)"; 
let currentFrameColor = null; 
let frameNameGlobal = "Gold-Blue Destiny";

const eventTypes = ["MINT", "NEW_USER", "TIP"];
const fakeNames = ["DegenJoe", "0xAlpha...", "BaseWhale", "CryptoGuru", "SpeedyMint", "0xLover", "MemeKing", "BaseGod", "0xChef", "AnonDegen"];
const fakeFates = ["THE WHALE ASCENDANT 🐋", "THE DEGEN SURVIVOR 🥷", "GENERATIONAL WEALTH 👑", "THE ETERNAL HOLDER 💎"];

// SUDAH DIPERBAIKI: Tidak ada lagi double declaration di sini
const fateLibrary = [
    { 
        fate: "THE WHALE ASCENDANT", 
        emoji: "🐋", 
        imagePath: "images1.jpeg", 
        text: "Your wallet is a black hole for liquidity. You are destined to lead trends and exit safely before the rug.", 
        score: 98 
    },
    { 
        fate: "GENERATIONAL WEALTH", 
        emoji: "👑", 
        imagePath: "images2.jpeg", 
        text: "Cosmic alignment confirms eternal wealth. Your core assets will outperform 99% of the market.", 
        score: 95 
    },
    { 
        fate: "THE BASE CHOSEN ONE", 
        emoji: "🔵", 
        imagePath: "images3.jpeg", 
        text: "Base protocol nodes whisper your address. You are the architect of the next moon mission.", 
        score: 99 
    },
    { 
        fate: "THE DEGEN SURVIVOR", 
        emoji: "🥷", 
        imagePath: "images4.jpeg", 
        text: "Battle scars of meme-coin wars everywhere. You survive when others get liquidated.", 
        score: 74 
    },
    { 
        fate: "THE MYSTERY ADDRESS", 
        emoji: "❓", 
        imagePath: "images5.jpeg", 
        text: "Even the blockchain cannot understand your patterns. You are a true anomaly.", 
        score: 41 
    },
    { 
        fate: "THE DIAMOND HANDS", 
        emoji: "💎", 
        imagePath: "images6.jpeg", 
        text: "Your hands are forged in pure diamond. Pressure only makes your bags heavier and stronger.", 
        score: 88 
    },
    { 
        fate: "THE ALPHA STALKER", 
        emoji: "🎯", 
        imagePath: "images7.jpeg", 
        text: "You spot narratives before they even exist. Your sniper entries are feared across the chain.", 
        score: 92 
    },
    { 
        fate: "THE RUGPROOF NINJA", 
        emoji: "🛡️", 
        imagePath: "images8.jpeg", 
        text: "Honeypots and malicious contracts miss you completely. Your intuition is a natural shield.", 
        score: 85 
    },
    { 
        fate: "THE LIQUIDITY GOD", 
        emoji: "🌊", 
        imagePath: "images9.jpeg", 
        text: "Every pool you touch overflows with rewards. Yield farms bow down to your harvesting strategy.", 
        score: 96 
    },
    { 
        fate: "THE PROPAGANDA KING", 
        emoji: "📢", 
        imagePath: "images10.jpeg", 
        text: "Your conviction can pump any chart. When you speak, the community follows your vision.", 
        score: 90 
    }
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

// ====================================================================
// PURE NATIVE SPA ROUTING NAVIGATION (Kunci Utama Pertukaran Halaman)
// ====================================================================
function navigate(targetTab) {
    if (!isConnected) {
        alert("🔮 Connect your Web3 Wallet first to unlock this dimension!");
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

// ==========================================
// FEATURE: GLOW AURA ALTER ENGINE
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

// ==========================================
// FEATURE: INTERACTIVE LEADERBOARD GENERATOR
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
        { r: 3, addr: `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`, s: userScore, tag: "❓ ACTIVE ANOMALY (LO)", isUser: true }
    ];

    container.innerHTML = boardData.map(item => `
        <div class="p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${item.isUser ? 'border-cyan-500 bg-cyan-950/20 shadow-md' : 'border-slate-800 bg-slate-950/40'}\">
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
// FEATURE: DEGEN LUCKY WHEEL ENGINE
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

// ==========================================
// CONNECT WALLET INTEGRATION SYSTEM
// ==========================================
async function connectWallet() {
    const provider = getActiveProvider();
    const connectBtn = document.getElementById("connect-btn");
    
    if (!provider) {
        alert("❌ Wallet Tidak Terdeteksi!\nBuka langsung dari Browser aplikasi Web3 Wallet (Coinbase/OKX).");
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
        navigate('oracle'); 
    } catch (error) {
        resetWalletState();
        alert("❌ Koneksi Gagal: " + error.message);
    }
}

function disconnectWallet() {
    if (!confirm("Putuskan koneksi wallet?")) return;
    localStorage.setItem("wallet_blacklisted", "true");
    resetWalletState();
}

function resetWalletState() {
    userAddress = "";
    isConnected = false;
    window.location.reload();
}

function updateWalletUI(address) {
    const connectBtn = document.getElementById("connect-btn");
    if (!connectBtn) return;
    connectBtn.setAttribute("data-status", "connected");
    connectBtn.innerHTML = `🔴 Disconnect (${address.slice(0, 6)}...${address.slice(-4)})`;
    connectBtn.className = "w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 px-4 rounded-2xl font-mono tracking-wide transition-all text-center block shadow-lg";
}

// ====================================================================
// NATIVE CORE MODULE COMPONENT FOR TRADING ($FORECAST DIRECT BUY)
// ====================================================================
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
        alert("🚀 Transaksi Berhasil Dikirim! Hash: " + txHash);
        if (typeof confetti === "function") confetti();
    } catch (err) {
        alert("Gagal: " + err.message);
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
    generateAIWalletAdvice(selectedFate, finalLuckScore);
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 350, 500);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.05)"; 
    ctx.lineWidth = 1;
    for (let x = 0; x < 350; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 500); ctx.stroke(); }
    for (let y = 0; y < 500; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(350, y); ctx.stroke(); }

    ctx.lineWidth = 4;
    ctx.strokeStyle = currentFrameColor || "#f59e0b";
    ctx.strokeRect(10, 10, 330, 480);

    ctx.fillStyle = "#94a3b8"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; 
    ctx.fillText("BASE FORECASTER CORES", 175, 45);

    const characterImg = new Image();
    characterImg.src = fateObj.imagePath; 

    characterImg.onload = function() {
        ctx.drawImage(characterImg, 100, 70, 150, 150);
        renderCardText(ctx, fateObj, score, address, seed);
    };

    characterImg.onerror = function() {
        ctx.font = "64px serif"; 
        ctx.fillText(fateObj.emoji, 175, 145);
        renderCardText(ctx, fateObj, score, address, seed);
    };
}

function renderCardText(ctx, fateObj, score, address, seed) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 19px sans-serif"; 
    ctx.fillText(fateObj.fate, 175, 250); 

    ctx.fillStyle = "#cbd5e1"; ctx.font = "italic 11px serif";
    const words = fateObj.text.split(" "); let line = ""; let y = 285;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > 260 && n > 0) { 
            ctx.fillText(line, 175, y); 
            line = words[n] + " "; 
            y += 17; 
        } else { 
            line = testLine; 
        }
    }
    ctx.fillText(line, 175, y);

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)"; ctx.fillRect(30, 405, 290, 62);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.1)"; ctx.strokeRect(30, 405, 290, 62);
    
    ctx.textAlign = "left"; ctx.font = "10px monospace"; ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 423);
    ctx.fillStyle = "#22d3ee"; ctx.fillText(`LUCK    : ${score}% DEGEN LEVEL`, 45, 440);
    ctx.fillStyle = "#94a3b8"; ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 457);
}

function generateAIWalletAdvice(fate, score) {
    const el = document.getElementById("ai-wallet-advice");
    if (!el) return;
    el.innerText = score > 60 
        ? `📊 [AI AUDIT]: Parameter aman. Status: ${fate.fate}. Momentum takdir lo mendukung akumulasi instan token $FORECAST.` 
        : `⚠️ [AI AUDIT]: Risiko tinggi terdeteksi. Gunakan parameter harian Gacha Wheel untuk menetralisir node sial.`;
}

// ==========================================
// LOGIC LOOPS & ENGINE INITIALIZATION
// ==========================================
function setupDailyLogin() {
    const dailyBtn = document.getElementById("daily-login-btn");
    let currentAP = parseInt(localStorage.getItem("user_aura_points")) || 0;
    document.getElementById("aura-points-display").innerText = `${currentAP} AP`;

    dailyBtn?.addEventListener("click", () => {
        const lastClaim = localStorage.getItem("last_daily_claim");
        if (lastClaim === new Date().toDateString()) return alert("🔒 Aura Points harian sudah diambil!");
        
        currentAP += 50;
        localStorage.setItem("user_aura_points", currentAP);
        localStorage.setItem("last_daily_claim", new Date().toDateString());
        document.getElementById("aura-points-display").innerText = `${currentAP} AP`;
        if (typeof confetti === "function") confetti();
        alert("🎁 +50 Aura Points Berhasil Diklaim!");
    });
}

function setupAIChatSystem() {
    const input = document.getElementById("ai-chat-input");
    const btn = document.getElementById("ai-chat-send-btn");
    const logs = document.getElementById("ai-chat-logs");

    btn?.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) return;

        logs.innerHTML += `<div class="text-white bg-slate-900 p-2 rounded-xl text-right"><strong>You:</strong> ${text}</div>`;
        input.value = "";

        setTimeout(() => {
            let res = `🔮 **Oracle Matrix AI**: Token $FORECAST terdaftar resmi di Flaunch Base. Evaluasi data hash dompet Anda menunjukkan sinyal trade aktif.`;
            logs.innerHTML += `<div class="text-slate-400 bg-slate-900/60 p-2 rounded-xl"><strong>Oracle AI:</strong> ${res}</div>`;
            logs.scrollTop = logs.scrollHeight;
        }, 600);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupDailyLogin();
    setupAIChatSystem();
    if(document.getElementById("view-counter")) document.getElementById("view-counter").innerText = "14,250";
    if(document.getElementById("mint-counter")) document.getElementById("mint-counter").innerText = "842";

    document.getElementById("connect-btn")?.addEventListener("click", (e) => {
        if (e.target.getAttribute("data-status") === "connected") disconnectWallet(); else connectWallet();
    });
});
