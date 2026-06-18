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

    // Database Ramalan Kombinasi Lucu & Horor
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

    // Fungsi Utama Koneksi Wallet
    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                connectBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Reading Address...`;
                
                // Minta akses akun ke MetaMask / OKX Wallet / Coinbase Wallet di HP
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const walletAddress = accounts[0];

                // Tampilkan info wallet terhubung
                walletSection.innerHTML = `
                    <div class="bg-slate-950 border border-blue-500/30 p-3 rounded-2xl text-[11px] text-blue-400 font-mono flex justify-between items-center">
                        <span>Connected: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}</span>
                        <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    </div>
                `;

                // Jalankan Ramalan Unik
                generatePrediction(walletAddress);

            } catch (error) {
                alert('Connection rejected or failed. Please try again!');
                connectBtn.innerHTML = `<span>🔮</span> Connect Wallet (Base Network)`;
            }
        } else {
            // Jika dibuka di browser biasa (bukan Web3 browser seperti OKX/MetaMask App)
            alert('Please open this dApp inside your OKX Wallet, Coinbase Wallet, or MetaMask App browser on your phone!');
            connectBtn.innerHTML = `<span>🔮</span> Connect Wallet (Base Network)`;
        }
    }

    // Algoritma Penentu Ramalan (Menggunakan hash address agar tidak pernah sama)
    function generatePrediction(address) {
        const cleanAddress = address.replace('0x', '');
        const lastFour = cleanAddress.slice(-4); // Mengambil 4 karakter terakhir
        const seedNumber = parseInt(lastFour, 16) || 777; // Ubah hex jadi angka desimal

        // Rumus matematika sederhana agar variasi index acak tapi konsisten per wallet
        const chosenFate = fates[seedNumber % fates.length];
        const chosenText = predictions[(seedNumber + 2) % predictions.length];
        const calculatedLuck = (seedNumber % 91) + 10; // Rentang Luck 10% - 100%

        // Munculkan Seksi Hasil
        resultSection.classList.remove('hidden');

        // Suntik data ke UI
        fortuneEmoji.innerText = chosenFate.emoji;
        fortuneFate.innerText = chosenFate.status;
        fortuneText.innerText = chosenText;
        luckScore.innerText = `${calculatedLuck}%`;
        seedAnchor.innerText = `#${lastFour.toUpperCase()}`;

        // Animasi Progress Bar Luck
        setTimeout(() => {
            luckBar.style.width = `${calculatedLuck}%`;
        }, 200);
    }

    connectBtn.addEventListener('click', connectWallet);
});

