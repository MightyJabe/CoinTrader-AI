/**
 * Calculator JavaScript - Profit calculator and ROI calculations
 */

/**
 * Enhanced Profit Calculator
 */
function calculateProfit() {
    const investment = parseFloat(document.getElementById('investment-amount').value) || 1000;
    const timeMonths = parseInt(document.getElementById('time-period').value) || 3;
    const riskLevel = document.getElementById('risk-level').value || 'balanced';
    
    // Track calculator usage
    if (window.trackEvent) {
        window.trackEvent('calculator_used', 'engagement', `${timeMonths}m_${riskLevel}`, investment);
    }
    
    // Risk level configurations
    const riskConfigs = {
        conservative: { 
            min: 0.06, 
            max: 0.10, 
            avg: 0.08, 
            label: 'Low Risk', 
            width: 30, 
            color: '#10B981' 
        },
        balanced: { 
            min: 0.08, 
            max: 0.15, 
            avg: 0.115, 
            label: 'Moderate Risk', 
            width: 50, 
            color: 'linear-gradient(90deg, #10B981, #F59E0B)' 
        },
        aggressive: { 
            min: 0.12, 
            max: 0.20, 
            avg: 0.16, 
            label: 'High Risk', 
            width: 80, 
            color: '#F59E0B' 
        }
    };
    
    const config = riskConfigs[riskLevel];
    const monthlyReturn = config.avg;
    
    // Calculate compound returns month by month
    let totalReturn = investment;
    let monthlyBreakdown = [];
    
    for (let i = 0; i < timeMonths; i++) {
        const monthStart = totalReturn;
        totalReturn *= (1 + monthlyReturn);
        const monthProfit = totalReturn - monthStart;
        monthlyBreakdown.push({
            month: i + 1,
            startBalance: monthStart,
            endBalance: totalReturn,
            profit: monthProfit
        });
    }
    
    const profit = totalReturn - investment;
    const roi = ((profit / investment) * 100);
    const dailyAvg = profit / (timeMonths * 30);
    const monthlyAvg = profit / timeMonths;
    
    // Update main displays
    updateCalculatorDisplay({
        profit,
        totalReturn,
        roi,
        dailyAvg,
        monthlyAvg,
        config,
        monthlyBreakdown,
        investment,
        timeMonths
    });
}

/**
 * Update calculator display elements
 */
