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
    chatWidget.className = 'fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50';
    chatWidget.style.display = 'none';
    
    chatWidget.innerHTML = `
        <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 class="font-semibold">Live Support</h3>
            <button onclick="closeChatWidget()" class="text-white hover:text-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="p-4 h-64 overflow-y-auto">
            <div class="mb-4">
                <div class="bg-gray-100 p-3 rounded-lg mb-2">
                    <p class="text-sm">Hi! 👋 How can we help you today?</p>
                </div>
                <div class="bg-gray-100 p-3 rounded-lg">
                    <p class="text-sm">Common questions:</p>
                    <ul class="text-xs mt-2 space-y-1">
                        <li>• How does the AI trading work?</li>
                        <li>• What exchanges are supported?</li>
                        <li>• Is my money safe?</li>
                        <li>• How do I get started?</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="p-4 border-t">
            <div class="flex gap-2">
                <input type="text" placeholder="Type your message..." 
                    class="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600">
                <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Send
                </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">We typically respond within 15 minutes</p>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
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
window.playDemoVideo = playDemoVideo;
window.createModal = createModal;
window.closeModal = closeModal;