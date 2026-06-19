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

    // Kumpulan Tautan Rujukan Resmi Milik Kamu
    const okxReferralUrl = "https://web3.okx.com/join/DONKEY";
    const baseReferralUrl = "https://base.app/invite/baseberry/0XLYVZQB";

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

    // 2. Aksi Tombol di dalam Modal Kustom (Ditambah Proteksi Tautan Rujukan)
    
    // Alur OKX Wallet + Rujukan OKX
    chooseOkx.addEventListener('click', () => {
        customModal.classList.add('hidden');
        const okxDeepLink = `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(currentDappUrl)}`;
        
        const start = Date.now();
        window.location.href = okxDeepLink;

        // Fallback jika tidak punya aplikasi OKX, lempar ke rujukan kamu
        setTimeout(() => {
            if (Date.now() - start < 2600) {
                window.location.href = okxReferralUrl;
            }
        }, 2500);
    });

    // Alur MetaMask
    chooseMetamask.addEventListener('click', () => {
        customModal.classList.add('hidden');
        const metamaskTarget = `https://metamask.app.link/dapp/${currentDappUrl.replace('https://', '').replace('http://', '')}`;
        window.location.href = metamaskTarget;
    });

    // Alur Coinbase/Base Wallet + Rujukan Base
    chooseCoinbase.addEventListener('click', () => {
        customModal.classList.add('hidden');
        const coinbaseDeepLink = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(currentDappUrl)}`;
        
        const start = Date.now();
        window.location.href = coinbaseDeepLink;

        // Fallback jika tidak punya aplikasi Coinbase Wallet, lempar ke rujukan Base kamu
        setTimeout(() => {
            if (Date.now() - start < 2600) {
                window.location.href = baseReferralUrl;
            }
        }, 2500);
    });

    closeModalBtn.addEventListener('click', () => {
        customModal.classList.add('hidden');
    });

    // 3. Update Tampilan setelah Wallet Sukses Tersambung
    function handleWalletConnected(address) {
        walletSection.innerHTML = `
            <div class="bg-slate-950 border border-blue-500/30 p-3 rounded-2xl text-[11px] text-blue-400 font-mono flex justify-between items-center w-full">
                <span>Connected: ${address.slice(0,6)}...${address.slice(-4)}</span>
                <span
            
