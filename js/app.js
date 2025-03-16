/**
 * קופת החיסכון המשפחתית - מודול ראשי
 * קובץ זה מכיל את הפונקציות הראשיות של האפליקציה, אתחול והפעלת מאזינים לאירועים
 */

/**
 * פונקציה ליצירת ילד חדש
 * @param {string} name - שם הילד
 */
function addChild(name) {
    console.log("מוסיף ילד חדש: " + name);
    
    // יצירת ילד חדש
    var newChildState = createDefaultChildState(name);
    var newIndex = appState.children.length;
    
    // הוספת הילד למערכת
    appState.children.push(newChildState);
    
    // יצירת הטאב והתוכן שלו
    var tabsContainer = document.getElementById('tabs-container');
    var addChildButton = document.getElementById('add-child-button');
    
    var newTab = createChildTab(name, newIndex);
    tabsContainer.insertBefore(newTab, addChildButton);
    
    var tabContentsContainer = document.getElementById('tab-contents-container');
    var newContent = createTabContent(newChildState, newIndex);
    tabContentsContainer.appendChild(newContent);
    
    // הפעלת הטאב החדש
    activateTab(newIndex);
    
    // שמירת המצב החדש
    saveAppState();
    
    // יצירת פירות לעץ או כוכבים לחלל
    if (newChildState.visualization === 'tree') {
        updateTreeVisualization(newIndex);
    } else {
        updateRocketVisualization(newIndex);
    }
    
    // הצגת הודעת ברוכים הבאים
    showToast("ברוכים הבאים!", `${name} התחיל/ה את דרך החיסכון`, "success");
}

/**
 * מחיקת ילד מהמערכת
 * @param {number} index - אינדקס הילד
 */
function deleteChild(index) {
    if (confirm('האם אתה בטוח שברצונך להסיר את הילד הזה?')) {
        // הסרת הילד מהמערכת
        appState.children.splice(index, 1);
        
        // אם אין יותר ילדים, אין טאב פעיל
        if (appState.children.length === 0) {
            appState.activeChildIndex = -1;
        } 
        // אם הסרנו את הטאב האחרון, עבור לטאב הקודם
        else if (index >= appState.children.length) {
            appState.activeChildIndex = appState.children.length - 1;
        }
        
        // עדכון הממשק
        refreshAllTabs();
        
        // שמירת המצב החדש
        saveAppState();
        
        // הצגת הודעה
        showToast("ילד הוסר", "הילד הוסר בהצלחה מהמערכת", "info");
    }
}

/**
 * איפוס חשבון של ילד
 * @param {number} index - אינדקס הילד
 */
function resetChild(index) {
    if (confirm('האם אתה בטוח שברצונך לאפס את החשבון של הילד הזה?')) {
        var childName = appState.children[index].kidName;
        
        // יצירת מצב חדש עם השם הקיים
        appState.children[index] = createDefaultChildState(childName);
        
        // עדכון הממשק
        updateChildTabUI(index);
        
        // שמירת המצב החדש
        saveAppState();
        
        // הצגת הודעה
        showToast("חשבון אופס", "החשבון אופס בהצלחה למצב התחלתי", "info");
    }
}

/**
 * פתיחת מודל הוספת ילד
 */
function openAddChildModal() {
    console.log("פותח חלון הוספת ילד");
    showModal('add-child-modal');
}

/**
 * אישור הוספת ילד
 */
function confirmAddChild() {
    var name = document.getElementById('new-child-name').value;
    if (name) {
        addChild(name);
        hideModal('add-child-modal');
        document.getElementById('new-child-name').value = ''; // איפוס השדה
    } else {
        showToast("שגיאה", "נא להכניס שם כדי להמשיך", "error");
    }
}

/**
 * הרחבה/צמצום מדור ההגדרות
 * @param {number} index - אינדקס הילד
 */
function toggleSettings(index) {
    var settingsSection = document.getElementById('settings-section-' + index);
    if (settingsSection.style.display === 'none' || settingsSection.style.display === '') {
        settingsSection.style.display = 'block';
    } else {
        settingsSection.style.display = 'none';
    }
}

/**
 * שמירת הגדרות ילד
 * @param {number} childIndex - אינדקס הילד
 */
function saveSettings(childIndex) {
    var child = appState.children[childIndex];
    var tabContent = document.getElementById('child-tab-' + childIndex);
    
    var newRate = parseFloat(tabContent.querySelector('.interest-rate-input').value);
    var newDeposit = parseFloat(tabContent.querySelector('.monthly-deposit-input').value);
    var newVisualization = tabContent.querySelector('.visualization-type').value;
    
    if (!isNaN(newRate) && newRate >= 0) {
        child.interestRate = newRate / 100;
    }
    
    if (!isNaN(newDeposit) && newDeposit >= 0) {
        child.monthlyDeposit = newDeposit;
    }
    
    if (newVisualization && (newVisualization === 'tree' || newVisualization === 'rocket')) {
        child.visualization = newVisualization;
    }
    
    updateChildTabUI(childIndex);
    document.getElementById('settings-section-' + childIndex).style.display = 'none';
    saveAppState();
    
    // הצגת הודעה
    showToast("הגדרות נשמרו", "ההגדרות שלך נשמרו בהצלחה", "success");
}

/**
 * אתחול המערכת
 */
function initApp() {
    console.log("אתחול המערכת");
    
    // טעינת מצב האפליקציה
    loadAppState();
    
    // אם אין ילדים, פתח מיד את החלון להוספת ילד
    if (appState.children.length === 0) {
        console.log("אין ילדים במערכת - פותח חלון להוספת ילד ראשון");
        setTimeout(function() {
            openAddChildModal();
        }, 500);
    } else {
        // יצירת הטאבים
        console.log("יש " + appState.children.length + " ילדים במערכת - מרענן טאבים");
        refreshAllTabs();
    }
}

// מאזינים לאירועים
document.addEventListener('DOMContentLoaded', function() {
    // מאזין למעבר בין מצבי תצוגה (רגיל/כהה)
    document.getElementById('theme-toggle').addEventListener('click', function() {
        // החלפת מצב תצוגה
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            this.innerHTML = '<i class="fas fa-moon"></i>';
            appState.settings.darkMode = false;
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
            appState.settings.darkMode = true;
        }
        
        saveAppState();
    });
    
    // מאזין לשינויים בסוג הויזואליזציה
    document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('visualization-type')) {
            const childIndex = appState.activeChildIndex;
            if (childIndex >= 0) {
                changeVisualization(childIndex, e.target.value);
            }
        }
    });
    
    // מאזין לאירועי מקלדת במודל הוספת ילד
    document.getElementById('new-child-name').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            confirmAddChild();
        }
    });
    
    // מאזין לאירועי מקלדת במודל הפקדה
    document.getElementById('deposit-amount').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            confirmDeposit();
        }
    });
    
    // מאזין לאירועי מקלדת במודל משיכה
    document.getElementById('withdraw-amount').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            confirmWithdraw();
        }
    });
});

// הפעלת האתחול בטעינת הדף
window.onload = function() {
    console.log("טעינת הדף הושלמה");
    initApp();
    
    // יצירת כפתור להורים
    const parentButton = document.createElement('button');
    parentButton.className = 'btn btn-outline';
    parentButton.innerHTML = '<i class="fas fa-user-shield"></i> בקרת הורים';
    parentButton.setAttribute('onclick', 'showParentControls()');
    parentButton.style.position = 'fixed';
    parentButton.style.bottom = '20px';
    parentButton.style.left = '20px';
    document.body.appendChild(parentButton);
};
