// js/browser-game.js

const shortcuts = document.querySelectorAll('.shortcut-btn');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');

const homeView = document.getElementById('home-view');
const loadingSpinner = document.getElementById('loading-spinner');
const resultCard = document.getElementById('result-card');
const resultEmoji = document.getElementById('result-emoji');
const resultTitle = document.getElementById('result-title');
const btnVoltarHome = document.getElementById('btn-voltar-home');

let currentEmoji = '';
let searchesCount = 0;

// Sons
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch(e){}
}

function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch(e){}
}

shortcuts.forEach(btn => {
  btn.addEventListener('click', () => {
    playClickSound();
    searchInput.value = btn.dataset.word;
    currentEmoji = btn.dataset.emoji;
  });
});

btnSearch.addEventListener('click', () => {
  if (!searchInput.value) return;
  
  playClickSound();
  
  // Mostra loading
  homeView.style.display = 'none';
  resultCard.style.display = 'none';
  loadingSpinner.style.display = 'block';
  
  // Simula o tempo de busca na internet
  setTimeout(() => {
    loadingSpinner.style.display = 'none';
    resultCard.style.display = 'block';
    
    resultEmoji.textContent = currentEmoji;
    resultTitle.textContent = searchInput.value;
    playSuccessSound();
    
    searchesCount++;
    if (searchesCount >= 2) {
      // Ganha a estrela da internet após buscar 2 coisas
      if (typeof unlockStar === 'function') unlockStar('browser');
    }
    
  }, 2000); // 2 segundos de loading para criar a expectativa
});

btnVoltarHome.addEventListener('click', () => {
  playClickSound();
  resultCard.style.display = 'none';
  homeView.style.display = 'block';
  searchInput.value = '';
});
