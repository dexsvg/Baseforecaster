document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURASI DEV WALLET ---
    const devWalletAddress = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8";

    // --- ELEMEN UTAMA ---
    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    const shareXBtn = document.getElementById('share-x-btn');
    const donateBtn = document.getElementById('donate-btn');

    // --- ELEMEN HASIL ---
    const fortuneEmoji = document.getElementById('fortune-emoji');
    const fortuneFate = document.getElementById('fortune-fate');
    const fortuneText = document.getElementById('fortune-text');
    const luckScore = document.getElementById('luck-score');
    const luckBar = document.getElementById('luck-bar');
    const seedAnchor = document.getElementById('seed-anchor');

    // --- ELEMEN CUSTOM MODAL ---
    const customModal = document.getElementById('custom-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chooseOkx = document.getElementById('choose-okx');
    const chooseMetamask = document.getElementById('choose-metamask');
    const chooseCoinbase = document.getElementById('choose-coinbase');

    // Container Baru untuk Fitur Degen Status & Streak
    const degenRatingContainer = document.createElement('div');
    degenRatingContainer.className = "mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center mb-4";
    resultSection.insertBefore(degenRatingContainer, resultSection.firstChild);

    // Database Hasil Ramalan Variatif
    const fates = [
        { status: "The Chad Base Whale", emoji: "🐋👑", label: "Apex Predator", text: "Horror awaits your portfolio if you open phishing links today. However, your luck indicator shows a weird spike in low-cap memecoin multipliers this week." },
        { status: "Paper Hands Martyr", emoji: "🧻💀", label: "Panic Seller", text: "You will sell the bottom right before a 100x pump. Take a deep breath and lock your tokens." },
        { status: "Gas Fee Ghost", emoji: "👻⛽", label: "Ghost Trader", text: "Your wallet history looks like a graveyard of failed transactions. The Base gwei gods demand patience." },
        { status: "Degen Prophet", emoji: "🔮🚀", label: "Fortune Seeker", text: "A massive multiplier is brewing in your metadata. Keep your eyes on early token launches this Friday." },
        { status: "Exit Liquidity Clown", emoji: "🤡💸", label: "Exit Liquidity", text: "Stop buying the top after the green candle is already a mile high. You are filling the whales' pockets." },
        { status: "MEV Bot Target", emoji: "🤖🎯", label: "Bot Bait", text: "Sandwich attacks lurk in your shadows. Use private RPC nodes or get sliced up by the algos." },
        { status: "Meme Coin Archeologist", emoji: "🦖💎", label: "Diamond Hands", text: "You possess the ancient patience. Holding onto dust until it turns into diamonds. Generational wealth approaches." }
    ];

    let userAddress = "";

    // --- FUNGSI MUNCULKAN MODAL PILIHAN WALLET ---
    connectBtn.onclick = () => {
        customModal.classList.remove('hidden');
    };

    closeModalBtn.onclick = () => {
        customModal.classList.add('hidden');
    };

    // --- LOGIKA UTAMA WEB3 KONEKSI ---
    async function requestWallet(walletType) {
        customModal.classList.add('hidden');
        
        let provider = window.ethereum;
        
        if (walletType === 'okx' && window.okxwallet) {
            provider = window.okxwallet;
        }

        if (provider) {
            try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                handleWalletConnected(userAddress);
            } catch (err) {
                alert("Connection rejected!");
            }
        } else {
            // JIKA DIWEB BIASA/CHROME HP -> REDIRECT LANGSUNG KE APLIKASI WALLET (DEEP LINK)
            const dappUrl = window.location.href;
            alert(`Redirecting to ${walletType.toUpperCase()} Wallet application...`);
            
            if (walletType === 'okx') {
                window.location.href = `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(dappUrl)}`;
            } else if (walletType === 'metamask') {
                window.location.href = `https://metamask.app.link/dapp/${dappUrl.replace('https://', '')}`;
            } else {
                window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(dappUrl)}`;
            }
        }
    }

    // Assign fungsi klik ke masing-masing pilihan di dalam modal
    chooseOkx.onclick = () => requestWallet('okx');
    chooseMetamask.onclick = () => requestWallet('metamask');
    chooseCoinbase.onclick = () => requestWallet('coinbase');

    // --- JIKA WALLET SUDAH CONNECT ---
    function handleWalletConnected(address) {
        walletSection.innerHTML = `<div class="bg-blue-950/30 border border-blue-500/30 p-2 rounded-xl text-xs text-blue-400 font-mono text-center">Connected: ${address.slice(0,6)}...${address.slice(-4)}</div>`;
        
        // Logika Harian (Ramalan Berubah Sesuai Tanggal & Alamat Wallet)
        const today = new Date().toISOString().split('T')[0];
        const seedNumber = parseInt(address.slice(-6), 16) + parseInt(today.replace(/-/g, ''));
        const fate = fates[seedNumber % fates.length];
        const luck = (seedNumber % 91) + 10; // Rentang skor 10% - 100%
        const shortHex = address.slice(2, 6).toUpperCase();

        // Tampilkan Hasil & Jalankan Animasi Progress Bar
        resultSection.classList.remove('hidden');
        fortuneEmoji.innerText = fate.emoji;
        fortuneFate.innerText = fate.status;
        fortuneText.innerText = fate.text;
        luckScore.innerText = `${luck}%`;
        seedAnchor.innerText = `#${shortHex}`;
        
        setTimeout(() => {
            luckBar.style.width = `${luck}%`;
        }, 100);

        // Render data Degen Status & Daily Streak
        degenRatingContainer.innerHTML = `
            <div class="text-[10px] uppercase tracking-widest text-slate-400">Degen Status:</div>
            <div class="text-md font-bold text-blue-400 mt-1">${fate.label}</div>
            <div class="text-[9px] text-slate-500 mt-0.5">Streak: ${seedNumber % 5 + 1} Days Active</div>
        `;

        // Sistem Auto-Tweet ke X (Twitter)
        shareXBtn.onclick = () => {
            const tweetText = `My ${today} Degen Report from Base Forecaster:\n\nStatus: ${fate.status} ${fate.emoji}\nLuck: ${luck}%\nRating: ${fate.label}\n\nCheck your wallet's destiny daily on @Base: ${window.location.origin}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
        };
    }

    // --- SYSTEM TRANSFER DONASI (SEND 0.001 ETH) ---
    donateBtn.onclick = async () => {
        if (!window.ethereum) {
            alert("Please use Web3 environment to complete transaction.");
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const tx = await signer.sendTransaction({
                to: devWalletAddress,
                value: ethers.utils.parseEther("0.001")
            });
            
            alert("Tip transaction submitted! Sending 0.001 ETH to Dev... 🚀");
            await tx.wait();
            alert("Thank you for supporting Base Forecaster, Chad! 🔥");
        } catch (err) {
            alert("Transaction canceled or failed.");
        }
    };
});
                                                                                                                                                                 
