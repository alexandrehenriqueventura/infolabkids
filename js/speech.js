function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Para fala anterior se houver
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR'; // Português do Brasil
    utterance.rate = 0.9; // Um pouco mais lento para crianças
    utterance.pitch = 1.1; // Um pouco mais amigável
    window.speechSynthesis.speak(utterance);
  } else {
    console.log("Seu navegador não suporta leitura em voz alta.");
  }
}

// Escuta os cliques em botões de fala
document.addEventListener('DOMContentLoaded', () => {
  const speechBtns = document.querySelectorAll('.btn-speech');
  speechBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Evita que clique vire o card
      const textToSpeak = btn.getAttribute('data-text');
      if(textToSpeak) {
        speakText(textToSpeak);
      }
    });
  });
});
