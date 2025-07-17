/**
 * Payment JavaScript - Payment processing, ID generation, and status checking
 */

/**
 * Generate unique payment ID
 */
function generatePaymentID() {
    const email = document.getElementById('customer-email').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address first!');
        return;
    }
    
    // Generate unique payment ID (format: CTA-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const paymentID = `CTA-${dateStr}-${randomNum}`;
    
    // Store email and payment ID (in real app, this would go to database)
    localStorage.setItem(`payment_${paymentID}`, JSON.stringify({
        email: email,
        id: paymentID,
        created: new Date().toISOString(),
        status: 'pending'
    }));
    
    // Show payment ID section
    const paymentIdEl = document.getElementById('payment-id');
    const paymentIdSection = document.getElementById('payment-id-section');
    
    if (paymentIdEl && paymentIdSection) {
        paymentIdEl.textContent = paymentID;
        paymentIdSection.classList.remove('hidden');
    }
    
    // Show success notification
    if (window.showNotification) {
        window.showNotification('Payment ID generated! Please save it safely.', 'success', 4000);
    }
}

/**
 * Copy payment ID to clipboard
 */
function copyPaymentID() {
    const paymentID = document.getElementById('payment-id').textContent;
    
    navigator.clipboard.writeText(paymentID).then(() => {
        if (window.showNotification) {
            window.showNotification('✓ Payment ID copied!', 'success');
        }
    }).catch(() => {
        if (window.showNotification) {
            window.showNotification('Failed to copy Payment ID', 'error');
        }
    });
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
 * Initialize payment system
 */
function initializePaymentSystem() {
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
    return `${currency.toLowerCase()}:${address}?amount=${amount}`;
}

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSystem();
});

// Global function exports for HTML onclick handlers
window.generatePaymentID = generatePaymentID;
window.copyPaymentID = copyPaymentID;
window.checkPaymentStatus = checkPaymentStatus;
window.sendPaymentConfirmation = sendPaymentConfirmation;