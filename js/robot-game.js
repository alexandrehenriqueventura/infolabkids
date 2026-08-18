// js/robot-game.js

const board = document.getElementById('board');
const queueDisplay = document.getElementById('queue-display');
const btnPlay = document.getElementById('btn-play');
const btnClear = document.getElementById('btn-clear');
const arrowBtns = document.querySelectorAll('.arrow-btn');
const levelHeader = document.getElementById('level-header');
const themeBody = document.getElementById('theme-body');

// Definição das 15 Fases
const LEVELS = [
  // MUNDO 1: Fábrica (Tons Laranja/Marrom, Alvo: Bateria)
  { size: 4, start: {x:0, y:0}, target: {x:3, y:0}, obstacles: [], theme: 'factory', name: 'Fábrica' },
  { size: 4, start: {x:0, y:0}, target: {x:3, y:3}, obstacles: [{x:2, y:0}], theme: 'factory', name: 'Fábrica' },
  { size: 4, start: {x:0, y:0}, target: {x:3, y:3}, obstacles: [{x:1, y:0}, {x:1, y:1}, {x:3, y:2}], theme: 'factory', name: 'Fábrica' },
  
  // MUNDO 2: Floresta Encantada (Tons Verde, Alvo: Maçã)
  { size: 5, start: {x:0, y:0}, target: {x:4, y:4}, obstacles: [{x:2, y:2}], theme: 'forest', name: 'Floresta Encantada' },
  { size: 5, start: {x:0, y:0}, target: {x:4, y:0}, obstacles: [{x:2, y:0}, {x:2, y:1}, {x:2, y:2}], theme: 'forest', name: 'Floresta Encantada' },
  { size: 5, start: {x:0, y:4}, target: {x:4, y:0}, obstacles: [{x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:3, y:2}, {x:3, y:1}], theme: 'forest', name: 'Floresta Encantada' },
  
  // MUNDO 3: Fundo do Mar (Tons Azul, Alvo: Tesouro)
  { size: 5, start: {x:2, y:2}, target: {x:0, y:0}, obstacles: [{x:1, y:1}, {x:1, y:2}, {x:2, y:1}], theme: 'ocean', name: 'Fundo do Mar' },
  { size: 5, start: {x:0, y:2}, target: {x:4, y:2}, obstacles: [{x:2, y:1}, {x:2, y:2}, {x:2, y:3}], theme: 'ocean', name: 'Fundo do Mar' },
  { size: 6, start: {x:0, y:5}, target: {x:5, y:0}, obstacles: [{x:1, y:4}, {x:2, y:3}, {x:3, y:2}, {x:4, y:1}], theme: 'ocean', name: 'Fundo do Mar' },
  
  // MUNDO 4: Deserto Egípcio (Tons Amarelo/Areia, Alvo: Diamante)
  { size: 6, start: {x:0, y:0}, target: {x:5, y:5}, obstacles: [{x:1, y:1}, {x:2, y:2}, {x:3, y:3}, {x:4, y:4}], theme: 'egypt', name: 'Deserto Egípcio' },
  { size: 6, start: {x:0, y:5}, target: {x:5, y:5}, obstacles: [{x:2, y:5}, {x:2, y:4}, {x:2, y:3}, {x:4, y:5}, {x:4, y:4}, {x:4, y:3}], theme: 'egypt', name: 'Deserto Egípcio' },
  { size: 6, start: {x:3, y:3}, target: {x:0, y:0}, obstacles: [{x:2, y:2}, {x:2, y:3}, {x:3, y:2}, {x:1, y:1}], theme: 'egypt', name: 'Deserto Egípcio' },
  
  // MUNDO 5: Espaço Sideral (Tons Escuros/Roxo, Alvo: Estrela Cadente)
  { size: 6, start: {x:0, y:0}, target: {x:5, y:5}, obstacles: [{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}], theme: 'space', name: 'Espaço Sideral' },
  { size: 6, start: {x:5, y:0}, target: {x:0, y:5}, obstacles: [{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:4, y:5}, {x:4, y:4}, {x:4, y:3}, {x:4, y:2}], theme: 'space', name: 'Espaço Sideral' },
  { size: 6, start: {x:2, y:0}, target: {x:2, y:5}, obstacles: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], theme: 'space', name: 'Espaço Sideral' }
];

const THEMES = {
  'factory': { bg: '#8B4513', cellBg: '#DEB887', border: '#5C2E0B', target: '🔋', obs: ['🛢️', '⚙️'] },
  'forest': { bg: '#228B22', cellBg: '#90EE90', border: '#006400', target: '🍎', obs: ['🌲', '🌳', '🪨'] },
  'ocean': { bg: '#008B8B', cellBg: '#AFEEEE', border: '#000080', target: '⚓', obs: ['🪸', '🦈', '🐙'] },
  'egypt': { bg: '#DAA520', cellBg: '#F5DEB3', border: '#8B6508', target: '💎', obs: ['🐪', '🧱', '🦂'] },
  'space': { bg: '#2F4F4F', cellBg: '#708090', border: '#191970', target: '🌟', obs: ['☄️', '🪐', '👾'] }
};

