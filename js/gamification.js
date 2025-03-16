/**
 * קופת החיסכון המשפחתית - מערכת משחוק והישגים
 * מודול זה אחראי על ניהול המשחוק, רמות והישגים באפליקציה
 */

/**
 * בדיקה אם לילד יש הישג ספציפי
 * @param {number} childIndex - אינדקס הילד
 * @param {string} achievementId - מזהה ההישג
 * @returns {boolean} - האם לילד יש את ההישג
 */
function hasAchievement(childIndex, achievementId) {
    const child = appState.children[childIndex];
    return child.badges.some(badge => badge.id === achievementId);
}

/**
 * הענקת הישג לילד
 * @param {number} childIndex - אינדקס הילד
 * @param {string} achievementId - מזהה ההישג
 */
function awardAchievement(childIndex, achievementId) {
    const child = appState.children[childIndex];
    const achievement = achievementsList.find(a => a.id === achievementId);
    
    if (achievement && !hasAchievement(childIndex, achievementId)) {
        // הוספת ההישג
        child.badges.push({
            id: achievement.id,
            name: achievement.name,
            icon: achievement.icon,
            date: new Date().toISOString()
        });
        
        // הוספת נקודות ניסיון
        addXP(childIndex, achievement.xpReward);
        
        // הצגת הודעה
        showToast("הישג חדש!", `השגת את ההישג: ${achievement.name}`, "success");
        
        // עדכון המצב
        updateBadges(childIndex);
        saveAppState();
    }
}

/**
 * הוספת נקודות ניסיון ובדיקת עלייה רמה
 * @param {number} childIndex - אינדקס הילד
 * @param {number} amount - כמות נקודות הניסיון
 */
function addXP(childIndex, amount) {
    const child = appState.children[childIndex];
    child.xp += amount;
    
    // בדיקת עלייה רמה
    for (let i = levels.length - 1; i >= 0; i--) {
        if (child.xp >= levels[i].requiredXP && child.level < levels[i].level) {
            const oldLevel = child.level;
            child.level = levels[i].level;
            
            // אם עלה רמה
            if (oldLevel !== child.level) {
                showToast("עלית רמה!", `התקדמת לרמה ${child.level}: ${levels[i].name}`, "success");
                
                // עדכון התצוגה
                updateLevelProgress(childIndex);
                
                // בדיקת הישגים בהתאם ליתרה
                checkBalanceAchievements(childIndex);
            }
            
            break;
        }
    }
}

/**
 * בדיקת הישגים על סמך יתרה
 * @param {number} childIndex - אינדקס הילד
 */
function checkBalanceAchievements(childIndex) {
    const child = appState.children[childIndex];
    
    // בדיקת הישג "חוסך גדול" (500 ₪)
    if (child.balance >= 500 && !hasAchievement(childIndex, "big_saver")) {
        awardAchievement(childIndex, "big_saver");
    }
    
    // בדיקת הישג "אלוף הכסף" (1000 ₪)
    if (child.balance >= 1000 && !hasAchievement(childIndex, "money_master")) {
        awardAchievement(childIndex, "money_master");
    }
}

/**
 * פתיחת הסימולטור
 * @param {number} childIndex - אינדקס הילד
 */
function toggleSimulator(childIndex) {
    const simulatorOptions = document.getElementById('simulator-options');
    
    // בחירת תרחיש אקראי
    const scenario = simulatorScenarios[Math.floor(Math.random() * simulatorScenarios.length)];
    
    // עדכון השאלה
    document.getElementById('simulator-question').textContent = scenario.question;
    
    // עדכון האפשרויות
    simulatorOptions.innerHTML = '';
    scenario.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'simulator-option';
        optionEl.textContent = option.text;
        optionEl.onclick = function() {
            showSimulatorResult(option.outcome, childIndex);
        };
        simulatorOptions.appendChild(optionEl);
    });
    
    // איפוס התוצאה
    document.getElementById('simulator-result').innerHTML = '';
    document.getElementById('simulator-result').classList.remove('active');
    
    // הצגת המודל
    showModal('simulator-modal');
}

/**
 * הצגת תוצאת הסימולטור
 * @param {string} outcome - תוצאת הסימולציה
 * @param {number} childIndex - אינדקס הילד
 */
function showSimulatorResult(outcome, childIndex) {
    const resultEl = document.getElementById('simulator-result');
    resultEl.innerHTML = `
        <h3>התוצאה</h3>
        <p>${outcome}</p>
    `;
    resultEl.classList.add('active');
    
    // הוספת נקודות ניסיון
    addXP(childIndex, 10);
    updateChildTabUI(childIndex);
    saveAppState();
}
