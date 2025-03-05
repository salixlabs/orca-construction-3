// Login functionality
function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'orca' && password === 'construction') {
        document.getElementById('loginOverlay').style.display = 'none';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Reset calculator
function resetCalculator() {
    document.getElementById('atticSquareFootage').value = '';
    document.getElementById('atticLength').value = '';
    document.getElementById('atticWidth').value = '';
    document.querySelector('input[name="ventRatio"][value="150"]').checked = true;
    document.querySelector('input[name="ventDistribution"][value="5050"]').checked = true;
    document.getElementById('resultsSection').style.display = 'none';
}

// Auto-calculate square footage when length or width changes
function updateSquareFootage() {
    const length = parseFloat(document.getElementById('atticLength').value) || 0;
    const width = parseFloat(document.getElementById('atticWidth').value) || 0;
    
    if (length > 0 && width > 0) {
        document.getElementById('atticSquareFootage').value = length * width;
    }
}

// Add event listeners for length and width inputs
document.getElementById('atticLength').addEventListener('input', updateSquareFootage);
document.getElementById('atticWidth').addEventListener('input', updateSquareFootage);

// Convert square feet to square inches
function sqFtToSqIn(sqFt) {
    return sqFt * 144; // 1 sq ft = 144 sq inches
}

// Main calculation function
function calculateVentilation() {
    // Get attic square footage
    const atticSqFt = parseFloat(document.getElementById('atticSquareFootage').value);
    
    if (!atticSqFt || atticSqFt <= 0) {
        alert('Please enter a valid attic square footage.');
        return;
    }

    // Get ventilation ratio (1:150 or 1:300)
    const ventRatio = parseInt(document.querySelector('input[name="ventRatio"]:checked').value);
    
    // Get distribution ratio (50/50 or 60/40)
    const distribution = document.querySelector('input[name="ventDistribution"]:checked').value;
    const [intakePercent, exhaustPercent] = distribution === '5050' 
        ? [0.5, 0.5] 
        : [0.6, 0.4];

    // Calculate total required ventilation in square inches
    const totalVentilation = sqFtToSqIn(atticSqFt / ventRatio);
    
    // Calculate intake and exhaust requirements
    const intakeVentilation = totalVentilation * intakePercent;
    const exhaustVentilation = totalVentilation * exhaustPercent;

    // Display results
    document.getElementById('intakeResult').textContent = Math.round(intakeVentilation) + ' sq. in.';
    document.getElementById('exhaustResult').textContent = Math.round(exhaustVentilation) + ' sq. in.';
    document.getElementById('totalResult').textContent = Math.round(totalVentilation) + ' sq. in.';
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
}

// Add some CSS styles for the dimensions group
const style = document.createElement('style');
style.textContent = `
    .dimensions-group {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    .multiply-symbol {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .results-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        padding: 1rem;
    }
    .result-item {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
    }
    .result-item h3 {
        margin-top: 0;
        color: #333;
    }
    .result-item p {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c5282;
        margin: 0.5rem 0;
    }
    .calculate-button {
        background-color: #2c5282;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 4px;
        font-size: 1.1rem;
        cursor: pointer;
        width: 100%;
        margin-top: 1rem;
    }
    .calculate-button:hover {
        background-color: #2a4365;
    }
`;
document.head.appendChild(style); 