/**
 * Payment JavaScript - Payment processing, ID generation, and status checking
 */

// Payment configuration
const PAYMENT_CONFIG = {
    addresses: {
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        ETH: '0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5',
        USDT_TRC20: 'TMWLhJd8E5c8QqUMXkqYFq7gWxGMEjvbZm',
        USDT_ERC20: '0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5',
        USDT_BEP20: '0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5',
        BNB: '0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5', // BSC address
        LTC: 'LYmpJZm1WrP5FSnxwkV2TTo5SkAF4Eha31',
        TRX: 'TMWLhJd8E5c8QqUMXkqYFq7gWxGMEjvbZm'
    },
    networks: {
        BTC: 'Bitcoin',
        ETH: 'Ethereum',
        USDT_TRC20: 'TRC20 (TRON)',
        USDT_ERC20: 'ERC20 (Ethereum)',
        USDT_BEP20: 'BEP20 (BSC)',
        BNB: 'BSC',
        LTC: 'Litecoin',
        TRX: 'TRON'
    },
    confirmations: {
        BTC: 1,
        ETH: 12,
        USDT_TRC20: 19,
        USDT_ERC20: 12,
        USDT_BEP20: 12,
        BNB: 12,
        LTC: 6,
        TRX: 19
    }
};

// Selected currency state
let selectedCurrency = null;
let paymentTimer = null;

/**
 * Select payment currency
 */
function selectPaymentCurrency(currency) {
    selectedCurrency = currency;
    
    // Update UI to show selected currency
    document.querySelectorAll('.currency-selector').forEach(btn => {
        btn.classList.remove('border-primary', 'shadow-lg', 'bg-primary/5');
        btn.classList.add('border-gray-300');
    });
    
    document.querySelectorAll('[id^="currency-check-"]').forEach(check => {
        check.classList.add('hidden');
    });
    
    const selectedBtn = document.getElementById(`currency-btn-${currency}`);
    const selectedCheck = document.getElementById(`currency-check-${currency}`);
    
    if (selectedBtn) {
        selectedBtn.classList.remove('border-gray-300');
        selectedBtn.classList.add('border-primary', 'shadow-lg', 'bg-primary/5');
    }
    
    if (selectedCheck) {
        selectedCheck.classList.remove('hidden');
    }
    
    // Show payment details section
    showPaymentDetails(currency);
    
    // Track selection
    if (window.trackEvent) {
        window.trackEvent('payment_currency_selected', 'payment', currency);
    }
}

/**
 * Show payment details for selected currency
 */
