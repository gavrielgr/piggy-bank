/**
 * קופת החיסכון המשפחתית - גרפים וויזואליזציות
 * מודול זה אחראי על הגרפים והוויזואליזציות באפליקציה
 */

/**
 * שינוי תצוגת הגרף
 * @param {number} childIndex - אינדקס הילד
 * @param {string} view - תצוגת הגרף (months/years)
 */
function changeChartView(childIndex, view) {
    var child = appState.children[childIndex];
    child.chartView = view;
    
    var tabContent = document.getElementById('child-tab-' + childIndex);
    var monthsBtn = tabContent.querySelector('.months-view-btn');
    var yearsBtn = tabContent.querySelector('.years-view-btn');
    
    if (view === "months") {
        monthsBtn.classList.add('active');
        yearsBtn.classList.remove('active');
    } else {
        yearsBtn.classList.add('active');
        monthsBtn.classList.remove('active');
    }
    
    updateChart(childIndex);
    saveAppState();
}

/**
 * עדכון גרף הריבית
 * @param {number} childIndex - אינדקס הילד
 */
function updateChart(childIndex) {
    var child = appState.children[childIndex];
    var tabContent = document.getElementById('child-tab-' + childIndex);
    var chartContainer = tabContent.querySelector('#interest-chart-' + childIndex);
    
    chartContainer.innerHTML = '';
    
    var currentAmount = child.balance;
    var timeframes = [];
    var periods = 0;
    
    // הגדרת פרקי זמן לפי תצוגת הגרף
    if (child.chartView === "months") {
        periods = window.innerWidth < 500 ? 7 : 13;
        for (var i = 0; i < periods; i++) {
            if (i === 0) {
                timeframes.push("היום");
            } else if (i === 1) {
                timeframes.push("חודש 1");
            } else {
                timeframes.push(i + " חודשים");
            }
        }
    } else { // תצוגת שנים
        periods = window.innerWidth < 500 ? 6 : 10;
        for (var i = 0; i < periods; i++) {
            if (i === 0) {
                timeframes.push("היום");
            } else if (i === 1) {
                timeframes.push("שנה 1");
            } else {
                timeframes.push(i + " שנים");
            }
        }
    }
    
    // חישוב ערך מקסימלי לסקילה
    var simulatedAmount = child.balance;
    var maxAmount = simulatedAmount;
    
    for (var i = 1; i < periods; i++) {
        var months = child.chartView === "months" ? i : i * 12;
        simulatedAmount = calculateGrowth(child.balance, child.interestRate, child.monthlyDeposit, months);
        maxAmount = Math.max(maxAmount, simulatedAmount);
    }
    
    // וידוא שסקלת הגרף הגיונית
    maxAmount = Math.max(maxAmount * 1.1, child.balance * 1.5, 100);
    
    // יצירת עמודות הגרף
    for (var i = 0; i < periods; i++) {
        var bar = document.createElement('div');
        bar.className = 'chart-bar';
        
        var amount = currentAmount;
        
        if (i > 0) {
            var months = child.chartView === "months" ? i : i * 12;
            amount = calculateGrowth(child.balance, child.interestRate, child.monthlyDeposit, months);
        }
        
        var heightPercentage = Math.min(100, (amount / maxAmount) * 100);
        heightPercentage = Math.max(heightPercentage, 10); // גובה מינימלי
        bar.style.height = heightPercentage + '%';
        
        bar.setAttribute('data-value', '₪ ' + amount.toLocaleString('he-IL', {maximumFractionDigits: 0}));
        bar.setAttribute('data-label', timeframes[i]);
        
        chartContainer.appendChild(bar);
    }
}

/**
 * חישוב צמיחה עם ריבית דריבית והפקדות חודשיות
 * @param {number} principal - סכום התחלתי
 * @param {number} monthlyRate - ריבית חודשית (כשבר עשרוני)
 * @param {number} monthlyDeposit - הפקדה חודשית
 * @param {number} months - מספר חודשים
 * @returns {number} - הסכום הסופי לאחר הריבית
 */
function calculateGrowth(principal, monthlyRate, monthlyDeposit, months) {
    var totalAmount = principal;
    
    for (var i = 0; i < months; i++) {
        // הוספת ריבית לחודש
        totalAmount = totalAmount * (1 + monthlyRate);
        
        // הוספת הפקדה חודשית
        totalAmount += monthlyDeposit;
    }
    
    return totalAmount;
}
