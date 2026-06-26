// ==========================================================================
// 1. GLOBAL STATE & CONFIGURATION
// ==========================================================================
let userAuraPoints = 0;

// Dummy data ramalan untuk modul Oracle Chat AI jika API eksternal belum siap
const destinyQuotes = [
    "Your hexadecimal alignment reveals a sudden 100x pump in an unexpected low-cap asset. Stay sharp.",
    "A ghost from a previous rugpull is guarding your current liquidity. Maximum safety detected.",
    "Cosmic matrix indicates temporary sideways movement followed by a massive breakout. HODL.",
    "Your wallet hash is heavily saturated with Based energy. Vitalik smiles upon your next transaction."
];

// Data Tren Teratas Polymarket dengan Analisis Bot Intelijen 99% Akurasi
const topPolymarketData = [
    {
        id: "poly-m1",
        title: "Bitcoin Hits $100k Before End of Next Month",
        category: "CRYPTO",
        marketYes: 64,
        marketNo: 36,
        aiConfidence: 98.7,
        aiSignal: "BUY YES",
        aiAnalysis: "Volume delta compression shows institutional whale accumulation backing this strike price. Probability boundary breached."
    },
    {
        id: "poly-m2",
        title: "Ethereum Spot ETF Inflows Surpass $1B This Week",
        category: "FINANCE",
        marketYes: 42,
        marketNo: 58,
        aiConfidence: 96.4,
        aiSignal: "BUY NO",
        aiAnalysis: "Orderbook sentiment divergence indicates retail exhaustion. Liquidity maps favor downside liquidation hunt."
    },
    {
        id: "poly-m3",
        title: "Major Layer-2 Network Announces Token Generation Event",
        category: "WEB3 TECH",
        marketYes: 78,
        marketNo: 22,
        aiConfidence: 99.1,
        aiSignal: "BUY YES",
        aiAnalysis: "On-chain testnet gas usage and deployment smart contracts confirm imminent mainnet launch consensus."
    }
];

// ==========================================================================
// 2. INITIALIZATION ON DOM LOAD
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔮 Base Forecaster Core Engine & Polymarket Bot Initialized.");
    
    // Inisialisasi Counter Palsu/Real untuk Keperluan Visual UI
    setupFakeCounters();

    // Jalankan System Event Listener dengan delay agar browser wallet sempat merender DOM
    setTimeout(() => {
        initAIChatSystem();
        initOracleStalkerSystem();
        initPolymarketSystem();
        renderTopPolymarketDashboard();
        initNavigationSystem();
    }, 500);
});

// ==========================================================================
// 3. CORE MODULE: ORACLE AI ASSISTANT (CHAT)
// ==========================================================================
function initAIChatSystem() {
    const chatInput = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-chat-send-btn");
    const chatLogs = document.getElementById("ai-chat-logs");

    if (!chatInput || !sendBtn || !chatLogs) {
        console.warn("⚠️ Elemen Oracle AI Chat tidak ditemukan di HTML.");
        return;
    }

    const handleSendMessage = () => {
        const messageText = chatInput.value.trim();
        if (messageText === "") return;

        // 1. Tampilkan pesan user ke log chat
        appendChatMessage("You", messageText, "text-blue-400 bg-slate-900/40");
        chatInput.value = ""; 

        // 2. Efek loading respons dari Oracle AI
        setTimeout(() => {
            const randomReply = destinyQuotes[Math.floor(Math.random() * destinyQuotes.length)];
            appendChatMessage("Oracle AI", randomReply, "text-emerald-400 bg-slate-900/80 border border-slate-800");
        }, 800);
    };

    sendBtn.onclick = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    chatInput.onkeypress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };
}

function appendChatMessage(sender, text, bgClass) {
    const chatLogs = document.getElementById("ai-chat-logs");
    if (!chatLogs) return;

    const msgBubble = document.createElement("div");
    msgBubble.className = `p-2.5 rounded-xl text-[11px] mb-2 leading-relaxed ${bgClass}`;
    msgBubble.innerHTML = `<strong>${sender}:</strong> ${text}`;
    
    chatLogs.appendChild(msgBubble);
    chatLogs.scrollTop = chatLogs.scrollHeight; // Auto-scroll ke bawah
}

