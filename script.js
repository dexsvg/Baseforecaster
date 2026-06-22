/**
 * Base Forecaster - Core Logic Script (Anti-Crash Version)
 * Fully functional for destiny calculation, wallet management, live notifications, and robust NFT minting.
 */

const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 
let userAddress = "";
let isConnected = false;
let appLogoImg = null;

const fateLibrary = [
    { fate: "THE WHALE ASCENDANT", emoji: "🐋", text: "Your hexadecimal wallet aligns with massive liquidity movements. You are destined to lead market trends, accumulate pristine assets, and exit safely right before the storm of a rugpull hits.", score: 98 },
    { fate: "THE DEGEN SURVIVOR", emoji: "🥷", text: "Your portfolio is filled with the battle scars of meme-coin wars. However, your address framework indicates absolute resilience. A 100x target is waiting for your next execution click.", score: 74 },
    { fate: "DUSTING ATTACK TARGET", emoji: "⚠️", text: "Warning signals are vibrating within your blockchain data nodes. Your wallet appears vulnerable to malicious tokens and dusting attacks. Clean up your digital footprint and avoid clicking random airdrop claims.", score: 21 },
    { fate: "GENERATIONAL WEALTH", emoji: "👑", text: "An extremely rare cosmic configuration! The prefix and suffix of your address secure an eternal wealth knot on the Base network. Keep a strong grip on your core assets; a magnificent future awaits.", score: 95 },
    { fate: "THE ETERNAL HOLDER", emoji: "💎", text: "True Diamond Hands. You never falter, no matter how deep the market correction goes. The Base ledger remembers your absolute loyalty, and great staking rewards are bound to manifest soon.", score: 85 },
    { fate: "LIQUIDITY PROVIDER DOOM", emoji: "📉", text: "Exercise extreme caution when deploying capital into obscure high-yield farming pools. Impermanent loss is lurking within your wallet parameters if greed takes over your strategy.", score: 42 }
];

const fakeNames = ["DegenJoe", "0xAlpha...", "BaseWhale", "CryptoGuru", "SpeedyMint", "0xLover", "MemeKing", "BaseGod", "0xChef", "AnonDegen"];
const fakeFates = ["THE WHALE ASCENDANT 🐋", "THE DEGEN SURVIVOR 🥷", "GENERATIONAL WEALTH 👑", "THE ETERNAL HOLDER 💎"];

document.addEventListener("DOMContentLoaded", () => {
    try { setupAppLogo(); } catch(e) { console.error("Logo error:", e); }
    try { setupViewCounter(); } catch(e) { console.error("View counter error:", e); }
    try { setupMintCounter(); } catch(e) { console.error("Mint counter error:", e); }
    try { startLiveNotificationLoop(); } catch(e) { console.error("Notification error:", e); }
    
    initWalletSystem();
    
    try { setupUniversalMintButton(); } catch(e) { console.error("Mint button error:", e); }
    try { setupTipSystem(); } catch(e) { console.error("Tip system error:", e); }
});

function initWalletSystem() {
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) connectBtn.addEventListener("click", openWalletModal);

    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeWalletModal);

    setupModalButtons();
}

function setupAppLogo() {
    appLogoImg = new Image();
    appLogoImg.src = "1000050193.png"; 
    appLogoImg.onload = () => { console.log("Logo loaded."); };
    appLogoImg.onerror = () => { console.warn("Logo image not found yet. Skipping logo draw."); };
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

function generateDestiny(address) {
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) {
        seed += cleanAddress.charCodeAt(i);
    }

    const fateIndex = seed % fateLibrary.length;
    const selectedFate = fateLibrary[fateIndex];
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
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#020617"); 
    bgGrad.addColorStop(0.5, "#0f172a"); 
    bgGrad.addColorStop(1, "#1e1b4b"); 
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 350, 500);

    ctx.lineWidth = 4;
    let goldGrad = ctx.createLinearGradient(0, 0, 350, 500);
    goldGrad.addColorStop(0, "#f59e0b"); 
    goldGrad.addColorStop(1, "#2563eb"); 
    ctx.strokeStyle = goldGrad;
    ctx.strokeRect(10, 10, 330, 480);

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

    ctx.fillStyle = "#cbd5e1"; 
    ctx.font = "italic 11.5px serif";
    const words = fateObj.text.split(" ");
    let line = "";
    let y = 252;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > 270 && n > 0) {
            ctx.fillText(line, 175, y);
            line = words[n] + " ";
            y += 17;
        } else { line = testLine; }
    }
    ctx.fillText(line, 175, y);

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
    ctx.fillText("VERIFIED BY BASE CHAIN CRYPTO-GRAPH", 175, 480);
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

