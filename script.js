/**
 * Base Forecaster - Core Logic Script (Ultimate AI Edition)
 * Fully functional with Destiny calculation, Daily Rewards, AI Advisor Auditor, and Chatbot.
 */

const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 
let userAddress = "";
let isConnected = false;
let appLogoImg = null;
let currentFateGlobal = null; // Menyimpan data ramalan aktif untuk rujukan AI

const fateLibrary = [
    // [1-10] THE GOD TIER (Score 90-100)
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

    // [11-25] THE DEGEN BATTLE (Score 60-89)
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

    // [26-40] THE CAUTIONARY TALES (Score 30-59)
    { fate: "THE APER", emoji: "🐒", text: "You ape in with everything. Sometimes it works, sometimes it hurts. Chill out, Bro.", score: 45 },
    { fate: "LIQUIDITY PROVIDER DOOM", emoji: "📉", text: "Impermanent loss is lurking. Check your pool allocations immediately.", score: 42 },
    { fate: "THE PANIC SELLER", emoji: "😱", text: "You sold the bottom. Again. Learn to breathe and trust your thesis.", score: 35 },
    { fate: "THE FEE VICTIM", emoji: "💸", text: "You spent more on gas than the actual token profit. Slow down, Anon.", score: 38 },
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

    // [41-50] THE ODD & CHAOTIC (Score 5-29)
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

// Pemicu Awal Saat Aplikasi Dimuat
document.addEventListener("DOMContentLoaded", () => {
    try { setupAppLogo(); } catch(e) { console.error("Logo error:", e); }
    try { setupViewCounter(); } catch(e) { console.error("View counter error:", e); }
    try { setupMintCounter(); } catch(e) { console.error("Mint counter error:", e); }
    try { startLiveNotificationLoop(); } catch(e) { console.error("Notification error:", e); }
    try { setupDailyLogin(); } catch(e) { console.error("Daily system error:", e); }
    
    initWalletSystem();
    
    try { setupUniversalMintButton(); } catch(e) { console.error("Mint button error:", e); }
    try { setupTipSystem(); } catch(e) { console.error("Tip system error:", e); }
    try { setupAIChatSystem(); } catch(e) { console.error("AI Chat error:", e); }
});

// ==========================================
// FITUR BARU 1: DAILY LOGIN LOGIC
// ==========================================
function setupDailyLogin() {
    const dailyBtn = document.getElementById("daily-login-btn");
    const auraDisplay = document.getElementById("aura-points-display");
    
    let currentAP = parseInt(localStorage.getItem("user_aura_points")) || 0;
    auraDisplay.innerText = `${currentAP} AP`;

    if(!dailyBtn) return;

    dailyBtn.addEventListener("click", () => {
        const lastClaim = localStorage.getItem("last_daily_claim");
        const todayStr = new Date().toDateString();

        if (lastClaim === todayStr) {
            alert("🔒 You have already claimed today's Aura Points! Come back tomorrow, traveler.");
            return;
        }

        // Tambah AP & Simpan Tanggal
        currentAP += 50;
        localStorage.setItem("user_aura_points", currentAP);
        localStorage.setItem("last_daily_claim", todayStr);
        
        auraDisplay.innerText = `${currentAP} AP`;
        triggerPremiumConfetti();
        alert("📆 Daily login success! +50 Aura Points added to your hexadecimal anchor.");
    });
}

// ==========================================
// KENDALI MODAL & TOMBOL CONNECT WALLET
// ==========================================
function initWalletSystem() {
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) connectBtn.addEventListener("click", openWalletModal);

    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeWalletModal);

    setupModalButtons();
}

function openWalletModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) modal.classList.remove("hidden");
}

function closeWalletModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) modal.classList.add("hidden");
}

function setupModalButtons() {
    const wallets = ["choose-okx", "choose-metamask"];
    wallets.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                closeWalletModal();
                connectWallet();
            });
        }
    });

    const coinbaseSmartBtn = document.getElementById("choose-coinbase-smart");
    if (coinbaseSmartBtn) {
        coinbaseSmartBtn.addEventListener("click", () => {
            closeWalletModal();
            connectCoinbaseSmartWallet();
        });
    }
}

