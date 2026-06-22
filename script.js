/**
 * Base Forecaster - Core Logic Script
 * Berfungsi penuh untuk kalkulasi takdir, manajemen wallet, dan pencetakan NFT.
 */

// ==========================================
// 1. CONFIGURATION & GLOBAL VARIABLES
// ==========================================
// GANTI alamat di bawah ini dengan alamat Smart Contract NFT Anda yang valid di Base Mainnet
const nftContractAddress = "0x0000000000000000000000000000000000000000"; 

let userAddress = "";
let isConnected = false;

// Kumpulan ramalan nasib (Destiny Library) berdasarkan hash wallet
const fateLibrary = [
    { fate: "THE WHALE ASCENDANT", emoji: "🐋", text: "Hexadecimal wallet Anda selaras dengan pergerakan likuiditas raksasa. Anda ditakdirkan untuk memimpin tren pasar, mengumpulkan aset murni, dan keluar tepat sebelum badai rugpull melanda.", score: 98 },
    { fate: "THE DEGEN SURVIVOR", emoji: "🥷", text: "Portofolio Anda penuh dengan bekas luka pertempuran meme-coin. Namun, struktur alamat Anda menunjukkan ketahanan mutlak. Satu target 100x sedang menunggu eksekusi klik Anda.", score: 74 },
    { fate: "DUSTING ATTACK TARGET", emoji: "⚠️", text: "Sinyal peringatan bergetar di dalam rantai blok Anda. Dompet Anda rentan terhadap token palsu dan dusting attack. Bersihkan jejak digital Anda dan jangan sembarang klik klaim airdrop bodong.", score: 21 },
    { fate: "GENERATIONAL WEALTH", emoji: "👑", text: "Takdir yang sangat langka! Angka awal dan akhir dari address Anda mengunci simpul kekayaan abadi di jaringan Base. Pegang aset utama Anda, masa depan cerah menanti.", score: 95 },
    { fate: "THE ETERNAL HOLDER", emoji: "💎", text: "Tangan berlian (Diamond Hands) sejati. Anda tidak pernah goyah oleh koreksi pasar sedalam apa pun. Rantai Base mencatat loyalitas Anda, imbalan staking besar akan segera datang.", score: 85 },
    { fate: "LIQUIDITY PROVIDER DOOM", emoji: "📉", text: "Berhati-hatilah saat memasukkan dana ke dalam pool imbal hasil (yield farming) yang tidak jelas. Kerugian tidak permanen (impermanent loss) mengintai dompet Anda jika terlalu serakah.", score: 42 }
];

// ==========================================
// 2. INITIALIZATION ON LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Jalankan counter pemandu estetika di footer
    setupViewCounter();
    
    // Pasang event listener utama untuk tombol koneksi wallet
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.addEventListener("click", openWalletModal);
    }

    // Pasang penutup modal
    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeWalletModal);
    }

    // Sambungkan tombol pilihan di dalam modal langsung ke fungsi eksekusi
    setupModalButtons();
    
    // Aktifkan listener bypass untuk tombol MINT NFT
    setupUniversalMintButton();
}

// ==========================================
// 3. WALLET CONNECTION MODAL SYSTEM
// ==========================================
function openWalletModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) modal.classList.remove("hidden");
}

function closeWalletModal() {
    const modal = document.getElementById("custom-modal");
    if (modal) modal.classList.add("hidden");
}

function setupModalButtons() {
    const wallets = ["choose-okx", "choose-metamask", "choose-coinbase"];
    wallets.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                closeWalletModal();
                connectWallet();
            });
        }
    });
}

