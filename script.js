// ==========================================
// 1. DYNAMIC REAL-TIME FOMO ACTIVITY FEED
// ==========================================
const fomoWallets = ['0x71C...8a9', '0x3F2...b1c', '0x9eA...45d', '0x21b...99a', '0x6Dd...e4f', '0x88A...11b', '0xbcE...72d'];
const fomoFates = ['THE WHALE ASCENDANT 🐋', 'PAPER HANDS REFUGEE 📄', 'DIAMOND CLAW GENIUS 💎', 'RUGPULL SURVIVOR 🛡️', 'GAS FEE MILLIONAIRE ⛽', 'MEMECOIN PROPHET 📈'];

function triggerLiveFomoNotification() {
    const notifElement = document.getElementById('live-notification');
    const notifText = document.getElementById('live-notif-text');
    
    if (!notifElement || !notifText) return;

    // Ambil data acak
    const randomWallet = fomoWallets[Math.floor(Math.random() * fomoWallets.length)];
    const randomFate = fomoFates[Math.floor(Math.random() * fomoFates.length)];
    
    notifText.innerHTML = `<strong class="text-blue-400">${randomWallet}</strong> just minted their Destiny NFT!<br>Fate: <span class="text-amber-400 font-bold">${randomFate}</span>`;
    
    // Animasikan Pop Up Muncul
    notifElement.classList.remove('hidden');
    setTimeout(() => {
        notifElement.style.transform = 'translateY(0)';
        notifElement.style.opacity = '1';
    }, 100);

    // Sembunyikan kembali setelah 4 detik
    setTimeout(() => {
        notifElement.style.transform = 'translateY(-100px)';
        notifElement.style.opacity = '0';
        setTimeout(() => {
            notifElement.classList.add('hidden');
        }, 500);
    }, 4000);
}

// Jalankan Loop Notifikasi Palsu secara periodik setiap 12-18 detik sekali agar natural
setInterval(triggerLiveFomoNotification, Math.floor(Math.random() * (18000 - 12000 + 1)) + 12000);
// Trigger pertama kali 3 detik setelah halaman di-load
setTimeout(triggerLiveFomoNotification, 3000);


// ==========================================
// 2. PREMIUM MINT SUCCESS CELEBRATION (CONFETTI)
// ==========================================
function triggerPremiumConfetti() {
    // Ledakan confetti sisi kiri
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: ['#2563eb', '#38bdf8', '#fbbf24'] // Warna Tema Base & Gold
    });
    
    // Ledakan confetti sisi kanan
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: ['#2563eb', '#38bdf8', '#fbbf24']
    });
}

// INTEGRASIKAN KODE CONFETTI KE DALAM TOMBOL MINT ANDA
// Cari fungsi onclick / event listener button "mint-nft-btn" di script.js lama Anda, lalu pastikan struktur internalnya memanggil pemicu di bawah ini:
const mintButton = document.getElementById('mint-nft-btn');
if(mintButton) {
    mintButton.addEventListener('click', function() {
        // ... Jalankan Kode Transaksi Kontrak Anda ...
        // Contoh implementasi di dalam blockchain callback onSuccess:
        // onSuccess: (hash) => {
        //     console.log("Transaction sent:", hash);
               
               // Panggil animasi kembang api perayaan
               triggerPremiumConfetti();
               
               // Tambah angka counter minting secara dinamis
               const counterEl = document.getElementById('mint-counter');
               if(counterEl) {
                   let currentCount = parseInt(counterEl.innerText) || 2791;
                   counterEl.innerText = currentCount + 1;
               }
        // }
    });
}