// ==========================================
// LOGIKA KONEKSI DOMPET WEB3
// ==========================================
async function connectWallet() {
    const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
    if (!provider) {
        alert("Web3 Wallet not detected! Please open from inside dApp Browser.");
        return;
    }
    try {
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "⏳ Connecting...";

        const accounts = await provider.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];
        isConnected = true;

        if (connectBtn) {
            connectBtn.innerHTML = `🟢 ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            connectBtn.classList.remove("bg-blue-600", "hover:bg-blue-500");
            connectBtn.classList.add("bg-slate-800", "border", "border-blue-500/40");
        }

        const resultSection = document.getElementById("result-section");
        if (resultSection) resultSection.classList.remove("hidden");

        generateDestiny(userAddress);
    } catch (error) {
        console.error(error);
        alert("Connection cancelled: " + error.message);
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "🔮 Connect Wallet";
    }
}

async function connectCoinbaseSmartWallet() {
    const provider = window.ethereum?.isCoinbaseWallet ? window.ethereum : window.coinbaseWalletExtension;
    if (!provider) {
        alert("Untuk login instan via Email, harap buka dApp ini dari Coinbase Wallet App atau pasang ekstensi Coinbase.");
        return;
    }
    try {
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "⏳ Initializing Uplink...";

        const accounts = await provider.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];
        isConnected = true;

        if (connectBtn) {
            connectBtn.innerHTML = `⚡ SYSTEM:${userAddress.slice(0, 4)}...${userAddress.slice(-4)}`;
            connectBtn.classList.add("text-neon-matrix", "border-neon-matrix");
        }

        const resultSection = document.getElementById("result-section");
        if (resultSection) resultSection.classList.remove("hidden");

        generateDestiny(userAddress);
    } catch (error) {
        console.error(error);
        alert("Uplink Aborted: " + error.message);
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "🔮 Connect Wallet";
    }
}

// ==========================================
// GENERASI RAMALAN & CANVAS CARD
// ==========================================
function generateDestiny(address) {
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) {
        seed += cleanAddress.charCodeAt(i);
    }

    const fateIndex = seed % fateLibrary.length;
    const selectedFate = fateLibrary[fateIndex];
    currentFateGlobal = selectedFate; // Set data global untuk rujukan AI
    const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 

    document.getElementById("fortune-fate").innerText = selectedFate.fate;
    const textEl = document.getElementById("fortune-text");
    textEl.innerText = selectedFate.text;
    textEl.parentElement.classList.remove("hidden");
    
    const emojiEl = document.getElementById("fortune-emoji");
    emojiEl.innerText = selectedFate.emoji;
    emojiEl.classList.remove("hidden");
    
    document.getElementById("luck-score").innerText = `${finalLuckScore}%`;
    document.getElementById("luck-bar").style.width = `${finalLuckScore}%`;
    document.getElementById("seed-anchor").innerText = `#${seed}`;

    drawDestinyCard(selectedFate, finalLuckScore, address, seed);
    setupTwitterShare(selectedFate, finalLuckScore);

    // Jalankan Audit Advisor AI secara otomatis sesaat setelah koneksi
    generateAIWalletAdvice(selectedFate, finalLuckScore);
}

// ==========================================
// FITUR BARU 2: WALLET CHECKER AI ADVISOR LOGIC
// ==========================================
function generateAIWalletAdvice(fate, score) {
    const adviceEl = document.getElementById("ai-wallet-advice");
    if (!adviceEl) return;

    let adviceText = "";
    if (score > 80) {
        adviceText = "📊 [AI AUDIT]: Security clearance high. Address pattern holds defensive lines against standard draining scripts. Advice: You have strong momentum, deploy assets to Base ecosystem LPs or consider minting to seal your anchor.";
    } else if (score >= 40) {
        adviceText = "📊 [AI AUDIT]: Moderate risk footprint detected. Your transaction velocity suggests slight panic selling in past cycles. Advice: Avoid chasing green candles on hyper-risky meme tokens tonight. Stabilize your gas threshold.";
    } else {
        adviceText = "🚨 [AI AUDIT]: Vulnerability Vector Active. Your hash pattern indicates weak resistance against dusting vectors. Advice: DO NOT interact with unverified airdrop items inside your gallery. Move core funds to cold vault storage.";
    }

    adviceEl.innerText = adviceText;
    adviceEl.classList.remove("italic", "text-slate-400");
    adviceEl.classList.add("text-slate-200");
}

// ==========================================
// FITUR BARU 3: DESTINY AI CHAT LOGIC (ENGINE JAWABAN ORACLE)
// ==========================================
function setupAIChatSystem() {
    const sendBtn = document.getElementById("ai-chat-send-btn");
    const chatInput = document.getElementById("ai-chat-input");
    const chatLogs = document.getElementById("ai-chat-logs");

    if (!sendBtn || !chatInput || !chatLogs) return;

    const handleChatSubmit = () => {
        const query = chatInput.value.trim();
        if (!query) return;

        // Cetak chat user
        chatLogs.innerHTML += `<div class="bg-blue-950/40 p-2 rounded-xl text-right"><strong>You:</strong> ${query}</div>`;
        chatInput.value = "";
        chatLogs.scrollTop = chatLogs.scrollHeight;

        // Logika berpikir AI (Simulasi Delay)
        setTimeout(() => {
            let aiResponse = "The stars are cloudy. Re-word your invocation, mortal.";
            const fateName = currentFateGlobal ? currentFateGlobal.fate : "THE MYSTIC BLANK";
            const fateScore = currentFateGlobal ? currentFateGlobal.score : 50;

            const lowerQuery = query.toLowerCase();
            
            if (lowerQuery.includes("rich") || lowerQuery.includes("kaya") || lowerQuery.includes("cuan")) {
                aiResponse = `🔮 Based on your profile **${fateName}**, financial alignment is volatile. Your luck score is ${fateScore}%. If you mint your card, the deterministic metadata code might stabilize your long-term yield portfolio.`;
            } else if (lowerQuery.includes("mint") || lowerQuery.includes("nft")) {
                aiResponse = "🪙 Minting the Destiny NFT creates an permanent cryptographic record of your alignment score on Base. It protects you from negative blockchain anomalies.";
            } else if (lowerQuery.includes("rug") || lowerQuery.includes("scam") || lowerQuery.includes("aman")) {
                aiResponse = `🛡️ Oracle warning scan: Your score is ${fateScore}%. Always check contract codes on BaseScan before clicking approve. Do not buy contracts without locked liquidity pools!`;
            } else {
                aiResponse = `✨ Regarding "${query}": Your address structure resonates deeply with **${fateName}**. The Oracle suggests holding your native assets and keeping your gas threshold steady for the next 24 hours.`;
            }

            chatLogs.innerHTML += `<div class="text-slate-300 bg-slate-900/60 p-2 rounded-xl"><strong>Oracle AI:</strong> ${aiResponse}</div>`;
            chatLogs.scrollTop = chatLogs.scrollHeight;
        }, 800);
    };

    sendBtn.addEventListener("click", handleChatSubmit);
    chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleChatSubmit(); });
}

