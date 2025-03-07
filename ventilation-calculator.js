// Constants for ventilation calculations
const VENT_SPECS = {
    ridge: {
        standard: { nfa: 12, name: "Standard Ridge Vent" },
        highCap: { nfa: 18, name: "High-capacity Ridge Vent" }
    },
    static: {
        standard: { nfa: 50, name: "Standard Roof Vent" },
        highCap: { nfa: 65, name: "High-capacity Roof Vent" }
    },
    soffit: {
        continuous: {
            standard: { nfa: 9, name: "Standard Continuous Soffit" },
            highCap: { nfa: 12, name: "High-capacity Continuous Soffit" }
        },
        individual: {
            standard: { nfa: 45, name: "Standard Individual Vent" },
            highCap: { nfa: 65, name: "High-capacity Individual Vent" }
        }
    }
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
    let atticSF = 0;
    if (document.getElementById('calculationType').value === 'total') {
        atticSF = parseFloat(document.getElementById('atticSF').value) || 0;
    } else {
        const length = parseFloat(document.getElementById('atticLength').value) || 0;
        const width = parseFloat(document.getElementById('atticWidth').value) || 0;
        atticSF = length * width;
    }

    // Get ventilation ratio
    const ratio = parseInt(document.getElementById('ventRatio').value);
    
    // Calculate required ventilation
    const totalRequired = atticSF * (1/ratio);
    const exhaustRequired = totalRequired / 2;
    const intakeRequired = totalRequired / 2;
    
    // Calculate exhaust ventilation
    let exhaustVentilation = 0;
    if (document.querySelector('input[name="exhaustType"]:checked').value === 'ridge') {
        const ridgeLength = parseFloat(document.getElementById('ridgeVentLF').value) || 0;
        const ridgeNFA = parseInt(document.getElementById('ridgeVentType').value);
        exhaustVentilation = ridgeLength * ridgeNFA;
    } else {
        const staticCount = parseFloat(document.getElementById('staticVentCount').value) || 0;
        const staticNFA = parseInt(document.getElementById('staticVentType').value);
        exhaustVentilation = staticCount * staticNFA;
    }
    
    // Calculate intake ventilation
    let intakeVentilation = 0;
    if (document.querySelector('input[name="intakeType"]:checked').value === 'soffit') {
        const soffitLength = parseFloat(document.getElementById('soffitVentLF').value) || 0;
        const soffitNFA = parseInt(document.getElementById('soffitVentType').value);
        intakeVentilation = soffitLength * soffitNFA;
    } else {
        const individualCount = parseFloat(document.getElementById('individualSoffitCount').value) || 0;
        const individualNFA = parseInt(document.getElementById('individualSoffitType').value);
        intakeVentilation = individualCount * individualNFA;
    }

    // Update totals
    document.getElementById('exhaustVentTotal').textContent = formatNumber(exhaustVentilation) + ' sq.in.';
    document.getElementById('intakeVentTotal').textContent = formatNumber(intakeVentilation) + ' sq.in.';
    document.getElementById('requiredVentTotal').textContent = formatNumber(totalRequired) + ' sq.in.';

    // Generate requirements text
    document.getElementById('ventilationRequirements').innerHTML = `
        <p>Based on your attic area of ${formatNumber(atticSF)} sq.ft. and a 1:${ratio} ratio:</p>
        <ul>
            <li>Total Required: ${formatNumber(totalRequired)} sq.in.</li>
            <li>Exhaust Required: ${formatNumber(exhaustRequired)} sq.in.</li>
            <li>Intake Required: ${formatNumber(intakeRequired)} sq.in.</li>
        </ul>
    `;

    // Generate recommendations
    let recommendations = '<h3>Recommended Configuration</h3>';
    
    // Check exhaust
    const exhaustDeficit = exhaustRequired - exhaustVentilation;
    if (exhaustDeficit > 0) {
        recommendations += `
            <p>Additional Exhaust Needed: ${formatNumber(exhaustDeficit)} sq.in.</p>
            <ul>
                <li>${formatNumber(exhaustDeficit/VENT_SPECS.ridge.highCap.nfa)} ft of high-capacity ridge vent, or</li>
                <li>${Math.ceil(exhaustDeficit/VENT_SPECS.static.highCap.nfa)} high-capacity static roof vents</li>
            </ul>
        `;
    }

    // Check intake
    const intakeDeficit = intakeRequired - intakeVentilation;
    if (intakeDeficit > 0) {
        recommendations += `
            <p>Additional Intake Needed: ${formatNumber(intakeDeficit)} sq.in.</p>
            <ul>
                <li>${formatNumber(intakeDeficit/VENT_SPECS.soffit.continuous.highCap.nfa)} ft of high-capacity continuous soffit, or</li>
                <li>${Math.ceil(intakeDeficit/VENT_SPECS.soffit.individual.highCap.nfa)} high-capacity individual vents</li>
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
        <p>Current Exhaust: ${formatNumber(exhaustVentilation)} sq.in.</p>
        <p>Current Intake: ${formatNumber(intakeVentilation)} sq.in.</p>
        <p><strong>Status: ${(exhaustDeficit <= 0 && intakeDeficit <= 0) ? 'Requirements Met' : 'Additional Ventilation Needed'}</strong></p>
    `;
}

function resetCalculator() {
    // Reset calculation type
    document.getElementById('calculationType').value = 'total';
    document.getElementById('totalSqFtInput').style.display = 'block';
    document.getElementById('dimensionsInput').style.display = 'none';

    // Reset all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Reset all selects
    document.getElementById('ventRatio').value = '150';
    document.getElementById('ridgeVentType').value = '12';
    document.getElementById('staticVentType').value = '50';
    document.getElementById('soffitVentType').value = '9';
    document.getElementById('individualSoffitType').value = '45';

    // Reset radio buttons to defaults
    document.querySelector('input[name="exhaustType"][value="ridge"]').checked = true;
    document.querySelector('input[name="intakeType"][value="soffit"]').checked = true;

    // Show/hide appropriate sections
    document.getElementById('ridgeVentOptions').style.display = 'block';
    document.getElementById('staticVentOptions').style.display = 'none';
    document.getElementById('soffitVentOptions').style.display = 'block';
    document.getElementById('individualSoffitOptions').style.display = 'none';

    // Recalculate to update totals
    calculateVentilation();
}

// Add event listeners to all inputs
function initializeAutoCalculate() {
    // Listen to calculation type change
    document.getElementById('calculationType').addEventListener('change', function() {
        document.getElementById('totalSqFtInput').style.display = 
            this.value === 'total' ? 'block' : 'none';
        document.getElementById('dimensionsInput').style.display = 
            this.value === 'dimensions' ? 'block' : 'none';
        calculateVentilation();
    });

    // Listen to all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', calculateVentilation);
    });

    // Listen to all selects
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', calculateVentilation);
    });

    // Listen to exhaust type radio buttons
    document.querySelectorAll('input[name="exhaustType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('ridgeVentOptions').style.display = 
                this.value === 'ridge' ? 'block' : 'none';
            document.getElementById('staticVentOptions').style.display = 
                this.value === 'static' ? 'block' : 'none';
            calculateVentilation();
        });
    });

    // Listen to intake type radio buttons
    document.querySelectorAll('input[name="intakeType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('soffitVentOptions').style.display = 
                this.value === 'soffit' ? 'block' : 'none';
            document.getElementById('individualSoffitOptions').style.display = 
                this.value === 'individual' ? 'block' : 'none';
            calculateVentilation();
        });
    });
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoCalculate();
    calculateVentilation();
}); 