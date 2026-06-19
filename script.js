document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    
    // Elemen Modal Kustom
    const customModal = document.getElementById('custom-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chooseOkx = document.getElementById('choose-okx');
    const chooseMetamask = document.getElementById('choose-metamask');
    const chooseCoinbase = document.getElementById('choose-coinbase');

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

    // Mengambil domain dApp kamu secara dinamis dari Vercel
    const currentDappUrl = window.location.href;

    // Tautan Rujukan Resmi OKX Milik Kamu
    const okxReferralUrl = "https://web3.okx.com/join/DONKEY";

    // 1. Fungsi Utama saat tombol Hubungkan Kripto diklik
    async function handleConnectClick() {
        // Cek jika dibuka langsung di dalam dApp Browser (In-app browser OKX/MetaMask)
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        
        if (injectedProvider) {
            try {
                connectBtn.innerHTML = `Connecting...`;
                const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts[0]) {
                    handleWalletConnected(accounts[0]);
                }
            } catch (error) {
                console.error(error);
                alert("Connection rejected by user.");
                connectBtn.innerHTML = `<span>🔮</span> Connect Wallet`;
            }
        } else {
            // Jika dibuka di Google Chrome biasa, munculkan modal buatan kita sendiri
            customModal.classList.remove('hidden');
        }
    }

    // 2. Aksi Tombol di dalam Modal Kustom (Ditambah Proteksi Tautan Rujukan OKX)
    
    chooseOkx.addEventListener('click', () => {
        customModal.classList.add('hidden');
        
        // Membuka dApp di dalam OKX Wallet menggunakan skema deep-link universal
        const okxDeepLink = `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(currentDappUrl)}`;
        
        // Buat pencatat waktu untuk mendeteksi apakah aplikasi OKX berhasil terbuka atau tidak di HP user
        const start = Date.now();
        window.location.href = okxDeepLink;

        // Jika dalam waktu 2.5 detik halaman tidak berpindah (artinya user tidak punya aplikasi OKX), 
        // secara otomatis lemparkan mereka ke Tautan Rujukan OKX kamu agar mendaftar/mengunduh
        setTimeout(() => {
            if (Date.now() - start < 2600) {
                window.location.href = okxReferralUrl;
            }
        }, 2500);
    });

    chooseMetamask.addEventListener('click', () => {
        customModal.classList.add('hidden');
        const metamaskTarget = `https://metamask.app.link/dapp/${currentDappUrl.replace('https://', '').replace('http://', '')}`;
        window.location.href = metamaskTarget;
    });

    chooseCoinbase.addEventListener('click', () => {
        customModal.classList.add('hidden');
        const coinbaseTarget = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(currentDappUrl)}`;
        window.location.href = coinbaseTarget;
    });

    closeModalBtn.addEventListener('click', () => {
        customModal.classList.add('hidden');
    });

    // 3. Update Tampilan setelah Wallet Sukses Tersambung
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

    connectBtn.addEventListener('click', handleConnectClick);

    // Cek otomatis di awal jika user membuka langsung di dalam browser dompet
    setTimeout(() => {
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        if (injectedProvider && injectedProvider.selectedAddress) {
            handleWalletConnected(injectedProvider.selectedAddress);
        }
    }, 500);
});