async function setupUniversalMintButton() {
    const mintBtnEl = document.getElementById("mint-nft-btn");
    if (!mintBtnEl) return;

    mintBtnEl.addEventListener("click", async (e) => {
        e.preventDefault();
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
        if (!provider) {
            alert("Web3 Wallet not found!");
            return;
        }
        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            const activeUserAddr = accounts[0];

            try {
                await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x2105" }] });
            } catch (switchError) {
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
                } else { throw switchError; }
            }

            const originalText = mintBtnEl.innerHTML;
            mintBtnEl.innerHTML = "⏳ Processing Mint...";
            mintBtnEl.disabled = true;

            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [{
                    from: activeUserAddr,
                    to: nftContractAddress,
                    value: "0x1c6bf52634000", 
                    data: "0x1249c5b8", 
                    chainId: "0x2105"
                }],
            });
            
            mintBtnEl.innerHTML = originalText;
            mintBtnEl.disabled = false;
            alert("Transaction Sent! Hash: " + txHash);
            incrementMintCounter();
        } catch (error) {
            mintBtnEl.innerHTML = "🪙 Mint NFT (0.0005 ETH)";
            mintBtnEl.disabled = false;
            alert("Minting Failed: " + (error.message || error));
        }
    });
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
            await provider.request({
                method: "eth_sendTransaction",
                params: [{
                    from: accounts[0],
                    to: "0x1395066A5bEFA739A06112C785C088f7b764D9f1", 
                    value: "0x38d7ea4c68000", 
                    chainId: "0x2105"
                }]
            });
            alert("Thank you for the tip! 💸");
        } catch (err) { alert("Tip canceled."); }
    };
}

function setupMintCounter() {
    const mintCounterEl = document.getElementById("mint-counter");
    if (!mintCounterEl) return; 
    let currentMints = localStorage.getItem("base_forecaster_mints") || Math.floor(Math.random() * 150) + 780;
    localStorage.setItem("base_forecaster_mints", currentMints);
    mintCounterEl.innerText = Number(currentMints).toLocaleString("en-US");

    setInterval(() => { if (Math.random() > 0.6) incrementMintCounter(); }, 9000);
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
    let baseViews = localStorage.getItem("base_forecaster_views") || Math.floor(Math.random() * 4000) + 12500;
    baseViews = parseInt(baseViews) + Math.floor(Math.random() * 3) + 1;
    localStorage.setItem("base_forecaster_views", baseViews);
    counterEl.innerText = Number(baseViews).toLocaleString("en-US");
}

function startLiveNotificationLoop() {
    const liveNotifEl = document.getElementById("live-notification");
    const liveTextEl = document.getElementById("live-notif-text");
    if (!liveNotifEl || !liveTextEl) return;

    const showNextNotification = () => {
        const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        const randomFate = fakeFates[Math.floor(Math.random() * fakeFates.length)];
        
        liveTextEl.innerHTML = `🎉 <strong>${randomName}</strong> just minted their Destiny NFT! <br>Fate: <span class="text-amber-400 font-bold">${randomFate}</span>`;
        
        liveNotifEl.classList.remove("hidden");
        setTimeout(() => {
            liveNotifEl.classList.remove("translate-y-[-100px]", "opacity-0");
            liveNotifEl.classList.add("translate-y-0", "opacity-100");
        }, 100);

        setTimeout(() => {
            liveNotifEl.classList.remove("translate-y-0", "opacity-100");
            liveNotifEl.classList.add("translate-y-[-100px]", "opacity-0");
        }, 4000);

        setTimeout(showNextNotification, Math.floor(Math.random() * 8000) + 9000);
    };

    setTimeout(showNextNotification, 3000);
}
