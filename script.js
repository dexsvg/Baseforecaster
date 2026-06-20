// Memastikan script berjalan setelah halaman web dan seluruh library (Ethers.js) selesai dimuat sepenuhnya
window.addEventListener('load', () => {
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

    // Buat kontainer rating degen secara dinamis
    const degenRatingContainer = document.createElement('div');
    degenRatingContainer.className = "mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center mb-4";
    if (resultSection) {
        resultSection.insertBefore(degenRatingContainer, resultSection.firstChild);
    }

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
    let activeProvider = null;

    // Aksi Buka Tutup Modal
    if(connectBtn) connectBtn.onclick = () => customModal.classList.remove('hidden');
    if(closeModalBtn) closeModalBtn.onclick = () => customModal.classList.add('hidden');

    async function requestWallet(walletType) {
        if(customModal) customModal.classList.add('hidden');
        let provider = window.ethereum;
        
        if (walletType === 'okx' && window.okxwallet) {
            provider = window.okxwallet;
        }

        if (provider) {
            try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                activeProvider = provider;
                handleWalletConnected(userAddress);
            } catch (err) {
                alert("Koneksi dibatalkan atau ditolak oleh pengguna.");
            }
        } else {
            const dappUrl = window.location.href;
            alert(`Membuka dompet ${walletType.toUpperCase()}...`);
            if (walletType === 'okx') window.location.href = `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(dappUrl)}`;
            else if (walletType === 'metamask') window.location.href = `https://metamask.app.link/dapp/${dappUrl.replace('https://', '')}`;
            else window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(dappUrl)}`;
        }
    }

    if(chooseOkx) chooseOkx.onclick = () => requestWallet('okx');
    if(chooseMetamask) chooseMetamask.onclick = () => requestWallet('metamask');
    if(chooseCoinbase) chooseCoinbase.onclick = () => requestWallet('coinbase');

    function handleWalletConnected(address) {
        if(walletSection) {
            walletSection.innerHTML = `<div class="bg-blue-950/30 border border-blue-500/30 p-2 rounded-xl text-xs text-blue-400 font-mono text-center">Connected: ${address.slice(0,6)}...${address.slice(-4)}</div>`;
        }
        
        const today = new Date().toISOString().split('T')[0];
        const seedNumber = parseInt(address.slice(-6), 16) + parseInt(today.replace(/-/g, ''));
        const fate = fates[seedNumber % fates.length];
        const luck = (seedNumber % 91) + 10;
        const shortHex = address.slice(2, 6).toUpperCase();

        if(resultSection) resultSection.classList.remove('hidden');
        if(fortuneFate) fortuneFate.innerText = fate.status;
        if(luckScore) luckScore.innerText = `${luck}%`;
        if(seedAnchor) seedAnchor.innerText = `#${shortHex}`;
        
        setTimeout(() => { if(luckBar) luckBar.style.width = `${luck}%`; }, 100);

        degenRatingContainer.innerHTML = `
            <div class="text-[10px] uppercase tracking-widest text-slate-400">Degen Status:</div>
            <div class="text-md font-bold text-blue-400 mt-1">${fate.label}</div>
            <div class="text-[9px] text-slate-500 mt-0.5">Streak: ${seedNumber % 5 + 1} Days Active</div>
        `;

        drawDestinyCard(address, fate, luck, shortHex);

        if(shareXBtn) {
            shareXBtn.onclick = () => {
                const tweetText = `My ${today} Destiny Report from Base Forecaster:\n\nStatus: ${fate.status} ${fate.emoji}\nLuck: ${luck}%\nRating: ${fate.label}\n\nCheck your wallet's destiny daily on @Base: ${window.location.origin}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
            };
        }
    }

    function drawDestinyCard(address, fate, luck, shortHex) {
        if(!cardCanvas) return;
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

    // --- LOGIKA MINT DENGAN EMULASI FALLBACK JIKA ETHERS KURANG RESPONSIF ---
    if(mintNftBtn) {
        mintNftBtn.onclick = async () => {
            const currentProvider = activeProvider || window.ethereum;
            if (!currentProvider) {
                alert("Gagal mendeteksi Dompet Web3.");
                return;
            }

            try {
                // Atur Jaringan Ke Base Mainnet (0x2105)
                await currentProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x2105' }],
                });

                // Deteksi Keberadaan Library Ethers
                if (typeof ethers === 'undefined') {
                    // JIKA ETHERS FAIL/ERROR, JALANKAN METODE NATIVE RPC (100% PASTI MUNCUL POPUP DI DOMPET)
                    alert("Menggunakan jalur transaksi alternatif standar...");
                    const hexPrice = "0x1C6BF52634000"; // 0.0005 ETH dalam bentuk Hexadecimal Wei
                    
                    // ABI Data encode otomatis untuk fungsi 'mint()' yang paling umum digunakan
                    const txParams = {
                        from: userAddress,
                        to: nftContractAddress,
                        value: hexPrice,
                        data: "0x1249c5b2" // Gas Selector Signature untuk fungsi mint() dasar
                    };
                    
                    const txHash = await currentProvider.request({
                        method: 'eth_sendTransaction',
                        params: [txParams],
                    });
                    alert(`Transaksi Terkirim! Hash: ${txHash}`);
                    return;
                }

                // JIKA ETHERS READY, JALANKAN INTERAKSI KONTRAK STRUKTURAL
                const provider = new ethers.providers.Web3Provider(currentProvider);
                const signer = provider.getSigner();
                
                // ABI Lengkap mencakup fungsi-fungsi minting NFT komersial secara umum
                const fullAbi = [
                    "function mint() external payable",
                    "function mint(uint256 quantity) external payable",
                    "function claim(address receiver, uint256 quantity, address currency, uint256 pricePerToken, tuple(bytes32[] proofs, uint256 maxQuantityInAllowlist, uint256 pricePerToken, address currency) allowlistProof, bytes data) external payable"
                ];

                const contract = new ethers.Contract(nftContractAddress, fullAbi, signer);
                alert("Menghubungi Kontrak NFT... Silakan setujui pop-up.");

                let tx;
                try {
                    tx = await contract.mint({ value: ethers.utils.parseEther("0.0005") });
                } catch (e) {
                    // Fallback jika minting memerlukan parameter jumlah token (mint(1))
                    tx = await contract.mint(1, { value: ethers.utils.parseEther("0.0005") });
                }

                alert("Memproses transaksi di Base Network... 🚀");
                await tx.wait();
                alert("Sukses! NFT Destiny Pass kamu berhasil dicetak! 🎉");

            } catch (err) {
                console.error(err);
                alert(`Gagal memproses minting. Detail: ${err.message || err}`);
            }
        };
    }

    // --- LOGIKA TOMBOL DONASI / TIP ---
    if(donateBtn) {
        donateBtn.onclick = async () => {
            const currentProvider = activeProvider || window.ethereum;
            if (!currentProvider) {
                alert("Dompet Web3 tidak ditemukan.");
                return;
            }

            try {
                await currentProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x2105' }],
                });

                alert("Membuka konfirmasi transfer tip 0.001 Base ETH...");
                
                // Menggunakan Metode Transaksi Native Direct Hex agar tidak bergantung pada library eksternal
                const txParams = {
                    from: userAddress,
                    to: devWalletAddress,
                    value: "0x38D7EA4C68000" // Nilai Hex dari 0.001 ETH
                };

                const txHash = await currentProvider.request({
                    method: 'eth_sendTransaction',
                    params: [txParams],
                });

                alert(`Terima kasih Chad! Tip terkirim. Tx Hash: ${txHash} 🔥`);
            } catch (err) {
                alert(`Donasi batal/gagal: ${err.message || err}`);
            }
        };
    }
});
    
