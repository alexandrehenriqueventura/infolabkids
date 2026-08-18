const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');

let score = 0;
let fallingLetters = [];
let spawnInterval;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#00FFFF', '#FF8C00'
];

function createLetter() {
  const letterDiv = document.createElement('div');
  letterDiv.classList.add('falling-letter');

  // Seleciona letra e cor aleatórias
  const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  letterDiv.innerText = letter;
  letterDiv.dataset.letter = letter;
  letterDiv.style.backgroundColor = color;

  // Evita cores escuras de texto em fundo escuro (todos os fundos são relativamente claros ou brilhantes)
  if(color === '#3357FF') letterDiv.style.color = '#fff';

  // Posição inicial
  const leftPos = Math.random() * (window.innerWidth - 100) + 10;
  letterDiv.style.left = `${leftPos}px`;
  letterDiv.style.top = `-100px`;

  // Velocidade lenta (crianças)
  const speed = Math.random() * 0.8 + 0.4;
  letterDiv.dataset.speed = speed;

  gameArea.appendChild(letterDiv);
  fallingLetters.push(letterDiv);
}

function update() {
  for (let i = 0; i < fallingLetters.length; i++) {
    const letterDiv = fallingLetters[i];
    
    if (letterDiv.classList.contains('pop-animation')) continue;

    let currentTop = parseFloat(letterDiv.style.top);
    const speed = parseFloat(letterDiv.dataset.speed);
    
    currentTop += speed;
    letterDiv.style.top = `${currentTop}px`;

    // Remove se atingiu o chão
    if (currentTop > window.innerHeight) {
      letterDiv.remove();
      fallingLetters.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(update);
}

// Escuta o teclado
document.addEventListener('keydown', (e) => {
  const pressedKey = e.key.toUpperCase();

  // Ignorar teclas que não são do alfabeto ou números (A-Z, 0-9) para não gerar loops desnecessários
  if (!alphabet.includes(pressedKey) && pressedKey !== 'Ç') return;

  // Procura a primeira letra correspondente que estiver na tela e não estiver estourando
  const targetIndex = fallingLetters.findIndex(
    el => el.dataset.letter === pressedKey && !el.classList.contains('pop-animation')
  );

  if (targetIndex !== -1) {
    const targetEl = fallingLetters[targetIndex];
    
    // Sucesso
    score++;
    scoreDisplay.innerText = score;
    
    targetEl.classList.add('pop-animation');
    playPopSound();

    setTimeout(() => {
      targetEl.remove();
      fallingLetters = fallingLetters.filter(el => el !== targetEl);
    }, 200);
  }
});

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function initGame() {
  // Cria uma letra a cada 2.5 segundos
  spawnInterval = setInterval(createLetter, 2500);
  requestAnimationFrame(update);
}

window.onload = initGame;
