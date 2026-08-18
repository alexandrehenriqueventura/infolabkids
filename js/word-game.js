const words = ["GATO", "BOLA", "CASA", "SOL", "PATO", "LUZ", "MESA"];
let currentWordIndex = 0;
let currentLetterIndex = 0;
let currentWord = "";

const trainContainer = document.getElementById('train');

function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e){}
}

function playTrainSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.setValueAtTime(400, ctx.currentTime + 0.2);
    osc.frequency.setValueAtTime(300, ctx.currentTime + 0.4);
    osc.frequency.setValueAtTime(400, ctx.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch(e){}
}

function loadWord() {
  trainContainer.innerHTML = '';
  trainContainer.style.transform = 'translateX(0)';
  
  currentWord = words[currentWordIndex];
  currentLetterIndex = 0;

  // Adiciona a locomotiva
  const engine = document.createElement('div');
  engine.classList.add('train-engine');
  engine.innerText = '🚂';
  trainContainer.appendChild(engine);

  // Adiciona os vagões
  for (let i = 0; i < currentWord.length; i++) {
    const wagon = document.createElement('div');
    wagon.classList.add('letter-wagon');
    wagon.innerText = currentWord[i];
    wagon.id = `wagon-${i}`;
    
    if (i === 0) wagon.classList.add('active');
    
    trainContainer.appendChild(wagon);
  }
}

document.addEventListener('keydown', (e) => {
  const pressedKey = e.key.toUpperCase();
  const targetLetter = currentWord[currentLetterIndex];

  if (pressedKey === targetLetter) {
    const currentWagon = document.getElementById(`wagon-${currentLetterIndex}`);
    currentWagon.classList.remove('active');
    currentWagon.classList.add('done');
    playSuccessSound();

    currentLetterIndex++;

    if (currentLetterIndex < currentWord.length) {
      const nextWagon = document.getElementById(`wagon-${currentLetterIndex}`);
      nextWagon.classList.add('active');
    } else {
      // Palavra concluída
      playTrainSound();
      if (typeof unlockStar === 'function') unlockStar('word');
      
      trainContainer.style.transform = 'translateX(150vw)'; // O trem vai embora
      
      setTimeout(() => {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        loadWord();
      }, 1500);
    }
  }
});

// Inicia
window.onload = loadWord;
