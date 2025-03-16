/**
 * קופת החיסכון המשפחתית - ניהול מצב האפליקציה
 * מודול זה אחראי על ניהול מצב האפליקציה, שמירה וטעינה של נתונים
 */

// מצב המערכת - אובייקט גלובלי המכיל את כל המידע של האפליקציה
var appState = {
    children: [],           // רשימת הילדים
    activeChildIndex: -1,   // אינדקס הילד הפעיל כרגע (-1 אם אין)
    settings: {
        darkMode: false,         // האם מצב כהה מופעל
        parentPin: "",           // קוד גישה להורים
        globalInterestRate: 0.05, // ריבית גלובלית (5%)
        lastInterestDate: null,  // תאריך חישוב ריבית אחרון
        didYouKnowIndex: 0       // אינדקס עובדה נוכחית
    }
};

// ======= מאגרי מידע =======

// מידע על הידעת
const didYouKnowItems = [
    {
        title: "כוח הריבית דריבית",
        content: "אם תחסכו 10 ₪ בחודש מגיל 8 ועד גיל 18 עם ריבית של 5%, בסוף תקבלו יותר מ-1,500 ₪! כמעט פי 1.5 ממה שהפקדתם!"
    },
    {
        title: "החוק של מספר 72",
        content: "רוצים לדעת מתי הכסף שלכם יוכפל? חלקו את המספר 72 באחוז הריבית השנתית ותקבלו את מספר השנים. למשל, בריבית של 6% שנתית, הכסף יוכפל בערך תוך 12 שנים!"
    },
    {
        title: "מה זה תקציב?",
        content: "תקציב הוא תכנית שעוזרת לנו להחליט איך להשתמש בכסף שלנו. זה כמו מפה שמראה לאן הכסף שלנו הולך, וזה עוזר לנו לחסוך יותר!"
    },
    {
        title: "איך בנק עובד?",
        content: "בנק הוא מקום שבו אנשים שמים את הכסף שלהם לשמירה. הבנק משתמש בחלק מהכסף כדי להלוות לאנשים אחרים, וכך הוא מרוויח כסף ויכול לשלם לך ריבית על החיסכון שלך."
    },
    {
        title: "למה לחסוך?",
        content: "חיסכון עוזר לנו לקנות דברים גדולים בעתיד! כשאנחנו שמים כסף בצד, אנחנו יכולים להשיג מטרות כמו אופניים חדשים, טלפון, או אפילו לימודים באוניברסיטה!"
    },
    {
        title: "מיהו וורן באפט?",
        content: "וורן באפט הוא אחד האנשים העשירים בעולם, והוא התחיל לחסוך ולהשקיע כבר בגיל 11! הוא אומר: \"אל תחסכו מה שנשאר אחרי שהוצאתם, אלא תוציאו מה שנשאר אחרי שחסכתם.\""
    },
    {
        title: "כסף דיגיטלי",
        content: "היום, רוב הכסף בעולם הוא דיגיטלי! רק כ-8% מהכסף בעולם קיים כמטבעות ושטרות אמיתיים. השאר הוא רק מספרים במחשבים."
    },
    {
        title: "המטבע הראשון",
        content: "המטבעות הראשונים בעולם נוצרו לפני כ-2,700 שנה בלידיה (טורקיה של היום). לפני כן, אנשים היו מחליפים דברים זה עם זה במקום להשתמש בכסף."
    },
    {
        title: "קופת חיסכון יפנית",
        content: "ביפן יש קופות חיסכון בצורת חתול שנקראות 'מאנקי נקו' שמביאות מזל טוב ועושר. החתול מניף את הכף שלו כאילו הוא קורא לכסף להיכנס לקופה!"
    },
    {
        title: "פסיכולוגיה של כסף",
        content: "מחקרים מראים שילדים שלומדים לחסוך בגיל צעיר מצליחים יותר מבחינה כלכלית כשהם גדלים! זה כי הם לומדים סבלנות ותכנון לטווח ארוך."
    }
];

