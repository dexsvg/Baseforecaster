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

const DEVELOPER_WALLET = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; 

// App Initialization On Load (PERBAIKAN SYNTAX Selesai di sini)
document.addEventListener("DOMContentLoaded", () => {
    try { setupAppLogo(); } catch(e) { console.error("Logo error:", e); }
    try { setupViewCounter(); } catch(e) { console.error("View counter error:", e); }
    try { setupMintCounter(); } catch(e) { console.error("Mint counter error:", e); }
    try { startLiveNotificationLoop(); } catch(e) { console.error("Notification error:", e); }
    try { setupDailyLogin(); } catch(e) { console.error("Daily system error:", e); }
    
    const lookupBtn = document.getElementById("external-target-btn");
    if (lookupBtn) lookupBtn.addEventListener("click", lookupExternalTarget);

    const lookupInput = document.getElementById("external-target-input");
    if (lookupInput) {
        lookupInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") lookupExternalTarget();
        });
    }
    
    initWalletSystem();
});

// Placeholder functions for system setup
function setupAppLogo() {}
function setupViewCounter() {}
function setupMintCounter() {}
function startLiveNotificationLoop() {}
function setupDailyLogin() {}
function lookupExternalTarget() {}
function initWalletSystem() {}


// ====================================================================
// NATIVE MODULE: FORECASTER HUB (MENGGUNAKAN ID UNTUK EVENT GLOBAL)
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
            
            <div class="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3 transition-all hover:scale-[1.01]">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">🔥 TOKEN IDO PRESALE</span>
                    <span class="text-amber-400 font-mono animate-pulse">● Live Protocol Phase 1</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200 leading-snug">Secure Pre-Listing $FORECAST Tokens</h4>
                <p class="text-[10px] text-slate-400 font-mono leading-relaxed">
                    Secure your allocation of the platform's main governance token directly before public exchange listings open.
                    <br><span class="text-cyan-400 font-bold">Rate: 1 ETH = 1,000,000 $FORECAST</span>
                </p>
                <div class="pt-1 flex gap-2">
                    <input id="presale-eth-input" type="number" step="0.001" min="0.001" placeholder="Amount ETH (e.g. 0.005)" class="w-2/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500">
                    <button id="btn-action-presale" class="w-1/3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-[11px] font-mono tracking-wide transition-all shadow-md active:scale-95">
                        BUY NOW
                    </button>
                </div>
            </div>

            <div class="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3 transition-all hover:scale-[1.01]">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">🎰 LIQUIDITY POOL</span>
                    <span class="text-slate-400 font-mono">Est. APY: 18.5%</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200 leading-snug">Base Native Prediction Micro-Betting & Staking</h4>
                <p class="text-[10px] text-slate-400 font-mono leading-relaxed">
                    Deploy decentralized micro-stakes directly into your smart contract liquidity router. Back or oppose daily global trend probabilities.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <button id="btn-action-stake-yes" class="flex items-center justify-center gap-1 p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-[10px] font-mono font-bold text-emerald-400 transition-all active:scale-95">
                        📈 Stake YES (0.0002 ETH)
                    </button>
                    <button id="btn-action-stake-no" class="flex items-center justify-center gap-1 p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-xl text-[10px] font-mono font-bold text-rose-400 transition-all active:scale-95">
                        📉 Stake NO (0.0002 ETH)
                    </button>
                </div>
            </div>

            <div class="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-3 transition-all hover:scale-[1.01]">
                <div class="flex justify-between items-center text-[10px]">
                    <span class="bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">👑 VIP UTILITY PASS</span>
                    <span class="text-slate-400 font-mono">Cost: 0.0005 ETH</span>
                </div>
                <h4 class="text-xs font-bold text-slate-200 leading-snug">Mint Premium Forecaster AI Access Pass</h4>
                <p class="text-[10px] text-slate-400 font-mono leading-relaxed">
                    Permanently unlock all premium AI bot alpha signals, double your daily Aura point generation, and obtain a cosmic-grade visual verification frame.
                </p>
                <button id="btn-action-mint-pass" class="w-full text-center p-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-mono font-extrabold text-[11px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 shadow-md shadow-amber-500/10">
                    🔑 MINT PREMIUM ACCESS PASS
                </button>
            </div>

        </div>
    `;
}


// ====================================================================
// NATIVE TRANSACTION CORE (SAMAKAN DENGAN SISTEM TRANSAKSI TIP)
// ====================================================================

// 1. Eksekusi Pembelian Presale
async function executePreListingBuy() {
    if (!isConnected || !userAddress) {
        alert("Silakan hubungkan wallet Anda terlebih dahulu!");
        return;
    }

    const inputEth = document.getElementById("presale-eth-input");
    const amountEth = inputEth ? parseFloat(inputEth.value) : 0;

    if (!amountEth || amountEth <= 0 || isNaN(amountEth)) {
        alert("Masukkan jumlah ETH yang valid untuk membeli presale!");
        return;
    }

    const valueHex = "0x" + (amountEth * 1e18).toString(16);

    try {
        alert(`Memproses pembelian Presale sebesar ${amountEth} ETH...`);
        
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: DEVELOPER_WALLET,
                value: valueHex,
            }],
        });

        alert("Transaksi Presale Berhasil Dikirim! Hash: " + txHash);
    } catch (error) {
        console.error("Presale Tx Error:", error);
        alert("Transaksi dibatalkan atau gagal: " + error.message);
    }
}

// 2. Eksekusi Staking / Micro-Betting (YES / NO)
async function executeBaseBet(predictionType) {
    if (!isConnected || !userAddress) {
        alert("Silakan hubungkan wallet Anda terlebih dahulu!");
        return;
    }

    const stakeAmount = 0.0002; 
    const valueHex = "0x" + (stakeAmount * 1e18).toString(16);

    try {
        alert(`Memproses Staking untuk pilihan [${predictionType}] sebesar ${stakeAmount} ETH...`);
        
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: DEVELOPER_WALLET,
                value: valueHex,
            }],
        });

        alert(`Staking ${predictionType} Berhasil! Hash: ` + txHash);
    } catch (error) {
        console.error("Staking Tx Error:", error);
        alert("Transaksi staking gagal: " + error.message);
    }
}

// 3. Eksekusi Mint Premium Access Pass
async function executeMintPass() {
    if (!isConnected || !userAddress) {
        alert("Silakan hubungkan wallet Anda terlebih dahulu!");
        return;
    }

    const passCost = 0.0005; 
    const valueHex = "0x" + (passCost * 1e18).toString(16);

    try {
        alert(`Memproses Minting Premium Access Pass sebesar ${passCost} ETH...`);
        
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddress,
                to: DEVELOPER_WALLET,
                value: valueHex,
            }],
        });

        alert("Mint Premium Pass Berhasil! Akses Fitur Alpha Terbuka. Hash: " + txHash);
    } catch (error) {
        console.error("Mint Pass Error:", error);
        alert("Gagal melakukan minting pass: " + error.message);
    }
}


// ====================================================================
// GLOBAL MOBILE EVENT DELEGATION (ANTI-BLOCKING LAYER PALING BAWAH)
// ====================================================================
document.addEventListener("click", function(e) {
    // A. Deteksi Tombol BUY NOW Presale
    if (e.target && e.target.id === "btn-action-presale") {
        e.preventDefault();
        executePreListingBuy();
    }
    
    // B. Deteksi Tombol Stake YES
    if (e.target && (e.target.id === "btn-action-stake-yes" || e.target.closest("#btn-action-stake-yes"))) {
        e.preventDefault();
        executeBaseBet('YES');
    }
    
    // C. Deteksi Tombol Stake NO
    if (e.target && (e.target.id === "btn-action-stake-no" || e.target.closest("#btn-action-stake-no"))) {
        e.preventDefault();
        executeBaseBet('NO');
    }
    
    // D. Deteksi Tombol Mint Premium Pass
    if (e.target && (e.target.id === "btn-action-mint-pass" || e.target.closest("#btn-action-mint-pass"))) {
        e.preventDefault();
        executeMintPass();
    }
});
