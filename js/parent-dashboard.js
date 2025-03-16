/**
 * קופת החיסכון המשפחתית - פאנל בקרת הורים
 * מודול זה אחראי על פאנל ניהול המערכת להורים
 */

/**
 * עדכון פאנל ההורים
 */
function updateParentPanel() {
    // סקירה כללית
    const overviewGrid = document.getElementById('parent-overview-grid');
    overviewGrid.innerHTML = '';
    
    appState.children.forEach((child, index) => {
        const card = document.createElement('div');
        card.className = 'parent-card';
        card.innerHTML = `
            <h4>${child.kidName}</h4>
            <p>יתרה: ₪ ${child.balance.toLocaleString('he-IL', {maximumFractionDigits: 0})}</p>
            <p>רמה: ${child.level} (${getLevelName(child.level)})</p>
            <p>מטרות: ${child.goals.length}</p>
            <p>הישגים: ${child.badges.length} / ${achievementsList.length}</p>
        `;
        overviewGrid.appendChild(card);
    });
    
    // הגדרות
    document.getElementById('parent-pin').value = appState.settings.parentPin || '';
    document.getElementById('global-interest-rate').value = (appState.settings.globalInterestRate * 100).toFixed(1);
    
    // הישגים
    updateParentAchievements();
}

/**
 * עדכון רשימת הישגים בפאנל ההורים
 */
function updateParentAchievements() {
    const grid = document.getElementById('parent-achievements-grid');
    grid.innerHTML = '';
    
    appState.children.forEach((child, childIndex) => {
        const childCard = document.createElement('div');
        childCard.className = 'parent-card';
        childCard.innerHTML = `<h4>${child.kidName}</h4>`;
        
        // רשימת הישגים אפשריים להענקה
        const unachievedBadges = achievementsList.filter(a => !child.badges.some(b => b.id === a.id)).slice(0, 3);
        
        if (unachievedBadges.length > 0) {
unachievedBadges.forEach(badge => {
                const badgeBtn = document.createElement('button');
                badgeBtn.className = 'btn btn-small';
                badgeBtn.innerHTML = `<i class="fas fa-${badge.icon}"></i> ${badge.name}`;
                badgeBtn.onclick = function() {
                    awardAchievement(childIndex, badge.id);
                    updateParentAchievements();
                };
                childCard.appendChild(badgeBtn);
            });
        } else {
            childCard.innerHTML += '<p>כל ההישגים הושגו!</p>';
        }
        
        grid.appendChild(childCard);
    });
}

/**
 * שמירת הגדרות הורים
 */
function saveParentSettings() {
    const pin = document.getElementById('parent-pin').value;
    const globalInterestRate = parseFloat(document.getElementById('global-interest-rate').value);
    
    appState.settings.parentPin = pin;
    
    if (!isNaN(globalInterestRate) && globalInterestRate >= 0) {
        appState.settings.globalInterestRate = globalInterestRate / 100;
        
        // עדכון ריבית לכל הילדים
        appState.children.forEach(child => {
            child.interestRate = appState.settings.globalInterestRate;
        });
        
        if (appState.activeChildIndex >= 0) {
            updateChildTabUI(appState.activeChildIndex);
        }
    }
    
    saveAppState();
    showToast("הגדרות נשמרו", "הגדרות ההורים נשמרו בהצלחה", "success");
}
