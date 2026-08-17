document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Alterna a classe que faz a carta virar
      card.classList.toggle('flipped');
      
      // Toca um som curto
      playCardSound();
    });
  });
});

// Reutilizamos a lógica do gerador de som simples
function playCardSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Som de "flip" (leve subida de frequência)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio api not supported or blocked", e);
  }
}
