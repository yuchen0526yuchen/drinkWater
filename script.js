// 榮譽箴言
const ideals = [
    "生命優於死亡。力量優於軟弱。旅程優於終點。",
    "我將保護那些無法保護自己的人。",
    "即使我討厭那些需要保護的人，我也會保護他們。",
    "只要它是正確的，我會保護所有人，哪怕包括我自己。",
    "我將團結眾人，而非分裂他們。我將帶領他們前進。",
    "我會記住那些被遺忘的人。",
    "我會傾聽那些被忽視的人。",
    "我會述說那些未被講述的故事。",
    "我會將破碎之人縫合。",
    "我會比任何人都更努力去戰勝自己的錯誤。",
    "我可以接受失敗，但我不能接受不嘗試。"
];

const dailyIdealDisplay = document.getElementById('dailyIdeal');

// 函數：隨機更換箴言
function refreshIdeal() {
    const randomIndex = Math.floor(Math.random() * ideals.length);
    const selectedIdeal = ideals[randomIndex];
    
    // 加上淡出淡入效果
    dailyIdealDisplay.style.opacity = 0;
    setTimeout(() => {
        dailyIdealDisplay.innerText = `“ ${selectedIdeal} ”`;
        dailyIdealDisplay.style.opacity = 1;
    }, 500);
}

// 介面過場效果
dailyIdealDisplay.style.transition = 'opacity 0.5s ease';

// 網頁載入時立刻更換箴言
refreshIdeal();


// --- 原有的計時器邏輯 ---

let timer;
const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timerDisplay');
const minutesInput = document.getElementById('minutesInput');
const statusText = document.getElementById('statusText');

startBtn.addEventListener('click', () => {
    // 請求瀏覽器通知權限
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                statusText.innerText = "風父的祝福已降臨。通知已開啟。";
            }
        });
    }
    
    startTimer();
    refreshIdeal(); // 按下按鈕時也更換箴言
    statusText.innerText = "颶光正在聚集。誓言已在倒數。";
    startBtn.innerText = "重訂誓言"; // 修改按鈕文字
});

function startTimer() {
    clearInterval(timer);
    let seconds = minutesInput.value * 60;
    
    // 如果輸入太小（防錯）
    if (seconds < 10) seconds = 10;
    
    updateDisplay(seconds);
    
    timer = setInterval(() => {
        seconds--;
        updateDisplay(seconds);
        
        if (seconds <= 0) {
            clearInterval(timer);
            sendNotification();
            refreshIdeal(); // 計時結束更換箴言
            startTimer(); // 自動重新計時
        }
    }, 1000);
}

function updateDisplay(sec) {
    const mins = Math.floor(sec / 60);
    const remainderSecs = sec % 60;
    timerDisplay.innerText = `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
}

function sendNotification() {
    if (Notification.permission === "granted") {
        new Notification("💧 你的「柔光」已耗盡！", {
            body: "身體需要補充水分以維持光輝。起身喝杯水，注入新的颶光。",
            icon: "https://cdn-icons-png.flaticon.com/512/3100/3100566.png" // 可以替換成騎士團紋章圖示
        });
    } else {
        alert("喝水時間到！你的光輝正在消逝！");
    }
}

// 新增變數
let currentWater = parseInt(localStorage.getItem('waterCount')) || 0;
const goalWater = 2000; // 目標值，你可以自行修改

// 初始化顯示
updateWaterUI();

function addWater(amount) {
    currentWater += amount;
    saveAndRefresh();
    
    // 小驚喜：當達到目標時的文字
    if (currentWater >= goalWater) {
        statusText.innerText = "你的光輝已達巔峰！你已充滿颶光。";
    }
}

function resetWater() {
    if (confirm("確定要清空今日的颶光儲備嗎？")) {
        currentWater = 0;
        saveAndRefresh();
        statusText.innerText = "儲備已清空，重新開始你的旅程。";
    }
}

function saveAndRefresh() {
    localStorage.setItem('waterCount', currentWater);
    updateWaterUI();
}

function updateWaterUI() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const percentage = Math.min((currentWater / goalWater) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${currentWater} / ${goalWater} ml`;
}

// 可以在 sendNotification 裡面也加入提醒
function sendNotification() {
    if (Notification.permission === "granted") {
        new Notification("💧 你的「柔光」已耗盡！", {
            body: `目前的儲備為 ${currentWater}ml。請補給以維持光輝。`,
            icon: "https://cdn-icons-png.flaticon.com/512/3100/3100566.png"
        });
    }
}
