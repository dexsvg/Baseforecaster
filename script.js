document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    
    const fortuneEmoji = document.getElementById('fortune-emoji');
    const fortuneFate = document.getElementById('fortune-fate');
    const fortuneText = document.getElementById('fortune-text');
    const luckScore = document.getElementById('luck-score');
    const luckBar = document.getElementById('luck-bar');
    const seedAnchor = document.getElementById('seed-anchor');

    const fates = [
        { status: "The Chad Base Whale", emoji: "🐋👑" },
        { status: "Paper Hands Martyr", emoji: "🧻💀" },
        { status: "Gas Fee Ghost", emoji: "👻⛽" },
        { status: "Degen Prophet", emoji: "🔮🚀" },
        { status: "Exit Liquidity Clown", emoji: "🤡💸" },
        { status: "MEV Bot Target", emoji: "🤖🎯" },
        { status: "Meme Coin Archeologist", emoji: "🦖💎" }
    ];

    const predictions = [
        "Your address contains the sacred geometry of an early adopter. A massive ecosystem airdrop is tracking your footsteps, but your patience is dangerously thin.",
        "The smart contract gods frown upon your past panic sells. A mysterious whale is watching your address, waiting for you to sleep to trigger a flash crash.",
        "The stars aligned on the Base network when this wallet was generated. Generational wealth is close, but your propensity to buy the absolute top remains active.",
        "Your wallet address screams chaotic energy. You are highly protected against dusting attacks, but your next transaction will likely be frontrun by a sandwich bot.",
        "Horror awaits your portfolio if you open phishing links today. However, your luck indicator shows a weird spike in low-cap memecoin multipliers this week."
    ];

    async function connectWallet() {
        // A. JALUR INTERNAL: Jika dibuka di dApp Browser OKX / MetaMask / Coinbase Wallet
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        
        if (injectedProvider) {
            try {
                connectBtn.innerHTML = `<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Injected Connecting...`;
                const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts[0]) {
                    handleWalletConnected(accounts[0]);
                    return;
                }
            } catch (error) {
                console.log("Injected provider bypassed or rejected, using WalletConnect...");
            }
        }

        // B. JALUR UNIVERSAL: Jika dibuka di Google Chrome biasa / Safari HP
        try {
            connectBtn.innerHTML = `<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Opening Modal...`;
            
            // Menginisialisasi Web3Provider WalletConnect independen
            const provider = new window.WalletConnectProvider.default({
                rpc: {
                    8453: "https://mainnet.base.org" // RPC Base Network
                },
                chainId: 8453,
                qrcodeModalOptions: {
                    mobileLinks: ["okx", "metamask", "coinbase", "trust"] // Memprioritaskan pop-up dompet utama di HP
                }
            });

            // Memicu jendela QR Code & Deep Link modal universal
            await provider.enable();

            // Ambil address wallet setelah user menyetujui koneksi di aplikasi dompetnya
            if (provider.accounts && provider.accounts[0]) {
                handleWalletConnected(provider.accounts[0]);
            }

        } catch (error) {
            console.error("User closed modal or connection failed:", error);
            alert("Connection cancelled.");
            connectBtn.innerHTML = `<span>🔮</span> Connect Wallet`;
        }
    }

    function handleWalletConnected(address) {
        walletSection.innerHTML = `
            <div class="bg-slate-950 border border-blue-500/30 p-3 rounded-2xl text-[11px] text-blue-400 font-mono flex justify-between items-center w-full">
                <span>Connected: ${address.slice(0,6)}...${address.slice(-4)}</span>
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
        `;
        generatePrediction(address);
    }

    function generatePrediction(address) {
        const cleanAddress = address.replace('0x', '');
        const lastFour = cleanAddress.slice(-4); 
        const seedNumber = parseInt(lastFour, 16) || 777; 

        const chosenFate = fates[seedNumber % fates.length];
        const chosenText = predictions[(seedNumber + 2) % predictions.length];
        const calculatedLuck = (seedNumber % 91) + 10; 

        resultSection.classList.remove('hidden');

        fortuneEmoji.innerText = chosenFate.emoji;
        fortuneFate.innerText = chosenFate.status;
        fortuneText.innerText = chosenText;
        luckScore.innerText = `${calculatedLuck}%`;
        seedAnchor.innerText = `#${lastFour.toUpperCase()}`;

        setTimeout(() => {
            luckBar.style.width = `${calculatedLuck}%`;
        }, 200);
    }

    connectBtn.addEventListener('click', connectWallet);
});