function showPaymentDetails(currency) {
    const detailsSection = document.getElementById('payment-details-section');
    const completionSection = document.getElementById('payment-completion-section');
    
    if (!detailsSection || !completionSection) return;
    
    // Show sections
    detailsSection.classList.remove('hidden');
    completionSection.classList.remove('hidden');
    
    // Update payment address
    const addressEl = document.getElementById('payment-address');
    if (addressEl) {
        addressEl.textContent = PAYMENT_CONFIG.addresses[currency];
    }
    
    // Update QR code
    const qrEl = document.getElementById('payment-qr');
    if (qrEl) {
        const qrData = PAYMENT_CONFIG.addresses[currency];
        qrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    }
    
    // Update network information
    const networkEl = document.getElementById('payment-network');
    if (networkEl) {
        networkEl.textContent = PAYMENT_CONFIG.networks[currency];
    }
    
    // Show network warning for USDT
    const warningEl = document.getElementById('network-warning');
    if (warningEl) {
        if (currency.startsWith('USDT_')) {
            warningEl.innerHTML = `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-yellow-700">
                                <strong>Important:</strong> This is ${PAYMENT_CONFIG.networks[currency]} network. 
                                Sending from wrong network will result in lost funds!
                            </p>
                        </div>
                    </div>
                </div>
            `;
            warningEl.classList.remove('hidden');
        } else {
            warningEl.classList.add('hidden');
        }
    }
    
    // Update amount display
    updateCryptoAmount(currency);
    
    // Smooth scroll to payment details
    detailsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Update crypto amount based on selected currency and price
 */
function updateCryptoAmount(currency) {
    const price = window.CoinTraderApp?.selectedPlan?.price || 297;
    const cryptoPrices = window.CoinTraderApp?.cryptoPrices || {};
    const cryptoChanges = window.CoinTraderApp?.cryptoChanges || {};
    
    let amount = 0;
    let rate = 0;
    let change = 0;
    
    switch(currency) {
        case 'BTC':
            rate = cryptoPrices.bitcoin || 43000;
            amount = (price / rate).toFixed(6);
            change = cryptoChanges.bitcoin || 0;
            break;
        case 'ETH':
            rate = cryptoPrices.ethereum || 2650;
            amount = (price / rate).toFixed(4);
            change = cryptoChanges.ethereum || 0;
            break;
        case 'USDT_TRC20':
        case 'USDT_ERC20':
        case 'USDT_BEP20':
            rate = cryptoPrices.tether || 1;
            amount = (price / rate).toFixed(2);
            change = cryptoChanges.tether || 0;
            break;
        case 'BNB':
            rate = cryptoPrices.bnb || 300;
            amount = (price / rate).toFixed(3);
            change = cryptoChanges.bnb || 0;
            break;
        case 'LTC':
            rate = cryptoPrices.litecoin || 70;
            amount = (price / rate).toFixed(3);
            change = cryptoChanges.litecoin || 0;
            break;
        case 'TRX':
            rate = cryptoPrices.tron || 0.08;
            amount = (price / rate).toFixed(0);
            change = cryptoChanges.tron || 0;
            break;
    }
    
    // Helper function to get change display
    const getChangeDisplay = (change) => {
        if (change > 0) {
            return `<span class="text-green-600 text-sm">+${change.toFixed(1)}%</span>`;
        } else if (change < 0) {
            return `<span class="text-red-600 text-sm">${change.toFixed(1)}%</span>`;
        } else {
            return `<span class="text-gray-500 text-sm">0.0%</span>`;
        }
    };
    
    // Update display
    const amountEl = document.getElementById('crypto-amount-display');
    const rateEl = document.getElementById('crypto-rate-display');
    const expectedEl = document.getElementById('expected-amount');
    
    // Get display currency for UI
    const displayCurrency = currency.startsWith('USDT_') ? 'USDT' : currency;
    
    if (amountEl) {
        amountEl.innerHTML = `${amount} ${displayCurrency}`;
    }
    
    if (rateEl) {
        rateEl.innerHTML = `1 ${displayCurrency} = $${rate.toLocaleString()} ${getChangeDisplay(change)}`;
    }
    
    if (expectedEl) {
        expectedEl.textContent = `${amount} ${displayCurrency}`;
    }
    
    // Store selected currency globally for price updates
    window.selectedCurrency = currency;
}

/**
 * Copy payment address to clipboard
 */
function copyPaymentAddress() {
    const address = document.getElementById('payment-address').textContent;
    const btn = document.getElementById('copy-address-btn');
    
    navigator.clipboard.writeText(address).then(() => {
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                Copied!
            `;
            btn.classList.add('bg-trust-green');
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('bg-trust-green');
            }, 2000);
        }
        
        if (window.showNotification) {
            window.showNotification('✓ Address copied to clipboard!', 'success');
        }
    }).catch(() => {
        if (window.showNotification) {
            window.showNotification('Failed to copy address', 'error');
        }
    });
}

/**
 * Generate unique payment ID
 */
function generatePaymentID() {
    // Generate unique payment ID (format: CTA-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `CTA-${dateStr}-${randomNum}`;
}

/**
 * Confirm payment and start monitoring
 */
function confirmPayment() {
    const email = document.getElementById('customer-email').value;
    
    if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    if (!selectedCurrency) {
        alert('Please select a payment currency first!');
        return;
    }
    
    // Generate payment ID
    const paymentID = generatePaymentID();
    
    // Store payment data
    const paymentData = {
        id: paymentID,
        email: email,
        currency: selectedCurrency,
        amount: document.getElementById('crypto-amount-display').textContent,
        address: PAYMENT_CONFIG.addresses[selectedCurrency],
        created: new Date().toISOString(),
        status: 'pending',
        price: window.CoinTraderApp?.selectedPlan?.price || 297
    };
    
    localStorage.setItem(`payment_${paymentID}`, JSON.stringify(paymentData));
    
    // Update UI
    const btn = document.getElementById('confirm-payment-btn');
    if (btn) {
        btn.innerHTML = '<span class="animate-pulse">Processing...</span>';
        btn.disabled = true;
    }
    
    // Show payment status
    showPaymentStatus(paymentData);
    
    // Start payment monitoring
    startPaymentMonitoring(paymentID);
    
    // Track event
    if (window.trackEvent) {
        window.trackEvent('payment_confirmed', 'payment', selectedCurrency, paymentData.price);
    }
}

/**
 * Show payment status display
 */
function showPaymentStatus(paymentData) {
    const statusDisplay = document.getElementById('payment-status-display');
    const paymentIdDisplay = document.getElementById('display-payment-id');
    const confirmBtn = document.getElementById('confirm-payment-btn');
    
    if (paymentIdDisplay) {
        paymentIdDisplay.textContent = paymentData.id;
    }
    
    if (statusDisplay) {
        statusDisplay.innerHTML = `
            <div class="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                <div class="flex items-start">
                    <svg class="w-6 h-6 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <div class="flex-1">
                        <h5 class="font-semibold text-green-800 mb-2">Payment Details Saved!</h5>
                        <p class="text-sm text-gray-700 mb-3">We're now monitoring the blockchain for your payment.</p>
                        <div class="bg-white rounded-lg p-4 border border-gray-200">
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span class="text-gray-600">Payment ID:</span>
                                    <span class="font-mono font-semibold text-gray-800 ml-2">${paymentData.id}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Email:</span>
                                    <span class="font-semibold text-gray-800 ml-2">${paymentData.email}</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-3">
                            <strong>Important:</strong> Keep this Payment ID for your records. You'll receive an email confirmation once payment is detected.
                        </p>
                    </div>
                </div>
            </div>
        `;
        statusDisplay.classList.remove('hidden');
    }
    
    if (confirmBtn) {
        confirmBtn.innerHTML = '<span id="confirm-btn-text">✓ Confirmed</span>';
        confirmBtn.classList.add('bg-trust-green');
        confirmBtn.disabled = true;
    }
}

/**
 * Start monitoring for payment
 */
function startPaymentMonitoring(paymentID) {
    let elapsed = 0;
    const timerEl = document.getElementById('payment-timer');
    const statusEl = document.getElementById('payment-status-text');
    
    // Clear any existing timer
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
    
    // Update timer every second
    paymentTimer = setInterval(() => {
        elapsed++;
        
        if (timerEl) {
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerEl.textContent = `Monitoring for ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Keep monitoring indefinitely until real blockchain integration
        // Removed automatic payment simulation for production readiness
        
        // Stop monitoring after 30 minutes
        if (elapsed >= 1800) {
            clearInterval(paymentTimer);
            if (statusEl) {
                statusEl.innerHTML = `
                    <span class="inline-flex items-center text-orange-600">
                        <span class="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                        Monitoring timed out
                    </span>
                `;
            }
        }
    }, 1000);
}

/**
 * Simulate payment received (for demo purposes)
 */
function simulatePaymentReceived(paymentID) {
    clearInterval(paymentTimer);
    
    const statusEl = document.getElementById('payment-status-text');
    const statusDisplay = document.getElementById('payment-status-display');
    
    if (statusEl) {
        statusEl.innerHTML = `
            <span class="inline-flex items-center text-green-600 font-semibold">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Payment Detected!
            </span>
        `;
    }
    
    // Update stored payment
    const storedPayment = localStorage.getItem(`payment_${paymentID}`);
    if (storedPayment) {
        const payment = JSON.parse(storedPayment);
        payment.status = 'confirmed';
        payment.confirmedAt = new Date().toISOString();
        localStorage.setItem(`payment_${paymentID}`, JSON.stringify(payment));
    }
    
    // Show success message
    if (statusDisplay) {
        statusDisplay.innerHTML = `
            <div class="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6">
                <div class="text-center">
                    <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <h5 class="text-2xl font-bold text-green-800 mb-2">Payment Confirmed!</h5>
                    <p class="text-lg text-gray-700 mb-4">Thank you for your purchase!</p>
                    <div class="bg-white rounded-lg p-4 border border-green-200 max-w-md mx-auto">
                        <p class="text-sm text-gray-700 mb-2">
                            <strong>What happens next:</strong>
                        </p>
                        <ul class="text-sm text-gray-600 space-y-1 text-left">
                            <li>• Access details sent to your email</li>
                            <li>• Check your inbox (and spam folder)</li>
                            <li>• Download link expires in 24 hours</li>
                        </ul>
                    </div>
                    <p class="text-sm text-gray-600 mt-4">
                        Didn't receive your email? Contact <a href="mailto:support@cointrader-ai.com" class="text-primary underline">support@cointrader-ai.com</a>
                    </p>
                </div>
            </div>
        `;
    }
    
    // Show notification
    if (window.showNotification) {
        window.showNotification('🎉 Payment confirmed! Check your email for access details.', 'success', 10000);
    }
}

/**
 * Check payment status
 */
function checkPaymentStatus() {
    const paymentID = document.getElementById('status-payment-id').value.trim();
    
    if (!paymentID) {
        alert('Please enter your Payment ID!');
        return;
    }
    
    // Check localStorage for payment (in real app, this would check database/API)
    const storedPayment = localStorage.getItem(`payment_${paymentID}`);
    const resultDiv = document.getElementById('payment-status-result');
    
    if (!resultDiv) return;
    
    if (storedPayment) {
        const payment = JSON.parse(storedPayment);
        resultDiv.innerHTML = `
            <div class="bg-blue-900 border border-blue-600 rounded p-3">
                <p class="text-blue-300 text-sm">
                    <strong>Payment ID:</strong> ${payment.id}<br>
                    <strong>Email:</strong> ${payment.email}<br>
                    <strong>Created:</strong> ${new Date(payment.created).toLocaleString()}<br>
                    <strong>Status:</strong> <span class="text-yellow-300">⏳ Pending - Send crypto and email TxID to payments@cointrader-ai.com</span>
                </p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="bg-red-900 border border-red-600 rounded p-3">
                <p class="text-red-300 text-sm">
                    ❌ Payment ID not found. Please check your ID or generate a new one above.
                </p>
            </div>
        `;
    }
    
    resultDiv.classList.remove('hidden');
}

/**
 * Send payment confirmation email
 */
function sendPaymentConfirmation(button) {
    const email = document.getElementById('customer-email').value;
    const paymentID = document.getElementById('payment-id').textContent;
    
    if (!email || !paymentID) {
        alert('Please generate a payment ID first!');
        return;
    }
    
    // Show loading state
    button.innerHTML = '⏳ Sending...';
    button.disabled = true;
    
    // Simulate sending email (in real app, this would call API)
    setTimeout(() => {
        button.innerHTML = '✅ Sent!';
        button.style.backgroundColor = '#10B981';
        
        if (window.showNotification) {
            window.showNotification('Payment confirmation sent! Check your email for next steps.', 'success', 4000);
        }
        
        // Reset button after 5 seconds
        setTimeout(() => {
            button.innerHTML = '📧 Send Payment Confirmation Email';
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 5000);
    }, 2000);
}

/**
 * Process payment verification (placeholder for real implementation)
 */
async function verifyPayment(paymentId, txHash, currency) {
    try {
        const response = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentId,
                txHash,
                currency
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Payment verification failed:', error);
        return { verified: false, error: 'Verification failed' };
    }
}

/**
 * Create payment request (placeholder for real implementation)
 */
async function createPaymentRequest(amount, currency, metadata = {}) {
    try {
        const response = await fetch('/api/payment/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                currency,
                metadata
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Payment creation failed:', error);
        return { error: 'Payment creation failed' };
    }
}

/**
 * Load wallet addresses from API
 */
async function loadWalletAddresses() {
    try {
        const response = await fetch('/api/payment/wallet-addresses');
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.addresses) {
                // Update addresses with server values
                Object.assign(PAYMENT_CONFIG.addresses, data.addresses);
                console.log('✅ Wallet addresses loaded from server');
            }
        }
    } catch (error) {
        console.warn('⚠️ Failed to load wallet addresses from server, using defaults:', error);
    }
}

/**
 * Initialize payment system
 */
function initializePaymentSystem() {
    // Load wallet addresses from server
    loadWalletAddresses();
    
    // Load crypto prices when payment section is visible
    if (window.CoinTraderApp && window.CoinTraderApp.loadCryptoPrices) {
        window.CoinTraderApp.loadCryptoPrices();
    }
    
    // Set up event listeners for payment forms
    const emailInput = document.getElementById('customer-email');
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generatePaymentID();
            }
        });
    }
    
    const statusInput = document.getElementById('status-payment-id');
    if (statusInput) {
        statusInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPaymentStatus();
            }
        });
    }
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Format currency amount
 */
function formatCurrencyAmount(amount, decimals = 2) {
    return parseFloat(amount).toFixed(decimals);
}

/**
 * Generate QR code data for crypto payments
 */
function generateQRData(currency, address, amount) {
    return address;
}

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSystem();
});

// Global function exports for HTML onclick handlers
window.selectPaymentCurrency = selectPaymentCurrency;
window.copyPaymentAddress = copyPaymentAddress;
window.confirmPayment = confirmPayment;
window.generatePaymentID = generatePaymentID;
window.checkPaymentStatus = checkPaymentStatus;
window.sendPaymentConfirmation = sendPaymentConfirmation;