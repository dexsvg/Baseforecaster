/**
 * Base Forecaster - Core Logic Script (Global English Version)
 * Fully functional for destiny calculation, wallet management, and NFT minting.
 */

// ==========================================
// 1. CONFIGURATION & GLOBAL VARIABLES
// ==========================================
// Automatically matches your deployed contract from Remix: 0x26E...13950
const nftContractAddress = "0x26E00eBdE27388077d9EC014C98c8764D9f13950"; 

let userAddress = "";
let isConnected = false;

// Destiny Library based on wallet address hash (Translated to English)
const fateLibrary = [
    { fate: "THE WHALE ASCENDANT", emoji: "🐋", text: "Your wallet's hexadecimal structure aligns with massive liquidity movements. You are destined to lead market trends, accumulate pristine assets, and exit safely right before the storm of a rugpull hits.", score: 98 },
    { fate: "THE DEGEN SURVIVOR", emoji: "🥷", text: "Your portfolio is filled with the battle scars of meme-coin wars. However, your address framework indicates absolute resilience. A 100x target is waiting for your next execution click.", score: 74 },
    { fate: "DUSTING ATTACK TARGET", emoji: "⚠️", text: "Warning signals are vibrating within your blockchain data nodes. Your wallet appears vulnerable to malicious tokens and dusting attacks. Clean up your digital footprint and avoid clicking random airdrop claims.", score: 21 },
    { fate: "GENERATIONAL WEALTH", emoji: "👑", text: "An extremely rare cosmic configuration! The prefix and suffix of your address secure an eternal wealth knot on the Base network. Keep a strong grip on your core assets; a magnificent future awaits.", score: 95 },
    { fate: "THE ETERNAL HOLDER", emoji: "💎", text: "True Diamond Hands. You never falter, no matter how deep the market correction goes. The Base ledger remembers your absolute loyalty, and great staking rewards are bound to manifest soon.", score: 85 },
    { fate: "LIQUIDITY PROVIDER DOOM", emoji: "📉", text: "Exercise extreme caution when deploying capital into obscure high-yield farming pools. Impermanent loss is lurking within your wallet parameters if greed takes over your strategy.", score: 42 }
];

