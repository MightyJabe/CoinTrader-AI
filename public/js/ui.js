/**
 * UI JavaScript - User interface interactions, modals, and dynamic elements
 */

/**
 * Chat Support Widget
 */
let chatWidget = null;

function initializeChatWidget() {
    createChatButton();
}

function createChatButton() {
    const chatBtn = document.createElement('button');
    chatBtn.id = 'chat-support-btn';
    chatBtn.className = 'chat-support-btn';
    chatBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
            </path>
        </svg>
    `;
    chatBtn.onclick = toggleChat;
    document.body.appendChild(chatBtn);
}

function toggleChat() {
    if (chatWidget && chatWidget.style.display !== 'none') {
        closeChatWidget();
    } else {
        openChatWidget();
    }
}

function openChatWidget() {
    if (!chatWidget) {
        createChatWidget();
    }
    chatWidget.style.display = 'block';
    chatWidget.classList.add('scale-in');
    
    // Track chat open event
    if (window.trackEvent) {
        window.trackEvent('chat_opened', 'engagement', 'support_chat');
    }
}

function closeChatWidget() {
    if (chatWidget) {
        chatWidget.style.display = 'none';
        chatWidget.classList.remove('scale-in');
    }
}

function createChatWidget() {
    chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.className = 'fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] flex flex-col';
    chatWidget.style.display = 'none';
    
    chatWidget.innerHTML = `
        <div class="bg-blue-600 p-4 rounded-t-2xl flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <h3 class="text-white font-bold">Get Help & Start Earning</h3>
            </div>
            <button onclick="closeChatWidget()" class="text-white hover:text-gray-200 text-xl">&times;</button>
        </div>
        <div class="flex-1 p-4 overflow-y-auto" id="chat-messages">
            <div class="bg-gray-100 rounded-lg p-3 mb-4">
                <p class="text-gray-700 text-sm">
                    <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"></path>
                    </svg>
                    Hi! I'm here to help you start making money with CoinTrader AI. What would you like to know?
                </p>
            </div>
            <div class="grid grid-cols-1 gap-2">
                <button onclick="sendQuickMessage('How does it work?')" class="bg-primary text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
                    How does it work?
                </button>
                <button onclick="sendQuickMessage('What exchanges work?')" class="bg-primary text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
                    What exchanges work?
                </button>
                <button onclick="sendQuickMessage('Is it safe?')" class="bg-primary text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
                    Is it safe?
                </button>
                <button onclick="sendQuickMessage('How to buy?')" class="bg-primary text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
                    How to buy?
                </button>
            </div>
        </div>
        <div class="p-4 border-t">
            <div class="flex gap-2">
                <input type="text" id="chat-input" placeholder="Type your message..." 
                    class="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                    onkeypress="handleChatKeyPress(event)">
                <button onclick="sendChatMessage()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Send
                </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">I'll respond instantly!</p>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
}

function sendQuickMessage(message) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = message;
        sendChatMessage();
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'bg-blue-600 text-white p-3 rounded-lg mb-4 ml-8';
    userMessage.innerHTML = `<p class="text-sm">${message}</p>`;
    messagesContainer.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Add bot response after a short delay
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bg-gray-100 rounded-lg p-3 mb-4';
        botMessage.innerHTML = `<p class="text-gray-700 text-sm">${getAutoResponse(message)}</p>`;
        messagesContainer.appendChild(botMessage);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAutoResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('money') || lowerMessage.includes('start'))) {
        return "It's simple! Connect your exchange → Pick a strategy → Start earning! Our AI watches the markets 24/7 and makes profitable trades automatically. Most users see results within their first week. Ready to get started?";
    } else if (lowerMessage.includes('exchange')) {
        return "We work with all the big ones! Binance, Coinbase, Kraken, KuCoin, Bybit, and 15+ more. Your license works on unlimited exchanges, so you can trade everywhere and maximize your profits!";
    } else if (lowerMessage.includes('guarantee') || lowerMessage.includes('refund') || lowerMessage.includes('safe')) {
        return "Absolutely! 30-day money-back guarantee, no questions asked. Plus your funds stay in YOUR exchange account - we can only make trades, never withdraw your money. You're 100% protected!";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('buy')) {
        return "Super easy! Choose your plan below, pay with Bitcoin, Ethereum, or USDT, and you'll have access in 5 minutes. One-time payment = lifetime access. No monthly fees ever!";
    } else if (lowerMessage.includes('telegram')) {
        return "Our exclusive Telegram group is a special bonus for customers only! After your payment is confirmed, you'll receive an invite link. It's a highly active community of members sharing strategies and results.";
    } else if (lowerMessage.includes('install') || lowerMessage.includes('setup')) {
        return "Installation is super easy! After purchase, you'll receive a download link and step-by-step guide. The bot works on Windows, Mac, and Linux. Most users are up and running in under 5 minutes.";
    } else {
        return "I'd love to help you start making money! Ready to join thousands of profitable traders? Choose your plan below and start earning in minutes. Questions? Just ask!";
    }
}

