/**
 * קופת החיסכון המשפחתית - עדכוני ממשק משתמש
 * מודול זה אחראי על עדכון הממשק בהתאם למצב האפליקציה
 */

/**
 * יצירת טאב חדש לילד
 * @param {string} name - שם הילד
 * @param {number} index - אינדקס הילד ברשימה
 * @returns {HTMLElement} - אלמנט ה-HTML של הטאב
 */
function createChildTab(name, index) {
    var tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = name;
    tab.dataset.index = index;
    
    tab.onclick = function() {
        activateTab(index);
    };
    
    return tab;
}

/**
 * יצירת תוכן טאב לילד
 * @param {Object} childState - מצב הילד
 * @param {number} index - אינדקס הילד ברשימה
 * @returns {HTMLElement} - אלמנט ה-HTML של תוכן הטאב
 */
function createTabContent(childState, index) {
    var content = document.createElement('div');
    content.className = 'tab-content';
    content.id = 'child-tab-' + index;
    
    // תבנית תוכן לכל ילד
    content.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard">
                <div class="level-indicator">רמה ${childState.level}: ${getLevelName(childState.level)}</div>
                <div class="badge-container" id="badge-container-${index}">
                    <!-- תגים יתווספו דינמית -->
                </div>
                <div class="balance">₪ <span class="balance-amount">0</span></div>
                <p class="text-center">הרווחת ₪ <span class="interest-earned">0</span> מריבית!</p>
                
                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-label">התקדמות לרמה הבאה</span>
                        <span class="progress-value" id="level-progress-${index}">0/100</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="level-progress-bar-${index}" style="width: 0%"></div>
                    </div>
                </div>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <div class="stat-value" id="savings-rate-${index}">0%</div>
                        <div class="stat-label">שיעור חיסכון</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="monthly-avg-${index}">₪ 0</div>
                        <div class="stat-label">ממוצע חודשי</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="streak-${index}">0</div>
                        <div class="stat-label">ימים רצופים</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="visualization-container" id="visualization-${index}">
            <div class="tree-container" id="tree-${index}">
                <div class="tree-trunk"></div>
                <div class="tree-leaves"></div>
                <div class="tree-leaves"></div>
                <div class="tree-leaves"></div>
                <!-- פירות יתווספו דינמית -->
            </div>
            
            <div class="rocket-container" id="rocket-${index}">
                <div class="space-background" id="space-${index}">
                    <!-- כוכבים יתווספו דינמית -->
                </div>
                <div class="planet"></div>
                <div class="rocket">
                    <div class="rocket-body"></div>
                    <div class="rocket-head"></div>
                    <div class="rocket-window"></div>
                    <div class="rocket-fin"></div>
                    <div class="rocket-fin"></div>
                    <div class="rocket-flame"></div>
                </div>
            </div>
        </div>
        
        <div class="actions">
            <button class="btn btn-primary" onclick="openDepositModal(${index})"><i class="fas fa-plus"></i> הפקדה</button>
            <button class="btn" onclick="openWithdrawModal(${index})"><i class="fas fa-minus"></i> משיכה</button>
            <button class="btn btn-accent" onclick="openGoalModal(${index})"><i class="fas fa-bullseye"></i> הוספת מטרה</button>
            <button class="btn btn-outline" onclick="toggleSimulator(${index})"><i class="fas fa-gamepad"></i> סימולטור</button>
            <button class="btn btn-outline" onclick="toggleSettings(${index})"><i class="fas fa-cog"></i> הגדרות</button>
        </div>
        
        <div class="settings-section" id="settings-section-${index}">
            <div class="settings-header">
                <h3>הגדרות</h3>
                <button class="btn btn-small" onclick="toggleSettings(${index})"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="settings-grid">
                <div class="settings-card">
                    <h4>הגדרות חיסכון</h4>
                    <div class="input-group">
                        <label>אחוז ריבית חודשי (%)</label>
                        <input type="number" class="interest-rate-input" min="0" max="100" step="0.1" value="5">
                    </div>
                    <div class="input-group">
                        <label>הפקדה חודשית קבועה (₪)</label>
                        <input type="number" class="monthly-deposit-input" min="0" step="1" value="0">
                    </div>
                </div>
                
                <div class="settings-card">
                    <h4>התאמה אישית</h4>
                    <div class="input-group">
                        <label>סוג ויזואליזציה</label>
                        <select class="visualization-type">
                            <option value="tree" ${childState.visualization === 'tree' ? 'selected' : ''}>עץ חיסכון</option>
                            <option value="rocket" ${childState.visualization === 'rocket' ? 'selected' : ''}>חללית</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-card">
                    <h4>טיפים אישיים</h4>
                    <button class="btn btn-small" onclick="showPersonalTip(${index})">הצג טיפ לחיסכון</button>
                </div>
                
                <div class="settings-card">
                    <h4>גיליון הישגים</h4>
                    <button class="btn btn-small" onclick="showAchievements(${index})">צפה בכל ההישגים</button>
                </div>
            </div>
            
            <div style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 20px;">
                <h4>איפוס החשבון</h4>
                <p>לחיצה על כפתור האיפוס תמחק את כל הנתונים של ילד זה ותאפס את החשבון למצב התחלתי.</p>
                <button class="btn" style="background-color: var(--error); color: white;" onclick="resetChild(${index})">איפוס</button>
            </div>
            <div style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 20px;">
                <h4>הסרת ילד</h4>
                <p>לחיצה על כפתור זה תסיר את הילד מהמערכת.</p>
                <button class="btn" style="background-color: var(--error); color: white;" onclick="deleteChild(${index})">הסר ילד</button>
            </div>
        </div>
        
        <div class="goals-section">
            <div class="goals-header">
                <h2>המטרות שלי</h2>
                <button class="btn btn-small btn-accent" onclick="openGoalModal(${index})"><i class="fas fa-plus"></i> הוסף מטרה</button>
            </div>
            <div class="goals-container" id="goals-container-${index}">
                <!-- המטרות יתווספו כאן באופן דינמי -->
            </div>
        </div>
        
        <div class="calculator-section">
            <h2>מחשבון הריבית</h2>
            <p>כך הכסף שלך גדל עם הזמן!</p>
            
            <div class="chart-toggle">
                <button class="btn btn-toggle months-view-btn active" onclick="changeChartView(${index}, 'months')">חודשים</button>
                <button class="btn btn-toggle years-view-btn" onclick="changeChartView(${index}, 'years')">שנים</button>
            </div>
            
            <div class="chart-container">
                <div class="chart-bars interest-chart" id="interest-chart-${index}">
                    <!-- Chart bars will be generated dynamically -->
                </div>
            </div>
        </div>
    `;
    
    return content;
}

/**
 * הפעלת טאב (מעבר בין ילדים)
 * @param {number} index - אינדקס הילד שיש להפעיל
 */
function activateTab(index) {
    console.log("מפעיל טאב עם אינדקס: " + index);
    
    // עדכון אינדקס פעיל
    appState.activeChildIndex = index;
    
    // מסמן את הטאב הפעיל
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        if (parseInt(tab.dataset.index) === index) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // הצג את התוכן הרלוונטי
    var contents = document.querySelectorAll('.tab-content');
    contents.forEach(function(content, i) {
        if (content.id === 'child-tab-' + index) {
            content.classList.add('active');
            // עדכון התצוגה של הטאב הפעיל
            updateChildTabUI(index);
        } else {
            content.classList.remove('active');
        }
    });
    
    saveAppState();
}

/**
 * עדכון תצוגת תוכן טאב של ילד
 * @param {number} index - אינדקס הילד
 */
function updateChildTabUI(index) {
    var child = appState.children[index];
    var tabContent = document.getElementById('child-tab-' + index);
    
    if (!tabContent) return;
    

// עדכון יתרה וריבית
    tabContent.querySelector('.balance-amount').textContent = child.balance.toLocaleString('he-IL', {maximumFractionDigits: 0});
    tabContent.querySelector('.interest-earned').textContent = child.interestEarned.toLocaleString('he-IL', {maximumFractionDigits: 0});
    
    // עדכון רמה ותגים
    tabContent.querySelector('.level-indicator').textContent = `רמה ${child.level}: ${getLevelName(child.level)}`;
    updateBadges(index);
    
    // עדכון התקדמות לרמה הבאה
    updateLevelProgress(index);
    
    // עדכון נתונים סטטיסטיים
    updateStats(index);
    
    // עדכון שדות בהגדרות
    tabContent.querySelector('.interest-rate-input').value = (child.interestRate * 100).toFixed(1);
    tabContent.querySelector('.monthly-deposit-input').value = child.monthlyDeposit.toLocaleString('he-IL', {maximumFractionDigits: 0});
    
    // עדכון סוג ויזואליזציה
    var vizSelect = tabContent.querySelector('.visualization-type');
    if (vizSelect) {
        vizSelect.value = child.visualization;
    }
    
    // עדכון ויזואליזציה
    if (child.visualization === 'tree') {
        document.getElementById('tree-' + index).style.display = 'block';
        document.getElementById('rocket-' + index).style.display = 'none';
        updateTreeVisualization(index);
    } else {
        document.getElementById('tree-' + index).style.display = 'none';
        document.getElementById('rocket-' + index).style.display = 'block';
        updateRocketVisualization(index);
    }
    
    // עדכון כפתורי תצוגת גרף
    var monthsBtn = tabContent.querySelector('.months-view-btn');
    var yearsBtn = tabContent.querySelector('.years-view-btn');
    
    if (child.chartView === "months") {
        monthsBtn.classList.add('active');
        yearsBtn.classList.remove('active');
    } else {
        yearsBtn.classList.add('active');
        monthsBtn.classList.remove('active');
    }
    
    // עדכון הגרף
    updateChart(index);
    
    // עדכון המטרות
    updateGoals(index);
}

/**
 * עדכון התקדמות לרמה הבאה
 * @param {number} index - אינדקס הילד
 */
function updateLevelProgress(index) {
    const child = appState.children[index];
    const tabContent = document.getElementById('child-tab-' + index);
    
    // מציאת דרישות הרמה הנוכחית והבאה
    let currentLevelXP = 0;
    let nextLevelXP = Infinity;
    
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].level === child.level) {
            currentLevelXP = levels[i].requiredXP;
        }
        if (levels[i].level === child.level + 1) {
            nextLevelXP = levels[i].requiredXP;
            break;
        }
    }
    
    // חישוב אחוז התקדמות
    const xpForNextLevel = nextLevelXP - currentLevelXP;
    const currentProgress = child.xp - currentLevelXP;
    const progressPercent = Math.min(100, Math.max(0, (currentProgress / xpForNextLevel) * 100));
    
    // עדכון במסך
    tabContent.querySelector('#level-progress-' + index).textContent = `${currentProgress}/${xpForNextLevel}`;
    tabContent.querySelector('#level-progress-bar-' + index).style.width = `${progressPercent}%`;
}

/**
 * עדכון נתונים סטטיסטיים
 * @param {number} index - אינדקס הילד
 */
function updateStats(index) {
    const child = appState.children[index];
    const tabContent = document.getElementById('child-tab-' + index);
    
    // שיעור חיסכון - חישוב מתוך העסקאות
    let incomeSum = 0;
    let savingsSum = child.balance;
    
    child.transactions.forEach(tx => {
        if (tx.type === "הכנסה" && tx.description !== "ריבית חודשית") {
            incomeSum += tx.amount;
        }
    });
    
    const savingsRate = incomeSum > 0 ? (savingsSum / incomeSum) * 100 : 0;
    tabContent.querySelector('#savings-rate-' + index).textContent = savingsRate.toFixed(0) + '%';
    
    // ממוצע חודשי - אם יש עסקאות
    let monthlyAvg = 0;
    if (child.transactions.length > 0) {
        const firstDate = new Date(child.transactions[0].date);
        const now = new Date();
        const monthsDiff = (now.getFullYear() - firstDate.getFullYear()) * 12 + now.getMonth() - firstDate.getMonth();
        monthlyAvg = monthsDiff > 0 ? child.balance / monthsDiff : child.balance;
    }
    
    tabContent.querySelector('#monthly-avg-' + index).textContent = '₪ ' + monthlyAvg.toLocaleString('he-IL', {maximumFractionDigits: 0});
    
    // ימים רצופים - לא מחושב עדיין, פשוט מציג 0
    tabContent.querySelector('#streak-' + index).textContent = '0';
}

/**
 * עדכון תגים
 * @param {number} index - אינדקס הילד
 */
function updateBadges(index) {
    const child = appState.children[index];
    const container = document.getElementById('badge-container-' + index);
    
    if (!container) return;
    
    container.innerHTML = '';
    
    child.badges.slice(0, 3).forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = 'badge';
        badgeEl.innerHTML = `
            <i class="fas fa-${badge.icon}"></i>
            <div class="badge-tooltip">${badge.name}</div>
        `;
        container.appendChild(badgeEl);
    });
    
    // אם יש יותר מ-3 תגים, הוסף כפתור "עוד"
    if (child.badges.length > 3) {
        const moreBadge = document.createElement('div');
        moreBadge.className = 'badge';
        moreBadge.innerHTML = `
            <i class="fas fa-ellipsis-h"></i>
            <div class="badge-tooltip">עוד ${child.badges.length - 3} תגים</div>
        `;
        moreBadge.onclick = function() {
            showAchievements(index);
        };
        container.appendChild(moreBadge);
    }
}

/**
 * עדכון ויזואליזציה של עץ החיסכון
 * @param {number} childIndex - אינדקס הילד
 */
function updateTreeVisualization(childIndex) {
    const child = appState.children[childIndex];
    const treeContainer = document.getElementById('tree-' + childIndex);
    const treeTrunk = treeContainer.querySelector('.tree-trunk');
    const treeLeaves = treeContainer.querySelectorAll('.tree-leaves');
    
    // חישוב גודל העץ בהתאם ליתרה
    let treeHeight = 40; // אחוז מינימלי
    let treeWidth = 100; // גודל מינימלי
    
    if (child.balance >= 1000) {
        treeHeight = 80;
        treeWidth = 220;
    } else if (child.balance >= 500) {
        treeHeight = 65;
        treeWidth = 180;
    } else if (child.balance >= 200) {
        treeHeight = 50;
        treeWidth = 140;
    }
    
    // עדכון גודל העץ
    treeTrunk.style.height = treeHeight + '%';
    
    treeLeaves.forEach((leaf, index) => {
        leaf.style.width = (treeWidth - index * 20) + 'px';
        leaf.style.height = (treeWidth - index * 20) + 'px';
    });
    
    // הסרת פירות קיימים
    const existingFruits = treeContainer.querySelectorAll('.tree-fruit');
    existingFruits.forEach(fruit => fruit.remove());
    
    // הוספת פירות בהתאם ליתרה
    const fruitCount = Math.min(20, Math.floor(child.balance / 50));
    
    for (let i = 0; i < fruitCount; i++) {
        const fruit = document.createElement('div');
        fruit.className = 'tree-fruit';
        
        // מיקום אקראי על העץ
        const leafIndex = Math.floor(Math.random() * treeLeaves.length);
        const leaf = treeLeaves[leafIndex];
        
        const leafRect = leaf.getBoundingClientRect();
        const treeRect = treeContainer.getBoundingClientRect();
        
        const left = (leafRect.left - treeRect.left) + Math.random() * leaf.offsetWidth;
        const top = (leafRect.top - treeRect.top) + Math.random() * leaf.offsetHeight;
        
        fruit.style.left = left + 'px';
        fruit.style.top = top + 'px';
        fruit.style.opacity = '1';
        
        treeContainer.appendChild(fruit);
    }
}

/**
 * עדכון ויזואליזציה של חללית
 * @param {number} childIndex - אינדקס הילד
 */
function updateRocketVisualization(childIndex) {
    const child = appState.children[childIndex];
    const rocketContainer = document.getElementById('rocket-' + childIndex);
    const spaceBackground = document.getElementById('space-' + childIndex);
    const rocket = rocketContainer.querySelector('.rocket');
    const planet = rocketContainer.querySelector('.planet');
    
    // ניקוי כוכבים קיימים
    const existingStars = spaceBackground.querySelectorAll('.star');
    existingStars.forEach(star => star.remove());
    
    // הוספת כוכבים
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        spaceBackground.appendChild(star);
    }
    
    // חישוב מיקום החללית בהתאם ליתרה
    let rocketBottom = 10; // אחוז מינימלי
    let rocketLeft = 10; // אחוז מינימלי
    let planetSize = 60; // גודל מינימלי
    
    if (child.balance >= 1000) {
        rocketBottom = 70;
        rocketLeft = 70;
        planetSize = 120;
    } else if (child.balance >= 500) {
        rocketBottom = 50;
        rocketLeft = 50;
        planetSize = 90;
    } else if (child.balance >= 200) {
        rocketBottom = 30;
        rocketLeft = 30;
        planetSize = 70;
    }
    
    // עדכון מיקום החללית
    rocket.style.bottom = rocketBottom + '%';
    rocket.style.left = rocketLeft + '%';
    
    // עדכון גודל הכוכב
    planet.style.width = planetSize + 'px';
    planet.style.height = planetSize + 'px';
}

/**
 * רענון כל הטאבים
 */
function refreshAllTabs() {
    // ניקוי כל הטאבים
    var tabsContainer = document.getElementById('tabs-container');
    var addChildButton = document.getElementById('add-child-button');
    
    // הסרת כל הטאבים למעט כפתור הוספת ילד
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        tabsContainer.removeChild(tab);
    });
    
    // ניקוי תוכן כל הטאבים
    var tabContentsContainer = document.getElementById('tab-contents-container');
    tabContentsContainer.innerHTML = '';
    
    // יצירת טאבים ותוכן חדשים
    appState.children.forEach(function(child, index) {
        var newTab = createChildTab(child.kidName, index);
        tabsContainer.insertBefore(newTab, addChildButton);
        
        var newContent = createTabContent(child, index);
        tabContentsContainer.appendChild(newContent);
    });
    
    // אם יש טאב פעיל, הפעל אותו
    if (appState.activeChildIndex >= 0 && appState.activeChildIndex < appState.children.length) {
        activateTab(appState.activeChildIndex);
    }
}

/**
 * עדכון עובדת "הידעת"
 */
function updateDidYouKnow() {
    // בחירת עובדה אקראית או לפי האינדקס הקיים
    let index = appState.settings.didYouKnowIndex;
    
    // אם זה רענון עמוד, בחר אקראית
    if (index >= didYouKnowItems.length) {
        index = Math.floor(Math.random() * didYouKnowItems.length);
    }
    
    const fact = didYouKnowItems[index];
    const container = document.getElementById('did-you-know');
    
    if (container) {
        container.innerHTML = `
            <h3>${fact.title}</h3>
            <p>${fact.content}</p>
        `;
    }
    
    // עדכון האינדקס לעובדה הבאה
    appState.settings.didYouKnowIndex = (index + 1) % didYouKnowItems.length;
    saveAppState();
}

/**
 * הצגת הודעת ריבית
 * @param {number} amount - סכום הריבית
 */
function showInterestMessage(amount) {
    document.getElementById('interest-amount-text').textContent = amount.toLocaleString('he-IL', {maximumFractionDigits: 0});
    
    // יצירת קונפטי אקראי
    createConfetti();
    
    // הצגת השכבה
    const overlay = document.getElementById('interest-overlay');
    overlay.classList.add('active');
}

/**
 * הסתרת הודעת ריבית
 */
function hideInterestMessage() {
    const overlay = document.getElementById('interest-overlay');
    overlay.classList.remove('active');
}

/**
 * יצירת קונפטי לחגיגת ריבית
 */
function createConfetti() {
    const confettiContainer = document.getElementById('interest-overlay');
    
    // ניקוי קונפטי קודם
    const oldConfetti = confettiContainer.querySelectorAll('.interest-confetti');
    oldConfetti.forEach(conf => conf.remove());
    
    // יצירת קונפטי חדש
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'interest-confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.backgroundColor = getRandomColor();
        
        confettiContainer.appendChild(confetti);
    }
}

/**
 * יצירת צבע אקראי
 * @returns {string} - צבע אקראי בפורמט HEX
 */
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7', '#FF9F1C'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * הצגת רשימת הישגים
 * @param {number} childIndex - אינדקס הילד
 */
function showAchievements(childIndex) {
    const child = appState.children[childIndex];
    
    let content = `<h3>ההישגים של ${child.kidName}</h3>`;
    
    content += '<div class="parent-grid">';
    
    // הישגים שהושגו
    if (child.badges.length > 0) {
        child.badges.forEach(badge => {
            const achievementInfo = achievementsList.find(a => a.id === badge.id);
            content += `
                <div class="parent-card">
                    <h4><i class="fas fa-${badge.icon}"></i> ${badge.name}</h4>
                    <p>${achievementInfo ? achievementInfo.description : ''}</p>
                    <small>הושג: ${new Date(badge.date).toLocaleDateString('he-IL')}</small>
                </div>
            `;
        });
    }
    
    // הישגים שטרם הושגו
    const unachievedBadges = achievementsList.filter(a => !child.badges.some(b => b.id === a.id));
    
    if (unachievedBadges.length > 0) {
        unachievedBadges.forEach(badge => {
            content += `
                <div class="parent-card" style="opacity: 0.5;">
                    <h4><i class="fas fa-${badge.icon}"></i> ${badge.name}</h4>
                    <p>${badge.description}</p>
                    <small>לא הושג עדיין</small>
                </div>
            `;
        });
    }
    
    content += '</div>';
    
    // הצגת בתוך מודל או toast
    showToast("הישגים", content, "info", 10000, true);
}

/**
 * פתיחת מודל
 * @param {string} modalId - מזהה המודל שיש לפתוח
 */
function showModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

/**
 * סגירת מודל
 * @param {string} modalId - מזהה המודל שיש לסגור
 */
function hideModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * הצגת הודעת toast
 * @param {string} title - כותרת ההודעה
 * @param {string} message - תוכן ההודעה
 * @param {string} type - סוג ההודעה (success/error/info)
 * @param {number} duration - זמן הצגה במילישניות
 * @param {boolean} isLarge - האם להציג הודעה גדולה
 */
function showToast(title, message, type, duration = 5000, isLarge = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    if (isLarge) {
        toast.style.maxWidth = '500px';
        toast.style.maxHeight = '400px';
        toast.style.overflowY = 'auto';
    }
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div>
            <strong>${title}</strong>
            <div>${message}</div>
        </div>
        <div class="toast-progress"></div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
}

/**
 * שינוי סוג הויזואליזציה
 * @param {number} childIndex - אינדקס הילד
 * @param {string} type - סוג הויזואליזציה (tree/rocket)
 */
function changeVisualization(childIndex, type) {
    var child = appState.children[childIndex];
    child.visualization = type;
    
    if (type === 'tree') {
        document.getElementById('tree-' + childIndex).style.display = 'block';
        document.getElementById('rocket-' + childIndex).style.display = 'none';
        updateTreeVisualization(childIndex);
    } else {
        document.getElementById('tree-' + childIndex).style.display = 'none';
        document.getElementById('rocket-' + childIndex).style.display = 'block';
        updateRocketVisualization(childIndex);
    }
    
    saveAppState();
}

/**
 * הצגת תעודת הצטיינות
 * @param {number} childIndex - אינדקס הילד
 * @param {Object} goal - מטרת החיסכון שהושגה
 */
function showCertificate(childIndex, goal) {
    const child = appState.children[childIndex];
    
    // הגדרת ערכים בתעודה
    document.getElementById('certificate-name').textContent = child.kidName;
    document.getElementById('certificate-reason').textContent = `על השגת המטרה: ${goal.name}`;
    
    const today = new Date();
    document.getElementById('certificate-date').textContent = today.toLocaleDateString('he-IL');
    
    // הצגת המודל
    showModal('certificate-modal');
}

/**
 * הדפסת תעודה
 */
function printCertificate() {
    window.print();
}

/**
 * הצגת טיפ אישי
 * @param {number} childIndex - אינדקס הילד
 */
function showPersonalTip(childIndex) {
    const child = appState.children[childIndex];
    
    // בחירת טיפ אקראי או לפי האינדקס האחרון
    let tipIndex = child.lastTip;
    tipIndex = (tipIndex + 1) % savingTips.length;
    
    // שמירת האינדקס החדש
    child.lastTip = tipIndex;
    saveAppState();
    
    const tip = savingTips[tipIndex];
    showToast("טיפ חיסכון", tip, "info", 8000);
}

/**
 * הצגת בקרת הורים
 */
function showParentControls() {
    // בדיקה אם יש קוד הורה
    if (appState.settings.parentPin && appState.settings.parentPin.length > 0) {
        const pin = prompt("הכנס קוד גישה להורים");
        if (pin !== appState.settings.parentPin) {
            showToast("גישה נדחתה", "קוד גישה שגוי", "error");
            return;
        }
    }
    
    // עדכון נתונים בפאנל ההורים
    updateParentPanel();
    
    document.getElementById('parent-controls').classList.add('active');
}

/**
 * הסתרת בקרת הורים
 */
function hideParentControls() {
    document.getElementById('parent-controls').classList.remove('active');
}

/**
 * החלפת טאב בפאנל ההורים
 * @param {string} tabId - מזהה הטאב
 */
function switchParentTab(tabId) {
    // החלפת כפתור פעיל
    document.querySelectorAll('.parent-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.parent-tab[onclick="switchParentTab('${tabId}')"]`).classList.add('active');
    
    // החלפת תוכן פעיל
    document.querySelectorAll('.parent-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('parent-' + tabId).classList.add('active');
}
