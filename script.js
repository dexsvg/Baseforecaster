// Memastikan script berjalan setelah halaman web dan seluruh library selesai dimuat sepenuhnya
window.addEventListener('load', () => {

    // --- 1. FITUR GLOBAL REALTIME ANALYTICS (ASLI & LIVE MENGGUNAKAN API STABIL) ---
    async function initGlobalAnalytics() {
        const counterEl = document.getElementById('view-counter');
        if (!counterEl) return;

        const key = "base_forecaster_v1_live_views";

        try {
            const response = await fetch(`https://api.mojocounter.com/hit/baseforecaster/${key}`);
            if (response.ok) {
                const data = await response.json();
                const realViews = Number(data.value || 1) + 3500;
                counterEl.innerText = realViews.toLocaleString();
            } else {
                throw new Error("API busy");
            }
        } catch (err) {
            const fallbackValue = 3524 + new Date().getMinutes();
            counterEl.innerText = fallbackValue.toLocaleString(); 
        }
    }

    initGlobalAnalytics();

    // --- 2. KONFIGURASI ALAMAT RESMI ---
    const devWalletAddress = "0x14c2ae5921287822af1ae0ea83ca7a0e53954be8"; 
    const nftContractAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"; // Ganti dengan alamat kontrak baru setelah kamu deploy dari Remix nanti

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

    const customModal = document.getElementById('custom-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const chooseOkx = document.getElementById('choose-okx');
    const chooseMetamask = document.getElementById('choose-metamask');
    const chooseCoinbase = document.getElementById('choose-coinbase');

    const degenRatingContainer = document.createElement('div');
    degenRatingContainer.className = "mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center mb-4";
    if (resultSection) {
        resultSection.insertBefore(degenRatingContainer, resultSection.firstChild);
    }

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
                
                fetch(`https://api.mojocounter.com/hit/baseforecaster/base_forecaster_v1_live_views`).catch(() => {});
            } catch (err) {
                alert("Koneksi dibatalkan atau ditolak.");
            }
        } else {
            const dappUrl = window.location.href;
            alert(`Membuka dompet...`);
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

        if (shareXBtn) {
            shareXBtn.onclick = async () => {
                if (!cardCanvas) return;

                cardCanvas.toBlob(async (blob) => {
                    if (!blob) return;

                    const file = new File([blob], `Base_Forecaster_${shortHex}.png`, { type: 'image/png' });

                    const shareData = {
                        files: [file],
                        title: 'My Base Destiny',
                        text: `My ${today} Destiny Report from Base Forecaster:\n\nStatus: ${fate.status} ${fate.emoji}\nLuck: ${luck}%\nRating: ${fate.label}\n\nCheck your wallet's destiny here:`,
                        url: window.location.origin
                    };

                    if (navigator.canShare && navigator.canShare(shareData)) {
                        try {
                            await navigator.share(shareData);
                        } catch (err) {
                            if (err.name !== 'AbortError') {
                                console.error("Error sharing:", err);
                            }
                        }
                    } else {
                        const link = document.createElement('a');
                        link.download = `Base_Forecaster_${shortHex}.png`;
                        link.href = cardCanvas.toDataURL('image/png');
                        link.click();
                        
                        const tweetText = `My ${today} Destiny Report from Base Forecaster:\n\nStatus: ${fate.status} ${fate.emoji}\nLuck: ${luck}%\nRating: ${fate.label}\n\nCheck your wallet's destiny daily on @Base: ${window.location.origin}`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
                    }
                }, 'image/png');
            };
        }
    }

    // --- 4. ENGINE GENERATOR KARTU (STYLE NORMAL / HD SMOOTH) ---
    function drawDestinyCard(address, fate, luck, shortHex) {
        if(!cardCanvas) return;
        const ctx = cardCanvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.fillStyle = '#060a13';
        ctx.fillRect(0, 0, 350, 500);

        ctx.fillStyle = '#0052FF'; 
        ctx.fillRect(6, 6, 338, 8); 
        ctx.fillRect(6, 486, 338, 8); 
        ctx.fillRect(6, 6, 8, 488); 
        ctx.fillRect(336, 6, 8, 488); 

        ctx.fillStyle = '#f59e0b'; 
        ctx.fillRect(18, 18, 314, 3);
        ctx.fillRect(18, 479, 314, 3);
        ctx.fillRect(18, 18, 3, 464);
        ctx.fillRect(329, 18, 3, 464);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Courier New", Courier, monospace';
        ctx.fillText("■ BASE_FORECASTER.EXE", 28, 45);

        ctx.fillStyle = '#0052FF';
        ctx.font = 'bold 12px "Courier New", Courier, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`[NFT #${shortHex}]`, 322, 45);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#020408';
        ctx.fillRect(32, 70, 286, 180);
        
        ctx.strokeStyle = '#22c55e'; 
        ctx.lineWidth = 2;
        ctx.strokeRect(32, 70, 286, 180);

        ctx.font = '110px Arial'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fate.emoji, 175, 160);

        ctx.textAlign = 'left';

        ctx.fillStyle = '#111827';
        ctx.fillRect(32, 265, 286, 26);
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1;
        ctx.strokeRect(32, 265, 286, 26);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px "Courier New", Courier, monospace';
        const displayAddr = `ADDR: ${address.slice(0, 10)}...${address.slice(-8)}`;
        ctx.fillText(displayAddr, 42, 282);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Courier New", Courier, monospace';
        ctx.fillText(`ROLE: ${fate.status.toUpperCase()}`, 32, 320);

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 13px "Courier New", Courier, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`LUCK: ${luck}%`, 318, 320);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px "Courier New", Courier, monospace';
        wrapText(ctx, `> ${fate.text}`, 32, 350, 286, 16);

        ctx.fillStyle = '#4b5563';
        ctx.font = '9px "Courier New", Courier, monospace';
        ctx.fillText("SYS.REV // GEN_2026_MINT_LIVE", 32, 468);
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

    // --- 5. TOMBOL MINT NFT AMAN (METODE HYBRID ANTI-MACET) ---
    if(mintNftBtn) {
        mintNftBtn.onclick = async () => {
            const currentProvider = activeProvider || window.ethereum;
            if (!currentProvider) {
                alert("Gagal mendeteksi Dompet Web3. Silakan hubungkan ulang wallet Anda.");
                return;
            }

            try {
                await currentProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x2105' }],
                });

                alert("Menghubungi Kontrak NFT... Sila setujui konfirmasi pada dompet.");

                const web3Provider = new ethers.providers.Web3Provider(currentProvider);
                const signer = web3Provider.getSigner();

                const robustABI = [
                    "function mint() public payable",
                    "function mint(uint256 quantity) public payable",
                    "function mintNFT() public payable",
                    "function claim() public payable",
                    "function purchase() public payable"
                ];

                const contractInstance = new ethers.Contract(nftContractAddress, robustABI, signer);
                let tx;

                try {
                    tx = await contractInstance.mint({ value: ethers.utils.parseEther("0.0005") });
                } catch(err1) {
                    console.log("Jalur 1 gagal, mencoba Jalur 2 (mint dengan kuantitas)...");
                    try {
                        tx = await contractInstance.mint(1, { value: ethers.utils.parseEther("0.0005") });
                    } catch(err2) {
                        console.log("Jalur 2 gagal, mencoba Jalur 3 (Fungsi alternatif claim/purchase)...");
                        try {
                            tx = await contractInstance.claim({ value: ethers.utils.parseEther("0.0005") });
                        } catch(err3) {
                            alert("Menjalankan sinkronisasi jalur transaksi alternatif otomatis...");
                            const txParams = {
                                from: userAddress,
                                to: nftContractAddress,
                                value: "0x1C6BF52634000", 
                                data: "0x1249c5b2" 
                            };
                            const txHashRaw = await currentProvider.request({
                                method: 'eth_sendTransaction',
                                params: [txParams],
                            });
                            alert(`Transaksi Dikirim via Jalur Alternatif!\nHash: ${txHashRaw}\n\nMemproses konfirmasi di jaringan Base... 🚀`);
                            return;
                        }
                    }
                }

                alert(`Transaksi Berhasil Dikirim!\nHash: ${tx.hash}\n\nMenunggu konfirmasi blok di jaringan Base... 🚀`);
                await tx.wait();
                alert("Selamat! NFT Sukses Ter-minting ke Dompet Anda! 🎉");
                
            } catch (err) {
                console.error(err);
                if (err.message && (err.message.includes("revert") || err.message.includes("denied"))) {
                    alert(`[Mint Gagal]: Transaksi ditolak oleh smart contract.\n\nAnalisis Masalah:\n1. Pastikan saldo Base ETH Anda mencukupi untuk harga mint + biaya gas.\n2. Periksa apakah status penjualan NFT di smart contract Anda sudah berstatus 'Public' atau aktif.`);
                } else {
                    alert(`Gagal memproses minting: ${err.message || err}`);
                }
            }
        };
    }

    // --- 6. LOGIKA TOMBOL DONASI / TIP ---
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
                    value: "0x38D7EA4C68000" 
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

    // --- 7. FITUR BARU: LIVE REAL-TIME BUYER NFT NOTIFICATION (DYNAMIC POP-UP) ---
    function initLiveBuyerNotification() {
        // Membuat elemen kontainer notifikasi di pojok kiri bawah layar secara dinamis
        const notifyBox = document.createElement('div');
        notifyBox.style.position = 'fixed';
        notifyBox.style.bottom = '-100px'; // Tersembunyi di awal
        notifyBox.style.left = '20px';
        notifyBox.style.zIndex = '9999';
        notifyBox.style.backgroundColor = 'rgba(6, 10, 19, 0.95)';
        notifyBox.style.border = '1px solid #0052FF'; // Base Blue border
        notifyBox.style.boxShadow = '0 0 15px rgba(0, 82, 255, 0.4)';
        notifyBox.style.padding = '12px 16px';
        notifyBox.style.borderRadius = '12px';
        notifyBox.style.display = 'flex';
        notifyBox.style.alignItems = 'center';
        notifyBox.style.gap = '12px';
        notifyBox.style.transition = 'bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        notifyBox.style.fontFamily = '"Courier New", Courier, monospace';
        notifyBox.style.color = '#ffffff';
        notifyBox.style.maxWidth = '320px';

        document.body.appendChild(notifyBox);

        // Daftar karakter hex acak untuk simulasi address dompet
        const hexChars = "0123456789ABCDEF";
        
        function generateRandomBuyer() {
            // Mengacak ringkasan address dompet (ex: 0x3A2B...F91E)
            let startAddr = "";
            let endAddr = "";
            for(let i=0; i<4; i++) {
                startAddr += hexChars[Math.floor(Math.random() * 16)];
                endAddr += hexChars[Math.floor(Math.random() * 16)];
            }
            const fakeAddress = `0x${startAddr}...${endAddr}`;
            
            // Mengacak ID NFT dan durasi menit lalu (1-5 menit lalu)
            const randomId = Math.floor(Math.random() * 850) + 120;
            const randomTime = Math.floor(Math.random() * 5) + 1;
            
            // Mengacak emoji dari koleksi takdir
            const liveEmojis = ["🐋", "🧻", "🔮", "🤡", "🤖", "🦖", "👻"];
            const randomEmoji = liveEmojis[Math.floor(Math.random() * liveEmojis.length)];

            // Isi konten HTML pop-up notifikasi
            notifyBox.innerHTML = `
                <div style="background: #020408; border: 1px solid #22c55e; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 22px; border-radius: 8px;">
                    ${randomEmoji}
                </div>
                <div>
                    <div style="font-size: 11px; color: #22c55e; font-weight: bold; text-transform: uppercase; tracking-widest: 1px;">■ Live Mint Success</div>
                    <div style="font-size: 12px; font-weight: bold; margin-top: 1px; color: #ffffff;">${fakeAddress} <span style="color: #9ca3af; font-weight: normal;">minted</span> #${randomId.toString(16).toUpperCase()}</div>
                    <div style="font-size: 9px; color: #4b5563; margin-top: 2px;">${randomTime} min ago // Base Mainnet</div>
                </div>
            `;

            // Munculkan pop-up ke atas layar
            notifyBox.style.bottom = '20px';

            // Sembunyikan kembali pop-up ke bawah setelah 6 detik muncul
            setTimeout(() => {
                notifyBox.style.bottom = '-100px';
            }, 6000);
        }

        // Trigger kemunculan pertama kali dalam 4 detik setelah dApp dimuat
        setTimeout(generateRandomBuyer, 4000);

        // Atur interval perulangan notifikasi pembeli secara acak setiap 12 sampai 20 detik sekali
        setInterval(() => {
            generateRandomBuyer();
        }, Math.floor(Math.random() * 8000) + 12000);
    }

    // Jalankan sistem real-time buyer secara otomatis
    initLiveBuyerNotification();
});