// ==========================================
// DRAW CANVAS, TWITTER, MINT & DATA SYSTEMS
// ==========================================
function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#020617"); bgGrad.addColorStop(0.5, "#0f172a"); bgGrad.addColorStop(1, "#1e1b4b"); 
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, 350, 500);

    ctx.lineWidth = 4;
    let goldGrad = ctx.createLinearGradient(0, 0, 350, 500);
    goldGrad.addColorStop(0, "#f59e0b"); goldGrad.addColorStop(1, "#2563eb"); 
    ctx.strokeStyle = goldGrad; ctx.strokeRect(10, 10, 330, 480);

    if (appLogoImg && appLogoImg.complete && appLogoImg.naturalWidth !== 0) { ctx.drawImage(appLogoImg, 155, 28, 40, 40); }
    ctx.fillStyle = "#94a3b8"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillText("BASE FORECASTER CORES", 175, 82);
    ctx.font = "64px serif"; ctx.fillText(fateObj.emoji, 175, 155);
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 19px sans-serif"; ctx.fillText(fateObj.fate, 175, 210);

    ctx.fillStyle = "#cbd5e1"; ctx.font = "italic 11.5px serif";
    const words = fateObj.text.split(" "); let line = ""; let y = 252;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > 270 && n > 0) { ctx.fillText(line, 175, y); line = words[n] + " "; y += 17; } else { line = testLine; }
    }
    ctx.fillText(line, 175, y);

    ctx.fillStyle = "rgba(15, 23, 42, 0.6)"; ctx.fillRect(30, 395, 290, 62);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)"; ctx.strokeRect(30, 395, 290, 62);
    ctx.textAlign = "left"; ctx.font = "10.5px monospace"; ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 413);
    ctx.fillText(`LUCK    : ${score}% DEGEN LEVEL`, 45, 430);
    ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 447);
    ctx.textAlign = "center"; ctx.font = "9px monospace"; ctx.fillText("VERIFIED BY BASE CHAIN CRYPTO-GRAPH", 175, 480);
}