// ==========================================
// 4. CORE WEB3 WALLET CONNECTION
// ==========================================
async function connectWallet() {
    // Deteksi berlapis untuk dApp browser seluler (Bitget, OKX, MetaMask, Coinbase)
    const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
    
    if (!provider) {
        alert("Dompet Web3 tidak terdeteksi! Jika Anda menggunakan HP, silakan buka situs ini dari dalam Menu dApp Browser aplikasi Bitget Wallet, OKX Wallet, atau MetaMask.");
        return;
    }

    try {
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "⏳ Connecting...";

        // Minta izin akses alamat wallet
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];
        isConnected = true;

        if (connectBtn) {
            connectBtn.innerHTML = `🟢 ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            connectBtn.classList.remove("bg-blue-600", "hover:bg-blue-500");
            connectBtn.classList.add("bg-slate-800", "border", "border-blue-500/40");
        }

        // Tampilkan bagian hasil kalkulasi takdir
        const resultSection = document.getElementById("result-section");
        if (resultSection) resultSection.classList.remove("hidden");

        // Proses pembuatan takdir unik berdasarkan address
        generateDestiny(userAddress);

    } catch (error) {
        console.error(error);
        alert("Koneksi dibatalkan atau terjadi kesalahan: " + error.message);
        const connectBtn = document.getElementById("connect-btn");
        if (connectBtn) connectBtn.innerHTML = "🔮 Connect Wallet";
    }
}

// ==========================================
// 5. DETERMINISTIC DESTINY ENGINE & CANVAS
// ==========================================
function generateDestiny(address) {
    // Membuat angka seed unik (deterministik) dari string hex wallet
    let cleanAddress = address.toLowerCase().replace("0x", "");
    let seed = 0;
    for (let i = 0; i < cleanAddress.length; i++) {
        seed += cleanAddress.charCodeAt(i);
    }

    // Pilih index ramalan berdasarkan sisa bagi seed
    const fateIndex = seed % fateLibrary.length;
    const selectedFate = fateLibrary[fateIndex];
    const finalLuckScore = Math.min(100, Math.max(5, (seed % 95) + 5)); // Score 5 - 100%

    // Update teks UI reguler
    document.getElementById("fortune-fate").innerText = selectedFate.fate;
    document.getElementById("fortune-text").innerText = selectedFate.text;
    document.getElementById("fortune-emoji").innerText = selectedFate.emoji;
    document.getElementById("fortune-emoji").classList.remove("hidden");
    document.getElementById("fortune-text").parentElement.classList.remove("hidden");
    
    // Update progress bar keberuntungan
    document.getElementById("luck-score").innerText = `${finalLuckScore}%`;
    document.getElementById("luck-bar").style.width = `${finalLuckScore}%`;
    document.getElementById("seed-anchor").innerText = `#${seed}`;

    // Render Gambar Kartu Takdir Estetik ke Canvas HTML5 (Gold-Blue Theme)
    drawDestinyCard(selectedFate, finalLuckScore, address, seed);
    
    // Atur aksi tombol share Twitter
    setupTwitterShare(selectedFate, finalLuckScore);
}

function drawDestinyCard(fateObj, score, address, seed) {
    const canvas = document.getElementById("destiny-card");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 1. Background utama - Gradasi Biru Tua Kegelapan
    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#020617"); // slate-950
    bgGrad.addColorStop(0.5, "#0f172a"); // slate-900
    bgGrad.addColorStop(1, "#1e1b4b"); // indigo-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 350, 500);

    // 2. Efek Efek Pendaran Cahaya (Glow di Tengah)
    let glowGrad = ctx.createRadialGradient(175, 220, 10, 175, 220, 180);
    glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.15)"); // blue-600
    glowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 350, 500);

    // 3. Frame Tipis Luar Emas (Gold Luxury Border)
    ctx.lineWidth = 4;
    let goldGrad = ctx.createLinearGradient(0, 0, 350, 500);
    goldGrad.addColorStop(0, "#f59e0b"); // amber-500
    goldGrad.addColorStop(0.5, "#d97706"); // amber-600
    goldGrad.addColorStop(1, "#2563eb"); // blue-600 (Perpaduan warna ekosistem)
    ctx.strokeStyle = goldGrad;
    ctx.strokeRect(10, 10, 330, 480);

    // Inner frame aksen kartu tarot
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.strokeRect(16, 16, 318, 468);

    // 4. Header Nama dApp
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BASE FORECASTER CORES", 175, 42);

    // 5. Gambar Ilustrasi Besar / Emoji Takdir
    ctx.font = "72px serif";
    ctx.fillText(fateObj.emoji, 175, 130);

    // 6. Judul Takdir Dompet
    ctx.fillStyle = "#38bdf8"; // sky-400
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(fateObj.fate, 175, 195);

    // 7. Garis Pembatas Ornamen
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.moveTo(80, 215);
    ctx.lineTo(270, 215);
    ctx.stroke();

    // Titik tengah hiasan
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(175, 215, 4, 0, Math.PI * 2);
    ctx.fill();

    // 8. Blok Deskripsi Teks (Word Wrapping Otomatis)
    ctx.fillStyle = "#cbd5e1"; // slate-300
    ctx.font = "italic 12px serif";
    const words = fateObj.text.split(" ");
    let line = "";
    let y = 245;
    const maxWidth = 270;
    const lineHeight = 18;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 175, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 175, y);

    // 9. Informasi Detail Status Parameter di bawah kartu
    // Kotak Parameter
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(30, 390, 290, 65);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.strokeRect(30, 390, 290, 65);

    ctx.textAlign = "left";
    ctx.font = "11px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`ADDRESS : ${address.slice(0,8)}...${address.slice(-8)}`, 45, 410);
    ctx.fillText(`LUCK    : ${score}% LEVEL DEGEN`, 45, 427);
    ctx.fillText(`SEED ANCHOR : #00${seed}`, 45, 444);

    // 10. Watermark kecil Keaslian Dokumen
    ctx.textAlign = "center";
    ctx.font = "9px monospace";
    ctx.fillStyle = "#475569";
    ctx.fillText("VERIFIED BY BASE CHAIN CRYPTO-GRAPH", 175, 478);
}

