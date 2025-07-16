/**
 * Main JavaScript - Core application logic and initialization
 */

// Global application state
window.CoinTraderApp = {
    cryptoPrices: { bitcoin: 43000, ethereum: 2650, tether: 1.00 },
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
 * Load cryptocurrency prices
 */
async function loadCryptoPrices() {
    try {
        const response = await fetch('/api/payment/rates');
        if (response.ok) {
            const rates = await response.json();
            CoinTraderApp.cryptoPrices.bitcoin = rates.BTC;
            CoinTraderApp.cryptoPrices.ethereum = rates.ETH;
        }
    } catch (error) {
        console.log('Using fallback crypto prices');
    }
    updatePriceDisplay();
}

/**
 * Update price display across the site
 */
function updatePriceDisplay() {
    if (!CoinTraderApp.selectedPlan) return;
    
    const price = CoinTraderApp.selectedPlan.price;
    const btcAmount = (price / CoinTraderApp.cryptoPrices.bitcoin).toFixed(6);
    const ethAmount = (price / CoinTraderApp.cryptoPrices.ethereum).toFixed(4);
    const usdtAmount = (price / CoinTraderApp.cryptoPrices.tether).toFixed(2);
    
    const livePricesEl = document.getElementById('live-prices');
    if (livePricesEl) {
        livePricesEl.innerHTML = `
            BTC: ${btcAmount} BTC ($${CoinTraderApp.cryptoPrices.bitcoin.toLocaleString()}) • 
            ETH: ${ethAmount} ETH ($${CoinTraderApp.cryptoPrices.ethereum.toLocaleString()}) • 
            USDT: ${usdtAmount} USDT
        `;
    }
    
    const cryptoAmountEl = document.getElementById('crypto-amount');
    if (cryptoAmountEl) {
        cryptoAmountEl.innerHTML = `
            ${btcAmount} BTC or ${ethAmount} ETH or ${usdtAmount} USDT
        `;
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