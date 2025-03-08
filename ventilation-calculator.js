// Constants for ventilation calculations
const VENT_SPECS = {
    ridge: { nfa: 18 },
    rvo: { nfa: 38 },
    gable: { nfa: 864 },
    birdBlock: { nfa: 3.14 },
    soffit: { nfa: 9 }
};

// Helper function to format numbers with commas
function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function calculateVentilation() {
    // Get attic area
    const atticSF = parseFloat(document.getElementById('atticSF').value) || 0;
    const ratio = parseInt(document.getElementById('ventRatio').value);
    
    // Calculate required ventilation
    const totalRequired = atticSF * (1/ratio);
    const exhaustRequired = totalRequired / 2;
    const intakeRequired = totalRequired / 2;
    
    // Calculate existing exhaust ventilation
    const ridgeLength = parseFloat(document.getElementById('existingRidgeLength').value) || 0;
    const rvoCount = parseFloat(document.getElementById('existingRVOCount').value) || 0;
    const gableCount = parseFloat(document.getElementById('existingGableCount').value) || 0;
    const otherExhaustCount = parseFloat(document.getElementById('existingOtherExhaustCount').value) || 0;
    const otherExhaustNFVA = parseFloat(document.getElementById('existingOtherExhaustNFVA').value) || 0;

    // Calculate exhaust totals
    const ridgeTotal = ridgeLength * VENT_SPECS.ridge.nfa;
    const rvoTotal = rvoCount * VENT_SPECS.rvo.nfa;
    const gableTotal = gableCount * VENT_SPECS.gable.nfa;
    const otherExhaustTotal = otherExhaustCount * otherExhaustNFVA;
    const totalExhaust = ridgeTotal + rvoTotal + gableTotal + otherExhaustTotal;

    // Update exhaust totals in table
    document.getElementById('ridgeVentTotal').textContent = formatNumber(ridgeTotal);
    document.getElementById('rvoVentTotal').textContent = formatNumber(rvoTotal);
    document.getElementById('gableVentTotal').textContent = formatNumber(gableTotal);
    document.getElementById('otherExhaustTotal').textContent = formatNumber(otherExhaustTotal);
    document.getElementById('totalExhaust').textContent = formatNumber(totalExhaust);

    // Calculate existing intake ventilation
    const birdBlockCount = parseFloat(document.getElementById('existingBirdBlockCount').value) || 0;
    const soffitLength = parseFloat(document.getElementById('existingSoffitLength').value) || 0;
    const otherIntakeCount = parseFloat(document.getElementById('existingOtherIntakeCount').value) || 0;
    const otherIntakeNFVA = parseFloat(document.getElementById('existingOtherIntakeNFVA').value) || 0;

    // Calculate intake totals
    const birdBlockTotal = birdBlockCount * VENT_SPECS.birdBlock.nfa;
    const soffitTotal = soffitLength * VENT_SPECS.soffit.nfa;
    const otherIntakeTotal = otherIntakeCount * otherIntakeNFVA;
    const totalIntake = birdBlockTotal + soffitTotal + otherIntakeTotal;

    // Update intake totals in table
    document.getElementById('birdBlockTotal').textContent = formatNumber(birdBlockTotal);
    document.getElementById('soffitVentTotal').textContent = formatNumber(soffitTotal);
    document.getElementById('otherIntakeTotal').textContent = formatNumber(otherIntakeTotal);
    document.getElementById('totalIntake').textContent = formatNumber(totalIntake);

    // Update requirements section
    document.getElementById('requiredVentTotal').textContent = formatNumber(totalRequired) + ' sq.in.';
    document.getElementById('ventilationRequirements').innerHTML = `
        <p>Based on your attic area of ${formatNumber(atticSF)} sq.ft. and a 1:${ratio} ratio:</p>
        <ul>
            <li>Total Required: ${formatNumber(totalRequired)} sq.in.</li>
            <li>Exhaust Required: ${formatNumber(exhaustRequired)} sq.in.</li>
            <li>Intake Required: ${formatNumber(intakeRequired)} sq.in.</li>
        </ul>
    `;

    // Generate recommendations
    let recommendations = '<h3>Ventilation Analysis</h3>';
    
    // Check exhaust
    const exhaustDeficit = exhaustRequired - totalExhaust;
    if (exhaustDeficit > 0) {
        recommendations += `
            <p>Additional Exhaust Needed: ${formatNumber(exhaustDeficit)} sq.in.</p>
            <ul>
                <li>Option 1: Add ${formatNumber(exhaustDeficit/VENT_SPECS.ridge.nfa)} LF of ridge vent</li>
                <li>Option 2: Add ${Math.ceil(exhaustDeficit/VENT_SPECS.rvo.nfa)} RVO vents</li>
                <li>Option 3: Add ${Math.ceil(exhaustDeficit/VENT_SPECS.gable.nfa)} gable vents</li>
            </ul>
        `;
    }

    // Check intake
    const intakeDeficit = intakeRequired - totalIntake;
    if (intakeDeficit > 0) {
        recommendations += `
            <p>Additional Intake Needed: ${formatNumber(intakeDeficit)} sq.in.</p>
            <ul>
                <li>Option 1: Add ${formatNumber(intakeDeficit/VENT_SPECS.soffit.nfa)} LF of continuous soffit vents</li>
                <li>Option 2: Add ${Math.ceil(intakeDeficit/VENT_SPECS.birdBlock.nfa)} bird blocks</li>
            </ul>
        `;
    }

    if (exhaustDeficit <= 0 && intakeDeficit <= 0) {
        recommendations += '<p>Your ventilation system meets or exceeds requirements.</p>';
    }

    document.getElementById('recommendations').innerHTML = recommendations;

    // Display summary
    document.getElementById('result').innerHTML = `
        <h3>Ventilation Summary:</h3>
        <p>Attic Area: ${formatNumber(atticSF)} SF</p>
        <p>Ventilation Ratio: 1:${ratio}</p>
        <p>Total Required: ${formatNumber(totalRequired)} sq.in.</p>
        <p>Current Exhaust: ${formatNumber(totalExhaust)} sq.in. (${Math.round(totalExhaust/exhaustRequired * 100)}% of required)</p>
        <p>Current Intake: ${formatNumber(totalIntake)} sq.in. (${Math.round(totalIntake/intakeRequired * 100)}% of required)</p>
        <p><strong>Status: ${(exhaustDeficit <= 0 && intakeDeficit <= 0) ? 'Requirements Met' : 'Additional Ventilation Needed'}</strong></p>
    `;
}

function resetCalculator() {
    // Reset all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Reset ventilation ratio
    document.getElementById('ventRatio').value = '150';

    // Recalculate to update totals
    calculateVentilation();
}

// Add event listeners to all inputs
function initializeAutoCalculate() {
    // Listen to all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', calculateVentilation);
    });

    // Listen to ventilation ratio select
    document.getElementById('ventRatio').addEventListener('change', calculateVentilation);
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoCalculate();
    calculateVentilation();
}); 