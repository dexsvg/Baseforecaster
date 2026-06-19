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

    // Project ID WalletConnect V2 Resmi
    const projectId = '8e6b5ffdcbc9794bf9f448ea2361483b';

    const baseChain = {
        chainId: 8453,
        name: 'Base Mainnet',
        currency: 'ETH',
        explorerUrl: 'https://basescan.org',
        rpcUrl: 'https://mainnet.base.org'
    };

    // Inisialisasi Kontroler Universal Modal
    const modal = window.Web3ModalEthers5.createWeb3Modal({
        ethersConfig: window.Web3ModalEthers5.defaultConfig({
            metadata: {
                name: 'Base Forecaster',
                description: 'Hexadecimal Address Destiny Tool',
                url: window.location.origin,
                icons: ['https://avatars.githubusercontent.com/u/37784886']
            }
        }),
        chains: [baseChain],
        projectId,
        themeMode: 'dark'
    });

    // Fungsi mengecek dan merubah tampilan jika sukses konek
    function syncWalletConnection() {
        const isConnected = modal.getIsConnected();
        const currentAddress = modal.getAddress();

        if (isConnected && currentAddress) {
            walletSection.innerHTML = `
                <div class="bg-slate-950 border border-blue-500/30 p-3 rounded-2xl text-[11px] text-blue-400 font-mono flex justify-between items-center w-full animate-fade-in">
                    <span>Connected: ${currentAddress.slice(0,6)}...${currentAddress.slice(-4)}</span>
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                </div>
            `;
            generatePrediction(currentAddress);
        }
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

    // Tombol pemicu buka modal universal
    connectBtn.addEventListener('click', async () => {
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        
        // Shortcut jika mendeteksi in-app browser aktif (Biar gak muter-muter)
        if (injectedProvider) {
            try {
                const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts[0]) {
                    handleWalletConnectedDirect(accounts[0]);
                    return;
                }
            } catch (e) {
                console.log("Injected rejected, running standard modal.");
            }
        }
        
        // Pemicu buka jendela pop-up di browser Chrome/Safari biasa
        modal.open();
    });

    function handleWalletConnectedDirect(address) {
        walletSection.innerHTML = `
            <div class="bg-slate-950 border border-blue-500/30 p-3 rounded-2xl text-[11px] text-blue-400 font-mono flex justify-between items-center w-full">
                <span>Connected: ${address.slice(0,6)}...${address.slice(-4)}</span>
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
        `;
        generatePrediction(address);
    }

    // Pantau perubahan status koneksi modal secara real-time
    modal.subscribeProvider((state) => {
        if (state.isConnected && state.address) {
            handleWalletConnectedDirect(state.address);
        }
    });

    // Cek status koneksi otomatis saat halaman pertama dimuat
    setTimeout(syncWalletConnection, 800);
});
