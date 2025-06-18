/* roof-calculator.js – Roof Calculator (identical to Dex calculator) */

(function() {
  const roofCalcForm = document.getElementById("roofCalcForm");
  const roofCalcResult = document.getElementById("roofCalcResult");

  roofCalcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const roofLength = parseFloat(document.getElementById("roofLength").value);
    const roofWidth = parseFloat(document.getElementById("roofWidth").value);
    const roofArea = roofLength * roofWidth;
    const roofPerimeter = 2 * (roofLength + roofWidth);

    // (Using the same "Dex" pricing and descriptions for now.)
    const railingPrices = {
      "Cable + Aluminum Posts": 278,
      "Glass": 295,
      "Aluminum": 225,
      "Composite": 188,
      "Cable + Cedar Posts": 132,
      "Cedar": 63,
      "Cedar / Hog Wire": 69
    };

    let resultHTML = "<h3>Roof Calculator Results (using Dex pricing for now):</h3>";
    resultHTML += "<p>Roof Area: " + roofArea.toFixed(2) + " sq ft</p>";
    resultHTML += "<p>Roof Perimeter: " + roofPerimeter.toFixed(2) + " ft</p>";
    resultHTML += "<h4>Railing (using Dex pricing):</h4>";
    for (const [ railing, price ] of Object.entries(railingPrices)) {
      const railingCost = roofPerimeter * price;
      resultHTML += ("<p>" + railing + " ( " + price + " $/LF ) : " + railingCost.toFixed(2) + " $</p>");
    }
    roofCalcResult.innerHTML = resultHTML;
  });
})(); 