// טיפים וטריקים לחיסכון
const savingTips = [
    "שים לב למה שאתה קונה - שאל את עצמך אם אתה באמת צריך את זה",
    "נסה לחסוך לפחות 10% מכל סכום שאתה מקבל",
    "הגדר לעצמך מטרות קטנות בדרך למטרה הגדולה",
    "שים את החיסכון שלך במקום שקשה להגיע אליו",
"דמיין מה תוכל לקנות בסכום שאתה חוסך",
    "תכנן מראש קניות גדולות ואל תקנה בדחף",
    "השתמש ב'חוק 24 השעות' - חכה יום שלם לפני קניה גדולה",
    "הכן רשימת קניות ותיצמד אליה",
    "חפש מבצעים והנחות בחנויות",
    "הפקד סכום קבוע בכל שבוע או חודש"
];

// תרחישי סימולטור החלטות
const simulatorScenarios = [
    {
        question: "קיבלת 100 ₪ ליום הולדת. מה תעשה איתם?",
        options: [
            { text: "אקנה משחק או צעצוע", outcome: "נהנית מהמשחק, אבל הכסף נגמר. חשוב לאזן בין הנאות לבין חיסכון!" },
            { text: "אשים הכל בחיסכון", outcome: "הכסף שלך ימשיך לגדול עם ריבית! בעוד שנה יהיה לך יותר מ-105 ₪." },
            { text: "אחסוך חלק ואבזבז חלק", outcome: "מעולה! זו החלטה מאוזנת שמאפשרת לך ליהנות עכשיו וגם לחסוך לעתיד." }
        ]
    },
    {
        question: "אתה רוצה לקנות משחק שעולה 200 ₪, אבל יש לך רק 100 ₪. מה תעשה?",
        options: [
            { text: "אבקש עוד כסף מההורים", outcome: "כדאי ללמוד לחסוך בעצמך! נסה להרוויח את הכסף החסר." },
            { text: "אחסוך עוד חודש-חודשיים", outcome: "נהדר! סבלנות משתלמת. גם תלמד להעריך יותר את המשחק כשתקנה אותו." },
            { text: "אחפש משחק דומה במחיר זול יותר", outcome: "חשיבה חכמה! לפעמים יש אפשרויות טובות שעולות פחות." }
        ]
    },
    {
        question: "אתה הולך לקניון עם חברים. יש לך 50 ₪. מה תעשה?",
        options: [
            { text: "אוציא את כל הכסף על נשנושים", outcome: "נהנית, אבל עכשיו אין לך כסף. בפעם הבאה כדאי להשאיר קצת בצד." },
            { text: "אקבע מראש כמה אני מוציא", outcome: "מצוין! תכנון תקציב מראש הוא הרגל מעולה שיעזור לך בחיים." },
            { text: "אשאיר את הכסף בבית", outcome: "חסכוני, אבל אפשר גם ליהנות קצת. האיזון חשוב בניהול כספים." }
        ]
    },
    {
        question: "אתה מרוויח 30 ₪ בשבוע מדמי כיס. איך תנהל את הכסף?",
        options: [
            { text: "אוציא הכל כל שבוע", outcome: "ככה לא יישאר לך כלום לדברים גדולים יותר שתרצה בעתיד." },
            { text: "אחסוך חצי ואבזבז חצי", outcome: "מעולה! זו דרך מצוינת לאזן בין הנאות היום לבין מטרות עתידיות." },
            { text: "אחסוך הכל לדבר גדול", outcome: "חיסכון הוא חשוב, אבל גם מותר ליהנות קצת. נסה למצוא איזון." }
        ]
    },
    {
        question: "אתה רוצה להרוויח יותר כסף. מה תעשה?",
        options: [
            { text: "אבקש יותר דמי כיס", outcome: "אפשר לנסות, אבל כדאי גם לחשוב על דרכים להרוויח בעצמך." },
            { text: "אציע לעזור בעבודות בית תמורת כסף", outcome: "יוזמה מצוינת! לימוד חשיבות העבודה והרווח שבא בעקבותיה." },
            { text: "אחפש דרכים יצירתיות להרוויח", outcome: "נהדר! חשיבה יזמית יכולה לפתוח הרבה דלתות להזדמנויות כלכליות." }
        ]
    }
];

