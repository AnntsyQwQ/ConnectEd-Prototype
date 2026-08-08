// ===== GAME VARIABLES =====
let dialogueStep = 1;
let currentTargetStandard = null;
let isPracticeMode = false;
let modalTimeout = null;
let audioUnlocked = false;
let currentTrack = 1;
let audioAttempts = 0;
const maxAudioAttempts = 5;

// ===== WIRE DEFINITIONS =====
const standards = {
  T568A: ['Green+White', 'Green', 'Orange+White', 'Blue', 'Blue+White', 'Orange', 'Brown+White', 'Brown'],
  T568B: ['Orange+White', 'Orange', 'Green+White', 'Blue', 'Blue+White', 'Green', 'Brown+White', 'Brown']
};

const wireDefinitions = [
  { name: 'Green+White', bg: 'repeating-linear-gradient(45deg, #27ae60, #27ae60 4px, #ffffff 4px, #ffffff 8px)' },
  { name: 'Green', bg: '#27ae60' },
  { name: 'Orange+White', bg: 'repeating-linear-gradient(45deg, #e67e22, #e67e22 4px, #ffffff 4px, #ffffff 8px)' },
  { name: 'Orange', bg: '#e67e22' },
  { name: 'Blue', bg: '#2980b9' },
  { name: 'Blue+White', bg: 'repeating-linear-gradient(45deg, #2980b9, #2980b9 4px, #ffffff 4px, #ffffff 8px)' },
  { name: 'Brown+White', bg: 'repeating-linear-gradient(45deg, #6d4c41, #6d4c41 4px, #ffffff 4px, #ffffff 8px)' },
  { name: 'Brown', bg: '#6d4c41' }
];

// ===== AUDIO SYSTEM - FIXED =====
const bgMusic = document.getElementById('bg-music');

// List of possible music sources to try
const musicSources = [
  'game/1',
  'game/2', 
  'game/3',
  'music/background music.mp3',
  'background music.mp3',
  'audio/background.mp3',
  'background.mp3'
];

let currentSourceIndex = 0;
let isMusicPlaying = false;

function tryPlayMusic() {
  if (isMusicPlaying) return;
  
  if (currentSourceIndex >= musicSources.length) {
    console.log('All music sources failed. Please add a music file.');
    return;
  }
  
  const source = musicSources[currentSourceIndex];
  bgMusic.src = source;
  
  bgMusic.play()
    .then(() => {
      console.log('Music playing from:', source);
      isMusicPlaying = true;
      audioUnlocked = true;
      currentSourceIndex = 0; // Reset for next time
    })
    .catch((error) => {
      console.log('Failed to play from:', source, error.message);
      currentSourceIndex++;
      // Try next source
      setTimeout(tryPlayMusic, 100);
    });
}

// Start music on any user interaction
function startMusicOnInteraction() {
  if (!isMusicPlaying) {
    tryPlayMusic();
  }
}

// Add event listeners for user interaction
document.addEventListener('click', startMusicOnInteraction);
document.addEventListener('touchstart', startMusicOnInteraction);
document.addEventListener('keydown', startMusicOnInteraction);

// Also try to play on page load (may be blocked by browser)
window.addEventListener('load', function() {
  // Try to play after a short delay
  setTimeout(tryPlayMusic, 1000);
});

// Handle music ending - try to play next track
bgMusic.addEventListener('ended', function() {
  // Try to play next track
  const currentNum = parseInt(bgMusic.src.split('/').pop()) || 0;
  if (currentNum > 0) {
    const nextNum = currentNum + 1;
    bgMusic.src = `game/${nextNum}`;
    bgMusic.play()
      .then(() => {
        console.log('Playing next track:', nextNum);
      })
      .catch(() => {
        // If next track doesn't exist, try again from start
        bgMusic.src = 'game/1';
        bgMusic.play().catch(() => {
          // If all fails, try alternative sources
          currentSourceIndex = 0;
          tryPlayMusic();
        });
      });
  } else {
    // If not a numbered track, restart
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {
      currentSourceIndex = 0;
      tryPlayMusic();
    });
  }
});

// Handle audio errors with retry
bgMusic.addEventListener('error', function() {
  console.log('Audio error, trying next source');
  currentSourceIndex++;
  if (currentSourceIndex < musicSources.length) {
    tryPlayMusic();
  } else {
    currentSourceIndex = 0;
    // Wait and retry
    setTimeout(tryPlayMusic, 5000);
  }
});

