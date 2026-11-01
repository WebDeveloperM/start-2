const HOLD_MS = 3000;
const LIFT_GRACE_MS = 400;

const startButton = document.getElementById('start-button');
const contacts = new Set();

let finished = false;
let holdTimer = null;
let liftTimer = null;

document.documentElement.style.setProperty('--hold', `${HOLD_MS}ms`);

// F11 rejimi ham to'liq ekran hisoblanadi, u document.fullscreenElement'da ko'rinmaydi
function isFullscreen() {
  return document.fullscreenElement !== null || Math.abs(window.innerHeight - screen.height) <= 1;
}

function enterFullscreen() {
  if (!isFullscreen()) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function finishScan() {
  clearTimeout(liftTimer);
  holdTimer = null;
  finished = true;
  document.body.classList.add('verified');
}

function beginScan() {
  clearTimeout(liftTimer);
  if (finished || holdTimer !== null) {
    return;
  }
  document.body.classList.add('scanning');
  holdTimer = setTimeout(finishScan, HOLD_MS);
  enterFullscreen();
}

function cancelScan() {
  clearTimeout(holdTimer);
  holdTimer = null;
  document.body.classList.remove('scanning');
}

startButton.addEventListener('pointerdown', (event) => {
  contacts.add(event.pointerId);
  beginScan();
});

// pointercancel ataylab tinglanmaydi: Windows kaftni rad etsa ham tekshiruv davom etadi
document.addEventListener('pointerup', (event) => {
  // Kaft ekranda turganda brauzer to'liq ekranni to'sadi, barmoq ko'tarilgach ruxsat beradi
  if (finished || holdTimer !== null) {
    enterFullscreen();
  }
  // Sensor bir lahza uzilsa tekshiruv to'xtab qolmasligi uchun kechiktirib bekor qilinadi
  if (contacts.delete(event.pointerId) && contacts.size === 0 && holdTimer !== null) {
    liftTimer = setTimeout(cancelScan, LIFT_GRACE_MS);
  }
});

// Sensor ishlamay qolsa, klaviaturadan zaxira: kaftsiz ham tekshiruv effekti boshlanadi
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    beginScan();
  }
});

document.addEventListener('contextmenu', (event) => event.preventDefault());