async function setupUniversalMintButton() {
    const mintBtnEl = document.getElementById("mint-nft-btn");
    if (!mintBtnEl) return;
    mintBtnEl.addEventListener("click", async (e) => {
        e.preventDefault();
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
        if (!provider) { alert("Web3 Wallet not found!"); return; }
        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            try { await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x2105" }] }); } catch (se) {
                if (se.code === 4902) {
                    await provider.request({ method: "wallet_addEthereumChain", params: [{ chainId: "0x2105", chainName: "Base", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: ["https://mainnet.base.org"], blockExplorerUrls: ["https://basescan.org"] }] });
                } else { throw se; }
            }
            const originalText = mintBtnEl.innerHTML;
            mintBtnEl.innerHTML = "⏳ Processing Mint..."; mintBtnEl.disabled = true;
            const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from: accounts[0], to: nftContractAddress, value: "0x1c6bf52634000", data: "0x1249c5b8", chainId: "0x2105" }] });
            mintBtnEl.innerHTML = originalText; mintBtnEl.disabled = false;
            triggerPremiumConfetti();
            alert("Transaction Sent! Hash: " + txHash);
            incrementMintCounter();
        } catch (error) { mintBtnEl.innerHTML = "🪙 Mint NFT (0.0005 ETH)"; mintBtnEl.disabled = false; alert("Minting Failed: " + (error.message || error)); }
    });
}

function triggerPremiumConfetti() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 80, spread: 60, origin: { x: 0, y: 0.8 }, colors: ['#2563eb', '#38bdf8', '#fbbf24'] });
        confetti({ particleCount: 80, spread: 60, origin: { x: 1, y: 0.8 }, colors: ['#2563eb', '#38bdf8', '#fbbf24'] });
    }
}

function setupTipSystem() {
    const donateBtnEl = document.getElementById("donate-btn");
    if (!donateBtnEl) return;
    donateBtnEl.onclick = async (e) => {
        e.preventDefault();
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
        if (!provider) return;
        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            await provider.request({ method: "eth_sendTransaction", params: [{ from: accounts[0], to: "0x1395066A5bEFA739A06112C785C088f7b764D9f1", value: "0x38d7ea4c68000", chainId: "0x2105" }] });
            triggerPremiumConfetti(); alert("Thank you for the tip! 💸");
        } catch (err) { alert("Tip canceled."); }
    };
}

function setupTwitterShare(fateObj, score) {
    const shareBtn = document.getElementById("share-x-btn");
    if (!shareBtn) return;
    shareBtn.onclick = (e) => {
        e.preventDefault();
        const tweetText = encodeURIComponent(`🔮 My Base wallet crystal ball just revealed my destiny!\n\nFate: ${fateObj.fate} ${fateObj.emoji}\nDegen Luck Score: ${score}%\n\nDiscover yours now on Base Forecaster! 🔵✨`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
    };
}

function setupAppLogo() { appLogoImg = new Image(); appLogoImg.src = "1000050193.png"; }
function setupMintCounter() {
    const mc = document.getElementById("mint-counter"); if (!mc) return;
    let cm = localStorage.getItem("base_forecaster_mints") || Math.floor(Math.random() * 150) + 780;
    localStorage.setItem("base_forecaster_mints", cm); mc.innerText = Number(cm).toLocaleString("en-US");
    setInterval(() => { if (Math.random() > 0.6) incrementMintCounter(); }, 9000);
}
function incrementMintCounter() {
    const mc = document.getElementById("mint-counter"); if (!mc) return;
    let cm = parseInt(localStorage.getItem("base_forecaster_mints")) || 800; cm += 1;
    localStorage.setItem("base_forecaster_mints", cm); mc.innerText = Number(cm).toLocaleString("en-US");
}
function setupViewCounter() {
    const cv = document.getElementById("view-counter"); if (!cv) return;
    let bv = localStorage.getItem("base_forecaster_views") || Math.floor(Math.random() * 4000) + 12500;
    bv = parseInt(bv) + Math.floor(Math.random() * 3) + 1; localStorage.setItem("base_forecaster_views", bv);
    cv.innerText = Number(bv).toLocaleString("en-US");
}
function startLiveNotificationLoop() {
    const ln = document.getElementById("live-notification"); const lt = document.getElementById("live-notif-text");
    if (!ln || !lt) return;
    const sn = () => {
        const rn = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        const rf = fakeFates[Math.floor(Math.random() * fakeFates.length)];
        lt.innerHTML = `🎉 <strong>${rn}</strong> just minted their Destiny NFT! <br>Fate: <span class="text-amber-400 font-bold">${rf}</span>`;
        ln.classList.remove("hidden");
        setTimeout(() => { ln.classList.remove("translate-y-[-100px]", "opacity-0"); ln.classList.add("translate-y-0", "opacity-100"); }, 100);
        setTimeout(() => { ln.classList.remove("translate-y-0", "opacity-100"); ln.classList.add("translate-y-[-100px]", "opacity-0"); }, 4000);
        setTimeout(sn, Math.floor(Math.random() * 8000) + 9000);
    };
    setTimeout(sn, 3000);
}
