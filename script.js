// === COMEIN WebApp — script.js (финал) ===

// 1) Telegram boot
const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// 2) ЛОГ В GOOGLE SHEETS через Apps Script (no-cors FormData)
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyM1E-nrXVOq4HFhrjLfyPWuZp_MA_n0NynlU4QC-mkqhaSCjBb8OJLZUY3W9kE9_YH/exec'; // твой exec URL
const SECRET   = 'COMEIN_SECRET_123'; // должен совпадать с Код.gs (если у тебя там проверка секрета включена)

// — минимальный визуальный дебаг
const __dbg = (msg) => {
  try {
    const el = document.createElement('div');
    el.style.cssText =
      'position:fixed;bottom:10px;left:10px;max-width:90vw;background:#0b0b0b;color:#00ff7f;padding:6px 8px;font:12px/1.3 monospace;z-index:99999;border:1px solid #00ff7f;border-radius:6px;opacity:.9';
    el.textContent = String(msg);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  } catch (_) {}
};

(function logToSheet() {
  const u = tg?.initDataUnsafe?.user;
  if (!u) { __dbg('NO TG USER (не через бота)'); return; }
  if (!ENDPOINT || !ENDPOINT.includes('/exec')) { __dbg('BAD ENDPOINT'); return; }

  const fd = new FormData();
  fd.append('secret',   SECRET);                     // если на сервере выключил секрет — эту строку удали
  fd.append('tgId',     String(u.id));
  fd.append('username', u.username || '');
  fd.append('source',   tg.initDataUnsafe?.start_param || 'без метки');

  // no-cors без заголовков — чтобы iOS/Telegram не резал запрос
  fetch(ENDPOINT, { method: 'POST', body: fd, mode: 'no-cors' })
    .then(() => __dbg('LOG TRY: ' + (u.username || u.id)))
    .catch(() => {});
})();

// 3) Игровая логика + фиксы тачей
document.addEventListener('DOMContentLoaded', function () {
  const introWrapper = document.getElementById('introWrapper');
  const startScreen  = document.getElementById('startScreen');
  const startGameBtn = document.getElementById('startGameBtn');

  const modeIntense = document.getElementById('modeIntense');
  const modeHidden  = document.getElementById('modeHidden');

  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { passive: true });

  const transitionToStart = () => {
    introWrapper.style.display = 'none';
    startScreen.style.display  = 'flex';
    startScreen.style.opacity  = 1;
  };

  const pickIntense = () => { localStorage.setItem('gameMode', 'intense'); transitionToStart(); };
  const pickHidden  = () => { localStorage.setItem('gameMode', 'hidden');  transitionToStart(); };

  // iOS/Telegram: вешаем и click, и touchend
  ['click', 'touchend'].forEach(ev => {
    on(modeIntense, ev, pickIntense);
    on(modeHidden,  ev, pickHidden);
  });

  const startHandler = () => {
    const mode = localStorage.getItem('gameMode') || 'default';
    const modeText = (mode === 'intense') ? 'НА ПРЕДЕЛЕ' : (mode === 'hidden') ? 'СКРЫТНО' : 'ОБЫЧНЫЙ';
    try { alert('Игра начинается в режиме: ' + modeText); } catch (_) {}
    startGame();
  };

  ['click', 'touchend'].forEach(ev => on(startGameBtn, ev, startHandler));
});

// === Глобальная функция
function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  const sceneContainer = document.getElementById('sceneContainer');
  sceneContainer.style.display = 'flex';

  const mode = localStorage.getItem('gameMode') || 'default';
  let text = "Ты стоишь в центре города, который тебе незнаком.\nОн молчит, но дышит.\nЧто ты сделаешь первым?";

  if (mode === 'intense') {
    text += "\n\n🔴 Здесь не будет пощады. Только выбор.";
  } else if (mode === 'hidden') {
    text += "\n\n🌒 Здесь всё завуалировано. И тебя будут проверять.";
  }

  document.getElementById('sceneText').innerText = text;

  const sceneChoices = document.getElementById('sceneChoices');
  sceneChoices.innerHTML = '';

  const btn1 = document.createElement('button');
  btn1.className = 'scene-btn';
  btn1.innerText = '📍 Осмотреться вокруг';

  const btn2 = document.createElement('button');
  btn2.className = 'scene-btn';
  btn2.innerText = '🚪 Пойти наугад в переулок';

  ['click', 'touchend'].forEach(ev => {
    btn1.addEventListener(ev, showComingSoonModal, { passive: true });
    btn2.addEventListener(ev, showComingSoonModal, { passive: true });
  });

  sceneChoices.appendChild(btn1);
  sceneChoices.appendChild(btn2);
}

