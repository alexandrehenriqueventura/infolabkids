// js/puzzle-game.js

const piecesBank = document.getElementById('pieces-bank');
const slots = document.querySelectorAll('.slot');
const btnReload = document.getElementById('btn-reload');

const EMOJIS = ['🐶', '🐱', '🚀', '🚗', '🎈', '🍎', '🌻', '🐢', '🤡', '👽', '🍔', '🦄'];
const BG_COLORS = ['#FFB6C1', '#87CEFA', '#98FB98', '#FFFACD', '#DDA0DD', '#F08080'];

let correctPieces = 0;

// Efeitos Sonoros
function playSnapSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch(e){}
}

function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e){}
}

function playWinSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch(e){}
}

// Inicializa Jogo
function initGame() {
  piecesBank.innerHTML = '';
  slots.forEach(slot => {
    slot.innerHTML = '';
    slot.classList.remove('hovered');
  });
  correctPieces = 0;

  // 1. Gera Imagem Base (300x300)
  const masterCanvas = document.createElement('canvas');
  masterCanvas.width = 300;
  masterCanvas.height = 300;
  const ctx = masterCanvas.getContext('2d');

  // Fundo Aleatório
  ctx.fillStyle = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
  ctx.fillRect(0, 0, 300, 300);

  // Borda suave interna na imagem
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 290, 290);

  // Emoji Gigante no Centro
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  ctx.font = '180px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 150, 165); // Ajuste sutil no Y para centralizar emoji
  
  // Desenha linhas de grade leves para ajudar a guiar
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 2;
  for(let i=1; i<3; i++) {
    ctx.beginPath(); ctx.moveTo(i*100, 0); ctx.lineTo(i*100, 300); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i*100); ctx.lineTo(300, i*100); ctx.stroke();
  }

  // 2. Fatiamento em 9 peças
  const pieces = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 100;
      pCanvas.height = 100;
      const pCtx = pCanvas.getContext('2d');
      // Copia a fatia do master para a peça
      pCtx.drawImage(masterCanvas, x*100, y*100, 100, 100, 0, 0, 100, 100);
      
      pCanvas.className = 'puzzle-piece';
      pCanvas.draggable = true;
      pCanvas.dataset.index = (y * 3) + x;
      
      // Eventos de Drag da Peça
      pCanvas.addEventListener('dragstart', handleDragStart);
      pCanvas.addEventListener('dragend', handleDragEnd);
      
      // Touch Support para Celulares/Tablets
      pCanvas.addEventListener('touchstart', handleTouchStart, {passive: false});
      pCanvas.addEventListener('touchmove', handleTouchMove, {passive: false});
      pCanvas.addEventListener('touchend', handleTouchEnd);

      pieces.push(pCanvas);
    }
  }

  // Embaralha
  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => piecesBank.appendChild(p));
}

// --- Lógica de Mouse (Drag and Drop HTML5 API) ---

let draggedPiece = null;

function handleDragStart(e) {
  draggedPiece = this;
  e.dataTransfer.setData('text/plain', this.dataset.index);
  setTimeout(() => this.style.opacity = '0.5', 0);
}

function handleDragEnd() {
  this.style.opacity = '1';
  draggedPiece = null;
}

slots.forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault(); // Necessário para permitir o drop
    slot.classList.add('hovered');
  });
  
  slot.addEventListener('dragleave', () => {
    slot.classList.remove('hovered');
  });
  
  slot.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('hovered');
    
    if (!draggedPiece) return;
    
    const targetIndex = this.dataset.index;
    const pieceIndex = draggedPiece.dataset.index;
    
    if (targetIndex === pieceIndex) {
      // Acertou!
      playSnapSound();
      this.appendChild(draggedPiece);
      draggedPiece.draggable = false;
      draggedPiece.classList.add('locked');
      
      correctPieces++;
      checkWin();
    } else {
      // Errou!
      playErrorSound();
    }
  });
});

// --- Lógica de Touch (Celulares/Tablets) ---
// O Drag and Drop nativo não funciona no mobile. Criamos um substituto.
let touchElement = null;
let touchStartX, touchStartY;
let originalParent = null;

function handleTouchStart(e) {
  if (!this.draggable) return;
  e.preventDefault();
  touchElement = this;
  originalParent = this.parentNode;
  
  const touch = e.touches[0];
  touchStartX = touch.clientX - this.offsetLeft;
  touchStartY = touch.clientY - this.offsetTop;
  
  this.style.position = 'absolute';
  this.style.zIndex = '1000';
  document.body.appendChild(this); // Move p/ o body p/ sobrepor tudo
  moveAt(touch.clientX, touch.clientY);
}

function handleTouchMove(e) {
  if (!touchElement) return;
  e.preventDefault();
  const touch = e.touches[0];
  moveAt(touch.clientX, touch.clientY);
}

function handleTouchEnd(e) {
  if (!touchElement) return;
  
  // Esconde o elemento rápido para pegar o elemento que está por baixo
  touchElement.style.display = 'none';
  const changedTouch = e.changedTouches[0];
  const elemBelow = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
  touchElement.style.display = 'block';
  
  touchElement.style.position = 'static';
  touchElement.style.zIndex = '';
  
  let droppedOnSlot = false;
  if (elemBelow) {
    const slot = elemBelow.closest('.slot');
    if (slot) {
      droppedOnSlot = true;
      if (slot.dataset.index === touchElement.dataset.index) {
        // Acertou
        playSnapSound();
        slot.appendChild(touchElement);
        touchElement.draggable = false;
        touchElement.classList.add('locked');
        correctPieces++;
        checkWin();
      } else {
        // Errou, volta pro banco
        playErrorSound();
        originalParent.appendChild(touchElement);
      }
    }
  }
  
  if (!droppedOnSlot) {
    // Soltou fora, volta pro banco
    originalParent.appendChild(touchElement);
  }
  
  touchElement = null;
}

function moveAt(pageX, pageY) {
  touchElement.style.left = pageX - 50 + 'px'; // 50 é metade da largura
  touchElement.style.top = pageY - 50 + 'px';
}


// --- Finalização ---
function checkWin() {
  if (correctPieces === 9) {
    setTimeout(() => {
      playWinSound();
      if (typeof unlockStar === 'function') unlockStar('puzzle');
      // Animação CSS para a montagem final brilhar
      document.getElementById('assembly-board').style.borderColor = '#FFD700';
    }, 300);
  }
}

btnReload.addEventListener('click', () => {
  document.getElementById('assembly-board').style.borderColor = '#aaa';
  initGame();
});

// Começa!
initGame();
