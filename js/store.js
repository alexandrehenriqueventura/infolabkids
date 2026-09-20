// js/store.js

const storeItems = [
  { id: 'glasses_nerd', name: 'Óculos Nerd', icon: '👓', price: 20 },
  { id: 'glasses_sun', name: 'Óculos de Sol', icon: '🕶️', price: 50 },
  { id: 'hat_cap', name: 'Boné Azul', icon: '🧢', price: 30 },
  { id: 'hat_crown', name: 'Coroa de Ouro', icon: '👑', price: 100 },
  { id: 'hat_magic', name: 'Cartola Mágica', icon: '🎩', price: 150 }
];

function openStore() {
  document.getElementById('store-modal').style.display = 'flex';
  renderStore();
  updateMascotPreview();
}

function closeStore() {
  document.getElementById('store-modal').style.display = 'none';
  // Atualiza as moedas no menu atrás da loja
  if(typeof renderTrail === 'function') renderTrail();
}

function renderStore() {
  const progress = getProgress();
  document.getElementById('store-coins').innerText = progress.coins || 0;
  
  const grid = document.getElementById('store-grid');
  grid.innerHTML = '';
  
  storeItems.forEach(item => {
    const isOwned = (progress.inventory || []).includes(item.id);
    const isEquipped = progress.equipped === item.id;
    
    const div = document.createElement('div');
    div.className = `store-item ${isOwned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}`;
    
    let btnHtml = '';
    if (isEquipped) {
      btnHtml = `<button disabled style="background:transparent; border:none; font-weight:bold;">Equipado</button>`;
    } else if (isOwned) {
      btnHtml = `<button onclick="equipItem('${item.id}')" style="background:#32CD32; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Usar</button>`;
    } else {
      btnHtml = `<button onclick="buyItem('${item.id}', ${item.price})" style="background:#f1c40f; color:black; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-weight:bold;">Comprar (${item.price}🪙)</button>`;
    }
    
    div.innerHTML = `
      <div style="font-size: 3rem;">${item.icon}</div>
      <div style="font-weight: 700; margin: 10px 0;">${item.name}</div>
      ${btnHtml}
    `;
    
    grid.appendChild(div);
  });
}

function buyItem(itemId, price) {
  const progress = getProgress();
  if ((progress.coins || 0) >= price) {
    progress.coins -= price;
    if (!progress.inventory) progress.inventory = [];
    progress.inventory.push(itemId);
    saveProgress(progress);
    
    // Tocar som de caixa registradora
    playBuySound();
    
    renderStore();
  } else {
    alert("Moedas insuficientes! Jogue mais minigames para ganhar moedas.");
  }
}

function equipItem(itemId) {
  const progress = getProgress();
  progress.equipped = itemId;
  saveProgress(progress);
  renderStore();
  updateMascotPreview();
}

function updateMascotPreview() {
  const progress = getProgress();
  const accDiv = document.getElementById('mascot-acc');
  if (!accDiv) return;
  
  if (progress.equipped) {
    const item = storeItems.find(i => i.id === progress.equipped);
    if (item) {
      accDiv.innerText = item.icon;
    }
  } else {
    accDiv.innerText = '';
  }
}

function playBuySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch(e){}
}
