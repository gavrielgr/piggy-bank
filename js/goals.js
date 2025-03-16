/**
 * קופת החיסכון המשפחתית - ניהול מטרות חיסכון
 * מודול זה אחראי על ניהול מטרות החיסכון של הילדים
 */

/**
 * עדכון המטרות
 * @param {number} index - אינדקס הילד
 */
function updateGoals(index) {
    var child = appState.children[index];
    var tabContent = document.getElementById('child-tab-' + index);
    var goalsContainer = tabContent.querySelector('#goals-container-' + index);
    
    goalsContainer.innerHTML = '';
    
    if (child.goals.length === 0) {
        goalsContainer.innerHTML = '<p>אין מטרות עדיין. הוסף מטרה כדי להתחיל!</p>';
        return;
    }
    
    // אם יש יותר ממטרה אחת, נחלק את היתרה באופן שווה
    const amountPerGoal = child.goals.length > 1 ? child.balance / child.goals.length : child.balance;
    
    for (var i = 0; i < child.goals.length; i++) {
        var goal = child.goals[i];
        var progress = Math.min(100, (amountPerGoal / goal.amount) * 100);
        var goalReached = amountPerGoal >= goal.amount;
        
        // חישוב תאריך הגעה צפוי
        var etaText = calculateETA(index, goal, amountPerGoal);
        
        var goalElement = document.createElement('div');
        goalElement.className = 'goal-item' + (goalReached ? ' achieved' : '');
        
        var goalInfo = document.createElement('div');
        goalInfo.className = 'goal-info';
        
        var goalHeader = document.createElement('div');
        goalHeader.className = 'goal-header';
        
        var goalName = document.createElement('div');
        goalName.className = 'goal-name';
        goalName.innerHTML = goal.icon ? `<i class="fas fa-${goal.icon}"></i> ${goal.name}` : goal.name;
        
        var goalEta = document.createElement('div');
        goalEta.className = 'goal-eta';
        goalEta.textContent = etaText;
        
        goalHeader.appendChild(goalName);
        goalHeader.appendChild(goalEta);
        
        var goalAmount = document.createElement('div');
        goalAmount.textContent = '₪ ' + amountPerGoal.toLocaleString('he-IL', {maximumFractionDigits: 0}) + ' / ₪ ' + goal.amount.toLocaleString('he-IL', {maximumFractionDigits: 0});
        
        var goalProgress = document.createElement('div');
        goalProgress.className = 'goal-progress';
        
        var goalProgressBar = document.createElement('div');
        goalProgressBar.className = 'goal-progress-bar';
        goalProgressBar.style.width = progress + '%';
        
        goalProgress.appendChild(goalProgressBar);
        goalInfo.appendChild(goalHeader);
        goalInfo.appendChild(goalAmount);
        goalInfo.appendChild(goalProgress);
        
        var goalActions = document.createElement('div');
        goalActions.className = 'goal-actions';
        
        if (goalReached) {
            var achieveButton = document.createElement('button');
            achieveButton.className = 'btn btn-small';
            achieveButton.innerHTML = '<i class="fas fa-award"></i> הושג';
            achieveButton.setAttribute('onclick', `completeGoal(${index}, ${i})`);
            goalActions.appendChild(achieveButton);
        }
        
        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-small';
        deleteButton.innerHTML = '<i class="fas fa-times"></i>';
        deleteButton.setAttribute('onclick', `removeGoal(${index}, ${i})`);
        goalActions.appendChild(deleteButton);
        
        goalElement.appendChild(goalInfo);
        goalElement.appendChild(goalActions);
        
        goalsContainer.appendChild(goalElement);
        
        // בדיקה אם המטרה הושגה
        checkGoalAchievement(index, i, goalReached);
    }
}
/**
 * חישוב תאריך הגעה צפוי למטרה
 * @param {number} childIndex - אינדקס הילד
 * @param {Object} goal - מטרת החיסכון
 * @param {number} currentAmount - סכום נוכחי
 * @returns {string} - טקסט המתאר את הזמן עד להשגת המטרה
 */
function calculateETA(childIndex, goal, currentAmount) {
    const child = appState.children[childIndex];
    
    // אם המטרה כבר הושגה
    if (currentAmount >= goal.amount) {
        return "הושג!";
    }
    
    // חישוב כמה כסף חסר להשגת המטרה
    const amountNeeded = goal.amount - currentAmount;
    
    // חישוב ממוצע הפקדות חודשי
    let monthlyDeposits = child.monthlyDeposit;
    
    // אם אין הפקדות קבועות, ננסה לחשב מהיסטוריה
    if (monthlyDeposits <= 0 && child.transactions.length > 0) {
        const deposits = child.transactions.filter(tx => tx.type === "הפקדה");
        const depositSum = deposits.reduce((sum, tx) => sum + tx.amount, 0);
        
        if (deposits.length > 0) {
            // חישוב ממוצע הפקדה
            const avgDeposit = depositSum / deposits.length;
            
            // בדיקת מספר הפקדות בחודש
            const now = new Date();
            const firstDate = new Date(deposits[0].date);
            const monthsDiff = (now.getFullYear() - firstDate.getFullYear()) * 12 + now.getMonth() - firstDate.getMonth();
            
            const depositsPerMonth = monthsDiff > 0 ? deposits.length / monthsDiff : deposits.length;
            
            monthlyDeposits = avgDeposit * depositsPerMonth;
        }
    }
    
    // אם עדיין אין לנו נתונים מספיקים
    if (monthlyDeposits <= 0) {
        return "לא ידוע";
    }
    
    // חישוב מספר חודשים עד השגת המטרה
    const monthsNeeded = Math.ceil(amountNeeded / (monthlyDeposits + (currentAmount * child.interestRate)));
    
    // המרה לטקסט
    if (monthsNeeded <= 0) {
        return "מיד!";
    } else if (monthsNeeded === 1) {
        return "חודש";
    } else if (monthsNeeded < 12) {
        return monthsNeeded + " חודשים";
    } else {
        const years = Math.floor(monthsNeeded / 12);
        const remainingMonths = monthsNeeded % 12;
        
        if (remainingMonths === 0) {
            return years + (years === 1 ? " שנה" : " שנים");
        } else {
            return years + (years === 1 ? " שנה" : " שנים") + " ו-" + remainingMonths + " חודשים";
        }
    }
}