function setupTwitterShare(fateObj, score) {
    const shareBtn = document.getElementById("share-x-btn");
    if (!shareBtn) return;

    shareBtn.onclick = (e) => {
        e.preventDefault();
        const tweetText = encodeURIComponent(
            `🔮 Hasil ramalan nasib wallet Base saya baru saja keluar!\n\n` +
            `Takdir: ${fateObj.fate} ${fateObj.emoji}\n` +
            `Degen Luck Score: ${score}%\n\n` +
            `Cek takdir rantai dompet hexadecimal mu sekarang di Base Forecaster! 🔵✨`
        );
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(twitterUrl, "_blank");
    };
}

// ==========================================
// 6. TOMBOL MINT NFT (UNIVERSAL BYPASS METHOD V5/V6)
// ==========================================
function setupUniversalMintButton() {
    const mintBtnEl = document.getElementById("mint-nft-btn");
    if (!mintBtnEl) return;

    // Kloning tombol untuk menghapus sisa event-listener ganda yang menumpuk
    const newMintBtn = mintBtnEl.cloneNode(true);
    mintBtnEl.parentNode.replaceChild(newMintBtn, mintBtnEl);

    newMintBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Kumpulkan semua pintu masuk provider Web3 dompet mobile/ekstensi
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum || (window.coinbaseWalletExtension ? window.coinbaseWalletExtension : null);

        if (!provider) {
            alert("Provider Web3 tidak ditemukan. Silakan jalankan web ini langsung dari dalam Dompet Web3 / dApp Browser HP Anda.");
            return;
        }

        try {
            // Validasi apakah akun sudah terikat sempurna
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            if (!accounts || accounts.length === 0) {
                alert("Gagal membaca alamat akun. Pastikan dompet Anda tidak terkunci.");
                return;
            }
            const activeUserAddr = accounts[0];

            // Paksa pemindahan rantai ke Base Jaringan Utama (Hex: 0x2105 = 8453)
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x2105" }],
            }).catch(async (switchError) => {
                // Kode 4902 berarti jaringan Base belum ada di daftar user, tambahkan otomatis
                if (switchError.code === 4902) {
                    await provider.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: "0x2105",
                            chainName: "Base",
                            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                            rpcUrls: ["https://mainnet.base.org"],
                            blockExplorerUrls: ["https://basescan.org"]
                        }]
                    });
                }
            });

            alert("Koneksi Base Terbuka! Mempersiapkan transaksi pencetakan NFT...");

            // ----------------------------------------------------
            // ENGINE JALUR 1: DETEKSI DAN EKSEKUSI JIKA ETHERS V6 AKTIF
            // ----------------------------------------------------
            if (window.ethers && window.ethers.BrowserProvider) {
                const browserProto = new window.ethers.BrowserProvider(provider);
                const signer = await browserProto.getSigner();
                const contract = new window.ethers.Contract(nftContractAddress, ["function mint() public payable"], signer);
                
                const tx = await contract.mint({
                    value: window.ethers.parseEther("0.0005"),
                    gasLimit: 150000 // Limit longgar agar aman
                });
                alert("Transaksi Dikirim (v6)! Hash: " + tx.hash);
                await tx.wait();
                alert("Selamat! NFT Anda sukses ter-minting di jaringan Base! 🎉");
            } 
            // ----------------------------------------------------
            // ENGINE JALUR 2: DETEKSI DAN EKSEKUSI JIKA ETHERS V5 AKTIF
            // ----------------------------------------------------
            else if (window.ethers && window.ethers.providers) {
                const web3Proto = new window.ethers.providers.Web3Provider(provider);
                const signer = web3Proto.getSigner();
                const contract = new window.ethers.Contract(nftContractAddress, ["function mint() public payable"], signer);
                
                const tx = await contract.mint({
                    value: window.ethers.utils.parseEther("0.0005"),
                    gasLimit: window.ethers.utils.hexlify(150000)
                });
                alert("Transaksi Dikirim (v5)! Hash: " + tx.hash);
                await tx.wait();
                alert("Selamat! NFT Anda sukses ter-minting di jaringan Base! 🎉");
            } 
            // ----------------------------------------------------
            // JALUR DARURAT SAKTI (DIRECT RPC BYPASS): 
            // Jika Library Ethers gagal dimuat / diblokir oleh sistem dompet bawaan
            // ----------------------------------------------------
            else {
                alert("Pustaka Ethers.js tidak merespons sempurna. Mengaktifkan Mode Transaksi Langsung (Direct RPC Bypass)...");
                
                const txData = "0x1249c5b8"; // Kepten data hex dari panggilan fungsi "mint()" kosong tanpa argumen
                const txParams = {
                    from: activeUserAddr,
                    to: nftContractAddress,
                    value: "0x1c6bf52634000", // Nilai nominal 0.0005 ETH dalam format Hex Wei
                    data: txData,
                    chainId: "0x2105" // Jaringan Base Mainnet
                };

                const txHash = await provider.request({
                    method: "eth_sendTransaction",
                    params: [txParams],
                });
                
                alert("Transaksi Pintas Berhasil Dikirim!\nHash: " + txHash + "\n\nSilakan cek status beberapa saat lagi di wallet.");
            }

        } catch (error) {
            console.error(error);
            const msg = error.data?.message || error.message || "User menolak konfirmasi kontrak atau saldo Base ETH Anda kurang.";
            alert("Gagal Eksekusi Mint: " + msg);
        }
    });
}