function updateCalculatorDisplay(data) {
    const {
        profit,
        totalReturn,
        roi,
        dailyAvg,
        monthlyAvg,
        config,
        monthlyBreakdown,
        investment,
        timeMonths
    } = data;
    
    // Main profit displays
    const profitDisplayEl = document.getElementById('profit-display');
    const totalReturnEl = document.getElementById('total-return');
    const roiPercentEl = document.getElementById('roi-percent');
    const dailyAvgEl = document.getElementById('daily-avg');
    const monthlyAvgEl = document.getElementById('monthly-avg');
    
    if (profitDisplayEl) {
        profitDisplayEl.textContent = `$${profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    if (totalReturnEl) {
        totalReturnEl.textContent = `$${totalReturn.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    if (roiPercentEl) {
        roiPercentEl.textContent = `${roi.toFixed(0)}%`;
    }
    if (dailyAvgEl) {
        dailyAvgEl.textContent = `$${dailyAvg.toFixed(0)}`;
    }
    if (monthlyAvgEl) {
        monthlyAvgEl.textContent = `$${monthlyAvg.toFixed(0)}`;
    }
    
    // Update return range description
    const returnRangeEl = document.getElementById('return-range');
    if (returnRangeEl) {
        returnRangeEl.textContent = `${(config.min * 100).toFixed(0)}%-${(config.max * 100).toFixed(0)}% monthly return strategy*`;
    }
    
    // Update monthly breakdown
    const monthlyBreakdownEl = document.getElementById('monthly-breakdown');
    if (monthlyBreakdownEl) {
        const breakdownHTML = monthlyBreakdown.map(month =>
            `<div class="flex justify-between text-xs mb-1">
                <span class="text-gray-400">Month ${month.month}:</span>
                <span class="text-green-600">+$${month.profit.toFixed(0)}</span>
            </div>`
        ).join('');
        monthlyBreakdownEl.innerHTML = breakdownHTML;
    }
    
    // Update risk indicator
    const riskIndicatorEl = document.getElementById('risk-indicator');
    const riskBarEl = document.getElementById('risk-bar');
    
    if (riskIndicatorEl) {
        riskIndicatorEl.textContent = config.label;
    }
    if (riskBarEl) {
        riskBarEl.style.width = `${config.width}%`;
        riskBarEl.style.background = config.color;
    }
    
    // Calculate traditional investment comparisons
    updateInvestmentComparisons(investment, timeMonths, profit);
}

/**
 * Update investment comparison section
 */
function updateInvestmentComparisons(investment, timeMonths, profit) {
    const savingsReturn = investment * Math.pow(1 + 0.005 / 12, timeMonths) - investment;
    const stocksReturn = investment * Math.pow(1 + 0.07 / 12, timeMonths) - investment;
    const multiplier = profit > 0 ? (profit / Math.max(stocksReturn, 1)).toFixed(0) : 0;
    
    const savingsComparisonEl = document.getElementById('savings-comparison');
    const stocksComparisonEl = document.getElementById('stocks-comparison');
    const cryptoComparisonEl = document.getElementById('crypto-comparison');
    
    if (savingsComparisonEl) {
        savingsComparisonEl.textContent = `$${savingsReturn.toFixed(0)}`;
    }
    if (stocksComparisonEl) {
        stocksComparisonEl.textContent = `$${stocksReturn.toFixed(0)}`;
    }
    if (cryptoComparisonEl) {
        cryptoComparisonEl.textContent = `$${profit.toFixed(0)}`;
    }
    
    // Update multiplier text
    const multiplierElements = document.querySelectorAll('.multiplier-text');
    multiplierElements.forEach(el => {
        el.textContent = `${multiplier}x better returns*`;
    });
}

/**
 * Slider synchronization functions
 */
function updateInvestmentAmount() {
    const slider = document.getElementById('investment-slider');
    const input = document.getElementById('investment-amount');
    
    if (slider && input) {
        input.value = slider.value;
        calculateProfit();
    }
}

function updateInvestmentSlider() {
    const slider = document.getElementById('investment-slider');
    const input = document.getElementById('investment-amount');
    
    if (slider && input) {
        slider.value = input.value;
        calculateProfit();
    }
}

function updateTimePeriod() {
    const slider = document.getElementById('time-slider');
    const select = document.getElementById('time-period');
    
    if (slider && select) {
        select.value = slider.value;
        calculateProfit();
    }
}

function updateTimeSlider() {
    const slider = document.getElementById('time-slider');
    const select = document.getElementById('time-period');
    
    if (slider && select) {
        slider.value = select.value;
        calculateProfit();
    }
}

/**
 * Initialize calculator
 */
function initializeCalculator() {
    // Set up event listeners
    const investmentAmountEl = document.getElementById('investment-amount');
    const timePeriodEl = document.getElementById('time-period');
    const riskLevelEl = document.getElementById('risk-level');
    const investmentSliderEl = document.getElementById('investment-slider');
    const timeSliderEl = document.getElementById('time-slider');
    
    if (investmentAmountEl) {
        investmentAmountEl.addEventListener('input', updateInvestmentSlider);
    }
    if (timePeriodEl) {
        timePeriodEl.addEventListener('change', updateTimeSlider);
    }
    if (riskLevelEl) {
        riskLevelEl.addEventListener('change', calculateProfit);
    }
    if (investmentSliderEl) {
        investmentSliderEl.addEventListener('input', updateInvestmentAmount);
    }
    if (timeSliderEl) {
        timeSliderEl.addEventListener('input', updateTimePeriod);
    }
    
    // Initial calculation
    calculateProfit();
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Calculate compound interest
 */
function calculateCompoundInterest(principal, rate, time, compound = 12) {
    return principal * Math.pow((1 + rate / compound), compound * time);
}

/**
 * Calculate simple interest
 */
function calculateSimpleInterest(principal, rate, time) {
    return principal * (1 + rate * time);
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Delay initialization to ensure all elements are loaded
    setTimeout(initializeCalculator, 100);
});

// Global function exports for HTML onclick handlers and inline scripts
window.calculateProfit = calculateProfit;
window.updateInvestmentAmount = updateInvestmentAmount;
window.updateInvestmentSlider = updateInvestmentSlider;
window.updateTimePeriod = updateTimePeriod;
window.updateTimeSlider = updateTimeSlider;