/**
 * בדיקה אם מטרה הושגה והענקת הישג אם צריך
 * @param {number} childIndex - אינדקס הילד
 * @param {number} goalIndex - אינדקס המטרה
 * @param {boolean} isReached - האם המטרה הושגה
 */
function checkGoalAchievement(childIndex, goalIndex, isReached) {
    if (isReached) {
        const child = appState.children[childIndex];
        const goal = child.goals[goalIndex];
        
        // אם המטרה עוד לא סומנה כהושגה
        if (!goal.achieved) {
            // סימון המטרה כהושגה
            goal.achieved = true;
            goal.achievedDate = new Date().toISOString();
            
            // הענקת הישג אם זו המטרה הראשונה שהושגה
            if (!hasAchievement(childIndex, "goal_reached")) {
                awardAchievement(childIndex, "goal_reached");
            }
            
            saveAppState();
        }
    }
}

/**
 * השלמת מטרה (לאחר שהושגה)
 * @param {number} childIndex - אינדקס הילד
 * @param {number} goalIndex - אינדקס המטרה
 */
function completeGoal(childIndex, goalIndex) {
    const child = appState.children[childIndex];
    const goal = child.goals[goalIndex];
    
    // אם המטרה הושגה
    if (child.balance >= goal.amount) {
        // הצגת תעודת הצטיינות
        showCertificate(childIndex, goal);
        
        // הוספת תנועה
        addTransaction(childIndex, -goal.amount, "הוצאה", `רכישת ${goal.name}`);
        
        // עדכון היתרה
        child.balance -= goal.amount;
        
        // הסרת המטרה
        child.goals.splice(goalIndex, 1);
        
        updateChildTabUI(childIndex);
        saveAppState();
        
        // הודעה
        showToast("מזל טוב!", `השגת את המטרה: ${goal.name}`, "success");
    }
}

/**
 * הסרת מטרה
 * @param {number} childIndex - אינדקס הילד
 * @param {number} goalIndex - אינדקס המטרה
 */
function removeGoal(childIndex, goalIndex) {
    if (confirm('האם אתה בטוח שברצונך למחוק את המטרה הזו?')) {
        appState.children[childIndex].goals.splice(goalIndex, 1);
        updateGoals(childIndex);
        saveAppState();
        
        // הודעה
        showToast("מטרה הוסרה", "המטרה הוסרה בהצלחה", "info");
    }
}

/**
 * פתיחת מודל הוספת מטרה
 * @param {number} childIndex - אינדקס הילד
 */
function openGoalModal(childIndex) {
    // שמור את האינדקס הנוכחי לפעולה מאוחרת יותר
    document.getElementById('goal-modal').dataset.childIndex = childIndex;
    showModal('goal-modal');
}

/**
 * אישור הוספת מטרה
 */
function confirmAddGoal() {
    var modal = document.getElementById('goal-modal');
    var childIndex = parseInt(modal.dataset.childIndex);
    var name = document.getElementById('goal-name').value;
    var amount = parseFloat(document.getElementById('goal-amount').value);
    var icon = document.getElementById('goal-icon').value;
    
    if (name && amount > 0) {
        var child = appState.children[childIndex];
        child.goals.push({ 
            name: name, 
            amount: amount, 
            icon: icon,
            createdDate: new Date().toISOString(),
            achieved: false
        });
        
        updateGoals(childIndex);
        saveAppState();
        hideModal('goal-modal');
        
        // הצגת הודעה
        showToast("מטרה נוספה", `הוספת מטרה חדשה: ${name}`, "success");
        
        // איפוס השדות
        document.getElementById('goal-name').value = '';
        document.getElementById('goal-amount').value = '100';
        document.getElementById('goal-icon').value = 'bicycle';
        
        // אם זו המטרה הראשונה, הענק הישג
        if (child.goals.length === 1 && !hasAchievement(childIndex, "first_goal")) {
            awardAchievement(childIndex, "first_goal");
        }
        
        // אם יש 3 מטרות או יותר, הענק הישג
        if (child.goals.length >= 3 && !hasAchievement(childIndex, "multiple_goals")) {
            awardAchievement(childIndex, "multiple_goals");
        }
    }
}