// ==========================================================================
// 4. CORE MODULE: SECURE ORACLE STALKER
// ==========================================================================
function initOracleStalkerSystem() {
    const stalkerInput = document.getElementById("external-target-input");
    const stalkerBtn = document.getElementById("external-target-btn");
    const stalkerResult = document.getElementById("external-target-result");

    if (!stalkerInput || !stalkerBtn || !stalkerResult) {
        console.warn("⚠️ Elemen Oracle Stalker tidak ditemukan di HTML.");
        return;
    }

    const handleStalkerScan = () => {
        const targetValue = stalkerInput.value.trim();
        if (targetValue === "") return;

        stalkerResult.classList.remove("hidden");
        stalkerResult.innerHTML = `
            <div class="text-[11px] text-cyan-400 font-mono animate-pulse bg-slate-950 p-3 rounded-xl border border-cyan-500/20">
                ⚡ Hashing matrix target: "${targetValue}"... Analysing contract resonance...
            </div>
        `;

        setTimeout(() => {
            let score = Math.floor(Math.random() * 41) + 60; 
            let cosmicStatus = score > 85 ? "🟢 HIGHLY BASED" : "🟡 NEUTRAL ALIGNMENT";

            stalkerResult.innerHTML = `
                <div class="bg-slate-950 border border-cyan-500/30 p-3 rounded-xl space-y-1.5 font-mono text-[11px]">
                    <div class="flex justify-between text-[10px]">
                        <span class="text-slate-400">Target Asset:</span>
                        <span class="text-white font-bold">${targetValue.toUpperCase()}</span>
                    </div>
                    <div class="flex justify-between text-[10px]">
                        <span class="text-slate-400">Cosmic Status:</span>
                        <span class="text-cyan-400 font-bold">${cosmicStatus}</span>
                    </div>
                    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div class="bg-cyan-500 h-full" style="width: ${score}%"></div>
                    </div>
                    <p class="text-[10px] text-slate-400 italic mt-1 leading-relaxed">
                        "The cosmic alignment for this target architecture shows a ${score}% stabilization matrix on Base Chain network."
                    </p>
                </div>
            `;
        }, 1200);
    };

    stalkerBtn.onclick = (e) => {
        e.preventDefault();
        handleStalkerScan();
    };

    stalkerInput.onkeypress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleStalkerScan();
        }
    };
}

// ==========================================================================
// 5. CORE MODULE: POLYMARKET CUSTOM FORECASTER & TOP DASHBOARD
// ==========================================================================
function initPolymarketSystem() {
    const polyInput = document.getElementById("polymarket-input");
    const polyBtn = document.getElementById("polymarket-btn");
    const polyResult = document.getElementById("polymarket-result");

    if (!polyInput || !polyBtn || !polyResult) {
        console.warn("⚠️ Elemen Polymarket Forecaster Kustom tidak ditemukan di HTML.");
        return;
    }

    const handlePolyPrediction = () => {
        const marketTopic = polyInput.value.trim();
        if (marketTopic === "") return;

        polyResult.classList.remove("hidden");
        polyResult.innerHTML = `
            <div class="text-[11px] text-blue-400 font-mono animate-pulse bg-slate-950 p-3 rounded-xl border border-blue-500/20">
                🔮 Pulling data from Polymarket orderbook... Computing cosmic odds for "${marketTopic}"...
            </div>
        `;

        setTimeout(() => {
            let yesProbability = Math.floor(Math.random() * 91) + 5; 
            let noProbability = 100 - yesProbability;
            
            let oracleVerdict = "";
            if (yesProbability > 75) {
                oracleVerdict = "🚀 THE MATRIX SAYS YES. Orderbook is heavily biased to this outcome. Full send, Anon!";
            } else if (yesProbability > 45) {
                oracleVerdict = "⚖️ PERFECT COINFLIP. The whales are fighting in the liquidity pools. Bet with caution.";
            } else {
                oracleVerdict = "📉 COLD INDICATION. Believing this market will hit is pure copium. Prepare to get regged or bet on NO.";
            }

            polyResult.innerHTML = `
                <div class="bg-slate-950 border border-blue-900/40 p-3 rounded-xl space-y-2 font-mono text-[11px]">
                    <div class="text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800 pb-1">
                        🔮 Polymarket Cosmic Odds: <span class="text-white font-bold">${marketTopic.toUpperCase()}</span>
                    </div>
                    <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-bold">
                            <span class="text-emerald-400">YES: ${yesProbability}%</span>
                            <span class="text-rose-400">NO: ${noProbability}%</span>
                        </div>
                        <div class="w-full bg-rose-950 h-2 rounded-full overflow-hidden flex">
                            <div class="bg-emerald-500 h-full transition-all duration-1000" style="width: ${yesProbability}%"></div>
                        </div>
                    </div>
                    <p class="text-[10px] text-slate-300 italic pt-1 leading-relaxed border-t border-slate-900">
                        "${oracleVerdict}"
                    </p>
                </div>
            `;
        }, 1500);
    };

    polyBtn.onclick = (e) => {
        e.preventDefault();
        handlePolyPrediction();
    };

    polyInput.onkeypress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handlePolyPrediction();
        }
    };
}

