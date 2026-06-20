document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURASI ALAMAT RESMI ---
    const devWalletAddress = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; // Untuk Donasi/Tip
    const nftContractAddress = "0x5693B08eD075012E42caCeAB11AA53b07f227e35"; // KONTRAK NFT BASE KAMU

    // --- ELEMENT SELECTOR ---
    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    const shareXBtn = document.getElementById('share-x-btn');
    const mintNftBtn = document.getElementById('mint-nft-btn');
    const donateBtn = document.getElementById('donate-btn');
    const cardCanvas = document.getElementById('destiny-card');
    const fortuneFate = document.getElementById('fortune-fate');
    const luckScore = document.getElementById('luck-score');
    const luckBar = document.getElementById('luck-bar');
    const seedAnchor = document.getElementById('seed-anchor');

    // --- CUSTOM MODAL DOMPET ---
    const customModal = document.getElementById('custom-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chooseOkx = document.getElementById('choose-okx');
    const chooseMetamask = document.getElementById('choose-metamask');
    const chooseCoinbase = document.getElementById('choose-coinbase');

    const degenRatingContainer = document.createElement('div');
    degenRatingContainer.className = "mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center mb-4";
    resultSection.insertBefore(degenRatingContainer, resultSection.firstChild);

    // Database Ramalan Unik
    const fates = [
        { status: "The Chad Base Whale", emoji: "🐋", label: "Apex Predator", text: "Horror awaits your portfolio if you open phishing links today. However, your luck indicator shows a weird spike in low-cap multipliers." },
        { status: "Paper Hands Martyr", emoji: "🧻", label: "Panic Seller", text: "You will sell the bottom right before a 100x pump. Take a deep breath, lock your tokens, and stay Based." },
        { status: "Gas Fee Ghost", emoji: "👻", label: "Ghost Trader", text: "Your wallet history looks like a graveyard of failed transactions. The Base gwei gods demand extreme patience." },
        { status: "Degen Prophet", emoji: "🔮", label: "Fortune Seeker", text: "A massive multiplier is brewing in your metadata. Keep your eyes on early token deployments this Friday." },
        { status: "Exit Liquidity Clown", emoji: "🤡", label: "Exit Liquidity", text: "Stop buying the top after the green candle is already a mile high. You are just filling the whale pockets." },
        { status: "MEV Bot Target", emoji: "🤖", label: "Bot Bait", text: "Sandwich attacks lurk in your shadows. Use private RPC nodes or get sliced up cleanly by the algorithms." },
        { status: "Meme Coin Archeologist", emoji: "🦖", label: "Diamond Hands", text: "You possess ancient patience. Holding onto dust until it turns into diamonds. Generational wealth is closing in." }
    ];

    let userAddress = "";

    connectBtn.onclick = () => customModal.classList.remove('hidden');
    closeModalBtn.onclick = () => customModal.classList.add('hidden');

    async function requestWallet(walletType) {
        customModal.classList.add('hidden');
        let provider = window.ethereum;
        if (walletType === 'okx' && window.okxwallet) provider = window.okxwallet;

        if (provider) {
            try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                handleWalletConnected(userAddress);
            } catch (err) {
                alert("Connection rejected!");
            }
        } else {
            const dappUrl = window.location.href;
            alert(`Redirecting to ${walletType.toUpperCase()} Wallet application...`);
            if (walletType === 'okx') window.location.href = `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(dappUrl)}`;
            else if (walletType === 'metamask') window.location.href = `https://metamask.app.link/dapp/${dappUrl.replace('https://', '')}`;
            else window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(dappUrl)}`;
        }
    }

    chooseOkx.onclick = () => requestWallet('okx');
    chooseMetamask.onclick = () => requestWallet('metamask');
    chooseCoinbase.onclick = () => requestWallet('coinbase');

    function handleWalletConnected(address) {
        walletSection.innerHTML = `<div class="bg-blue-950/30 border border-blue-500/30 p-2 rounded-xl text-xs text-blue-400 font-mono text-center">Connected: ${address.slice(0,6)}...${address.slice(-4)}</div>`;
        
        const today = new Date().toISOString().split('T')[0];
        const seedNumber = parseInt(address.slice(-6), 16) + parseInt(today.replace(/-/g, ''));
        const fate = fates[seedNumber % fates.length];
        const luck = (seedNumber % 91) + 10;
        const shortHex = address.slice(2, 6).toUpperCase();

        resultSection.classList.remove('hidden');
        fortuneFate.innerText = fate.status;
        luckScore.innerText = `${luck}%`;
        seedAnchor.innerText = `#${shortHex}`;
        
        setTimeout(() => { luckBar.style.width = `${luck}%`; }, 100);

        degenRatingContainer.innerHTML = `
            <div class="text-[10px] uppercase tracking-widest text-slate-400">Degen Status:</div>
            <div class="text-md font-bold text-blue-400 mt-1">${fate.label}</div>
            <div class="text-[9px] text-slate-500 mt-0.5">Streak: ${seedNumber % 5 + 1} Days Active</div>
        `;

        drawDestinyCard(address, fate, luck, shortHex);

        shareXBtn.onclick = () => {
            const tweetText = `My ${today} Destiny Report from Base Forecaster:\n\nStatus: ${fate.status} ${fate.emoji}\nLuck: ${luck}%\nRating: ${fate.label}\n\nCheck your wallet's destiny daily on @Base: ${window.location.origin}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
        };
    }

    function drawDestinyCard(address, fate, luck, shortHex) {
        const ctx = cardCanvas.getContext('2d');
        const bgGrad = ctx.createLinearGradient(0, 0, 350, 500);
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(0.5, '#1e3a8a');
        bgGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 350, 500);

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 14;
        ctx.strokeRect(7, 7, 336, 486);

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.strokeRect(16, 16, 318, 468);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 18px Helvetica, Arial, sans-serif';
        ctx.fillText("BASE FORECASTER", 28, 45);

        ctx.fillStyle = '#60a5fa';
        ctx.font = 'bold 13px Courier New, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`ID: #${shortHex}`, 320, 43);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#090d16';
        ctx.fillRect(28, 65, 294, 180);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.strokeRect(28, 65, 294, 180);

        const holoGrad = ctx.createRadialGradient(175, 155, 10, 175, 155, 120);
        holoGrad.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
        holoGrad.addColorStop(1, 'rgba(217, 119, 6, 0.05)');
        ctx.fillStyle = holoGrad;
        ctx.fillRect(30, 67, 290, 176);

        ctx.font = '75px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(fate.emoji, 175, 175);
        ctx.textAlign = 'left';

        ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
        ctx.fillRect(28, 255, 294, 30);
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(28, 255, 294, 30);

        ctx.fillStyle = '#93c5fd';
        ctx.font = '11px Courier New, monospace';
        const displayAddr = `${address.slice(0, 14)}...${address.slice(-12)}`;
        ctx.fillText(displayAddr, 38, 274);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 15px Helvetica, Arial, sans-serif';
        ctx.fillText(fate.status.toUpperCase(), 28, 315);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`LUCK: ${luck}%`, 320, 315);
        ctx.textAlign = 'left';

        wrapText(ctx, `"${fate.text}"`, 28, 345, 294, 18);

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = '9px Helvetica';
        ctx.fillText("© 2026 BASE FORECASTER DEV • BUILT ON BASE", 28, 475);
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // --- INTEGRASI SMART CONTRACT (MINT NFT) ---
    const nftAbi = [
        "function mint() external payable",
        "function purchase() external payable"
    ];

    mintNftBtn.onclick = async () => {
        if (!window.ethereum) {
            alert("Sila gunakan dompet Web3 (MetaMask/Coinbase) untuk mencetak NFT!");
            return;
        }
        try {
            // Pindah jaringan dompet secara paksa ke Base Mainnet (0x2105)
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x2105' }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x2105',
                            chainName: 'Base Mainnet',
                            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                            rpcUrls: ['https://mainnet.base.org'],
                            blockExplorerUrls: ['https://basescan.org']
                        }],
                    });
                }
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(nftContractAddress, nftAbi, signer);

            alert("Membuka dompet untuk konfirmasi minting NFT (0.0005 ETH)...");
            
            // Mencoba mengeksekusi fungsi standar mint() pada contract kamu
            const tx = await contract.mint({
                value: ethers.utils.parseEther("0.0005")
            });

            alert("Transaksi dikirim ke Base Network! Memproses... 🚀");
            await tx.wait();
            alert("Sukses! NFT Kartu Destiny Pass resmi dicetak ke dalam dompetmu. 🎉");
        } catch (err) {
            console.error(err);
            alert(`Minting gagal: ${err.message || err}`);
        }
    };

    // --- TRANSFER DONASI TIP (0.001 ETH) ---
    donateBtn.onclick = async () => {
        if (!window.ethereum) {
            alert("Sila gunakan lingkungan Web3 untuk mengirim tip.");
            return;
        }
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x2105' }],
            });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            alert("Membuka dompet untuk transfer tip 0.001 ETH...");
            const tx = await signer.sendTransaction({
                to: devWalletAddress,
                value: ethers.utils.parseEther("0.001")
            });

            alert("Tip sedang dikonfirmasi di jaringan Base... 🚀");
            await tx.wait();
            alert("Terima kasih atas kiriman tipnya, Chad! Kreativitas Anda sangat dihargai! 🔥");
        } catch (err) {
            console.error(err);
            alert(`Donasi gagal: ${err.message || err}`);
        }
    };
});
    
