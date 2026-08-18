const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorBtns = document.querySelectorAll('.color-btn');
const clearBtn = document.getElementById('clearBtn');

let isDrawing = false;
let currentColor = 'black';
let currentLineWidth = 8; // Linha grossa para crianças

// Ajusta canvas para telas menores se necessário
function resizeCanvas() {
  const containerWidth = window.innerWidth * 0.9;
  if(containerWidth < 800) {
    canvas.width = containerWidth;
    canvas.height = containerWidth * 0.7;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath(); // Reseta o caminho para não ligar pontos
}

function draw(e) {
  if (!isDrawing) return;

  // Suporte a toque (touch) ou mouse
  let clientX = e.clientX || (e.touches && e.touches[0].clientX);
  let clientY = e.clientY || (e.touches && e.touches[0].clientY);

  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  ctx.lineWidth = currentLineWidth;
  ctx.strokeStyle = currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Eventos de Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Eventos de Touch
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener('touchend', stopDrawing);

// Troca de Cores
colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    colorBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentColor = btn.getAttribute('data-color');
  });
});

// Limpar
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