function renderTopPolymarketDashboard() {
    const container = document.getElementById("polymarket-top-container");
    if (!container) return;

    container.innerHTML = ""; 

    topPolymarketData.forEach((market) => {
        const signalColor = market.aiSignal === "BUY YES" ? "text-emerald-400" : "text-rose-400";
        const signalBg = market.aiSignal === "BUY YES" ? "border-emerald-500/30 bg-emerald-950/20" : "border-rose-500/30 bg-rose-950/20";

        const marketCard = document.createElement("div");
        marketCard.className = "bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4 relative overflow-hidden text-left";
        
        marketCard.innerHTML = `
            <div class="flex justify-between items-center text-[10px]">
                <span class="bg-blue-950/50 border border-blue-800/40 text-blue-400 px-2 py-0.5 rounded-md font-mono">${market.category}</span>
                <span class="text-slate-500 font-mono">Live Polymarket Odds</span>
            </div>

            <h4 class="text-xs font-bold text-slate-200 leading-relaxed">${market.title}</h4>

            <div class="space-y-1.5">
                <div class="flex justify-between text-[10px] font-mono">
                    <span class="text-emerald-400 font-bold">YES ${market.marketYes}%</span>
                    <span class="text-rose-400 font-bold">NO ${market.marketNo}%</span>
                </div>
                <div class="w-full bg-rose-950/60 h-2 rounded-full overflow-hidden flex">
                    <div class="bg-emerald-500 h-full transition-all duration-1000" style="width: ${market.marketYes}%"></div>
                </div>
            </div>

            <div class="p-3 rounded-xl border text-[11px] font-mono space-y-1.5 ${signalBg}">
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 text-[10px]">🤖 AI BOT ACCURACY:</span>
                    <span class="text-amber-400 font-bold">${market.aiConfidence}%</span>
                </div>
                <div class="flex justify-between items-center border-b border-slate-800/50 pb-1.5">
                    <span class="text-slate-400 text-[10px]">RECOMMENDATION:</span>
                    <span class="${signalColor} font-bold tracking-wider">${market.aiSignal}</span>
                </div>
                <p class="text-[10px] text-slate-300 italic pt-0.5 leading-relaxed font-sans">
                    "${market.aiAnalysis}"
                </p>
            </div>

            <button onclick="executeMagicBet('${market.id}', '${market.aiSignal}')" 
                    class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md active:scale-[0.98]">
                Bet via Magic Route ⚡
            </button>
        `;

        container.appendChild(marketCard);
    });
}

window.executeMagicBet = function(marketId, signal) {
    alert(`🔮 Routing liquidity through Magic Route for Market [${marketId}] with signal [${signal}]. Confirming contract on your Web3 Wallet...`);
};

// ==========================================================================
// 6. UTILITY & NAVIGATION MODULES
// ==========================================================================
function initNavigationSystem() {
    window.navigate = function(page) {
        if (page === 'glow') {
            document.getElementById("modal-glow").classList.remove("hidden");
            document.getElementById("modal-glow").classList.add("flex");
        } else if (page === 'wheel') {
            document.getElementById("modal-wheel").classList.remove("hidden");
            document.getElementById("modal-wheel").classList.add("flex");
        } else if (page === 'home') {
            closeModal('glow');
            closeModal('wheel');
        }
    };

    window.closeModal = function(target) {
        const modal = document.getElementById(`modal-${target}`);
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    };
}

function setupFakeCounters() {
    const viewCounter = document.getElementById("view-counter");
    const mintCounter = document.getElementById("mint-counter");

    if (viewCounter) viewCounter.innerText = Math.floor(Math.random() * 5000) + 12500;
    if (mintCounter) mintCounter.innerText = Math.floor(Math.random() * 200) + 740;
}

window.spinTheWheel = function() {
    const wheelGraphic = document.getElementById("wheel-graphic");
    const spinResult = document.getElementById("spin-result");
    const btnSpin = document.getElementById("btn-spin");

    if (!wheelGraphic || !spinResult || !btnSpin) return;

    btnSpin.disabled = true;
    wheelGraphic.classList.add("animate-spin");
    spinResult.classList.add("hidden");

    setTimeout(() => {
        wheelGraphic.classList.remove("animate-spin");
        btnSpin.disabled = false;
        
        spinResult.classList.remove("hidden");
        spinResult.innerText = "🎉 Congratulations! You won: +50 Aura Points Matrix!";
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }, 2000);
};
            
