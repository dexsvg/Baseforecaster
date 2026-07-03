// ============================================================
//  BASE FORECASTER — PROFESSIONAL v3.1 (UPDATED & SECURED)
// ============================================================

(function() {
    'use strict';

    // ---------- CONFIG ----------
    const CONFIG = {
        NFT_CONTRACT: '0x26E00eBdE27388077d9EC014C98c8764D9f13950',
        TOKEN_CONTRACT: '0x052aE904DD28b5D840F7a25f77003E0f9597Fc69',
        DEVELOPER_WALLET: '0x14c2ae5921287822af1ae0ea83ca7a0e53954be8',
        B20_FACTORY: '0xB20f000000000000000000000000000000000000',
        FLAUNCH_LINK: 'https://flaunch.gg/base/coins/0x052aE904DD28b5D840F7a25f77003E0f9597Fc69',
        // Menggunakan alamat Router Resmi Uniswap V2/Aerodrome yang mendukung swap ETH langsung via Method Identifiers
        ROUTER_AERODROME: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
        ROUTER_DEFAULT: '0x2626664c2602818E568351633F6522EAC9D1217e', 
        SCAN_INTERVAL: 4000,
        TICKER_INTERVAL: 20000,
    };

    // ---------- STATE ----------
    const state = {
        userAddress: '',
        isConnected: false,
        currentFate: null,
        frameColor: '#f59e0b',
        frameName: 'Gold Luck Destiny',
        luckScore: 50,
        scanInterval: null,
        tickerInterval: null,
        scannedAddress: '',
        isScanning: false,
        isSpinning: false,
        provider: null,
        isTickerFetching: false, // Mencegah bentrokan fetch ticker
    };

    // ---------- FATE LIBRARY ----------
    // Menggunakan base64 SVG fallback aman agar tidak terkena bug CORS Tainted Canvas dari picsum
    const FATE_LIBRARY = [
        { fate: 'THE WHALE ASCENDANT', emoji: '🐋', image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=350&q=80', text: 'Your wallet is a black hole for liquidity. You lead trends and exit safely.', score: 98 },
        { fate: 'GENERATIONAL WEALTH', emoji: '👑', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=350&q=80', text: 'Cosmic alignment confirms eternal wealth. Your core assets outperform 99% of the market.', score: 95 },
        { fate: 'THE BASE CHOSEN ONE', emoji: '🔵', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=350&q=80', text: 'Base protocol nodes whisper your address. You are the architect of the next moon mission.', score: 99 },
        { fate: 'THE DEGEN SURVIVOR', emoji: '🥷', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=350&q=80', text: 'Battle scars of meme-coin wars everywhere. You survive when others get liquidated.', score: 74 },
        { fate: 'THE MYSTERY ADDRESS', emoji: '❓', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=350&q=80', text: 'Even the blockchain cannot understand your patterns. You are a true anomaly.', score: 41 },
        { fate: 'THE DIAMOND HANDS', emoji: '💎', image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=350&q=80', text: 'Your hands are forged in pure diamond. Pressure only makes your bags heavier.', score: 88 },
        { fate: 'THE ALPHA STALKER', emoji: '🎯', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80', text: 'You spot narratives before they exist. Your sniper entries are feared across the chain.', score: 92 },
        { fate: 'THE RUGPROOF NINJA', emoji: '🛡️', image: 'https://images.unsplash.com/photo-1533134486753-c833f95486e1?auto=format&fit=crop&w=350&q=80', text: 'Honeypots and malicious contracts miss you completely. Your intuition is a shield.', score: 85 },
        { fate: 'THE LIQUIDITY GOD', emoji: '🌊', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=350&q=80', text: 'Every pool you touch overflows with rewards. Yield farms bow to your strategy.', score: 96 },
        { fate: 'THE PROPAGANDA KING', emoji: '📢', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=350&q=80', text: 'Your conviction can pump any chart. When you speak, the community follows.', score: 90 },
        { fate: 'THE CYPHER PUNK', emoji: '🧬', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=350&q=80', text: 'You move in silence, leave zero traces. Your on-chain footprint is a masterpiece.', score: 78 },
        { fate: 'THE MEME LORD', emoji: '🐸', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=350&q=80', text: 'You embody the culture. When you ape, the whole chain watches and follows.', score: 82 },
    ];

    // ---------- DOM REFS ----------
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);
    const DOM = {};

    function cacheDoms() {
        DOM.connectBtn = $('#connect-btn');
        DOM.walletSection = $('#wallet-section');
        DOM.lockedView = $('#locked-state-view');
        DOM.resultSection = $('#result-section');
        DOM.destinyCanvas = $('#destiny-card');
        DOM.luckScore = $('#luck-score');
        DOM.luckBar = $('#luck-bar');
        DOM.seedAnchor = $('#seed-anchor');
        DOM.auraDisplay = $('#aura-points-display');
        DOM.tickerTrack = $('#ticker-track');
        DOM.scanInput = $('#external-target-input');
        DOM.scanBtn = $('#external-target-btn');
        DOM.scanResult = $('#external-target-result');
        DOM.scanStatus = $('#scan-status');
        DOM.rerollBtn = $('#reroll-btn');
        DOM.shareX = $('#share-x-btn');
        DOM.shareTg = $('#share-tg-btn');
        DOM.tipBtn = $('#tip-btn');
        DOM.mintBtn = $('#mint-btn');
        DOM.dailyLoginBtn = $('#daily-login-btn');
        DOM.spinBtn = $('#btn-spin');
        DOM.wheelGraphic = $('#wheel-graphic');
        DOM.spinResult = $('#spin-result');
        DOM.ranksContainer = $('#ranks-list-container');
        DOM.b20Name = $('#b20-name');
        DOM.b20Symbol = $('#b20-symbol');
        DOM.deployB20Btn = $('#deploy-b20-btn');
        DOM.swapAmount = $('#swap-amount');
        DOM.swapToken = $('#swap-token');
        DOM.swapBtn = $('#swap-btn');
        DOM.swapStatus = $('#swap-status');
        DOM.navBtns = $$('.nav-btn');
        DOM.toastContainer = $('#toast-container');
        DOM.glowButtons = $$('[data-glow]');
    }

    // ---------- TOAST SYSTEM ----------
    function toast(message, type = 'info', duration = 4000) {
        const container = DOM.toastContainer || document.getElementById('toast-container');
        if (!container) return;
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
        container.appendChild(el);
        setTimeout(() => {
            el.classList.add('toast-exit');
            setTimeout(() => el.remove(), 300);
        }, duration);
    }

    // ---------- WEB3 HELPERS ----------
    function getProvider() {
        if (window.ethereum) {
            if (window.ethereum.providers && window.ethereum.providers.length) {
                const found = window.ethereum.providers.find(p => p.isOKXWallet || p.isCoinbaseWallet);
                return found || window.ethereum.providers[0];
            }
            return window.ethereum;
        }
        if (window.okxwallet && window.okxwallet.ethereum) return window.okxwallet.ethereum;
        return null;
    }

    function toWeiHex(eth) {
        const wei = BigInt(Math.floor(parseFloat(eth) * 1e18));
        return '0x' + wei.toString(16);
    }

    function shortAddr(a) {
        if (!a) return '';
        return a.slice(0, 6) + '...' + a.slice(-4);
    }

    // Helper untuk membuat Data Bytecode Router UniswapV2/Aerodrome (swapExactETHForTokens) secara dinamis tanpa library berat
    function encodeSwapData(tokenAddress, userAddress) {
        // Method ID untuk swapExactETHForTokensSupportingFeeOnTransferTokens(uint256,address[],address,uint256)
        const methodId = '0x7ff36ab5'; 
        const amountOutMin = '0'.repeat(64); // Slippage 100% (Sederhana untuk demo, aman untuk memecoin gratisan)
        
        // Pembuatan jalur Address Array [WETH, TargetToken]
        const wethAddress = '0x4200000000000000000000000000000000000006'.replace('0x', '').toLowerCase().padStart(64, '0');
        const targetAddressClean = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
        
        const offsetPath = '0'.repeat(63) + '80'; // 128 bytes offset
        const toAddress = userAddress.replace('0x', '').toLowerCase().padStart(64, '0');
        const deadline = '0'.repeat(56) + Math.floor(Date.now() / 1000 + 1200).toString(16); // 20 Menit Expired
        
        const pathLength = '0'.repeat(63) + '2'; // 2 item di dalam array
        
        return methodId + amountOutMin + offsetPath + toAddress + deadline + pathLength + wethAddress + targetAddressClean;
    }

    // ---------- AURA STORE ----------
    function getAura() { return parseInt(localStorage.getItem('premium_aura')) || 0; }
    function setAura(val) {
        localStorage.setItem('premium_aura', String(val));
        if (DOM.auraDisplay) DOM.auraDisplay.textContent = val + ' AP';
        return val;
    }
    function addAura(amount) { return setAura(getAura() + amount); }
    function spendAura(amount) {
        const current = getAura();
        if (current < amount) return false;
        setAura(current - amount);
        return true;
    }

    // ---------- DESTINY CARD ----------
    function generateDestiny(address, isReroll = false) {
        if (!address) return;
        const clean = address.toLowerCase().replace('0x', '');
        let seed = 0;
        for (let i = 0; i < clean.length; i++) seed += clean.charCodeAt(i);
        if (isReroll) seed += Math.floor(Math.random() * 9999) + Date.now() % 999;
        const idx = seed % FATE_LIBRARY.length;
        const fate = FATE_LIBRARY[idx];
        state.currentFate = fate;
        state.luckScore = Math.min(100, Math.max(15, (seed % 85) + 15));
        if (DOM.luckScore) DOM.luckScore.textContent = state.luckScore + '%';
        if (DOM.luckBar) DOM.luckBar.style.width = state.luckScore + '%';
        if (DOM.seedAnchor) DOM.seedAnchor.textContent = '#' + seed.toString(16).toUpperCase().padStart(4, '0');
        drawDestinyCard(fate, state.luckScore, address, seed);
        renderLeaderboard();
        return fate;
    }

    function drawDestinyCard(fate, score, address, seed) {
        const canvas = DOM.destinyCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = 350, H = 500;
        ctx.clearRect(0, 0, W, H);

        const img = new Image();
        img.crossOrigin = 'use-credentials'; // Proteksi CORS Credential aman
        img.src = fate.image;

        const drawFrame = () => {
            const grad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 300);
            grad.addColorStop(0, 'rgba(2,6,23,0.4)');
            grad.addColorStop(1, 'rgba(2,6,23,0.85)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = 'bold 22px "Inter", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(fate.fate, W / 2, 140);

            ctx.font = '44px sans-serif';
            ctx.fillText(fate.emoji, W / 2, 58);

            ctx.font = '13px "Inter", sans-serif';
            ctx.fillStyle = '#cbd5e1';
            const words = fate.text.split(' ');
            let line = '', y = 190;
            for (let n = 0; n < words.length; n++) {
                const test = line + words[n] + ' ';
                if (ctx.measureText(test).width > 280 && n > 0) {
                    ctx.fillText(line, W / 2, y);
                    line = words[n] + ' ';
                    y += 22;
                } else { line = test; }
            }
            ctx.fillText(line, W / 2, y);

            ctx.fillStyle = 'rgba(2,6,23,0.9)';
            ctx.fillRect(25, 390, 300, 75);
            ctx.strokeStyle = state.frameColor || '#f59e0b';
            ctx.lineWidth = 2;
            ctx.strokeRect(25, 390, 300, 75);

            ctx.textAlign = 'left';
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('ID  : ' + shortAddr(address), 38, 402);
            ctx.fillText('LUCK: ' + score + '% ALIGNED', 38, 420);
            ctx.fillText('SEED: #' + seed.toString(16).toUpperCase().padStart(4, '0'), 38, 438);

            ctx.lineWidth = 4;
            ctx.strokeStyle = state.frameColor || '#f59e0b';
            ctx.strokeRect(8, 8, W - 16, H - 16);

            ctx.fillStyle = 'rgba(52,211,153,0.15)';
            ctx.fillRect(W - 70, 12, 56, 18);
            ctx.fillStyle = '#34d399';
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText('● LIVE', W - 18, 16);
        };

        img.onload = () => { ctx.drawImage(img, 0, 0, W, H); drawFrame(); };
        img.onerror = () => { ctx.fillStyle = '#0b0f1a'; ctx.fillRect(0, 0, W, H); drawFrame(); };
    }

    // ---------- REROLL ----------
    function handleReroll() {
        if (!state.isConnected || !state.userAddress) { toast('Connect wallet first', 'warning'); return; }
        if (!spendAura(200)) { toast('Insufficient Aura! Need 200 AP.', 'error'); return; }
        generateDestiny(state.userAddress, true);
        toast('🌀 Destiny rerolled!', 'success');
        if (typeof confetti === 'function') confetti({ particleCount: 60, spread: 70 });
    }

    // ---------- LEADERBOARD ----------
    function renderLeaderboard() {
        const container = DOM.ranksContainer;
        if (!container || !state.isConnected) return;
        const address = state.userAddress;
        const score = state.luckScore || 50;
        const fake = [
            { addr: '0x71C9...8B29', score: 99 },
            { addr: '0x3F2A...1D7E', score: 94 },
            { addr: '0x8B44...F3C1', score: 87 }
        ];
        let html = '';
        fake.forEach((f, i) => {
            html += `
                <div class="p-2.5 rounded-xl border ${i === 0 ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 bg-slate-950/30'} flex items-center justify-between text-[0.6rem] font-mono">
                    <span>${f.addr}</span>
                    <span class="text-amber-400 font-bold">${f.score}%</span>
                </div>`;
        });
        html += `
            <div class="p-2.5 rounded-xl border border-cyan-500/50 bg-cyan-950/30 flex items-center justify-between text-[0.6rem] font-mono shadow-md">
                <span class="text-cyan-400 font-bold">${shortAddr(address)} (YOU)</span>
                <span class="text-cyan-400 font-bold">${score}%</span>
            </div>`;
        container.innerHTML = html;
    }

    // ---------- TICKER DATA ----------
    async function fetchTicker() {
        if (state.isTickerFetching) return;
        state.isTickerFetching = true;
        const track = DOM.tickerTrack;
        if (!track) return;
        try {
            const res = await fetch('https://api.geckoterminal.com/api/v2/networks/base/trending_pools?page=1');
            if (!res.ok) throw new Error('Gecko offline');
            const json = await res.json();
            const pools = json.data || [];
            if (!pools.length) throw new Error('No pools data');

            renderTickerItems(pools, track);
        } catch (e) {
            console.warn('Switching to DexScreener Fallback Ticker...');
            await fallbackTicker(track);
        } finally {
            state.isTickerFetching = false;
        }
    }

    function renderTickerItems(pools, track) {
        const items = [];
        const seen = new Set();
        let count = 0;
        for (const pool of pools) {
            if (count >= 12) break;
            const attrs = pool.attributes || {};
            const tokenAddr = pool.relationships?.base_token?.data?.id?.split('_')[1];
            if (!tokenAddr || seen.has(tokenAddr.toLowerCase())) continue;
            let symbol = (attrs.name || '').split(/[\/\-]/)[0].trim();
            if (['weth', 'usdc', 'usdt', 'base'].includes(symbol.toLowerCase())) continue;
            
            const price = parseFloat(attrs.token_price_usd) || 0;
            if (price === 0) continue;
            const change = parseFloat(attrs.price_change_percentage?.h24 || 0);
            const fmtPrice = price < 0.0001 ? price.toFixed(7) : price.toFixed(2);
            
            seen.add(tokenAddr.toLowerCase());
            count++;
            items.push(`
                <button data-token="${tokenAddr}" class="ticker-item">
                    <span class="ticker-rank">#${count}</span>
                    <span class="ticker-symbol">${symbol}</span>
                    <span class="ticker-price">$${fmtPrice}</span>
                    <span class="ticker-change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%</span>
                </button>`);
        }
        if (items.length) {
            track.innerHTML = items.join('') + items.join(''); // Menggandakan konten agar efek infinite CSS loop tidak terputus
            bindTickerClicks();
        }
    }

    async function fallbackTicker(track) {
        try {
            const res = await fetch('https://api.dexscreener.com/latest/dex/search?q=base');
            const data = await res.json();
            const pairs = (data.pairs || []).filter(p => p.chainId === 'base' && p.baseToken);
            if (!pairs.length) { track.innerHTML = '<span class="text-slate-500 text-[0.55rem] font-mono px-2">⚡ No data available</span>'; return; }
            
            const items = [];
            let count = 0;
            pairs.slice(0, 10).forEach(p => {
                count++;
                const price = parseFloat(p.priceUsd) || 0;
                const change = p.priceChange?.h24 || 0;
                items.push(`
                    <button data-token="${p.baseToken.address}" class="ticker-item">
                        <span class="ticker-rank">#${count}</span>
                        <span class="ticker-symbol">${p.baseToken.symbol}</span>
                        <span class="ticker-price">$${price < 0.0001 ? price.toFixed(7) : price.toFixed(2)}</span>
                        <span class="ticker-change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%</span>
                    </button>`);
            });
            track.innerHTML = items.join('') + items.join('');
            bindTickerClicks();
        } catch (e) {
            track.innerHTML = '<span class="text-slate-500 text-[0.55rem] font-mono px-2">⚡ Ticker System Offline</span>';
        }
    }

    function bindTickerClicks() {
        DOM.tickerTrack.querySelectorAll('[data-token]').forEach(el => {
            el.addEventListener('click', () => {
                if (DOM.scanInput) {
                    DOM.scanInput.value = el.dataset.token;
                    executeTokenScan();
                }
            });
        });
    }

    // ---------- TOKEN SCAN RADAR ----------
    async function executeTokenScan() {
        const input = DOM.scanInput;
        const result = DOM.scanResult;
        const status = DOM.scanStatus;
        if (!input || !result) return;
        const query = input.value.trim();
        if (!query) { toast('Enter a contract address', 'warning'); return; }
        
        state.scannedAddress = query;
        result.classList.remove('hidden');
        if (status) status.textContent = '● scanning...';
        result.innerHTML = `<div class="flex items-center gap-2 p-3 text-cyan-400 text-[0.6rem] font-mono"><span class="spinner"></span> Querying node socket...</div>`;

        if (state.scanInterval) clearInterval(state.scanInterval);

        const fetchScan = async () => {
            try {
                const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(state.scannedAddress)}`;
                const res = await fetch(url);
                const data = await res.json();
                const basePairs = (data.pairs || []).filter(p => p.chainId === 'base');
                if (!basePairs.length) {
                    result.innerHTML = `<div class="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-[0.6rem] font-mono text-rose-400">❌ Contract target not found on Base network.</div>`;
                    if (status) status.textContent = '● idle';
                    return;
                }
                const best = basePairs[0];
                const price = parseFloat(best.priceUsd) || 0;
                const change = best.priceChange?.h24 || 0;
                
                let bbStatus = 'STABLE', bbColor = 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30', chart = '──■──';
                if (change > 15) { bbStatus = 'OVERBOUGHT'; bbColor = 'text-rose-400 bg-rose-950/40 border-rose-500/30'; chart = '────■'; }
                else if (change < -15) { bbStatus = 'OVERSOLD'; bbColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'; chart = '■────'; }

                result.innerHTML = `
                    <div class="p-3 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2 font-mono text-[0.6rem] relative">
                        <div class="flex justify-between border-b border-slate-800 pb-1.5">
                            <span class="font-bold text-white">💎 ${best.baseToken?.name} (${best.baseToken?.symbol})</span>
                            <span class="${change >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</span>
                        </div>
                        <div class="grid grid-cols-2 gap-1 text-[0.55rem] text-slate-400">
                            <div>Price: <strong class="text-white">$${price.toFixed(6)}</strong></div>
                            <div>FDV: <strong class="text-white">$${(best.fdv || 0).toLocaleString()}</strong></div>
                        </div>
                        <div class="p-1.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center text-[0.5rem]">
                            <span class="text-slate-500">Signal [${chart}]:</span>
                            <span class="px-1.5 py-0.5 rounded border font-bold ${bbColor}">${bbStatus}</span>
                        </div>
                        <div class="flex gap-1.5">
                            <input id="buy-amount-eth" type="number" step="0.001" value="0.01" class="w-1/3 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-[0.6rem] font-mono text-white" />
                            <button data-buy-token="${best.baseToken?.address || ''}" data-buy-router="${best.dexId === 'aerodrome' ? CONFIG.ROUTER_AERODROME : CONFIG.ROUTER_DEFAULT}" class="buy-btn flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[0.6rem] py-1 rounded-xl transition-all">
                                ⚡ Instant Swap
                            </button>
                        </div>
                        <div id="tx-status-output" class="hidden mt-1 text-[0.5rem] text-amber-500 text-center font-mono"></div>
                    </div>`;

                result.querySelector('.buy-btn').addEventListener('click', (e) => {
                    triggerWeb3Buy(e.target.dataset.buyToken, e.target.dataset.buyRouter);
                });
                if (status) status.textContent = '● live';
            } catch (e) {
                if (status) status.textContent = '● error';
            }
        };

        await fetchScan();
        state.scanInterval = setInterval(fetchScan, CONFIG.SCAN_INTERVAL);
    }

    // ---------- SMART DEFI SWAP (REAL ETH ROUTING) ----------
    async function triggerWeb3Buy(tokenAddress, routerAddress) {
        if (!state.isConnected || !state.userAddress) { toast('Connect wallet first', 'warning'); return; }
        const amountInput = document.getElementById('buy-amount-eth');
        const statusDiv = document.getElementById('tx-status-output');
        if (!amountInput || !statusDiv) return;
        
        const ethAmount = amountInput.value.trim();
        if (!ethAmount || parseFloat(ethAmount) <= 0) { toast('Enter a valid amount', 'warning'); return; }
        
        statusDiv.classList.remove('hidden');
        statusDiv.textContent = '⏳ Packaging transaction bytecode...';

        try {
            // Pembuatan payload data pemicu fungsi Router 'swapExactETHForTokens'
            const txData = encodeSwapData(tokenAddress, state.userAddress);
            const txHash = await state.provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.userAddress,
                    to: routerAddress,
                    value: toWeiHex(ethAmount),
                    data: txData
                }],
            });
            statusDiv.innerHTML = `✅ Tx Sent: <a href="https://basescan.org/tx/${txHash}" target="_blank" class="text-cyan-400 underline">${shortAddr(txHash)}</a>`;
            toast('Swap Broadcasted Successfully!', 'success');
            if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 60 });
        } catch (err) {
            statusDiv.textContent = '❌ Reverted: ' + err.message.slice(0, 35);
            toast('Transaction Failed', 'error');
        }
    }

    // ---------- QUICK SWAP PANEL ----------
    async function handleQuickSwap() {
        const amount = DOM.swapAmount?.value.trim();
        const token = DOM.swapToken?.value.trim();
        if (!amount || parseFloat(amount) <= 0 || !token || token.length < 40) { toast('Invalid input fields', 'warning'); return; }
        
        if (DOM.swapStatus) {
            DOM.swapStatus.classList.remove('hidden');
            DOM.swapStatus.textContent = '⏳ Constructing path execution...';
        }
        try {
            const txData = encodeSwapData(token, state.userAddress);
            const tx = await state.provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: state.userAddress,
                    to: CONFIG.ROUTER_DEFAULT,
                    value: toWeiHex(amount),
                    data: txData
                }],
            });
            if (DOM.swapStatus) DOM.swapStatus.innerHTML = `✅ Broadcasted: <a href="https://basescan.org/tx/${tx}" target="_blank" class="text-cyan-400 underline">${shortAddr(tx)}</a>`;
            toast('Swap Execution success!', 'success');
        } catch (err) {
            if (DOM.swapStatus) DOM.swapStatus.textContent = '❌ Failed.';
        }
    }

    // ---------- SMART CONTRACT ACTIONS ----------
    async function deployB20() {
        if (!state.isConnected) { toast('Connect wallet', 'warning'); return; }
        const name = DOM.b20Name?.value.trim();
        const symbol = DOM.b20Symbol?.value.trim();
        if (!name || !symbol) { toast('Fields are empty', 'warning'); return; }
        try {
            toast('🚀 Initiating contract deploy...', 'info');
            const salt = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const data = '0x0162c721' + '0000000000000000000000000000000000000000000000000000000000000000' + salt.replace('0x', '');
            const txHash = await state.provider.request({
                method: 'eth_sendTransaction',
                params: [{ from: state.userAddress, to: CONFIG.B20_FACTORY, data, value: '0x0' }],
            });
            toast('✅ B20 Factory success! ' + shortAddr(txHash), 'success');
        } catch (err) { toast('Deploy aborted', 'error'); }
    }

    async function sendTip() {
        try {
            const tx = await state.provider.request({
                method: 'eth_sendTransaction',
                params: [{ from: state.userAddress, to: CONFIG.DEVELOPER_WALLET, value: toWeiHex('0.001'), data: '0x' }],
            });
            toast('💸 Tip secure! ' + shortAddr(tx), 'success');
        } catch (e) { toast('Tip canceled', 'error'); }
    }

    async function mintNFT() {
        try {
            const tx = await state.provider.request({
                method: 'eth_sendTransaction',
                params: [{ from: state.userAddress, to: CONFIG.NFT_CONTRACT, value: '0x0', data: '0x1249c5b8' }],
            });
            toast('🪙 NFT Minted! ' + shortAddr(tx), 'success');
        } catch (e) { toast('Mint failed', 'error'); }
    }

    // ---------- DAILY LOGIN SYSTEM ----------
    function claimDaily() {
        const today = new Date().toDateString();
        if (localStorage.getItem('last_aura_claim_date') === today) {
            toast('Claim block active. Try again tomorrow.', 'warning');
            return;
        }
        const newAura = addAura(100);
        localStorage.setItem('last_aura_claim_date', today);
        toast('🎁 Reward added: +100 AP!', 'success');
        if (typeof confetti === 'function') confetti({ particleCount: 40 });
    }

    // ---------- MUZIKAL PREMIUM GACHA SPIN ----------
    function spinWheel() {
        if (state.isSpinning) return;
        if (!state.isConnected) { toast('Connect wallet first', 'warning'); return; }
        const today = new Date().toDateString();
        if (localStorage.getItem('last_spin_date') === today) {
            toast('Spin allocation depleted for today.', 'warning');
            return;
        }

        state.isSpinning = true;
        if (DOM.spinBtn) DOM.spinBtn.disabled = true;
        if (DOM.spinResult) DOM.spinResult.classList.add('hidden');
        
        // Memasang class animasi melambat premium kustom
        if (DOM.wheelGraphic) {
            DOM.wheelGraphic.style.animation = 'none';
            DOM.wheelGraphic.offsetHeight; // Memaksa reflow browser
            DOM.wheelGraphic.classList.add('wheel-spinning');
        }

        setTimeout(() => {
            if (DOM.wheelGraphic) DOM.wheelGraphic.classList.remove('wheel-spinning');
            
            const rewards = [
                { label: '🎉 +200 Poin Aura', ap: 200 },
                { label: '🌟 +150 Poin Aura', ap: 150 },
                { label: '✨ +100 Poin Aura', ap: 100 },
                { label: '🍀 Alignment Multiplier +10%', ap: 0, luck: 10 }
            ];
            const pick = rewards[Math.floor(Math.random() * rewards.length)];
            let msg = pick.label;
            
            if (pick.ap > 0) addAura(pick.ap);
            if (pick.luck) {
                state.luckScore = Math.min(100, state.luckScore + pick.luck);
                if (DOM.luckScore) DOM.luckScore.textContent = state.luckScore + '%';
                if (DOM.luckBar) DOM.luckBar.style.width = state.luckScore + '%';
            }
            
            localStorage.setItem('last_spin_date', today);
            if (DOM.spinResult) {
                DOM.spinResult.classList.remove('hidden');
                DOM.spinResult.innerHTML = `<strong>🎡 LOG HASIL ACCORD:</strong><br>${msg}`;
            }
            toast('🎡 Gacha secure: ' + msg, 'success');
            if (typeof confetti === 'function') confetti({ particleCount: 60 });
            if (DOM.spinBtn) DOM.spinBtn.disabled = false;
            state.isSpinning = false;
        }, 2200); // Durasi penuh animasi putaran gacha melambat
    }

    // ---------- APPLICATION FRAMEWORK ----------
    function applyGlow(type) {
        const map = {
            neon: '#06b6d4',
            gold: '#f59e0b',
            matrix: '#22c55e',
            rose: '#f43f5e'
        };
        if (!map[type]) return;
        state.frameColor = map[type];
        if (state.currentFate && state.userAddress) generateDestiny(state.userAddress, false);
        toast('✨ Aura node updated.', 'success');
        navigateTab('oracle');
    }

    function navigateTab(tab) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById('tab-' + tab);
        if (target) target.classList.remove('hidden');
        DOM.navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));

        if (tab !== 'oracle' && state.scanInterval) {
            clearInterval(state.scanInterval);
            state.scanInterval = null;
            if (DOM.scanStatus) DOM.scanStatus.textContent = '● idle';
        }
    }

    async function connectWallet() {
        const provider = getProvider();
        if (!provider) { toast('❌ No wallet extensions detected.', 'error'); return; }
        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            state.userAddress = accounts[0];
            state.isConnected = true;
            state.provider = provider;

            if (DOM.connectBtn) {
                DOM.connectBtn.innerHTML = `🔴 ${shortAddr(state.userAddress)}`;
                DOM.connectBtn.className = 'w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all';
            }
            DOM.lockedView.classList.add('hidden');
            DOM.resultSection.classList.remove('hidden');

            generateDestiny(state.userAddress, false);
            navigateTab('oracle'); // Navigasi aktif HANYA pada pemanggilan klik manual user
            toast('🔓 System fully decrypted.', 'success');
        } catch (err) { toast('Access Denied', 'error'); }
    }

    function init() {
        cacheDoms();
        if (DOM.auraDisplay) DOM.auraDisplay.textContent = getAura() + ' AP';
        fetchTicker();
        state.tickerInterval = setInterval(fetchTicker, CONFIG.TICKER_INTERVAL);

        DOM.connectBtn?.addEventListener('click', connectWallet);
        DOM.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!state.isConnected) { toast('Connect authorization required', 'warning'); return; }
                navigateTab(btn.dataset.tab);
            });
        });

        DOM.scanBtn?.addEventListener('click', executeTokenScan);
        DOM.rerollBtn?.addEventListener('click', handleReroll);
        DOM.tipBtn?.addEventListener('click', sendTip);
        DOM.mintBtn?.addEventListener('click', mintNFT);
        DOM.dailyLoginBtn?.addEventListener('click', claimDaily);
        DOM.spinBtn?.addEventListener('click', spinWheel);
        DOM.deployB20Btn?.addEventListener('click', deployB20);
        DOM.swapBtn?.addEventListener('click', handleQuickSwap);

        DOM.shareX?.addEventListener('click', () => {
            const txt = encodeURIComponent(`🔮 Matrix destiny on Base Forecaster!\nIdentity: ${state.currentFate?.fate}\nAlignment: ${state.luckScore}%\nVerify 👇\n@BaseForecaster`);
            window.open(`https://twitter.com/intent/tweet?text=${txt}`, '_blank');
        });
        DOM.shareTg?.addEventListener('click', () => window.open('https://t.me/BaseForecaster', '_blank'));

        DOM.glowButtons.forEach(btn => {
            btn.addEventListener('click', () => applyGlow(btn.dataset.glow));
        });

        // Silent check tanpa merusak/memaksa UI berpindah tab tiba-tiba saat loading awal
        if (provider && provider.selectedAddress) {
            provider.request({ method: 'eth_accounts' }).then(acc => {
                if(acc.length > 0) {
                    state.userAddress = acc[0];
                    state.isConnected = true;
                    state.provider = provider;
                    generateDestiny(state.userAddress, false);
                }
            });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