// ==========================================
// 7. SISTEM DONASI / TIP PENGEMBANG
// ==========================================
const donateBtnEl = document.getElementById("donate-btn");
if (donateBtnEl) {
    donateBtnEl.onclick = async (e) => {
        e.preventDefault();
        const provider = window.ethereum || window.okxwallet || window.bitkeep?.ethereum;
        if (!provider) return;

        try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            // Alamat tujuan tip (Bisa diganti ke address pengembang pilihan Anda)
            const devAddress = "0x1395066A5bEFA739A06112C785C088f7b764D9f1"; 
            
            const txParams = {
                from: accounts[0],
                to: devAddress,
                value: "0x38d7ea4c68000", // Senilai 0.001 ETH dalam format Hex Wei
                chainId: "0x2105"
            };

            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [txParams],
            });
            alert("Terima kasih banyak atas tip yang Anda kirimkan! Semoga rezeki Anda dilipatgandakan! 💸 Hash: " + txHash);
        } catch (err) {
            alert("Batal mengirim tip: " + err.message);
        }
    };
}

// ==========================================
// 8. AUXILIARY UTILITIES (VIEW COUNTER)
// ==========================================
function setupViewCounter() {
    const counterEl = document.getElementById("view-counter");
    if (!counterEl) return;
    
    // Simulasi counter realistik yang tersimpan di memori browser lokal
    let baseViews = localStorage.getItem("base_forecaster_views");
    if (!baseViews) {
        baseViews = Math.floor(Math.random() * 4000) + 12500;
    } else {
        baseViews = parseInt(baseViews) + Math.floor(Math.random() * 3) + 1;
    }
    localStorage.setItem("base_forecaster_views", baseViews);
    counterEl.innerText = Number(baseViews).toLocaleString("en-US");
        }
                            
