document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURASI ---
    const devWalletAddress = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8";

    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    const shareXBtn = document.getElementById('share-x-btn');
    const mintNftBtn = document.getElementById('mint-nft-btn');
    const donateBtn = document.getElementById('donate-btn');

    const fortuneEmoji = document.getElementById('fortune-emoji');
    const fortuneFate = document.getElementById('fortune-fate');
    const luckScore = document.getElementById('luck-score');
    
    // Tempat Degen Rating
    const degenRatingContainer = document.createElement('div');
    degenRatingContainer.className = "mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center mb-4";
    resultSection.insertBefore(degenRatingContainer, resultSection.firstChild);

    const fates = [
        { status: "The Chad Base Whale", emoji: "🐋👑", label: "Apex Predator" },
        { status: "Paper Hands Martyr", emoji: "🧻💀", label: "Panic Seller" },
        { status: "Gas Fee Ghost", emoji: "👻⛽", label: "Ghost Trader" },
        { status: "Degen Prophet", emoji: "🔮🚀", label: "Fortune Seeker" },
        { status: "Exit Liquidity Clown", emoji: "🤡💸", label: "Exit Liquidity" },
        { status: "MEV Bot Target", emoji: "🤖🎯", label: "Bot Bait" },
        { status: "Meme Coin Archeologist", emoji: "🦖💎", label: "Diamond Hands" }
    ];

    // --- FUNGSI UTAMA ---
    async function handleConnectClick() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                handleWalletConnected(accounts[0]);
            } catch (err) { alert("Connection failed!"); }
        } else {
            alert("Please use a Web3 browser (OKX/MetaMask).");
        }
    }

    function handleWalletConnected(address) {
        walletSection.innerHTML = `<div class="bg-blue-950/30 border border-blue-500/30 p-2 rounded-xl text-xs text-blue-400 font-mono text-center">Connected: ${address.slice(0,6)}...${address.slice(-4)}</div>`;
        
        const today = new Date().toISOString().split('T')[0];
        const seed = parseInt(address.slice(-6), 16) + parseInt(today.replace(/-/g, ''));
        const fate = fates[seed % fates.length];
        const luck = (seed % 91) + 10;

        resultSection.classList.remove('hidden');
        fortuneEmoji.innerText = fate.emoji;
        fortuneFate.innerText = fate.status;
        luckScore.innerText = `${luck}%`;
        degenRatingContainer.innerHTML = `<div class="text-[10px] uppercase text-slate-400">Degen Status:</div><div class="text-md font-bold text-blue-400">${fate.label}</div><div class="text-[9px] text-slate-500">Streak: ${seed % 5 + 1} Days</div>`;

        shareXBtn.onclick = () => {
            const tweet = `My ${today} Degen Report:\nStatus: ${fate.status}\nLuck: ${luck}%\nRating: ${fate.label}\n\nCheck your fate: ${window.location.href}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
        };
    }

    // --- EVENT LISTENERS ---
    connectBtn.addEventListener('click', handleConnectClick);
    
    donateBtn.onclick = async () => {
        // Logika Donasi tetap di sini...
        alert("Proceeding to tip the Dev!");
    };
});
                                                                                                                                                                                         