function showComingSoonModal() {
  const modal = document.getElementById('modalOverlay');
  modal.style.display = 'flex';
  const close = document.getElementById('closeModalBtn');
  ['click','touchend'].forEach(ev =>
    close.addEventListener(ev, () => { modal.style.display = 'none'; }, { passive:true, once:true })
  );
}  fetch(ENDPOINT, { method: 'POST', body: fd, mode: 'no-cors' })
    .then(() => __dbg('LOG TRY: ' + (u.username || u.id)))
    .catch(() => {});
})();

// 3) Игровая логика + фиксы тачей
document.addEventListener('DOMContentLoaded', function () {
  const introWrapper = document.getElementById('introWrapper');
  const startScreen  = document.getElementById('startScreen');
  const startGameBtn = document.getElementById('startGameBtn');

  const modeIntense = document.getElementById('modeIntense');
  const modeHidden  = document.getElementById('modeHidden');

  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { passive: true });

  const transitionToStart = () => {
    introWrapper.style.display = 'none';
    startScreen.style.display  = 'flex';
    startScreen.style.opacity  = 1;
  };

  const pickIntense = () => { localStorage.setItem('gameMode', 'intense'); transitionToStart(); };
  const pickHidden  = () => { localStorage.setItem('gameMode', 'hidden');  transitionToStart(); };

  // Для iOS/Telegram: вешаем и click, и touchend
  ['click', 'touchend'].forEach(ev => {
    on(modeIntense, ev, pickIntense);
    on(modeHidden,  ev, pickHidden);
  });

  const startHandler = () => {
    const mode = localStorage.getItem('gameMode') || 'default';
    const modeText = (mode === 'intense') ? 'НА ПРЕДЕЛЕ' : (mode === 'hidden') ? 'СКРЫТНО' : 'ОБЫЧНЫЙ';
    try { alert('Игра начинается в режиме: ' + modeText); } catch(_) {}
    startGame();
  };

  ['click', 'touchend'].forEach(ev => on(startGameBtn, ev, startHandler));
});

// ✅ Глобальная функция
function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  const sceneContainer = document.getElementById('sceneContainer');
  sceneContainer.style.display = 'flex';

  const mode = localStorage.getItem('gameMode') || 'default';
  let text = "Ты стоишь в центре города, который тебе незнаком.\nОн молчит, но дышит.\nЧто ты сделаешь первым?";

  if (mode === 'intense') {
    text += "\n\n🔴 Здесь не будет пощады. Только выбор.";
  } else if (mode === 'hidden') {
    text += "\n\n🌒 Здесь всё завуалировано. И тебя будут проверять.";
  }

  document.getElementById('sceneText').innerText = text;

  const sceneChoices = document.getElementById('sceneChoices');
  sceneChoices.innerHTML = '';

  const btn1 = document.createElement('button');
  btn1.className = 'scene-btn';
  btn1.innerText = '📍 Осмотреться вокруг';

  const btn2 = document.createElement('button');
  btn2.className = 'scene-btn';
  btn2.innerText = '🚪 Пойти наугад в переулок';

  ['click', 'touchend'].forEach(ev => {
    btn1.addEventListener(ev, showComingSoonModal, { passive: true });
    btn2.addEventListener(ev, showComingSoonModal, { passive: true });
  });

  sceneChoices.appendChild(btn1);
  sceneChoices.appendChild(btn2);
}

function showComingSoonModal() {
  const modal = document.getElementById('modalOverlay');
  modal.style.display = 'flex';
  const close = document.getElementById('closeModalBtn');
  ['click','touchend'].forEach(ev => close.addEventListener(ev, () => { modal.style.display = 'none'; }, { passive:true, once:true }));
}
