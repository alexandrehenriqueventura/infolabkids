let words = [
  // Animais
  "GATO", "CACHORRO", "LEAO", "TIGRE", "URSO", "MACACO", "ELEFANTE", "GIRAFA", "ZEBRA", "CAVALO", "VACA", "PORCO", "OVELHA", "CABRA", "PATO", "GALINHA", "GALO", "PERU", "RATO", "SAPO", "JACARE", "COBRA", "PEIXE", "TUBARAO", "BALEIA", "GOLFINHO", "TARTARUGA", "POLVO", "LULA", "ABELHA", "FORMIGA", "BORBOLETA", "ARANHA", "MOSCA", "BESOURO", "JOANINHA", "PAPAGAIO", "ARARA", "CORUJA", "GAVIAO", "AGUIA", "PINGUIM",
  
  // Alimentos e Frutas
  "AGUA", "SUCO", "LEITE", "BOLO", "PUDIM", "MACA", "BANANA", "PERA", "UVA", "LARANJA", "LIMAO", "ABACAXI", "MELANCIA", "MELAO", "MORANGO", "CEREJA", "AMORA", "GOIABA", "MANGA", "CAJU", "MARACUJA", "COCO", "ABACATE", "MAMAO", "TOMATE", "CEBOLA", "ALHO", "BATATA", "CENOURA", "BETERRABA", "BROCOLIS", "ALFACE", "ARROZ", "FEIJAO", "CARNE", "FRANGO", "OVO", "QUEIJO", "PRESUNTO", "PAO", "MACARRAO", "PIZZA", "SORVETE", "CHOCOLATE", "DOCE", "BALA", "PIRULITO",
  
  // Brinquedos e Transportes
  "BOLA", "BONECA", "CARRINHO", "TREM", "AVIAO", "BARCO", "MOTO", "BICICLETA", "PATINETE", "SKATE", "PIPA", "DADO", "DOMINO", "XADREZ", "CARTA", "FOGUETE", "ONIBUS", "CAMINHAO", "HELICOPTERO", "TRATOR",
  
  // Natureza
  "SOL", "LUA", "ESTRELA", "NUVEM", "CEU", "CHUVA", "VENTO", "NEVE", "GELO", "FOGO", "TERRA", "PEDRA", "PLANTA", "ARVORE", "FLOR", "FOLHA", "RAIZ", "MAR", "ONDA", "PRAIA", "AREIA", "RIO", "LAGO", "MONTANHA",
  
  // Casa e Objetos
  "CASA", "PREDIO", "RUA", "PRACA", "PARQUE", "ESCOLA", "SALA", "QUARTO", "COZINHA", "BANHEIRO", "QUINTAL", "JARDIM", "PORTA", "JANELA", "PAREDE", "TETO", "CHAO", "TELHADO", "MESA", "CADEIRA", "CAMA", "SOFA", "ARMARIO", "GELADEIRA", "FOGAO", "TELEVISAO", "COMPUTADOR", "CELULAR", "TABLET", "LIVRO", "CADERNO", "LAPIS", "CANETA", "BORRACHA", "REGUA", "TESOURA", "COLA", "MOCHILA",
  
  // Vestuário
  "SAPATO", "TENIS", "MEIA", "CALCA", "BERMUDA", "SHORT", "SAIA", "VESTIDO", "BLUSA", "CAMISA", "CAMISETA", "CASACO", "BONE", "CHAPEU", "LUVA", "RELOGIO", "OCULOS", "COLAR", "ANEL"
];

// Remove duplicatas por segurança
words = [...new Set(words)];

// Lógica de Dificuldade Progressiva:
// 1. Separar palavras em grupos por tamanho (Fácil: 3-4, Médio: 5-6, Difícil: 7+)
let easyWords = words.filter(w => w.length <= 4);
let mediumWords = words.filter(w => w.length > 4 && w.length <= 6);
let hardWords = words.filter(w => w.length > 6);

// 2. Função genérica de embaralhamento (Fisher-Yates)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 3. Embaralha cada grupo individualmente
easyWords = shuffleArray(easyWords);
mediumWords = shuffleArray(mediumWords);
hardWords = shuffleArray(hardWords);

// 4. Junta os grupos: O jogo começará com as fáceis e ficará difícil com o tempo
words = [...easyWords, ...mediumWords, ...hardWords];

// Começa do índice 0 (sempre pelas palavras mais curtas)
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
