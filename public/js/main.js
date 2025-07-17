/**
 * Main JavaScript - Core application logic and initialization
 */

// Global application state
window.CoinTraderApp = {
    cryptoPrices: { 
        bitcoin: 43000, 
        ethereum: 2650, 
        tether: 1.00,
        bnb: 300,
        litecoin: 70,
        tron: 0.08
    },
    cryptoChanges: {
        bitcoin: 0,
        ethereum: 0,
        tether: 0,
        bnb: 0,
        litecoin: 0,
        tron: 0
    },
    tradingStats: {
        totalTrades: 0,
        winRate: 0,
        profitToday: 0,
        totalCustomers: 0,
        dailyVolume: 0
    },
    planPricing: {
        'starter': { name: 'Starter', price: 89 },
        'professional': { name: 'Professional', price: 189 },
        'complete': { name: 'Complete', price: 389 }
    },
    selectedPlan: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set default plan
    CoinTraderApp.selectedPlan = CoinTraderApp.planPricing['professional'];
    
    // Initialize components
    initializeNavigation();
    initializeScrollEffects();
    loadCryptoPrices();
    
    // Start timers and animations
    startCountdown();
    
    console.log('CoinTrader AI App initialized successfully');
}

/**
 * Navigation and Mobile Menu
 */
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

/**
 * Scroll Effects and Animations
 */
function initializeScrollEffects() {
    // Progress bar
    window.addEventListener('scroll', updateScrollProgress);
    
    // Scroll reveal animations
    initializeScrollReveal();
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe scroll reveal elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .stagger-children')
        .forEach(el => observer.observe(el));
}

/**
 * Countdown Timer
 */
function startCountdown() {
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Load cryptocurrency prices from CoinGecko API
 */
async function loadCryptoPrices() {
    try {
        // Show loading state
        const livePricesEl = document.getElementById('live-prices');
        if (livePricesEl) {
            livePricesEl.innerHTML = `
                <span class="flex items-center">
                    <svg class="animate-spin h-4 w-4 text-accent mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading live rates...
                </span>
            `;
        }
        
        // Fetch prices from CoinGecko API (free tier)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,litecoin,tron&vs_currencies=usd&include_24hr_change=true');
        
        if (response.ok) {
            const data = await response.json();
            
            // Update prices
            CoinTraderApp.cryptoPrices.bitcoin = data.bitcoin?.usd || 43000;
            CoinTraderApp.cryptoPrices.ethereum = data.ethereum?.usd || 2650;
            CoinTraderApp.cryptoPrices.tether = data.tether?.usd || 1.00;
            CoinTraderApp.cryptoPrices.bnb = data.binancecoin?.usd || 300;
            CoinTraderApp.cryptoPrices.litecoin = data.litecoin?.usd || 70;
            CoinTraderApp.cryptoPrices.tron = data.tron?.usd || 0.08;
            
            // Store 24hr changes for display
            CoinTraderApp.cryptoChanges = {
                bitcoin: data.bitcoin?.usd_24h_change || 0,
                ethereum: data.ethereum?.usd_24h_change || 0,
                tether: data.tether?.usd_24h_change || 0,
                bnb: data.binancecoin?.usd_24h_change || 0,
                litecoin: data.litecoin?.usd_24h_change || 0,
                tron: data.tron?.usd_24h_change || 0
            };
            
            console.log('✅ Crypto prices loaded successfully:', CoinTraderApp.cryptoPrices);
        } else {
            throw new Error('Failed to fetch prices');
        }
    } catch (error) {
        console.warn('⚠️  Failed to load live crypto prices, using fallback values:', error);
        
        // Show error state briefly
        const livePricesEl = document.getElementById('live-prices');
        if (livePricesEl) {
            livePricesEl.innerHTML = `
                <span class="text-yellow-600">
                    ⚠️ Using cached prices (live prices unavailable)
                </span>
            `;
        }
    }
    
    // Update displays
    updatePriceDisplay();
    
    // Set up periodic updates (every 2 minutes to respect rate limits)
    setInterval(() => {
        loadCryptoPricesQuietly();
    }, 120000);
}

/**
 * Load crypto prices quietly (no UI updates during refresh)
 */
async function loadCryptoPricesQuietly() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,litecoin,tron&vs_currencies=usd&include_24hr_change=true');
        
        if (response.ok) {
            const data = await response.json();
            
            // Update prices
            CoinTraderApp.cryptoPrices.bitcoin = data.bitcoin?.usd || CoinTraderApp.cryptoPrices.bitcoin;
            CoinTraderApp.cryptoPrices.ethereum = data.ethereum?.usd || CoinTraderApp.cryptoPrices.ethereum;
            CoinTraderApp.cryptoPrices.tether = data.tether?.usd || CoinTraderApp.cryptoPrices.tether;
            CoinTraderApp.cryptoPrices.bnb = data.binancecoin?.usd || CoinTraderApp.cryptoPrices.bnb;
            CoinTraderApp.cryptoPrices.litecoin = data.litecoin?.usd || CoinTraderApp.cryptoPrices.litecoin;
            CoinTraderApp.cryptoPrices.tron = data.tron?.usd || CoinTraderApp.cryptoPrices.tron;
            
            // Update changes
            CoinTraderApp.cryptoChanges = {
                bitcoin: data.bitcoin?.usd_24h_change || 0,
                ethereum: data.ethereum?.usd_24h_change || 0,
                tether: data.tether?.usd_24h_change || 0,
                bnb: data.binancecoin?.usd_24h_change || 0,
                litecoin: data.litecoin?.usd_24h_change || 0,
                tron: data.tron?.usd_24h_change || 0
            };
            
            // Update displays
            updatePriceDisplay();
            
            console.log('🔄 Crypto prices updated:', new Date().toLocaleTimeString());
        }
    } catch (error) {
        console.warn('🔄 Price update failed (using cached):', error.message);
    }
}