// ==========================================
// 2. INITIALIZATION ON LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setupViewCounter();
    
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.addEventListener("click", openWalletModal);
    }

    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeWalletModal);
    }

    setupModalButtons();
    setupUniversalMintButton();
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
        alert("Web3 Wallet not detected! If you are on a mobile device, please open this website from inside the dApp Browser of Bitget Wallet, OKX Wallet, Coinbase Wallet, or MetaMask.");
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
        alert("Connection cancelled or error occurred: " + error.message);
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

    document.getElementById("fortune-fate").innerText = selectedFate.fate;
    document.getElementById("fortune-text").innerText = selectedFate.text;
    document.getElementById("fortune-emoji").innerText = selectedFate.emoji;
    document.getElementById("fortune-emoji").classList.remove("hidden");
    document.getElementById("fortune-text").parentElement.classList.remove("hidden");
    
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

    // 1. Background Gradient - Deep Dark Blue Celestial Theme
    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#020617"); 
    bgGrad.addColorStop(0.5, "#0f172a"); 
    bgGrad.addColorStop(1, "#1e1b4b"); 
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 350, 500);

    // 2. Radial Glow Effect
    let glowGrad = ctx.createRadialGradient(175, 220, 10, 175, 220, 180);
    glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.15)"); 
    glowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 350, 500);

    // 3. Border Luxury Gold-Blue Gradient
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

    // 4. Header Text
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BASE FORECASTER CORES", 175, 42);

    // 5. Destiny Emoji
    ctx.font = "72px serif";
    ctx.fillText(fateObj.emoji, 175, 130);

    // 6. Title
    ctx.fillStyle = "#38bdf8"; 
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(fateObj.fate, 175, 195);

    // 7. Decorative Divider
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.moveTo(80, 215);
    ctx.lineTo(270, 215);
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(175, 215, 4, 0, Math.PI * 2);
    ctx.fill();

    // 8. Description Word Wrapping
    ctx.fillStyle = "#cbd5e1"; 
    ctx.font = "italic 12px serif";
    const words = fateObj.text.split(" ");
    let line = "";
    let y = 245;
    const maxWidth = 270;
    const lineHeight = 18;

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

    // 9. Parameters Panel Box
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(30, 390, 290, 65);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.strokeRect(30, 390, 290, 65);

    ctx.textAlign = "left";
    ctx.font = "11px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 410);
    ctx.fillText(`LUCK    : ${score}% DEGEN LEVEL`, 45, 427);
    ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 444);

    // 10. Watermark
    ctx.textAlign = "center";
    ctx.font = "9px monospace";
    ctx.fillStyle = "#475569";
    ctx.fillText("VERIFIED BY BASE CHAIN CRYPTO-GRAPH", 175, 478);
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
// 6. TOMBOL MINT NFT (UNIVERSAL BYPASS METHOD V5/V6)
// ==========================================
function setupUniversalMintButton() {
    const mintBtnEl = document.getElementById("mint-nft-btn");
    if (!mintBtnEl) return;

    const newMintBtn = mintBtnEl.cloneNode(true);
    mintBtnEl.parentNode.replaceChild(newMintBtn, mintBtnEl);

    newMintBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum || (window.coinbaseWalletExtension ? window.coinbaseWalletExtension : null);

        if (!provider) {
            alert("Web3 Provider not found. Please open this app inside your crypto wallet dApp browser.");
            return;
        }

        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            if (!accounts || accounts.length === 0) {
                alert("Failed to read active wallet address. Please unlock your wallet application.");
                return;
            }
            const activeUserAddr = accounts[0];

            // Force Switch Network to Base Mainnet (Hex: 0x2105)
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x2105" }],
            }).catch(async (switchError) => {
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
                }
            });

            alert("Connected to Base Network! Preparing NFT minting contract pipeline...");

            // Precise Smart Contract ABIs covering all variants found in your code
            const comprehensiveABI = [
                "function mint() public payable",
                "function mintNFT() public payable",
                "function mint(uint256 quantity) public payable"
            ];

            // --- PROTOCOL PATHWAY 1: ETHERS.JS V6 DETECT ---
            if (window.ethers && window.ethers.BrowserProvider) {
                const browserProto = new window.ethers.BrowserProvider(provider);
                const signer = await browserProto.getSigner();
                const contract = new window.ethers.Contract(nftContractAddress, comprehensiveABI, signer);
                
                const tx = await contract.mint({
                    value: window.ethers.parseEther("0.0005"),
                    gasLimit: 160000
                });
                alert("Transaction Submitted! Hash: " + tx.hash);
                await tx.wait();
                alert("Success! Your Base Forecaster Destiny NFT has been minted! 🎉");
            } 
            // --- PROTOCOL PATHWAY 2: ETHERS.JS V5 DETECT ---
            else if (window.ethers && window.ethers.providers) {
                const web3Proto = new window.ethers.providers.Web3Provider(provider);
                const signer = web3Proto.getSigner();
                const contract = new window.ethers.Contract(nftContractAddress, comprehensiveABI, signer);
                
                const tx = await contract.mint({
                    value: window.ethers.utils.parseEther("0.0005"),
                    gasLimit: window.ethers.utils.hexlify(160000)
                });
                alert("Transaction Submitted! Hash: " + tx.hash);
                await tx.wait();
                alert("Success! Your Base Forecaster Destiny NFT has been minted! 🎉");
            } 
            // --- HARDCORE EMERGENCY PATHWAY: DIRECT RPC CALL (NO ETHERS AT ALL) ---
            else {
                alert("Ethers library binding frozen. Launching Direct RPC Data Stream...");
                
                // standard function selector hash for mint()
                const txData = "0x1249c5b8"; 
                const txParams = {
                    from: activeUserAddr,
                    to: nftContractAddress,
                    value: "0x1c6bf52634000", // 0.0005 ETH in Hex Wei format
                    data: txData,
                    chainId: "0x2105"
                };

                const txHash = await provider.request({
                    method: "eth_sendTransaction",
                    params: [txParams],
                });
                
                alert("Emergency Bypass Transaction Sent!\nHash: " + txHash + "\n\nCheck your wallet portfolio or block explorer shortly.");
            }

        } catch (error) {
            console.error(error);
            const msg = error.data?.message || error.message || "User denied transaction or insufficient Base ETH balance.";
            alert("Minting Failed: " + msg);
        }
    });
}

// ==========================================
// 7. DEVELOPER DONATION / TIP SYSTEM
// ==========================================
const donateBtnEl = document.getElementById("donate-btn");
if (donateBtnEl) {
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
                value: "0x38d7ea4c68000", // 0.001 ETH
                chainId: "0x2105"
            };

            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [txParams],
            });
            alert("Thank you so much for the support tip! 💸 Hash: " + txHash);
        } catch (err) {
            alert("Tip canceled: " + err.message);
        }
    };
}

// ==========================================
// 8. AUXILIARY UTILITIES (VIEW COUNTER)
// ==========================================
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
            
