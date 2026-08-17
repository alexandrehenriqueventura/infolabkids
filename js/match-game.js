document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable');
  const dropZones = document.querySelectorAll('.drop-zone');
  
  let matchesCount = 0;

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      draggable.classList.add('dragging');
      // Passa o ID do elemento arrastado
      e.dataTransfer.setData('text/plain', draggable.id);
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessário para permitir o drop
      zone.classList.add('hovered');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('hovered');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('hovered');

      const draggedId = e.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(draggedId);
      
      // Verifica se o id bate com o target
      const elementTarget = draggedElement.getAttribute('data-target');
      const zoneTarget = zone.getAttribute('data-target');

      if (elementTarget === zoneTarget) {
        // Acertou!
        const slot = zone.querySelector('.slot');
        slot.appendChild(draggedElement);
        
        // Remove a borda branca e ajusta o fundo do draggable
        draggedElement.style.boxShadow = 'none';
        draggedElement.style.background = 'transparent';
        
        // Remove o evento de drag
        draggedElement.setAttribute('draggable', 'false');
        
        zone.classList.add('success');
        playSuccessSound();

        matchesCount++;
        
        if (matchesCount === 4) {
          showCongrats();
        }
      } else {
        // Errou!
        playErrorSound();
        // O elemento apenas volta pro lugar dele (comportamento nativo do html5)
      }
    });
  });
});

function showCongrats() {
  setTimeout(() => {
    const congrats = document.getElementById('congrats');
    congrats.style.display = 'block';
    
    // Tocar um som alegre longo
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if(ctx){
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.8);
        
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1);
    }
  }, 500);
}

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

function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e){}
}