/**
 * Update price display across the site
 */
function updatePriceDisplay() {
    if (!CoinTraderApp.selectedPlan) return;
    
    const price = CoinTraderApp.selectedPlan.price;
    const prices = CoinTraderApp.cryptoPrices;
    const changes = CoinTraderApp.cryptoChanges || {};
    
    // Calculate amounts for each currency
    const amounts = {
        BTC: (price / prices.bitcoin).toFixed(6),
        ETH: (price / prices.ethereum).toFixed(4),
        USDT: (price / prices.tether).toFixed(2),
        BNB: (price / prices.bnb).toFixed(3),
        LTC: (price / prices.litecoin).toFixed(3),
        TRX: (price / prices.tron).toFixed(0)
    };
    
    // Helper function to get change color and symbol
    const getChangeDisplay = (change) => {
        if (change > 0) {
            return `<span class="text-green-600">+${change.toFixed(1)}%</span>`;
        } else if (change < 0) {
            return `<span class="text-red-600">${change.toFixed(1)}%</span>`;
        } else {
            return `<span class="text-gray-500">0.0%</span>`;
        }
    };
    
    // Update live prices display
    const livePricesEl = document.getElementById('live-prices');
    if (livePricesEl) {
        livePricesEl.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div class="flex items-center justify-between">
                    <span class="font-medium">BTC:</span>
                    <span>$${prices.bitcoin.toLocaleString()} ${getChangeDisplay(changes.bitcoin)}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">ETH:</span>
                    <span>$${prices.ethereum.toLocaleString()} ${getChangeDisplay(changes.ethereum)}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">USDT:</span>
                    <span>$${prices.tether.toFixed(3)} ${getChangeDisplay(changes.tether)}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">BNB:</span>
                    <span>$${prices.bnb.toLocaleString()} ${getChangeDisplay(changes.bnb)}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">LTC:</span>
                    <span>$${prices.litecoin.toLocaleString()} ${getChangeDisplay(changes.litecoin)}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">TRX:</span>
                    <span>$${prices.tron.toFixed(3)} ${getChangeDisplay(changes.tron)}</span>
                </div>
            </div>
        `;
    }
    
    // Update crypto amount display (legacy)
    const cryptoAmountEl = document.getElementById('crypto-amount');
    if (cryptoAmountEl) {
        cryptoAmountEl.innerHTML = `
            ${amounts.BTC} BTC or ${amounts.ETH} ETH or ${amounts.USDT} USDT
        `;
    }
    
    // Update payment amount if a currency is selected
    if (window.selectedCurrency && window.updateCryptoAmount) {
        window.updateCryptoAmount(window.selectedCurrency);
    }
}

/**
 * Plan Selection
 */
function selectPlan(planName) {
    CoinTraderApp.selectedPlan = CoinTraderApp.planPricing[planName] || CoinTraderApp.planPricing['professional'];
    
    // Track plan selection
    if (window.trackEvent) {
        window.trackEvent('plan_selected', 'pricing', planName, CoinTraderApp.selectedPlan.price);
    }
    
    // Update UI
    const selectedPlanNameEl = document.getElementById('selected-plan-name');
    const selectedPriceEl = document.getElementById('selected-price');
    
    if (selectedPlanNameEl) {
        selectedPlanNameEl.textContent = 'CoinTrader AI ' + CoinTraderApp.selectedPlan.name;
    }
    if (selectedPriceEl) {
        selectedPriceEl.textContent = CoinTraderApp.selectedPlan.price;
    }
    
    // Show payment section with smooth scroll
    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.style.display = 'block';
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Update crypto amounts
    updatePriceDisplay();
    
    // Show notification
    showNotification('Ready to complete your purchase!', 'success');
}

/**
 * FAQ Toggle
 */
function toggleFAQ(num) {
    const content = document.getElementById(`faq-content-${num}`);
    const icon = document.getElementById(`faq-icon-${num}`);
    
    if (content && icon) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.textContent = '−';
        } else {
            content.classList.add('hidden');
            icon.textContent = '+';
        }
    }
}

/**
 * Copy to clipboard utility
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Address copied!', 'success');
    }).catch(() => {
        showNotification('Failed to copy address', 'error');
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    
    let bgClass = 'bg-blue-600';
    if (type === 'success') bgClass = 'bg-green-600';
    if (type === 'error') bgClass = 'bg-red-600';
    if (type === 'warning') bgClass = 'bg-yellow-600';
    
    notification.className = `fixed top-4 right-4 ${bgClass} text-white px-6 py-3 rounded-lg font-medium z-50 shadow-lg transition-all duration-300`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Update signal times (if elements exist)
 */
function updateSignalTimes() {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`signal-time-${i}`);
        if (el) {
            const currentTime = parseInt(el.textContent.split(' ')[0]);
            el.textContent = `${currentTime + 1} min ago`;
        }
    }
}

// Global function exports for HTML onclick handlers
window.selectPlan = selectPlan;
window.toggleFAQ = toggleFAQ;
window.copyToClipboard = copyToClipboard;