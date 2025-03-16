/**
 * קופת החיסכון המשפחתית - ניהול עסקאות
 * מודול זה אחראי על ניהול עסקאות, הפקדות ומשיכות
 */

/**
 * הוספת תנועה להיסטוריה
 * @param {number} childIndex - אינדקס הילד
 * @param {number} amount - סכום העסקה
 * @param {string} type - סוג העסקה (הכנסה/הוצאה)
 * @param {string} description - תיאור העסקה
 */
function addTransaction(childIndex, amount, type, description) {
    const child = appState.children[childIndex];
    
    child.transactions.push({
        date: new Date().toISOString(),
        amount: amount,
        type: type,
        description: description,
        balance: child.balance
    });
    
    // שמירת רק 50 העסקאות האחרונות
    if (child.transactions.length > 50) {
        child.transactions = child.transactions.slice(-50);
    }
}

/**
 * פתיחת מודל הפקדה
 * @param {number} childIndex - אינדקס הילד
 */
function openDepositModal(childIndex) {
    // שמור את האינדקס הנוכחי לפעולה מאוחרת יותר
    document.getElementById('deposit-modal').dataset.childIndex = childIndex;
    showModal('deposit-modal');
}

/**
 * אישור הפקדה
 */
function confirmDeposit() {
    var modal = document.getElementById('deposit-modal');
    var childIndex = parseInt(modal.dataset.childIndex);
    var amount = parseFloat(document.getElementById('deposit-amount').value);
    var reason = document.getElementById('deposit-reason').value;
    
    if (amount > 0) {
        var child = appState.children[childIndex];
        child.balance += amount;
        
        // הוספה להיסטוריית עסקאות
        addTransaction(childIndex, amount, "הפקדה", reason || "הפקדה");
        
        // בדיקה אם זו הפקדה ראשונה
        if (child.transactions.filter(tx => tx.type === "הפקדה").length === 1) {
            awardAchievement(childIndex, "first_deposit");
        }
        
        // הוספת XP
        addXP(childIndex, Math.min(50, Math.floor(amount / 10)));
        
        // בדיקת הישגים בהתאם ליתרה
        checkBalanceAchievements(childIndex);
        
        updateChildTabUI(childIndex);
        saveAppState();
        hideModal('deposit-modal');
        
        // איפוס השדות
        document.getElementById('deposit-amount').value = "10";
        document.getElementById('deposit-reason').value = "";
        
        // הצגת הודעה
        showToast("הפקדה בוצעה", `הפקדת ₪ ${amount.toLocaleString('he-IL', {maximumFractionDigits: 0})} לקופת החיסכון!`, "success");
    }
}

/**
 * פתיחת מודל משיכה
 * @param {number} childIndex - אינדקס הילד
 */
function openWithdrawModal(childIndex) {
    // שמור את האינדקס הנוכחי לפעולה מאוחרת יותר
    document.getElementById('withdraw-modal').dataset.childIndex = childIndex;
    showModal('withdraw-modal');
}

/**
 * אישור משיכה
 */
function confirmWithdraw() {
    var modal = document.getElementById('withdraw-modal');
    var childIndex = parseInt(modal.dataset.childIndex);
    var amount = parseFloat(document.getElementById('withdraw-amount').value);
    var reason = document.getElementById('withdraw-reason').value;
    
    if (amount > 0) {
        var child = appState.children[childIndex];
        if (amount <= child.balance) {
            child.balance -= amount;
            
            // הוספה להיסטוריית עסקאות
            addTransaction(childIndex, amount, "הוצאה", reason || "משיכה");
            
            updateChildTabUI(childIndex);
            saveAppState();
            hideModal('withdraw-modal');
            
            // איפוס השדות
            document.getElementById('withdraw-amount').value = "5";
            document.getElementById('withdraw-reason').value = "";
            
            // הצגת הודעה
            showToast("משיכה בוצעה", `משכת ₪ ${amount.toLocaleString('he-IL', {maximumFractionDigits: 0})} מקופת החיסכון!`, "info");
            
            // אם יש סיבה למשיכה, הענק הישג
            if (reason && reason.trim() !== "" && !hasAchievement(childIndex, "smart_spender")) {
                awardAchievement(childIndex, "smart_spender");
            }
        } else {
            showToast("שגיאה", "אין מספיק כסף בקופה!", "error");
        }
    }
}
