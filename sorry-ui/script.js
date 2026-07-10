const introScreen = document.querySelector('#introScreen');
const cardShell = document.querySelector('#cardShell');
const measureCard = document.querySelector('.measure-card');
const measureButton = document.querySelector('#measureButton');
const cuteMeter = document.querySelector('#cuteMeter');
const meterResult = document.querySelector('#meterResult');
const giftCards = Array.from(document.querySelectorAll('.gift-card'));
const progressText = document.querySelector('#progressText');
const progressBar = document.querySelector('#progressBar');
const finalMessage = document.querySelector('#finalMessage');
const confettiLayer = document.querySelector('#confettiLayer');
const smileAgain = document.querySelector('#smileAgain');
const yesButton = document.querySelector('#yesButton');
const noButton = document.querySelector('#noButton');
const yesNudge = document.querySelector('.yes-nudge');
const choiceReply = document.querySelector('#choiceReply');
const celebrationScreen = document.querySelector('#celebrationScreen');
const confettiShapes = ['💗', '✨', '🌸', '💫', '🌷', '💕'];
const clickLogKey = 'ishitaSorryCardClickLogs';
const remoteLogEndpoint = window.SORRY_CARD_LOG_ENDPOINT || '';

let revealedCount = 0;
let noButtonMoves = 0;
let lastNoMoveAt = 0;

function getClickLogs() {
  try {
    return JSON.parse(localStorage.getItem(clickLogKey)) || [];
  } catch {
    return [];
  }
}

function logClick(action) {
  const entry = {
    action,
    timestamp: new Date().toISOString(),
    readableTime: new Date().toLocaleString(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent
  };
  const logs = [...getClickLogs(), entry];

  localStorage.setItem(clickLogKey, JSON.stringify(logs));
  window.ishitaSorryCardClickLogs = logs;
  console.log(`[Ishita sorry card] ${entry.readableTime} - ${action}`);

  if (remoteLogEndpoint) {
    try {
      fetch(remoteLogEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(entry)
      }).catch(() => {
        console.warn('[Ishita sorry card] Remote log failed');
      });
    } catch {
      console.warn('[Ishita sorry card] Remote log failed');
    }
  }
}

function showSorryCard() {
  introScreen.classList.add('hide-intro');
  cardShell.classList.remove('is-hidden');
  cardShell.classList.add('show-card');
  cardShell.setAttribute('aria-hidden', 'false');
  launchConfetti(34);
}

function launchConfetti(amount = 24) {
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.textContent = confettiShapes[index % confettiShapes.length];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    piece.style.fontSize = `${1 + Math.random() * 1.4}rem`;
    confettiLayer.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}

function showCelebration() {
  celebrationScreen.classList.add('show-celebration');
  celebrationScreen.setAttribute('aria-hidden', 'false');
  launchConfetti(96);
}

function startMeasurement() {
  if (measureButton.disabled) {
    return;
  }

  logClick('lets measure clicked');
  measureButton.disabled = true;
  measureButton.textContent = 'measuring cuteness...';
  cuteMeter.classList.add('show-meter', 'measuring');
  cuteMeter.setAttribute('aria-hidden', 'false');
  meterResult.textContent = 'calculating';
  launchConfetti(14);

  window.setTimeout(() => {
    cuteMeter.classList.add('complete');
    meterResult.textContent = 'infinite cute';
    measureButton.textContent = 'too cute to measure 💗';
    launchConfetti(32);
  }, 1800);

  window.setTimeout(showSorryCard, 3100);
}

measureButton.addEventListener('click', startMeasurement);
measureCard.addEventListener('click', startMeasurement);

function updateProgress() {
  progressText.textContent = `${revealedCount} of ${giftCards.length} smiles unlocked`;
  progressBar.style.width = `${(revealedCount / giftCards.length) * 100}%`;

  if (revealedCount === giftCards.length) {
    finalMessage.classList.add('show');
    finalMessage.setAttribute('aria-hidden', 'false');
    launchConfetti(44);
    finalMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

giftCards.forEach((card) => {
  const messageSlot = card.querySelector('.gift-message');

  card.addEventListener('click', () => {
    if (card.classList.contains('revealed')) {
      logClick(`${card.querySelector('.gift-title').textContent} clicked again`);
      launchConfetti(8);
      return;
    }

    logClick(`${card.querySelector('.gift-title').textContent} revealed`);
    messageSlot.textContent = card.dataset.message;
    card.classList.add('revealed');
    card.setAttribute('aria-expanded', 'true');
    card.querySelector('.tap-hint').textContent = 'opened';
    revealedCount += 1;
    launchConfetti(14);
    updateProgress();
  });
});

function moveNoButton(forceMove = false) {
  const now = Date.now();

  if (!forceMove && now - lastNoMoveAt < 180) {
    return;
  }

  lastNoMoveAt = now;
  const isSmallScreen = window.matchMedia('(max-width: 520px)').matches;
  const positions = isSmallScreen
    ? [
      { x: 72, y: -28 },
      { x: -74, y: 30 },
      { x: 78, y: 34 },
      { x: -66, y: -30 }
    ]
    : [
      { x: 128, y: -22 },
      { x: -132, y: 26 },
      { x: 116, y: 34 },
      { x: -118, y: -30 },
      { x: 0, y: 42 }
    ];
  const nextPosition = positions[noButtonMoves % positions.length];

  noButtonMoves += 1;

  noButton.style.setProperty('--no-x', `${nextPosition.x}px`);
  noButton.style.setProperty('--no-y', `${nextPosition.y}px`);
  noButton.classList.add('dodging');
  yesNudge.classList.remove('is-hidden');
  choiceReply.textContent = 'no bhaag gaya, yes hi option hai 😌';
  window.setTimeout(() => noButton.classList.remove('dodging'), 260);
}

smileAgain.addEventListener('click', () => {
  logClick('make it sparkle again clicked');
  launchConfetti(52);
});

yesButton.addEventListener('click', () => {
  logClick('yes clicked for unblock question');
  choiceReply.textContent = 'yaayyy, ab bas unblock bhi kar do 💗';
  yesButton.textContent = 'thank youuu 💗';
  showCelebration();
});

['pointerenter', 'pointerdown', 'focus'].forEach((eventName) => {
  noButton.addEventListener(eventName, () => {
    logClick(`no button attempted via ${eventName}`);
    moveNoButton();
  });
});

noButton.addEventListener('click', (event) => {
  event.preventDefault();
  logClick('no button click blocked');
  moveNoButton(true);
});