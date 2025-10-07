// Custom Project Calculator JavaScript
// Based on the spreadsheet formulas provided

// Labor rates (fixed)
const LABOR_RATES = {
    foreman: 60,    // $60/hour
    helper1: 35,    // $35/hour
    helper2: 35     // $35/hour
};

// Hours per day
const HOURS_PER_DAY = 8;

// Current selected margin
let selectedMargin = 0.55; // Default to 55%
window.selectedMargin = selectedMargin; // Make globally accessible

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Helper function to format numbers
function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Helper function to format numbers with decimals for days
function formatDays(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(number);
}

// Calculate total labor cost
function calculateLaborCost() {
    const foremanDays = parseFloat(document.getElementById('foremanDays').value) || 0;
    const helper1Days = parseFloat(document.getElementById('helper1Days').value) || 0;
    const helper2Days = parseFloat(document.getElementById('helper2Days').value) || 0;
    
    // Calculate hours
    const foremanHours = foremanDays * HOURS_PER_DAY;
    const helper1Hours = helper1Days * HOURS_PER_DAY;
    const helper2Hours = helper2Days * HOURS_PER_DAY;
    
    // Calculate costs
    const foremanCost = foremanHours * LABOR_RATES.foreman;
    const helper1Cost = helper1Hours * LABOR_RATES.helper1;
    const helper2Cost = helper2Hours * LABOR_RATES.helper2;
    
    const totalLaborCost = foremanCost + helper1Cost + helper2Cost;
    const totalDays = foremanDays + helper1Days + helper2Days;
    const totalHours = foremanHours + helper1Hours + helper2Hours;
    
    // Update display
    document.getElementById('totalLaborDays').textContent = formatDays(totalDays);
    document.getElementById('totalLaborHours').textContent = formatNumber(totalHours);
    document.getElementById('totalLaborCost').textContent = formatCurrency(totalLaborCost);
    
    return totalLaborCost;
}

// Calculate project management cost
function calculateProjectManagementCost() {
    let totalCost = 0;
    
    // Check which project management option is selected
    if (document.getElementById('smallProject').checked) {
        totalCost += 1000;
    }
    if (document.getElementById('mediumProject').checked) {
        totalCost += 2000;
    }
    if (document.getElementById('bigProject').checked) {
        totalCost += 4000;
    }
    
    document.getElementById('totalProjectManagement').textContent = formatCurrency(totalCost);
    return totalCost;
}

// Calculate total COGS
function calculateTotalCOGS() {
    const laborCost = calculateLaborCost();
    const materialsCost = parseFloat(document.getElementById('materialsCost').value) || 0;
    const projectManagementCost = calculateProjectManagementCost();
    
    const totalCOGS = laborCost + materialsCost + projectManagementCost;
    
    // Update the main total COGS display
    document.getElementById('totalCOGS').textContent = formatCurrency(totalCOGS);
    
    // Update the breakdown display in the cost summary section
    document.getElementById('displayLaborCost').textContent = formatCurrency(laborCost);
    document.getElementById('displayMaterialsCost').textContent = formatCurrency(materialsCost);
    document.getElementById('displayProjectManagement').textContent = formatCurrency(projectManagementCost);
    
    return totalCOGS;
}

// Calculate customer prices for different margins
function calculateCustomerPrices(totalCOGS) {
    const margins = [0.45, 0.55, 0.65];
    
    margins.forEach(margin => {
        // Formula: Customer Price = Total COGS / (1 - Margin Percentage)
        const customerPrice = totalCOGS / (1 - margin);
        document.getElementById(`price${Math.round(margin * 100)}`).textContent = formatCurrency(customerPrice);
    });
}

// Select margin option
function selectMargin(margin) {
    console.log('selectMargin called with:', margin);
    selectedMargin = margin;
    window.selectedMargin = margin; // Update global variable
    
    // Update visual selection
    document.querySelectorAll('.margin-option').forEach(option => {
        option.classList.remove('selected');
        console.log('Removed selected from:', option.dataset.margin);
    });
    
    // Format margin to match HTML data attributes (0.60, not 0.6)
    const formattedMargin = margin.toFixed(2);
    const targetElement = document.querySelector(`[data-margin="${formattedMargin}"]`);
    console.log('Looking for element with data-margin:', formattedMargin);
    console.log('Target element found:', targetElement);
    
    if (targetElement) {
        targetElement.classList.add('selected');
        console.log('Added selected class to:', formattedMargin);
    } else {
        console.error('Could not find element with data-margin:', formattedMargin);
    }
}

// selectMargin function is now used internally via event listeners

// Main calculation function
function calculateTotal() {
    const totalCOGS = calculateTotalCOGS();
    calculateCustomerPrices(totalCOGS);
}

// Initialize calculator
function initializeCalculator() {
    // Add event listeners to all inputs
    const inputs = document.querySelectorAll('input[type="number"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
        input.addEventListener('change', calculateTotal);
    });
    
    // Add event listeners to margin options
    const marginOptions = document.querySelectorAll('.margin-option');
    marginOptions.forEach(option => {
        option.addEventListener('click', function() {
            const margin = parseFloat(this.dataset.margin);
            selectMargin(margin);
        });
    });
    
    // Initial calculation
    calculateTotal();
}

// Reset calculator
function resetCalculator() {
    // Reset all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset margin selection to default
    selectMargin(0.55);
    
    // Recalculate
    calculateTotal();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    
    // Ensure 55% margin is selected by default
    setTimeout(() => {
        selectMargin(0.55);
    }, 200);
});
