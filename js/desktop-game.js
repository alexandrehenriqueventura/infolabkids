const trashes = document.querySelectorAll('.draggable-trash');
const trashBin = document.getElementById('trash-bin');
const chest = document.getElementById('chest');
const modalTreasure = document.getElementById('modal-treasure');

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

function playTadaSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch(e){}
}

// Drag and Drop (Nativo HTML5)
trashes.forEach(trash => {
  trash.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', trash.id);
    setTimeout(() => trash.style.opacity = '0.5', 0);
  });

  trash.addEventListener('dragend', () => {
    trash.style.opacity = '1';
  });
});

trashBin.addEventListener('dragover', (e) => {
  e.preventDefault(); // Necessário para permitir o drop
  trashBin.classList.add('hovered');
});

trashBin.addEventListener('dragleave', () => {
  trashBin.classList.remove('hovered');
});

trashBin.addEventListener('drop', (e) => {
  e.preventDefault();
  trashBin.classList.remove('hovered');
  
  const id = e.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(id);
  
  if (draggedElement && draggedElement.classList.contains('draggable-trash')) {
    draggedElement.remove();
    playPopSound();
    
    trashBin.classList.add('success');
    setTimeout(() => trashBin.classList.remove('success'), 300);
  }
});

// Duplo Clique no Baú
chest.addEventListener('dblclick', () => {
  playTadaSound();
  modalTreasure.style.display = 'block';
  if (typeof unlockStar === 'function') unlockStar('desktop');
});

// Para dispositivos Touch (O duplo clique nativo às vezes não pega bem em touch, mas vamos simular)
let lastTap = 0;
chest.addEventListener('touchend', (e) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  if (tapLength < 500 && tapLength > 0) {
    e.preventDefault();
    playTadaSound();
    modalTreasure.style.display = 'block';
    if (typeof unlockStar === 'function') unlockStar('desktop');
  }
  lastTap = currentTime;
});
