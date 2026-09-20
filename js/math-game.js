// js/math-game.js

let timeLeft = 60;
let score = 0;
let hearts = 3;
let currentAnswer = "";
let correctAnswer = 0;
let timerInterval;

// O "pool" de perguntas erradas para a repetição espaçada
let wrongQuestionsQueue = [];

// Elementos da UI
const elTimer = document.getElementById('timer-display');
const elScore = document.getElementById('score-display');
const elHearts = document.getElementById('hearts-display');
const elInput = document.getElementById('answer-input');
const elNum1 = document.getElementById('num1');
const elNum2 = document.getElementById('num2');
const board = document.getElementById('game-board');

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    } else if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    }
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e){}
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-ui-header').style.display = 'flex';
  board.style.display = 'block';
  
  timeLeft = 60;
  score = 0;
  hearts = 3;
  wrongQuestionsQueue = [];
  
  updateUI();
  nextQuestion();
  
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateUI();
    if (timeLeft <= 0) {
      endGame(false, "O tempo acabou!");
    }
  }, 1000);
}

function resetGame() {
  document.getElementById('result-screen').style.display = 'none';
  startGame();
}

function nextQuestion() {
  currentAnswer = "";
  elInput.innerText = "";
  
  let n1, n2;
  
  // Repetição espaçada: 50% de chance de puxar uma pergunta que errou antes (se houver)
  if (wrongQuestionsQueue.length > 0 && Math.random() > 0.5) {
    const q = wrongQuestionsQueue.shift();
    n1 = q.n1;
    n2 = q.n2;
  } else {
    // Tabuada do 2 ao 9
    n1 = Math.floor(Math.random() * 8) + 2;
    n2 = Math.floor(Math.random() * 9) + 2; // 2 a 10
  }
  
  correctAnswer = n1 * n2;
  elNum1.innerText = n1;
  elNum2.innerText = n2;
}

function pressKey(num) {
  if (currentAnswer.length < 3) {
    currentAnswer += num.toString();
    elInput.innerText = currentAnswer;
  }
}

function pressClear() {
  currentAnswer = "";
  elInput.innerText = "";
}

function checkAnswer() {
  if (currentAnswer === "") return;
  
  const ans = parseInt(currentAnswer);
  
  if (ans === correctAnswer) {
    // Acertou
    playSound('correct');
    score++;
    
    board.classList.remove('flash-green');
    void board.offsetWidth; // trigger reflow
    board.classList.add('flash-green');
    
    if (score >= 10) {
      endGame(true, "Você é um mestre da tabuada!");
    } else {
      nextQuestion();
    }
  } else {
    // Errou
    playSound('wrong');
    hearts--;
    
    // Adiciona na fila de erros para repetir depois
    wrongQuestionsQueue.push({ n1: parseInt(elNum1.innerText), n2: parseInt(elNum2.innerText) });
    
    board.classList.remove('shake', 'flash-red');
    void board.offsetWidth;
    board.classList.add('shake', 'flash-red');
    
    pressClear(); // limpa input para tentar de novo
    
    if (hearts <= 0) {
      endGame(false, "Você perdeu todos os corações!");
    }
  }
  updateUI();
}

function updateUI() {
  elTimer.innerText = `⏱️ ${timeLeft}s`;
  elScore.innerText = score;
  
  let heartsStr = "";
  for(let i=0; i<3; i++) {
    heartsStr += (i < hearts) ? "❤️" : "🖤";
  }
  elHearts.innerText = heartsStr;
}

function endGame(won, msg) {
  clearInterval(timerInterval);
  
  const resScreen = document.getElementById('result-screen');
  const resTitle = document.getElementById('result-title');
  const resMsg = document.getElementById('result-message');
  
  resScreen.style.display = 'flex';
  resMsg.innerText = msg;
  
  if (won) {
    resTitle.innerText = "Vitória! 🏆";
    playSound('win');
    if (typeof unlockStar === 'function') unlockStar('math');
  } else {
    resTitle.innerText = "Fim de Jogo 🥺";
  }
}

// Suporte a teclado físico
document.addEventListener('keydown', (e) => {
  if (document.getElementById('start-screen').style.display !== 'none') return;
  if (document.getElementById('result-screen').style.display === 'flex') return;
  
  if (e.key >= '0' && e.key <= '9') {
    pressKey(e.key);
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    pressClear();
  } else if (e.key === 'Enter') {
    checkAnswer();
  }
});
