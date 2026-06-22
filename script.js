/**
 * Base Forecaster - Core Logic Script (Anti-Crash Version)
 * Fully functional for destiny calculation, wallet management, live notifications, and robust NFT minting.
 */

// ==========================================
// 1. CONFIGURATION & GLOBAL VARIABLES
// ==========================================
// REPLACE the address below with your valid NFT Smart Contract address on Base Mainnet
const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 

let userAddress = "";
let isConnected = false;
let appLogoImg = null; // Holds the preloaded branding identity image

// Destiny Library based on wallet address hash
const fateLibrary = [
    { fate: "THE WHALE ASCENDANT", emoji: "🐋", text: "Your hexadecimal wallet aligns with massive liquidity movements. You are destined to lead market trends, accumulate pristine assets, and exit safely right before the storm of a rugpull hits.", score: 98 },
    { fate: "THE DEGEN SURVIVOR", emoji: "🥷", text: "Your portfolio is filled with the battle scars of meme-coin wars. However, your address framework indicates absolute resilience. A 100x target is waiting for your next execution click.", score: 74 },
    { fate: "DUSTING ATTACK TARGET", emoji: "⚠️", text: "Warning signals are vibrating within your blockchain data nodes. Your wallet appears vulnerable to malicious tokens and dusting attacks. Clean up your digital footprint and avoid clicking random airdrop claims.", score: 21 },
    { fate: "GENERATIONAL WEALTH", emoji: "👑", text: "An extremely rare cosmic configuration! The prefix and suffix of your address secure an eternal wealth knot on the Base network. Keep a strong grip on your core assets; a magnificent future awaits.", score: 95 },
    { fate: "THE ETERNAL HOLDER", emoji: "💎", text: "True Diamond Hands. You never falter, no matter how deep the market correction goes. The Base ledger remembers your absolute loyalty, and great staking rewards are bound to manifest soon.", score: 85 },
    { fate: "LIQUIDITY PROVIDER DOOM", emoji: "📉", text: "Exercise extreme caution when deploying capital into obscure high-yield farming pools. Impermanent loss is lurking within your wallet parameters if greed takes over your strategy.", score: 42 }
];

// Fake English Names & Fates for Live Mint Notification Engine
const fakeNames = ["DegenJoe", "0xAlpha...", "BaseWhale", "CryptoGuru", "SpeedyMint", "0xLover", "MemeKing", "BaseGod", "0xChef", "AnonDegen"];
const fakeFates = ["THE WHALE ASCENDANT 🐋", "THE DEGEN SURVIVOR 🥷", "GENERATIONAL WEALTH 👑", "THE ETERNAL HOLDER 💎"];

// ==========================================
// 2. INITIALIZATION ON LOAD (SISTEM ISOLASI ERROR)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Memungkus inisialisasi agar jika salah satu fitur gagal, modal & wallet tetep jalan
    try { setupAppLogo(); } catch(e) { console.error("Logo error:", e); }
    try { setupViewCounter(); } catch(e) { console.error("View counter error:", e); }
    try { setupMintCounter(); } catch(e) { console.error("Mint counter error:", e); }
    try { startLiveNotificationLoop(); } catch(e) { console.error("Notification error:", e); }
    
    // Inisialisasi tombol wallet utama
    initWalletSystem();
    
    try { setupUniversalMintButton(); } catch(e) { console.error("Mint button error:", e); }
    try { setupTipSystem(); } catch(e) { console.error("Tip system error:", e); }
});

function initWalletSystem() {
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.addEventListener("click", openWalletModal);
    }

    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeWalletModal);
    }

    setupModalButtons();
}

/**
 * Preloads the uploaded Crystal Ball logo image safely
 */
function setupAppLogo() {
    appLogoImg = new Image();
    appLogoImg.src = "1000050193.png"; 
    appLogoImg.onload = () => { console.log("Logo loaded."); };
    appLogoImg.onerror = () => { console.warn("Logo image not found in folder yet. Skipping logo draw."); };
}

// ==========================================
// 3. WALLET CONNECTION MODAL SYSTEM
// ==========================================
function openWalletModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) modal.classList.remove("hidden");
}

function closeWalletModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) modal.classList.add("hidden");
}

function setupModalButtons() {
    const wallets = ["choose-okx", "choose-metamask", "choose-coinbase"];
    wallets.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                closeWalletModal();
                connectWallet();
            });
        }
    });
}

// ==========================================
// 4. CORE WEB3 WALLET CONNECTION
// ==========================================
async function connectWallet() {
    const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
    
    if (!provider) {
        alert("Web3 Wallet not detected! If you are using a mobile phone, please open this website from inside the dApp Browser of Bitget Wallet, OKX Wallet, or MetaMask.");
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
        alert("Connection cancelled or an error occurred: " + error.message);
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "🔮 Connect Wallet";
    }
}

// ==========================================
// 5. DETERMINISTIC DESTINY ENGINE & CANVAS
// ==========================================
function generateDestiny(address) {
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) {
        seed += cleanAddress.charCodeAt(i);
    }

    const fateIndex = seed % fateLibrary.length;
    const selectedFate = fateLibrary[fateIndex];
    const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); 

    const fateEl = document.getElementById("fortune-fate");
    const textEl = document.getElementById("fortune-text");
    const emojiEl = document.getElementById("fortune-emoji");

    if (fateEl) fateEl.innerText = selectedFate.fate;
    if (textEl) {
        textEl.innerText = selectedFate.text;
        if (textEl.parentElement) textEl.parentElement.classList.remove("hidden");
    }
    if (emojiEl) {
        emojiEl.innerText = selectedFate.emoji;
        emojiEl.classList.remove("hidden");
    }
    
    const scoreEl = document.getElementById("luck-score");
    const barEl = document.getElementById("luck-bar");
    const seedEl = document.getElementById("seed-anchor");

    if (scoreEl) scoreEl.innerText = `${finalLuckScore}%`;
    if (barEl) barEl.style.width = `${finalLuckScore}%`;
    if (seedEl) seedEl.innerText = `#${seed}`;

    drawDestinyCard(selectedFate, finalLuckScore, address, seed);
    setupTwitterShare(selectedFate, finalLuckScore);
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Background Gradient
    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#020617"); 
    bgGrad.addColorStop(0.5, "#0f172a"); 
    bgGrad.addColorStop(1, "#1e1b4b"); 
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 350, 500);

    // Glow Effect
    let glowGrad = ctx.createRadialGradient(175, 220, 10, 175, 220, 180);
    glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.15)"); 
    glowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 350, 500);

    // Gold Border
    ctx.lineWidth = 4;
    let goldGrad = ctx.createLinearGradient(0, 0, 350, 500);
    goldGrad.addColorStop(0, "#f59e0b"); 
    goldGrad.addColorStop(0.5, "#d97706"); 
    goldGrad.addColorStop(1, "#2563eb"); 
    ctx.strokeStyle = goldGrad;
    ctx.strokeRect(10, 10, 330, 480);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.strokeRect(16, 16, 318, 468);

    // DRAW LOGO BOLA KRISTAL (Jika gambarnya ada dan siap)
    if (appLogoImg && appLogoImg.complete && appLogoImg.naturalWidth !== 0) {
        ctx.drawImage(appLogoImg, 155, 28, 40, 40);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BASE FORECASTER CORES", 175, 82);

    ctx.font = "64px serif";
    ctx.fillText(fateObj.emoji, 175, 155);

    ctx.fillStyle = "#38bdf8"; 
    ctx.font = "bold 19px sans-serif";
    ctx.fillText(fateObj.fate, 175, 210);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.moveTo(80, 225);
    ctx.lineTo(270, 225);
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(175, 225, 4, 0, Math.PI * 2);
    ctx.fill();

    // Word Wrap Description
    ctx.fillStyle = "#cbd5e1"; 
    ctx.font = "italic 11.5px serif";
    const words = fateObj.text.split(" ");
    let line = "";
    let y = 252;
    const maxWidth = 270;
    const lineHeight = 17;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 175, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 175, y);

    // Meta Box Panel
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(30, 395, 290, 62);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.strokeRect(30, 395, 290, 62);

    ctx.textAlign = "left";
    ctx.font = "10.5px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 413);
    ctx.fillText(`LUCK    : ${score}% DEGEN LEVEL`, 45, 430);
    ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 447);

    ctx.textAlign = "center";
    ctx.font = "9px monospace";
    ctx.fillStyle = "#475569";
    ctx.fillText("VERIFIED BY BASE CHAIN CRYPTO-GRAPH", 175, 480);
}

