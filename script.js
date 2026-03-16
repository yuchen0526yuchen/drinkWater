// --- 榮譽箴言库 (Ideals) ---
const ideals = [
    "生命先於死亡。力量先於軟弱。旅程先於終點。",
    "我將保護那些無法保護自己的人。",
    "即使我討厭那些需要保護的人，我也會保護他們。",
    "只要它是正確的，我會保護所有人，哪怕包括我自己。",
    "我將團結眾人，而非分裂他們。",
    "我會記住那些被遺忘的人。",
    "我會比任何人都更努力去戰勝自己的錯誤。",
];

const dailyIdealDisplay = document.getElementById('dailyIdeal');

// 隨機更換箴言 (織光者幻象動畫)
function refreshIdeal() {
    if (!dailyIdealDisplay) return;
    
    // 加上織光者寶石般的紅光過場
    dailyIdealDisplay.style.color = '#e6194b'; // Garnet red
    dailyIdealDisplay.style.opacity = 0;
    dailyIdealDisplay.style.textShadow = '0 0 10px #e6194b';
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * ideals.length);
        dailyIdealDisplay.innerText = `“ ${ideals[randomIndex]} ”`;
        dailyIdealDisplay.style.opacity = 1;
        dailyIdealDisplay.style.color = '#ccddff'; // Restore honor blue
        dailyIdealDisplay.style.textShadow = 'none';
    }, 500);
}

// 設置淡出過場效果
dailyIdealDisplay.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
refreshIdeal(); // 初始載入


// --- 飲水紀錄與目標系統 ---

// 從本地緩存讀取目標，預設為 2000
let goalWater = parseInt(localStorage.getItem('waterGoal')) || 2000;
// 從本地緩存讀取當前喝水量
let currentWater = parseInt(localStorage.getItem('waterCount')) || 0;

// DOM 元素
const goalInput = document.getElementById('goalInput');
const setGoalBtn = document.getElementById('setGoalBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');

// 初始化顯示
goalInput.value = goalWater;
updateWaterUI();

// 設置目標邏輯
setGoalBtn.addEventListener('click', () => {
    let newGoal = parseInt(goalInput.value);
    
    if (isNaN(newGoal) || newGoal < 500) {
        alert("旅程需要足夠的準備。目標不能小於 500ml。");
        goalInput.value = goalWater;
        return;
    }
    
    goalWater = newGoal;
    localStorage.setItem('waterGoal', goalWater); // 保存新目標
    updateWaterUI();
    
    statusText.innerText = "新誓言已立。你的旅程目標是 " + goalWater + "ml。";
    refreshIdeal(); // 目標改變，風父給予新指示
    
    // 按鈕金屬反饋
    setGoalBtn.innerText = "誓言已定";
    setGoalBtn.style.borderColor = "#ffffff";
    setTimeout(() => {
        setGoalBtn.innerText = "綁定誓言";
        setGoalBtn.style.borderColor = "#552222";
    }, 1500);
});

// 增加喝水量
function addWater(amount) {
    currentWater += amount;
    saveAndRefresh();
    
    if (currentWater >= goalWater) {
        statusText.innerText = "榮譽！你的光輝已達巔峰。你注入了足夠的颶光。";
    } else {
        statusText.innerText = "已補充 " + amount + "ml 柔光。旅程繼續。";
    }
    
    // 增加按鈕粒子效果的 placeholder (因純CSS不夠完美，故省略，保持乾淨)
}

// 清空紀錄
function resetWater() {
    if (confirm("確定要清空今日的颶光儲備嗎？這將消除今日的旅程紀錄。")) {
        currentWater = 0;
        saveAndRefresh();
        statusText.innerText = "儲備已清空，光輝消逝。重新立誓吧。";
        refreshIdeal();
    }
}

// 保存並更新介面
function saveAndRefresh() {
    localStorage.setItem('waterCount', currentWater);
    updateWaterUI();
}

// 更新紀錄介面
function updateWaterUI() {
    const percentage = Math.min((currentWater / goalWater) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${currentWater} / ${goalWater} ml`;
}


// --- 計時器邏輯 ---

let timerInterval;
const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timerDisplay');
const minutesInput = document.getElementById('minutesInput');
const sphereWrapper = document.querySelector('.sphere-wrapper');

startBtn.addEventListener('click', () => {
    // 請求通知權限
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                statusText.innerText = "風父的祝福已降臨。通知已開啟。";
            }
        });
    }
    
    startTimer();
    refreshIdeal(); // 按下按鈕時也更換箴言
});

function startTimer() {
    clearInterval(timerInterval);
    let seconds = minutesInput.value * 60;
    
    if (isNaN(seconds) || seconds < 10) seconds = 10;
    
    updateTimerDisplay(seconds);
    
    // 加上計時狀態的視覺效果 (寶石旋轉動畫)
    sphereWrapper.classList.add('timer-running');
    startBtn.innerText = "重訂誓言"; 
    startBtn.style.backgroundColor = "#cc0000"; // 重置時變紅表示警告
    startBtn.style.borderColor = "#ff4444";
    statusText.innerText = "颶光聚集，誓言倒數中...";
    
    timerInterval = setInterval(() => {
        seconds--;
        updateTimerDisplay(seconds);
        
        if (seconds <= 0) {
            clearInterval(timerInterval);
            sendNotification();
            refreshIdeal(); 
            startTimer(); // 自動重新計時
        }
    }, 1000);
}

function updateTimerDisplay(sec) {
    const mins = Math.floor(sec / 60);
    const remainderSecs = sec % 60;
    timerDisplay.innerText = `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
}

function sendNotification() {
    if (Notification.permission === "granted") {
        new Notification("💧 颶光已耗盡！", {
            body: `目前的儲備為 ${currentWater}ml。請補給以維持光輝。`,
            // 建議換成橋四點或榮譽紋章圖示網址
            icon: "https://cdn-icons-png.flaticon.com/512/3100/3100566.png" 
        });
    } else {
        alert("喝水時間到！你的光輝正在消逝！");
    }
}
