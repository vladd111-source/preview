// === Telegram boot ===
const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// === ЛОГ В ТАБЛИЦУ ЧЕРЕЗ APPS SCRIPT ===
const ENDPOINT = 'https://script.google.com/macros/s/XXXX/exec'; // <-- твой URL деплоя
const SECRET   = 'COMEIN_SECRET_123'; // тот же, что в коде Apps Script

(function logToSheet() {
  const u = tg?.initDataUnsafe?.user;
  if (!u || !ENDPOINT) return; // открыто не через бота — нечего шлём

  const payload = {
    secret:   SECRET,
    tgId:     u.id,
    username: u.username || '',
    source:   tg.initDataUnsafe?.start_param || 'без метки'
    // дату поставит скрипт сам
  };

  fetch(ENDPOINT, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  }).catch(()=>{});
})();

document.addEventListener('DOMContentLoaded', function () {
  const introWrapper = document.getElementById('introWrapper');
  const startScreen = document.getElementById('startScreen');
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
    startScreen.style.display = 'flex';
    startScreen.style.opacity = 1;
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