// רשימת הישגים אפשריים
const achievementsList = [
    { id: "first_deposit", name: "הפקדה ראשונה", icon: "piggy-bank", description: "ביצעת את ההפקדה הראשונה שלך", xpReward: 50 },
    { id: "saving_streak_week", name: "שבוע של חיסכון", icon: "calendar-check", description: "חסכת במשך 7 ימים רצופים", xpReward: 100 },
    { id: "first_goal", name: "מטרה ראשונה", icon: "bullseye", description: "הגדרת את מטרת החיסכון הראשונה שלך", xpReward: 50 },
    { id: "goal_reached", name: "הגעת ליעד", icon: "trophy", description: "השגת את היעד הראשון שלך", xpReward: 200 },
    { id: "interest_earned", name: "מרוויח ריבית", icon: "percentage", description: "הרווחת את הריבית הראשונה שלך", xpReward: 75 },
    { id: "big_saver", name: "חוסך גדול", icon: "coins", description: "הגעת ל-500 ₪ בחיסכון", xpReward: 300 },
    { id: "money_master", name: "אלוף הכסף", icon: "crown", description: "הגעת ל-1,000 ₪ בחיסכון", xpReward: 500 },
    { id: "smart_spender", name: "קונה חכם", icon: "shopping-cart", description: "משכת כסף למטרה מתוכננת", xpReward: 100 },
    { id: "multiple_goals", name: "רב-משימתי", icon: "tasks", description: "הגדרת 3 מטרות חיסכון במקביל", xpReward: 150 },
    { id: "long_term_saver", name: "חוסך לטווח ארוך", icon: "hourglass", description: "שמרת על חיסכון למשך 3 חודשים", xpReward: 250 }
];

// מידע על רמות
const levels = [
    { level: 1, name: "מתחיל", requiredXP: 0 },
    { level: 2, name: "חוסך מתחיל", requiredXP: 100 },
    { level: 3, name: "חוסך מתקדם", requiredXP: 300 },
    { level: 4, name: "חוסך מנוסה", requiredXP: 600 },
    { level: 5, name: "מומחה חיסכון", requiredXP: 1000 },
    { level: 6, name: "אלוף החיסכון", requiredXP: 1500 },
    { level: 7, name: "גורו פיננסי", requiredXP: 2200 },
    { level: 8, name: "מיליונר העתיד", requiredXP: 3000 },
    { level: 9, name: "מאסטר הכלכלה", requiredXP: 4000 },
    { level: 10, name: "מלך הפיננסים", requiredXP: 5500 }
];

// ======= פונקציות ניהול מצב =======

/**
 * יצירת מצב ברירת מחדל לילד חדש
 * @param {string} name - שם הילד
 * @returns {Object} - אובייקט המכיל את המצב ההתחלתי של ילד חדש
 */
function createDefaultChildState(name) {
    return {
        kidName: name,
        balance: 100.00,                // יתרה התחלתית של 100 ש"ח
        interestEarned: 0.00,           // סך הריבית שנצברה
        interestRate: 0.05,             // 5% ריבית חודשית (ברירת מחדל)
        monthlyDeposit: 0.00,           // סכום הפקדה חודשית (ברירת מחדל)
        goals: [],                      // מטרות חיסכון
        transactions: [],               // היסטוריית עסקאות
        chartView: "months",            // תצוגת גרף ברירת מחדל
        level: 1,                       // רמת החוסך
        xp: 0,                          // נקודות ניסיון
        badges: [],                     // הישגים ותגים
        lastTip: 0,                     // אינדקס עצה אחרונה
        visualization: "tree"           // סוג ויזואליזציה (עץ או חללית)
    };
}

/**
 * טעינת מצב האפליקציה מהאחסון המקומי
 */
