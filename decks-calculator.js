// Helper function to format currency with commas
function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

// Helper function to format numbers with commas but no decimals
function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function calculateCost() {
    // Get measurements
    const firstFloorSF = parseFloat(document.getElementById('firstFloorSF').value) || 0;
    const secondFloorSF = parseFloat(document.getElementById('secondFloorSF').value) || 0;
    const railingLF = parseFloat(document.getElementById('railingLF').value) || 0;
    const steps = parseFloat(document.getElementById('steps').value) || 0;

    // Get selected materials
    const firstLevel = document.querySelector('input[name="firstLevel"]:checked');
    const secondLevel = document.querySelector('input[name="secondLevel"]:checked');
    const railing = document.querySelector('input[name="railing"]:checked');

    let totalCost = 0;
    let firstLevelTotal = 0;
    let secondLevelTotal = 0;
    let railingsTotal = 0;
    let optionsTotal = 0;

    // Calculate first level cost
    if (firstLevel) {
        firstLevelTotal = firstFloorSF * parseFloat(firstLevel.dataset.price);
        totalCost += firstLevelTotal;
    }

    // Calculate second level cost
    if (secondLevel) {
        secondLevelTotal = secondFloorSF * parseFloat(secondLevel.dataset.price);
        totalCost += secondLevelTotal;
    }

    // Calculate railing cost
    if (railing) {
        railingsTotal = railingLF * parseFloat(railing.dataset.price);
        totalCost += railingsTotal;
    }

    // Calculate additional options
    if (document.getElementById('pressureTreated').checked) {
        optionsTotal += firstFloorSF * 32;
    }
    if (document.getElementById('secondStoryFraming').checked) {
        optionsTotal += secondFloorSF * 38;
    }
    if (document.getElementById('stairs').checked) {
        optionsTotal += steps * 255;
    }
    if (document.getElementById('dumpFee').checked) {
        optionsTotal += (firstFloorSF + secondFloorSF) * 6;
    }
    if (document.getElementById('permits').checked) {
        optionsTotal += 4000;
    }
    if (document.getElementById('rainEscape').checked) {
        optionsTotal += (firstFloorSF + secondFloorSF) * 28;
    }
    // Add custom option cost
    const customPrice = parseFloat(document.getElementById('customOptionPrice').value) || 0;
    optionsTotal += customPrice;
    totalCost += optionsTotal;

    // Update section totals
    document.getElementById('firstLevelTotal').textContent = formatCurrency(firstLevelTotal);
    document.getElementById('secondLevelTotal').textContent = formatCurrency(secondLevelTotal);
    document.getElementById('railingsTotal').textContent = formatCurrency(railingsTotal);
    document.getElementById('optionsTotal').textContent = formatCurrency(optionsTotal);

    // Display results
    document.getElementById('result').innerHTML = `
        <h3>Cost Breakdown:</h3>
        <p>Total Square Footage: ${formatNumber(firstFloorSF + secondFloorSF)} SF</p>
        <p>Total Railing Length: ${formatNumber(railingLF)} LF</p>
        <p>Number of Steps: ${formatNumber(steps)}</p>
        <p><strong>Total Estimated Cost: ${formatCurrency(totalCost)}</strong></p>
    `;
}

// Add event listeners to all inputs
function initializeAutoCalculate() {
    // Listen to number inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', calculateCost);
    });

    // Listen to custom option price
    document.getElementById('customOptionPrice').addEventListener('input', calculateCost);

    // Listen to radio buttons
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', calculateCost);
    });

    // Listen to checkboxes
    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach(input => {
        input.addEventListener('change', calculateCost);
    });
}

function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'ORE' && password === 'ORE') {
        document.getElementById('loginOverlay').style.display = 'none';
        document.querySelector('.container').style.display = 'grid';
        // Initialize calculator after successful login
        initializeAutoCalculate();
        calculateCost();
    } else {
        alert('Invalid username or password');
    }
}

// Remove the DOMContentLoaded event listener since we'll initialize after login
document.removeEventListener('DOMContentLoaded', initializeAutoCalculate);

function resetCalculator() {
    // Reset all number inputs to empty
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Uncheck all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });

    // Clear custom option fields
    document.getElementById('customOptionText').value = '';
    document.getElementById('customOptionPrice').value = '';

    // Recalculate to update totals
    calculateCost();
} 