document.addEventListener('DOMContentLoaded', async () => {
    const connectBtn = document.getElementById('connect-btn');
    const walletSection = document.getElementById('wallet-section');
    const resultSection = document.getElementById('result-section');
    
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

    // Project ID Publik WalletConnect v2 (Siap pakai untuk demo/produksi statis)
    const projectId = '8e6b5ffdcbc9794bf9f448ea2361483b'; 

    let signClient;
    let walletConnectModal;

    // Inisialisasi Klien Utama WalletConnect & Jendela UI Modal
    async function initWalletConnect() {
        try {
            signClient = await window.SignClient.init({
                projectId: projectId,
                metadata: {
                    name: 'Base Forecaster',
                    description: "Your Wallet's Hexadecimal Destiny",
                    url: window.location.origin,
                    icons: ['https://avatars.githubusercontent.com/u/37784886']
                }
            });

            walletConnectModal = new window.WalletConnectModal.WalletConnectModal({
                projectId: projectId,
                chains: ['eip155:8453'], // Mengunci relasi jaringan ke Base Network
                themeMode: 'dark'
            });

            // Deteksi jika sesi lama masih tersimpan aktif di browser
            const sessions = signClient.session.getAll();
            if (sessions.length > 0) {
                const session = sessions[0];
                const address = session.namespaces.eip155.accounts[0].split(':')[2];
                handleWalletConnected(address);
            }
        } catch (err) {
            console.error("Gagal inisialisasi WalletConnect:", err);
        }
    }

    async function handleConnect() {
        // A. JALUR SHORTCUT: Jika dibuka langsung di dalam DApp Browser Dompet (OKX/MetaMask)
        const injectedProvider = window.ethereum || (window.okxwallet && window.okxwallet.ethereum);
        if (injectedProvider) {
            try {
                connectBtn.innerHTML = `<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Connecting...`;
                const accounts = await injectedProvider.request({ method: 'eth_requestAccounts' });
                handleWalletConnected(accounts[0]);
                return;
            } catch (e) {
                console.log("Injected connect diabaikan, dialihkan ke Modal Universal.");
            }
        }

        // B. JALUR UTAMA (UNIVERSAL): Di Google Chrome Biasa / Safari HP
        if (!signClient || !walletConnectModal) {
            alert("Sistem sedang memuat modul, mohon tekan kembali tombol dalam 2 detik, boss!");
            return;
        }

        try {
            connectBtn.innerHTML = `<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Loading Modal...`;

            // Membuat pengaitan handshake urutan kamar koneksi (Protokol WC v2)
            const { uri, approval } = await signClient.connect({
                requiredNamespaces: {
                    eip155: {
                        methods: ['eth_sendTransaction', 'personal_sign'],
                        chains: ['eip155:8453'], // Paksa Hanya untuk Base Network
                        events: ['chainChanged', 'accountsChanged']
                    }
                }
            });

            if (uri) {
                // Buka Jendela Modal Pilihan Dompet (Akan memunculkan daftar ratusan dompet kripto)
                await walletConnectModal.openModal({ uri });

                // Menunggu persetujuan koneksi dari aplikasi dompet yang dipilih user di HP
                const session = await approval();
                const address = session.namespaces.eip155.accounts[0].split(':')[2];
                
                // Tutup jendela modal secara otomatis setelah disetujui
                walletConnectModal.closeModal();
                handleWalletConnected(address);
            }
        } catch (error) {
            console.error("User membatalkan koneksi atau timeout:", error);
            walletConnectModal.closeModal();
            connectBtn.innerHTML = `<span>🔌</span> Connect Wallet`;
        }
    }

    function handleWalletConnected(walletAddress) {
        walletSection.innerHTML = `
            <div class="bg-slate-950 border border-blue-500/30 p-3 rounded-2xl text-[11px] text-blue-400 font-mono flex justify-between items-center w-full">
                <span>Connected: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}</span>
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
        `;
        generatePrediction(walletAddress);
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

    // Jalankan inisialisasi modul di latar belakang saat web siap
    await initWalletConnect();

    connectBtn.addEventListener('click', handleConnect);
});
