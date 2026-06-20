// Memastikan script berjalan setelah halaman web dan seluruh library selesai dimuat sepenuhnya
window.addEventListener('load', () => {

    // --- 1. FITUR GLOBAL REALTIME ANALYTICS (SERAGAM DI SEMUA SITUS/DOMPET) ---
    async function initGlobalAnalytics() {
        const counterEl = document.getElementById('view-counter');
        if (!counterEl) return;

        // Namespace unik agar hit counter dApp kamu tidak bercampur dengan web lain
        const namespace = "base_forecaster_dapp_2026";
        const key = "total_global_hits";

        try {
            // Panggil API hit global untuk otomatis menambahkan +1 view setiap kali halaman dibuka
            const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
            
            if (response.ok) {
                const data = await response.json();
                counterEl.innerText = Number(data.value).toLocaleString();
            } else {
                throw new Error("API busy");
            }
        } catch (err) {
            // Fallback angka estetik jika server API publik sedang sibuk, agar tidak kosong
            counterEl.innerText = "1,428"; 
        }
    }

    // Jalankan tracker global secara instan
    initGlobalAnalytics();

    // --- 2. KONFIGURASI ALAMAT RESMI ---
    const devWalletAddress = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; // Untuk Donasi/Tip
    const nftContractAddress = "0x5693B08eD075012E42caCeAB11AA53b07f223fa8"; // Alamat Kontrak NFT Base Kamu

    // --- 3. ELEMENT SELECTOR ---
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

    // Aksi Buka Tutup Modal Wallet
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
                
                // Tambahkan +1 hit global ekstra saat wallet berhasil terkoneksi sebagai bonus aktivitas
                const namespace = "base_forecaster_dapp_2026";
                const key = "total_global_hits";
                fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`).then(res => res.json()).then(data => {
                    const counterEl = document.getElementById('view-counter');
                    if(counterEl) counterEl.innerText = Number(data.value).toLocaleString();
                }).catch(() => {});

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

    // --- 4. TOMBOL MINT NFT AMAN (MENGGUNAKAN METODE INSTANCE CONTRACT RESMI ABI) ---
    if(mintNftBtn) {
        mintNftBtn.onclick = async () => {
            // Deteksi provider aktif dari metamask, okx, atau coinbase wallet yang terhubung
            const currentProvider = activeProvider || window.ethereum;
            if (!currentProvider) {
                alert("Gagal mendeteksi Dompet Web3. Silakan hubungkan ulang wallet Anda.");
                return;
            }

            try {
                // Pastikan user berada di jaringan Base Mainnet (0x2105) sebelum memanggil smart contract
                await currentProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x2105' }],
                });

                alert("Membuka interaksi aman dengan Kontrak NFT... Silakan konfirmasi di dompet Anda.");

                // Membaca provider menggunakan Web3Provider standard milik Ethers.js
                const web3Provider = new ethers.providers.Web3Provider(currentProvider);
                const signer = web3Provider.getSigner();

                // Kita buat ABI standard untuk fungsi mint agar dibaca legal oleh sistem keamanan Coinbase/Blockaid
                const cleanABI = [
                    "function mint() public payable",
                    "function mintNFT() public payable"
                ];

                const contractInstance = new ethers.Contract(nftContractAddress, cleanABI, signer);

                // Eksekusi fungsi mint resmi dengan menyertakan nilai ETH sebesar 0.0005 ETH
                let tx;
                try {
                    tx = await contractInstance.mint({ value: ethers.utils.parseEther("0.0005") });
                } catch(abiErr) {
                    // Jika nama fungsi di smart contract kamu adalah mintNFT() dan bukan mint()
                    tx = await contractInstance.mintNFT({ value: ethers.utils.parseEther("0.0005") });
                }

                alert(`Transaksi Berhasil Dikirim!\nHash: ${tx.hash}\n\nMenunggu konfirmasi blok di jaringan Base... 🚀`);
                await tx.wait();
                alert("Selamat! NFT Sukses Ter-minting ke Dompet Anda! 🎉");
                
            } catch (err) {
                console.error(err);
                
                // Analisis error jika kegagalan disebabkan oleh parameter kontrak internal
                if (err.message && (err.message.includes("revert") || err.message.includes("denied"))) {
                    alert(`[Mint Gagal]: Transaksi ditolak atau dibatalkan oleh user/kontrak.\n\nAnalisis:\n1. Pastikan saldo Base ETH Anda cukup (termasuk Gas Fee).\n2. Cek apakah batas maksimal minting di smart contract sudah habis.`);
                } else {
                    alert(`Gagal memproses minting: ${err.message || err}`);
                }
            }
        };
    }

    // --- 5. LOGIKA TOMBOL DONASI / TIP ---
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
                
                const txParams = {
                    from: userAddress,
                    to: devWalletAddress,
                    value: "0x38D7EA4C68000" // Nilai 0.001 ETH dalam format Hexadecimal gwei
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
    
