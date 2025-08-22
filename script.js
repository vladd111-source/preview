// === Telegram boot ===
const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// === Автолог ника в Google Form (ТОЛЬКО ник) ===
// 1) ВСТАВЬ СВОЙ FORM_ID (из URL формы)
// 2) Поставь правильный entry.* для поля "username"
const GFORM_URL = "https://docs.google.com/forms/d/e/FORM_ID/formResponse";
const USERNAME_FIELD = "entry.123456789"; // <-- замени на своё поле

(function sendUsernameToGoogle() {
  if (!tg || !tg.initDataUnsafe?.user) return; // открыто не через бота — ничего не шлём
  if (!GFORM_URL.includes("/formResponse")) return;

  // пишем ник в скрытую форму (элементы объявлены в index.html)
  const f = document.getElementById("gform");
  const inpUser = document.getElementById("f_username");
  if (!f || !inpUser) return;

  inpUser.name = USERNAME_FIELD;              // маппим правильный entry.*
  inpUser.value = tg.initDataUnsafe.user.username || ""; // сам ник
  f.action = GFORM_URL;
  f.submit();
})();

document.addEventListener('DOMContentLoaded', function () {
  const introWrapper = document.getElementById('introWrapper');
  const introScreen = document.getElementById('introScreen');
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

// ✅ ВНЕ document.addEventListener — доступно глобально
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