function setupTwitterShare(fateObj, score) {
    const shareBtn = document.getElementById("share-x-btn");
    if (!shareBtn) return;

    shareBtn.onclick = (e) => {
        e.preventDefault();
        const tweetText = encodeURIComponent(
            `🔮 My Base wallet crystal ball just revealed my destiny!\n\n` +
            `Fate: ${fateObj.fate} ${fateObj.emoji}\n` +
            `Degen Luck Score: ${score}%\n\n` +
            `Discover your hexadecimal chain destiny right now on Base Forecaster! 🔵✨`
        );
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(twitterUrl, "_blank");
    };
}

// ==========================================
// 6. MINT NFT BUTTON (REWORKED & FULL REPAIR)
// ==========================================
function setupUniversalMintButton() {
    const mintBtnEl = document.getElementById("mint-nft-btn");
    if (!mintBtnEl) {
        console.warn("Tombol #mint-nft-btn tidak ditemukan di HTML.");
        return;
    }

    // Bersihkan listener lama dengan menghapus atribut onclick (aman tanpa cloneNode)
    mintBtnEl.onclick = null;

    // Pasang Event Listener Klik Baru yang Kuat
    mintBtnEl.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("Tombol Mint diklik. Memulai proses Web3...");

        // Deteksi Provider Dompet Aktif
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum || window.coinbaseWalletExtension;

        if (!provider) {
            alert("Web3 Wallet tidak ditemukan! Jika kamu menggunakan HP, buka website ini dari dalam Browser dApp Aplikasi OKX Wallet, Bitget Wallet, atau MetaMask.");
            return;
        }

        try {
            // 1. Minta akses alamat wallet
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            if (!accounts || accounts.length === 0) {
                alert("Gagal membaca alamat wallet. Pastikan wallet kamu sudah di-unlock.");
                return;
            }
            const activeUserAddr = accounts[0];

            // 2. Paksa pindah/tambah jaringan ke Base Mainnet (Chain ID: 0x2105)
            try {
                await provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x2105" }],
                });
            } catch (switchError) {
                // Code 4902 berarti jaringan Base belum ada di wallet, maka kita tambahkan otomatis
                if (switchError.code === 4902) {
                    await provider.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: "0x2105",
                            chainName: "Base",
                            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                            rpcUrls: ["https://mainnet.base.org"],
                            blockExplorerUrls: ["https://basescan.org"]
                        }]
                    });
                } else {
                    throw switchError;
                }
            }

            // Ubah text tombol biar user tahu proses sedang berjalan
            const originalText = mintBtnEl.innerHTML;
            mintBtnEl.innerHTML = "⏳ Processing Mint...";
            mintBtnEl.disabled = true;

            // 3. METODE UTAMA: Eksekusi Direct RPC Data Stream (Paling Stabil & Universal untuk Semua Wallet)
            // Menggunakan signature hash dari fungsi standard mint() -> "0x1249c5b8"
            // Value: 0.0005 ETH -> Konversi Hex: "0x1c6bf52634000"
            const txParams = {
                from: activeUserAddr,
                to: nftContractAddress,
                value: "0x1c6bf52634000", 
                data: "0x1249c5b8", 
                chainId: "0x2105"
            };

            console.log("Mengirim transaksi langsung ke blockchain via RPC...", txParams);

            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [txParams],
            });
            
            // Kembalikan status tombol
            mintBtnEl.innerHTML = originalText;
            mintBtnEl.disabled = false;

            alert("Transaksi Berhasil Dikirim!\nHash: " + txHash + "\n\nSilakan cek wallet kamu dalam beberapa detik untuk melihat NFT takdirmu!");
            
            // Naikkan angka counter minting secara lokal
            if (typeof incrementMintCounter === "function") {
                incrementMintCounter();
            }

        } catch (error) {
            console.error("Detail Error Minting:", error);
            
            // Kembalikan status tombol jika error
            mintBtnEl.innerHTML = "🔮 Mint Destiny NFT (0.0005 ETH)";
            mintBtnEl.disabled = false;

            const msg = error.data?.message || error.message || "User menolak transaksi atau saldo Base ETH tidak mencukupi.";
            alert("Minting Gagal: " + msg);
        }
    });
        }
                
