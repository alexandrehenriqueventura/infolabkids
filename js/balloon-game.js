const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameInterval;
let balloons = [];

const colors = [
  '#FF5733', // Laranja Escuro/Vermelho
  '#33FF57', // Verde
  '#3357FF', // Azul
  '#FF33F5', // Rosa
  '#F5FF33'  // Amarelo
];

// Cria um balão no topo da tela em posição horizontal aleatória
function createBalloon() {
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');

  // Seleciona cor aleatória
  const color = colors[Math.floor(Math.random() * colors.length)];
  balloon.style.backgroundColor = color;
  balloon.style.borderBottomColor = color; // pro "nózinho" do balão

  // Posição aleatória (deixando uma margem de segurança)
  const leftPos = Math.random() * (window.innerWidth - 100) + 10;
  balloon.style.left = `${leftPos}px`;
  balloon.style.top = `-120px`; // Começa acima da tela

  // Velocidade de queda baseada numa aleatoriedade simples (podemos aumentar de acordo com o score depois)
  const speed = Math.random() * 1.5 + 0.5;

  balloon.dataset.speed = speed;

  // Adiciona evento de clique e de toque
  balloon.addEventListener('mousedown', popBalloon);
  balloon.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Evita scroll ao tocar
    popBalloon(e);
  });

  gameArea.appendChild(balloon);
  balloons.push(balloon);
}

// Estoura o balão
function popBalloon(event) {
  const balloon = event.target;
  
  // Evitar clique duplo enquanto já está estourando
  if (balloon.classList.contains('pop-animation')) return;

  // Atualiza score
  score++;
  scoreDisplay.innerText = score;

  // Animação de estouro
  balloon.classList.add('pop-animation');

  // Toca um som curto e simples sintetizado
  playPopSound();

  // Remove do DOM após a animação
  setTimeout(() => {
    balloon.remove();
    // Remove do array
    balloons = balloons.filter(b => b !== balloon);
  }, 200);
}

// Loop principal do jogo (faz os balões caírem)
function update() {
  for (let i = 0; i < balloons.length; i++) {
    const balloon = balloons[i];
    
    // Ignora se estiver estourando
    if (balloon.classList.contains('pop-animation')) continue;

    let currentTop = parseFloat(balloon.style.top);
    const speed = parseFloat(balloon.dataset.speed);
    
    currentTop += speed;
    balloon.style.top = `${currentTop}px`;

    // Se o balão passou da tela (atingiu o chão), apenas removemos
    if (currentTop > window.innerHeight) {
      balloon.remove();
      balloons.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(update);
}

// Pequeno gerador de som (AudioContext API) para feedback ao estourar
function playPopSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio api not supported or blocked", e);
  }
}

// Inicializa o jogo
function initGame() {
  // Cria um balão a cada 1.5 a 2.5 segundos
  gameInterval = setInterval(() => {
    createBalloon();
  }, 2000);

  // Inicia o loop de queda
  requestAnimationFrame(update);
}

// Iniciar quando carregar a página
window.onload = initGame;
