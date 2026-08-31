// js/progress.js
// Sistema de Estrelas (Gamificação)

function getProgress() {
  try {
    const data = localStorage.getItem('infolab_stars');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.log("Erro ao acessar LocalStorage", e);
  }
  // Estado padrão
  return {
    match: false,
    mouse: false,
    keyboard: false,
    word: false,
    paint: false,
    desktop: false,
    browser: false,
    robot: false,
    puzzle: false,
    robot_level_current: 0 // Começa na fase 0 (Fase 1)
  };
}

function saveProgress(progressObj) {
  try {
    localStorage.setItem('infolab_stars', JSON.stringify(progressObj));
  } catch (e) {
    console.log("Erro ao salvar no LocalStorage", e);
  }
}

function getRobotLevel() {
  return getProgress().robot_level_current || 0;
}

function setRobotLevel(levelIndex) {
  const progress = getProgress();
  progress.robot_level_current = levelIndex;
  saveProgress(progress);
}

function unlockStar(gameId) {
  const progress = getProgress();
  if (!progress[gameId]) {
    progress[gameId] = true;
    saveProgress(progress);
    playStarSound();
    showStarAnimation();
  }
}

// Efeitos visuais e sonoros ao ganhar estrela pela primeira vez
function playStarSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    // Arpeggio feliz
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch(e){}
}

function showStarAnimation() {
  // Cria uma estrela gigante no meio da tela temporariamente
  const star = document.createElement('div');
  star.innerHTML = '⭐';
  star.style.position = 'fixed';
  star.style.top = '50%';
  star.style.left = '50%';
  star.style.transform = 'translate(-50%, -50%) scale(0)';
  star.style.fontSize = '8rem';
  star.style.zIndex = '9999';
  star.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  star.style.pointerEvents = 'none';
  star.style.textShadow = '0 10px 20px rgba(0,0,0,0.5)';
  
  document.body.appendChild(star);
  
  // Animação de entrada
  setTimeout(() => {
    star.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
  
  // Animação de saída
  setTimeout(() => {
    star.style.transform = 'translate(-50%, -50%) scale(0)';
    star.style.opacity = '0';
    setTimeout(() => star.remove(), 500);
  }, 2000);
}

// Renderiza o painel de estrelas no Menu
function renderStarsPanel() {
  const panel = document.getElementById('stars-panel');
  if (!panel) return;
  
  const progress = getProgress();
  let totalStars = 0;
  
  for (let key in progress) {
    if (progress[key]) totalStars++;
  }
  
  panel.innerHTML = `<h3>Suas Estrelas: ${totalStars} ⭐</h3>`;
}