// ==========================================
// 7. DEVELOPER TIP SYSTEM
// ==========================================
function setupTipSystem() {
    const donateBtnEl = document.getElementById("donate-btn");
    if (!donateBtnEl) return;

    donateBtnEl.onclick = async (e) => {
        e.preventDefault();
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
        if (!provider) return;

        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            const devAddress = "0x1395066A5bEFA739A06112C785C088f7b764D9f1"; 
            
            const txParams = {
                from: accounts[0],
                to: devAddress,
                value: "0x38d7ea4c68000", 
                chainId: "0x2105"
            };

            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [txParams],
            });
            alert("Thank you so much for the support tip! May your wealth multiply! 💸 Hash: " + txHash);
        } catch (err) {
            alert("Tip canceled: " + err.message);
        }
    };
}

// ==========================================
// 8. TOTAL MINT QUANTITY COUNTER SYSTEM
// ==========================================
function setupMintCounter() {
    const mintCounterEl = document.getElementById("mint-counter");
    if (!mintCounterEl) return; 

    let currentMints = localStorage.getItem("base_forecaster_mints");
    if (!currentMints) {
        currentMints = Math.floor(Math.random() * 150) + 780; 
    }
    localStorage.setItem("base_forecaster_mints", currentMints);
    mintCounterEl.innerText = Number(currentMints).toLocaleString("en-US");

    setInterval(() => {
        if (Math.random() > 0.6) {
            incrementMintCounter();
        }
    }, 9000);
}

function incrementMintCounter() {
    const mintCounterEl = document.getElementById("mint-counter");
    if (!mintCounterEl) return;

    let currentMints = parseInt(localStorage.getItem("base_forecaster_mints")) || 800;
    currentMints += 1;
    localStorage.setItem("base_forecaster_mints", currentMints);
    mintCounterEl.innerText = Number(currentMints).toLocaleString("en-US");
}

function setupViewCounter() {
    const counterEl = document.getElementById("view-counter");
    if (!counterEl) return; 
    
    let baseViews = localStorage.getItem("base_forecaster_views");
    if (!baseViews) {
        baseViews = Math.floor(Math.random() * 4000) + 12500;
    } else {
        baseViews = parseInt(baseViews) + Math.floor(Math.random() * 3) + 1;
    }
    localStorage.setItem("base_forecaster_views", baseViews);
    counterEl.innerText = Number(baseViews).toLocaleString("en-US");
}

// ==========================================
// 9. LIVE POP-UP MINT NOTIFICATION LOOP
// ==========================================
function startLiveNotificationLoop() {
    const liveNotifEl = document.getElementById("live-notification");
    const liveTextEl = document.getElementById("live-notif-text");
    if (!liveNotifEl || !liveTextEl) return;

    const showNextNotification = () => {
        const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        const randomFate = fakeFates[Math.floor(Math.random() * fakeFates.length)];
        
        liveTextEl.innerHTML = `🎉 <strong>${randomName}</strong> just minted their Destiny NFT! Fate obtained: <span class="text-blue-400 font-bold">${randomFate}</span>`;
        
        liveNotifEl.classList.remove("hidden", "translate-y-10", "opacity-0");
        liveNotifEl.classList.add("translate-y-0", "opacity-100");

        setTimeout(() => {
            liveNotifEl.classList.remove("translate-y-0", "opacity-100");
            liveNotifEl.classList.add("translate-y-10", "opacity-0");
        }, 4000);

        const nextInterval = Math.floor(Math.random() * 8000) + 7000;
        setTimeout(showNextNotification, nextInterval);
    };

    setTimeout(showNextNotification, 3000);
    }
