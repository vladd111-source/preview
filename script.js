// === COMEIN WebApp — script.js (полная версия) ===

// 1) Telegram boot
const tg = window.Telegram?.WebApp;
if (tg) { 
  tg.ready(); 
  tg.expand(); 
}

// 2) ЛОГ В GOOGLE SHEETS через Apps Script (БЕЗ форм)
const ENDPOINT = 'https://script.google.com/macros/s/XXXX/exec'; // ⬅️ ВСТАВЬ СВОЙ URL деплоя
const SECRET   = 'COMEIN_SECRET_123';                              // ⬅️ тот же, что в Код.gs

// — минимальный визуальный дебаг (видно прямо в приложении)
const __dbg = (msg) => {
  try {
    const el = document.createElement('div');
    el.style.cssText='position:fixed;bottom:10px;left:10px;max-width:90vw;background:#0b0b0b;color:#00ff7f;padding:6px 8px;font:12px/1.3 monospace;z-index:99999;border:1px solid #00ff7f;border-radius:6px;opacity:.9';
    el.textContent = String(msg);
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 5000);
  } catch(_) {}
};

(function logToSheet() {
  const u = tg?.initDataUnsafe?.user;
  if (!u) { __dbg('NO TG USER (открыто не через бота)'); return; }
  if (!ENDPOINT || !ENDPOINT.includes('/exec')) { __dbg('ENDPOINT пустой/неверный'); return; }

  const payload = {
    secret:   SECRET,
    tgId:     u.id,
    username: u.username || '',
    source:   tg.initDataUnsafe?.start_param || 'без метки'
    // дату поставит Apps Script
  };

  fetch(ENDPOINT, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  .then(r => r.ok ? r.text() : Promise.reject('HTTP '+r.status))
  .then(() => __dbg('LOG OK: ' + (payload.username || payload.tgId)))
  .catch(err => __dbg('LOG ERR: ' + err));
})();

// 3) Твой игровой код (без изменений)
document.addEventListener('DOMContentLoaded', function () {
  const introWrapper = document.getElementById('introWrapper');
  const startScreen  = document.getElementById('startScreen');
  const startGameBtn = document.getElementById('startGameBtn');

  document.getElementById('modeIntense').addEventListener('click', () => {
    localStorage.setItem('gameMode', 'intense');
    transitionToStart();
  });

  document.getElementById('modeHidden').addEventListener('click', () => {
    localStorage.setItem('gameMode', 'hidden');
    transitionToStart();
  });

  function transitionToStart() {
    introWrapper.style.display = 'none';
    startScreen.style.display  = 'flex';
    startScreen.style.opacity  = 1;
  }

  startGameBtn.addEventListener('click', () => {
    const mode = localStorage.getItem('gameMode') || 'default';
    let modeText = (mode === 'intense') ? 'НА ПРЕДЕЛЕ'
                 : (mode === 'hidden') ? 'СКРЫТНО'
                 : 'ОБЫЧНЫЙ';
    alert("Игра начинается в режиме: " + modeText);
    startGame();
  });
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
  btn1.onclick = () => showComingSoonModal();

  const btn2 = document.createElement('button');
  btn2.className = 'scene-btn';
  btn2.innerText = '🚪 Пойти наугад в переулок';
  btn2.onclick = () => showComingSoonModal();

  sceneChoices.appendChild(btn1);
  sceneChoices.appendChild(btn2);
}

function showComingSoonModal() {
  const modal = document.getElementById('modalOverlay');
  modal.style.display = 'flex';
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}