/**
 * Modal System
 */
function createModal(title, content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b">
                <h3 class="text-lg font-semibold">${title}</h3>
                <button onclick="closeModal(this)" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="p-6">
                ${content}
            </div>
            ${options.showButtons !== false ? `
                <div class="flex justify-end gap-3 p-6 border-t">
                    <button onclick="closeModal(this)" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Cancel
                    </button>
                    <button onclick="closeModal(this)" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        OK
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal.querySelector('button'));
        }
    });
    
    return modal;
}

function closeModal(button) {
    const modal = button.closest('.fixed');
    if (modal) {
        modal.remove();
    }
}

/**
 * Video Demo Player
 */
function playDemoVideo() {
    const videoContent = `
        <div class="text-center">
            <p class="mb-4">Demo video coming soon!</p>
            <p class="text-sm text-gray-600">
                Our AI trading demo will show you exactly how the system works 
                and how it can help you generate passive income.
            </p>
        </div>
    `;
    
    createModal('CoinTrader AI Demo', videoContent);
    
    // Track video play attempt
    if (window.trackEvent) {
        window.trackEvent('video_play_attempted', 'engagement', 'demo_video');
    }
}

/**
 * Tooltip System
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed bg-gray-800 text-white text-sm px-2 py-1 rounded z-50 pointer-events-none';
    tooltip.textContent = tooltipText;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Dynamic Progress Indicators
 */
function updateProgressIndicators() {
    // Update license counter
    const licensesLeftEl = document.getElementById('licenses-left');
    if (licensesLeftEl) {
        const currentCount = parseInt(licensesLeftEl.textContent) || 47;
        const newCount = Math.max(1, currentCount - Math.floor(Math.random() * 2));
        licensesLeftEl.textContent = `${newCount} remaining`;
        
        if (newCount <= 10) {
            licensesLeftEl.className = 'text-red-600 font-bold animate-pulse';
        }
    }
}

/**
 * Smooth Reveal Animations
 */
function initializeRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger staggered animations for children
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with reveal classes
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .stagger-children')
        .forEach(el => observer.observe(el));
}

/**
 * Dynamic Background Particles
 */
function createBackgroundParticles() {
    const particleContainer = document.querySelector('.background-particles');
    if (!particleContainer) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `particle particle-${(i % 4) + 1}`;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        particleContainer.appendChild(particle);
    }
}

/**
 * Initialize all UI components
 */
function initializeUI() {
    initializeChatWidget();
    initializeTooltips();
    initializeRevealAnimations();
    createBackgroundParticles();
    
    // Update progress indicators periodically
    setInterval(updateProgressIndicators, 30000); // Every 30 seconds
    
    console.log('UI components initialized');
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeUI, 100);
});

// Global function exports for HTML onclick handlers
window.toggleChat = toggleChat;
window.openChatWidget = openChatWidget;
window.closeChatWidget = closeChatWidget;
window.sendQuickMessage = sendQuickMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.sendChatMessage = sendChatMessage;
window.playDemoVideo = playDemoVideo;
window.createModal = createModal;
window.closeModal = closeModal;