// ===== MODAL =====
function showModal(message, type = 'warning', title = '') {
  const modal = document.getElementById('custom-modal');
  const icon = document.getElementById('modal-icon');
  const titleEl = document.getElementById('modal-title');
  const messageEl = document.getElementById('modal-message');
  
  const titles = { error: '❌ ERROR', success: '✅ SUCCESS', warning: '⚠️ NOTICE', info: 'ℹ️ INFO' };
  const icons = { error: '❌', success: '✅', warning: '⚠️', info: 'ℹ️' };
  
  icon.textContent = icons[type] || icons.warning;
  titleEl.textContent = title || titles[type] || titles.warning;
  messageEl.textContent = message;
  
  modal.className = 'modal-overlay';
  modal.classList.add(`modal-${type}`);
  modal.classList.add('active');
  
  if (modalTimeout) clearTimeout(modalTimeout);
  if (type === 'success' || type === 'info') {
    modalTimeout = setTimeout(closeModal, 5000);
  }
}

function closeModal() {
  document.getElementById('custom-modal').classList.remove('active');
  if (modalTimeout) clearTimeout(modalTimeout);
}

document.getElementById('custom-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function goToMenu() {
  showScreen('main-menu');
  resetGameState();
  document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
  document.getElementById('pinout-list').classList.add('hidden');
}

function startGame() {
  isPracticeMode = false;
  dialogueStep = 1;
  document.getElementById('pinout-list').classList.add('hidden');
  document.getElementById('challenge-img').src = "image/cha1.jpg";
  showScreen('challenge-1');
  resetGameState();
}

function startPractice() {
  isPracticeMode = true;
  document.getElementById('pinout-list').classList.remove('hidden');
  showScreen('challenge-2');
  document.getElementById('game-status').innerText = "PRACTICE MODE: SELECT SCHEMATIC & STUDY GUIDE";
  resetGameState();
  initWirePalette();
}

function nextDialogue() {
  if (dialogueStep === 1) {
    document.getElementById('challenge-img').src = "image/cha2.PNG";
    dialogueStep = 2;
  } else if (dialogueStep === 2) {
    showScreen('challenge-2');
    resetGameState();
    initWirePalette();
    document.getElementById('game-status').innerText = "STATUS: SELECT SCHEMATIC & DRAG WIRES";
  }
}

function resetGameState() {
  currentTargetStandard = null;
  document.querySelectorAll('.standard-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const wire = zone.querySelector('.drag-wire');
    if (wire) wire.remove();
  });
}

function initWirePalette() {
  const container = document.getElementById('wire-source-container');
  container.innerHTML = '';
  
  const shuffled = [...wireDefinitions].sort(() => Math.random() - 0.5);
  
  shuffled.forEach((wire) => {
    const el = document.createElement('div');
    el.classList.add('drag-wire');
    el.draggable = true;
    el.dataset.name = wire.name;
    el.style.background = wire.bg;
    el.innerText = wire.name;
    
    el.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', JSON.stringify(wire));
      this.style.opacity = '0.5';
    });
    
    el.addEventListener('dragend', function(e) {
      this.style.opacity = '1';
    });

    container.appendChild(el);
  });
}

function dropWire(e) {
  e.preventDefault();
  const zone = e.target.closest('.drop-zone');
  if (!zone) return;

  const existing = zone.querySelector('.drag-wire');
  if (existing) returnWireToPalette(existing);

  try {
    const wireData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const sourceEl = document.querySelector(`.drag-wire[data-name="${wireData.name}"]`);
    if (sourceEl && sourceEl.parentElement && sourceEl.parentElement.id === 'wire-source-container') {
      sourceEl.remove();
    }

    const newWire = document.createElement('div');
    newWire.classList.add('drag-wire');
    newWire.dataset.name = wireData.name;
    newWire.style.background = wireData.bg;
    newWire.innerText = wireData.name;
    newWire.draggable = false;
    zone.appendChild(newWire);
    
  } catch (error) {
    console.error('Drop error:', error);
  }
}

