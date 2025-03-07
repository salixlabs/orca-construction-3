// Constants for ventilation calculations
const VENTILATION_RATIO = 1/150; // 1 square inch of vent area per 150 square feet of attic space
const VENT_SPECS = {
    ridgeVent: 18, // Net free area per linear foot (sq.in.)
    gableVent: 144, // Net free area per vent (sq.in.)
    soffitVent: 45 // Net free area per vent (sq.in.)
};

// Helper function to format numbers with commas
function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function calculateVentilation() {
    // Get measurements
    const atticSF = parseFloat(document.getElementById('atticSF').value) || 0;
    const roofPitch = document.getElementById('roofPitch').value;
    
    // Calculate current ventilation
    let currentVentilation = 0;
    
    // Ridge vent calculation
    if (document.getElementById('hasRidgeVent').checked) {
        const ridgeLength = parseFloat(document.getElementById('ridgeVentLF').value) || 0;
        currentVentilation += ridgeLength * VENT_SPECS.ridgeVent;
    }
    
    // Gable vent calculation
    if (document.getElementById('hasGableVents').checked) {
        const gableCount = parseFloat(document.getElementById('gableVentNum').value) || 0;
        currentVentilation += gableCount * VENT_SPECS.gableVent;
    }
    
    // Soffit vent calculation
    if (document.getElementById('hasSoffitVents').checked) {
        const soffitCount = parseFloat(document.getElementById('soffitVentNum').value) || 0;
        currentVentilation += soffitCount * VENT_SPECS.soffitVent;
    }

    // Calculate required ventilation
    const requiredVentilation = atticSF * VENTILATION_RATIO;
    
    // Update totals
    document.getElementById('currentVentTotal').textContent = formatNumber(currentVentilation) + ' sq.in.';
    document.getElementById('requiredVentTotal').textContent = formatNumber(requiredVentilation) + ' sq.in.';

    // Generate recommendations
    const ventilationDeficit = requiredVentilation - currentVentilation;
    let recommendations = '';
    
    if (ventilationDeficit > 0) {
        recommendations = `
            <h3>Additional Ventilation Needed</h3>
            <p>Your attic needs ${formatNumber(ventilationDeficit)} more square inches of ventilation.</p>
            <p>This could be achieved with any of these options:</p>
            <ul>
                <li>${formatNumber(ventilationDeficit / VENT_SPECS.ridgeVent)} linear feet of ridge vent</li>
                <li>${Math.ceil(ventilationDeficit / VENT_SPECS.gableVent)} gable vents</li>
                <li>${Math.ceil(ventilationDeficit / VENT_SPECS.soffitVent)} soffit vents</li>
            </ul>
        `;
    } else {
        recommendations = `
            <h3>Ventilation Requirements Met</h3>
            <p>Your attic has adequate ventilation according to building codes.</p>
            <p>Current ventilation exceeds requirements by ${formatNumber(Math.abs(ventilationDeficit))} square inches.</p>
        `;
    }

    // Display results
    document.getElementById('ventilationRequirements').innerHTML = `
        <p>Minimum required ventilation: ${formatNumber(requiredVentilation)} sq.in.</p>
        <p>Current ventilation: ${formatNumber(currentVentilation)} sq.in.</p>
    `;
    
    document.getElementById('recommendations').innerHTML = recommendations;

    // Display summary
    document.getElementById('result').innerHTML = `
        <h3>Ventilation Summary:</h3>
        <p>Attic Area: ${formatNumber(atticSF)} SF</p>
        <p>Roof Pitch: ${roofPitch}:12</p>
        <p>Required Ventilation: ${formatNumber(requiredVentilation)} sq.in.</p>
        <p>Current Ventilation: ${formatNumber(currentVentilation)} sq.in.</p>
        <p><strong>Status: ${ventilationDeficit > 0 ? 'Additional Ventilation Needed' : 'Requirements Met'}</strong></p>
    `;
}

function resetCalculator() {
    // Reset all number inputs to empty
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Reset select to default
    document.getElementById('roofPitch').value = '';

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });

    // Hide all sub-inputs
    document.querySelectorAll('.sub-input').forEach(div => {
        div.style.display = 'none';
    });

    // Recalculate to update totals
    calculateVentilation();
}

// Add event listeners to all inputs
function initializeAutoCalculate() {
    // Listen to number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', calculateVentilation);
    });

    // Listen to select
    document.getElementById('roofPitch').addEventListener('change', calculateVentilation);

    // Listen to checkboxes and show/hide related inputs
    document.getElementById('hasRidgeVent').addEventListener('change', function() {
        document.getElementById('ridgeVentLength').style.display = this.checked ? 'block' : 'none';
        calculateVentilation();
    });

    document.getElementById('hasGableVents').addEventListener('change', function() {
        document.getElementById('gableVentCount').style.display = this.checked ? 'block' : 'none';
        calculateVentilation();
    });

    document.getElementById('hasSoffitVents').addEventListener('change', function() {
        document.getElementById('soffitVentCount').style.display = this.checked ? 'block' : 'none';
        calculateVentilation();
    });
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoCalculate();
    calculateVentilation();
}); 