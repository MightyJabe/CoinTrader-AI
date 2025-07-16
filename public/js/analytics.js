/**
 * Analytics JavaScript - Event tracking and analytics
 */

/**
 * Initialize Google Analytics
 */
function initializeAnalytics() {
    // Google Analytics is loaded via the HTML head
    // This function sets up additional tracking
    
    if (typeof gtag !== 'undefined') {
        console.log('Google Analytics initialized');
        
        // Track page view
        trackPageView();
        
        // Set up scroll tracking
        initializeScrollTracking();
        
        // Set up click tracking
        initializeClickTracking();
    } else {
        console.warn('Google Analytics not loaded');
    }
}

/**
 * Track custom events
 */
function trackEvent(eventName, eventCategory, eventLabel, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': eventCategory,
            'event_label': eventLabel,
            'value': value
        });
        
        console.log('Event tracked:', eventName, eventCategory, eventLabel, value);
    } else {
        console.log('Analytics not available - Event:', eventName, eventCategory, eventLabel, value);
    }
}

/**
 * Track page views
 */
function trackPageView(page_title, page_location) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: page_title || document.title,
            page_location: page_location || window.location.href
        });
    }
}

/**
 * Track user engagement
 */
function trackEngagement(action, element) {
    trackEvent('engagement', 'user_interaction', action, element);
}

/**
 * Track conversions
 */
function trackConversion(type, value) {
    trackEvent('conversion', 'purchase_intent', type, value);
}

/**
 * Track scroll depth
 */
function initializeScrollTracking() {
    const scrollThresholds = [25, 50, 75, 90];
    const scrolledThresholds = new Set();
    
    function trackScrollDepth() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        scrollThresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !scrolledThresholds.has(threshold)) {
                scrolledThresholds.add(threshold);
                trackEvent('scroll_depth', 'engagement', `${threshold}%`, threshold);
            }
        });
    }
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                trackScrollDepth();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Track important clicks
 */
function initializeClickTracking() {
    // Track CTA button clicks
    document.querySelectorAll('.btn-primary, .cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('cta_click', 'conversion', buttonText);
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('nav a, .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim();
            trackEvent('navigation_click', 'engagement', linkText);
        });
    });
    
    // Track pricing plan clicks
    document.querySelectorAll('[onclick*="selectPlan"]').forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.getAttribute('onclick').match(/selectPlan\('([^']+)'\)/)?.[1];
            if (planName) {
                trackEvent('plan_selection', 'conversion', planName);
            }
        });
    });
    
    // Track FAQ interactions
    document.querySelectorAll('[onclick*="toggleFAQ"]').forEach(button => {
        button.addEventListener('click', function() {
            const faqNumber = this.getAttribute('onclick').match(/toggleFAQ\((\d+)\)/)?.[1];
            if (faqNumber) {
                trackEvent('faq_interaction', 'engagement', `faq_${faqNumber}`);
            }
        });
    });
    
    // Track external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            trackEvent('external_link_click', 'engagement', href);
        });
    });
}

/**
 * Track form interactions
 */
function trackFormInteraction(formName, action, field) {
    trackEvent('form_interaction', formName, `${action}_${field}`);
}

/**
 * Track calculator usage
 */
function trackCalculatorUsage(investment, timeframe, riskLevel) {
    trackEvent('calculator_used', 'engagement', `${timeframe}m_${riskLevel}`, investment);
}

/**
 * Track payment funnel
 */
function trackPaymentFunnel(step, data = {}) {
    const funnelSteps = {
        'plan_selected': 'Plan Selected',
        'email_entered': 'Email Entered',
        'payment_id_generated': 'Payment ID Generated',
        'payment_initiated': 'Payment Initiated',
        'payment_completed': 'Payment Completed'
    };
    
    trackEvent('payment_funnel', 'conversion', funnelSteps[step] || step, data.value);
}

/**
 * Track user timing
 */
function trackTiming(category, variable, time, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            'name': variable,
            'value': time,
            'event_category': category,
            'event_label': label
        });
    }
}

/**
 * Track errors
 */
function trackError(error, context) {
    trackEvent('javascript_error', 'error', error.message || error, context);
}

/**
 * Track performance metrics
 */
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                
                trackTiming('page_performance', 'page_load_time', pageLoadTime, 'full_page');
                trackTiming('page_performance', 'dom_ready_time', domReadyTime, 'dom_ready');
            }, 0);
        });
    }
}

/**
 * Track user sessions
 */
function trackSession() {
    const sessionStart = Date.now();
    const sessionId = generateSessionId();
    
    // Track session start
    trackEvent('session_start', 'engagement', 'new_session');
    
    // Track session end on page unload
    window.addEventListener('beforeunload', function() {
        const sessionDuration = Date.now() - sessionStart;
        trackTiming('user_engagement', 'session_duration', sessionDuration, 'page_session');
    });
    
    return sessionId;
}

/**
 * Generate session ID
 */
function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Track user demographics (if available)
 */
function trackUserProperties(properties) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            custom_map: properties
        });
    }
}

/**
 * Enhanced ecommerce tracking
 */
function trackPurchase(transactionId, items, value, currency = 'USD') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            'transaction_id': transactionId,
            'value': value,
            'currency': currency,
            'items': items
        });
    }
}

/**
 * Set up error tracking
 */
function setupErrorTracking() {
    window.addEventListener('error', function(e) {
        trackError(e.error || e.message, {
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        });
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        trackError(e.reason, 'unhandled_promise_rejection');
    });
}

/**
 * Initialize all analytics
 */
function initializeAllAnalytics() {
    initializeAnalytics();
    trackPerformance();
    trackSession();
    setupErrorTracking();
    
    console.log('Analytics system initialized');
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllAnalytics();
});

// Global function exports
window.trackEvent = trackEvent;
window.trackEngagement = trackEngagement;
window.trackConversion = trackConversion;
window.trackFormInteraction = trackFormInteraction;
window.trackCalculatorUsage = trackCalculatorUsage;
window.trackPaymentFunnel = trackPaymentFunnel;
window.trackError = trackError;