function returnWireToPalette(wireElement) {
  const container = document.getElementById('wire-source-container');
  const wireName = wireElement.dataset.name;
  const wireDef = wireDefinitions.find(w => w.name === wireName);
  
  if (wireDef) {
    const newWire = document.createElement('div');
    newWire.classList.add('drag-wire');
    newWire.draggable = true;
    newWire.dataset.name = wireDef.name;
    newWire.style.background = wireDef.bg;
    newWire.innerText = wireDef.name;
    
    newWire.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', JSON.stringify(wireDef));
      this.style.opacity = '0.5';
    });
    
    newWire.addEventListener('dragend', function(e) {
      this.style.opacity = '1';
    });
    
    container.appendChild(newWire);
    wireElement.remove();
  }
}

function setTargetStandard(std) {
  currentTargetStandard = std;
  
  document.querySelectorAll('.standard-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.standard-btn')[std === 'T568A' ? 0 : 1].classList.add('selected');
  
  if (isPracticeMode) {
    const list = document.getElementById('pinout-list');
    list.innerHTML = `<b>${std} Sequence:</b><ol type="1" style="margin-left: 15px;">` + 
      standards[std].map(w => `<li>${w}</li>`).join('') + `</ol>`;
    list.classList.remove('hidden');
  }
  
  document.getElementById('game-status').innerText = `STATUS: TARGET SET TO ${std}`;
}

function crimpConnector() {
  if (!currentTargetStandard) {
    showModal('Please select a schematic (T568A or T568B) target first!', 'warning', '⚠️ SCHEMATIC REQUIRED');
    return;
  }

  const dropZones = document.querySelectorAll('.drop-zone');
  const targetSequence = standards[currentTargetStandard];
  let isCorrect = true;
  let filledSlots = 0;

  dropZones.forEach((zone, idx) => {
    const placedWire = zone.querySelector('.drag-wire');
    if (!placedWire) {
      isCorrect = false;
    } else if (placedWire.dataset.name !== targetSequence[idx]) {
      isCorrect = false;
    } else {
      filledSlots++;
    }
  });

  if (filledSlots < 8) {
    showModal(`Please fill all 8 slots before crimping! (${filledSlots}/8 filled)`, 'warning', '⚠️ INCOMPLETE');
    return;
  }

  if (isCorrect) {
    document.getElementById('game-status').innerHTML = "STATUS: ✅ SUCCESS! WIRED CORRECTLY!";
    showModal(`🎉 Success! Correctly crimped using the ${currentTargetStandard} standard!\nNetwork connection established!`, 'success', '🎉 CRIMP SUCCESSFUL');
    highlightCorrectWires(true);
  } else {
    document.getElementById('game-status').innerHTML = "STATUS: ❌ INCORRECT WIRING. TRY AGAIN.";
    showModal('❌ Incorrect wire ordering!\nCheck your pin alignment and try again.', 'error', '❌ CRIMP FAILED');
    highlightCorrectWires(false);
  }
}

function highlightCorrectWires(success) {
  const dropZones = document.querySelectorAll('.drop-zone');
  const targetSequence = standards[currentTargetStandard];
  
  dropZones.forEach((zone, idx) => {
    const wire = zone.querySelector('.drag-wire');
    if (wire) {
      if (success || wire.dataset.name === targetSequence[idx]) {
        wire.style.border = '3px solid #2ecc71';
        wire.style.boxShadow = '0 0 15px #2ecc71';
      } else {
        wire.style.border = '3px solid #e74c3c';
        wire.style.boxShadow = '0 0 15px #e74c3c';
      }
    }
  });
  
  setTimeout(() => {
    document.querySelectorAll('.drop-zone .drag-wire').forEach(wire => {
      wire.style.border = '1px solid #000';
      wire.style.boxShadow = 'none';
    });
  }, 3000);
}

function resetWires() {
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const wire = zone.querySelector('.drag-wire');
    if (wire) wire.remove();
  });
  
  initWirePalette();
  document.getElementById('game-status').innerHTML = "STATUS: WIRES RESET";
  
  document.querySelectorAll('.drop-zone .drag-wire').forEach(wire => {
    wire.style.border = '1px solid #000';
    wire.style.boxShadow = 'none';
  });
  
  showModal('🔄 All wires have been reset! Ready to try again.', 'info', '🔄 RESET COMPLETE');
}

// ===== INIT =====
initWirePalette();
console.log('Game loaded! Click START to begin.');
console.log('Background music will start on first click.');