function loadAppState() {
    console.log("טוען את מצב האפליקציה");
    var savedState = localStorage.getItem('piggyBankAppState');
    if (savedState) {
        try {
            var parsedState = JSON.parse(savedState);
            appState.children = parsedState.children || [];
            
            // טעינת הגדרות
            if (parsedState.settings) {
                appState.settings = {
                    ...appState.settings,
                    ...parsedState.settings
                };
            }
            
            // אם יש ילדים, הפעל את הראשון
            if (appState.children.length > 0) {
                appState.activeChildIndex = 0;
            }
            
            // בדיקה האם להפעיל מצב כהה
            if (appState.settings.darkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
            }
            
            // חישוב ריבית אם צריך
            checkInterestCalculation();
            
        } catch (e) {
            console.error('שגיאה בטעינת מצב האפליקציה:', e);
            appState.children = [];
        }
    }
    
    // הצגת עובדה אקראית
    updateDidYouKnow();
}

/**
 * שמירת מצב האפליקציה לאחסון המקומי
 */
function saveAppState() {
    console.log("שומר את מצב האפליקציה");
    try {
        localStorage.setItem('piggyBankAppState', JSON.stringify(appState));
    } catch (e) {
        console.error('שגיאה בשמירת מצב האפליקציה:', e);
        showToast("שגיאה", "אירעה שגיאה בשמירת הנתונים", "error");
    }
}

/**
 * בדיקה אם צריך לחשב ריבית חודשית
 */
function checkInterestCalculation() {
    const now = new Date();
    const lastInterestDate = appState.settings.lastInterestDate ? new Date(appState.settings.lastInterestDate) : null;
    
    // אם אין תאריך אחרון או שעבר חודש מהחישוב האחרון
    if (!lastInterestDate || 
        (now.getMonth() !== lastInterestDate.getMonth() || now.getFullYear() !== lastInterestDate.getFullYear())) {
        
        calculateMonthlyInterest();
        appState.settings.lastInterestDate = now.toISOString();
        saveAppState();
    }
}

/**
 * חישוב ריבית חודשית לכל הילדים
 */
function calculateMonthlyInterest() {
    appState.children.forEach((child, index) => {
        const interestRate = child.interestRate;
        const interestAmount = Math.round(child.balance * interestRate);
        
        if (interestAmount > 0) {
            child.balance += interestAmount;
            child.interestEarned += interestAmount;
            
            // הוספת תנועה להיסטוריה
            addTransaction(index, interestAmount, "הכנסה", "ריבית חודשית");
            
            // בדיקה האם הילד פעיל כרגע
            if (index === appState.activeChildIndex) {
                // הצגת הודעה על הריבית
                showInterestMessage(interestAmount);
            }
            
            // הענקת הישג אם זו ריבית ראשונה
            if (!hasAchievement(index, "interest_earned")) {
                awardAchievement(index, "interest_earned");
            }
        }
    });
}

/**
 * פונקציה עזר לקבלת שם רמה
 * @param {number} level - מספר הרמה
 * @returns {string} - שם הרמה
 */
function getLevelName(level) {
    const levelInfo = levels.find(l => l.level === level);
    return levelInfo ? levelInfo.name : "מתחיל";
}

/**
 * יצירת גיבוי
 */
function createBackup() {
    const backup = {
        date: new Date().toISOString(),
        version: "1.0",
        data: appState
    };
    
    const json = JSON.stringify(backup);
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `piggybank_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("גיבוי נוצר", "הגיבוי נוצר בהצלחה ונשמר למחשב שלך", "success");
}

/**
 * שחזור מגיבוי
 */
function restoreFromBackup() {
    const fileInput = document.getElementById('restore-file');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showToast("שגיאה", "אנא בחר קובץ גיבוי", "error");
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (!backup.data || !backup.version) {
                showToast("שגיאה", "קובץ גיבוי לא תקין", "error");
                return;
            }
            
            // החלת הגיבוי
            appState = backup.data;
            
            // רענון הממשק
            refreshAllTabs();
            
            // סגירת פאנל הורים
            hideParentControls();
            
            showToast("שחזור הושלם", "הנתונים שוחזרו בהצלחה מקובץ הגיבוי", "success");
            
            saveAppState();
        } catch (error) {
            console.error('שגיאה בשחזור גיבוי:', error);
            showToast("שגיאה", "אירעה שגיאה בעת שחזור הנתונים", "error");
        }
    };
    
    reader.readAsText(file);
}