let currentLevelIndex = (typeof getRobotLevel === 'function') ? getRobotLevel() : 0;
// Segurança para não estourar o array
if (currentLevelIndex >= LEVELS.length) currentLevelIndex = 0;

let currentLevel;
let robotPos = { x: 0, y: 0 };
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

function loadLevel(index) {
  currentLevel = LEVELS[index];
  robotPos = { x: currentLevel.start.x, y: currentLevel.start.y };
  commands = [];
  isExecuting = false;
  updateQueueDisplay();
  
  // Atualiza UI
  levelHeader.textContent = `Fase ${index + 1} de 15: ${currentLevel.name}`;
  
  const theme = THEMES[currentLevel.theme];
  board.style.gridTemplateColumns = `repeat(${currentLevel.size}, 60px)`;
  board.style.gridTemplateRows = `repeat(${currentLevel.size}, 60px)`;
  board.style.backgroundColor = theme.bg;
  board.style.borderColor = theme.border;
  
  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';
  const theme = THEMES[currentLevel.theme];
  
  for (let y = 0; y < currentLevel.size; y++) {
    for (let x = 0; x < currentLevel.size; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `cell-${x}-${y}`;
      cell.style.backgroundColor = theme.cellBg;
      
      // Verifica se é obstáculo estático
      const isObs = currentLevel.obstacles.find(o => o.x === x && o.y === y);
      if (isObs) {
        const randomObs = theme.obs[Math.floor(Math.random() * theme.obs.length)];
        cell.innerHTML = `<div class="obstacle">${randomObs}</div>`;
      }
      
      board.appendChild(cell);
    }
  }
  updateEntities();
}

function updateEntities() {
  // Limpa entidades dinâmicas (bateria e robô)
  document.querySelectorAll('.robot, .target-item').forEach(el => el.remove());
  
  const theme = THEMES[currentLevel.theme];
  
  // Desenha Alvo
  const targetCell = document.getElementById(`cell-${currentLevel.target.x}-${currentLevel.target.y}`);
  if (targetCell && !targetCell.querySelector('.target-item')) {
    targetCell.innerHTML += `<div class="target-item" style="font-size:2.5rem; position:absolute;">${theme.target}</div>`;
  }
  
  // Desenha Robô
  const robCell = document.getElementById(`cell-${robotPos.x}-${robotPos.y}`);
  if (robCell) robCell.innerHTML += '<div class="robot" style="font-size:2.5rem; position:absolute;">🤖</div>';
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
    if (commands.length >= 25) return; // Aumentado para labirintos maiores
    
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
  robotPos = { x: currentLevel.start.x, y: currentLevel.start.y };
  updateEntities();
});

btnPlay.addEventListener('click', () => {
  if (isExecuting || commands.length === 0) return;
  isExecuting = true;
  robotPos = { x: currentLevel.start.x, y: currentLevel.start.y };
  updateEntities();
  executeCommand(0);
});

function executeCommand(index) {
  if (index >= commands.length) {
    isExecuting = false;
    checkWin();
    return;
  }
  
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
  
  // Colisão com Borda
  if (newX < 0 || newX >= currentLevel.size || newY < 0 || newY >= currentLevel.size) {
    triggerError("BUM! O robô bateu na parede da fase.");
    return;
  }
  
  // Colisão com Obstáculo
  const isObs = currentLevel.obstacles.find(o => o.x === newX && o.y === newY);
  if (isObs) {
    triggerError("Aiaiai! O robô bateu em um obstáculo.");
    return;
  }
  
  playBeepSound(true);
  robotPos.x = newX;
  robotPos.y = newY;
  updateEntities();
  
  setTimeout(() => {
    executeCommand(index + 1);
  }, 400); // Mais rápido que antes
}

function triggerError(msg) {
  playErrorSound();
  isExecuting = false;
  setTimeout(() => {
    alert(msg + " Limpe a lista e tente de novo!");
  }, 400);
}

function checkWin() {
  if (robotPos.x === currentLevel.target.x && robotPos.y === currentLevel.target.y) {
    playWinSound();
    
    setTimeout(() => {
      if (currentLevelIndex >= LEVELS.length - 1) {
        // ZEROU O JOGO!
        if (typeof unlockStar === 'function') unlockStar('robot');
        alert("🎉 INCRÍVEL! Você completou TODAS as 15 Fases do Robô! A Estrela Final é sua!");
        if (typeof setRobotLevel === 'function') setRobotLevel(0); // Reseta
        loadLevel(0);
      } else {
        // Próxima fase
        currentLevelIndex++;
        if (typeof setRobotLevel === 'function') setRobotLevel(currentLevelIndex);
        alert("BIP BOP! Você pegou o item! Vamos para a próxima fase!");
        loadLevel(currentLevelIndex);
      }
    }, 500);
  }
}

// Inicia Jogo
loadLevel(currentLevelIndex);
