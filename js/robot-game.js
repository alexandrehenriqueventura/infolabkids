// js/robot-game.js

const board = document.getElementById('board');
const queueDisplay = document.getElementById('queue-display');
const btnPlay = document.getElementById('btn-play');
const btnClear = document.getElementById('btn-clear');
const arrowBtns = document.querySelectorAll('.arrow-btn');

const GRID_SIZE = 4;
let robotPos = { x: 0, y: 0 };
let batteryPos = { x: 3, y: 3 };
let commands = [];
let isExecuting = false;

// Sons
function playBeepSound(high = false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(high ? 800 : 400, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch(e){}
}

function playWinSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e){}
}

function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch(e){}
}

// Inicializa tabuleiro
function renderBoard() {
  board.innerHTML = '';
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `cell-${x}-${y}`;
      board.appendChild(cell);
    }
  }
  updateEntities();
}

function updateEntities() {
  // Limpa tudo
  document.querySelectorAll('.cell').forEach(c => c.innerHTML = '');
  
  // Desenha Bateria
  const batCell = document.getElementById(`cell-${batteryPos.x}-${batteryPos.y}`);
  if(batCell) batCell.innerHTML = '<div class="battery">🔋</div>';
  
  // Desenha Robô
  const robCell = document.getElementById(`cell-${robotPos.x}-${robotPos.y}`);
  if(robCell) robCell.innerHTML += '<div class="robot">🤖</div>';
}

function updateQueueDisplay() {
  if (commands.length === 0) {
    queueDisplay.innerHTML = '<span style="color: #999; font-family: \'Fredoka One\';">Sua lista de comandos aparecerá aqui...</span>';
    return;
  }
  
  queueDisplay.innerHTML = '';
  commands.forEach((cmd, index) => {
    const div = document.createElement('div');
    div.className = 'queue-item';
    div.id = `q-${index}`;
    if (cmd === 'UP') div.textContent = '⬆️';
    if (cmd === 'DOWN') div.textContent = '⬇️';
    if (cmd === 'LEFT') div.textContent = '⬅️';
    if (cmd === 'RIGHT') div.textContent = '➡️';
    queueDisplay.appendChild(div);
  });
}

// Controles
arrowBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (isExecuting) return;
    if (commands.length >= 10) return; // Limite de comandos
    
    playBeepSound();
    commands.push(btn.dataset.dir);
    updateQueueDisplay();
  });
});

btnClear.addEventListener('click', () => {
  if (isExecuting) return;
  playBeepSound(true);
  commands = [];
  updateQueueDisplay();
  // Reseta a posicao
  robotPos = { x: 0, y: 0 };
  updateEntities();
});

btnPlay.addEventListener('click', () => {
  if (isExecuting || commands.length === 0) return;
  isExecuting = true;
  
  // Reseta para garantir
  robotPos = { x: 0, y: 0 };
  updateEntities();
  
  executeCommand(0);
});

function executeCommand(index) {
  if (index >= commands.length) {
    isExecuting = false;
    checkWin();
    return;
  }
  
  // Destaca o comando atual
  document.querySelectorAll('.queue-item').forEach(el => el.classList.remove('active'));
  const currentItem = document.getElementById(`q-${index}`);
  if (currentItem) currentItem.classList.add('active');
  
  const cmd = commands[index];
  let newX = robotPos.x;
  let newY = robotPos.y;
  
  if (cmd === 'UP') newY--;
  if (cmd === 'DOWN') newY++;
  if (cmd === 'LEFT') newX--;
  if (cmd === 'RIGHT') newX++;
  
  // Verifica colisao com borda
  if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
    playErrorSound();
    isExecuting = false;
    setTimeout(() => {
      alert("BUM! O robô bateu na parede. Limpe a lista e tente de novo!");
    }, 500);
    return;
  }
  
  // Move
  playBeepSound(true);
  robotPos.x = newX;
  robotPos.y = newY;
  updateEntities();
  
  // Vai para o proximo após um atraso
  setTimeout(() => {
    executeCommand(index + 1);
  }, 600);
}

function checkWin() {
  if (robotPos.x === batteryPos.x && robotPos.y === batteryPos.y) {
    playWinSound();
    if (typeof unlockStar === 'function') unlockStar('robot');
    setTimeout(() => {
      alert("BIP BOP! O Robô pegou a bateria! Você venceu!");
    }, 500);
  }
}

// Inicia
renderBoard();
