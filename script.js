// ============================================
// CABLE CONNECT - RJ45 CRIMPING TRAINER
// Complete Game Script - ALL BUTTONS WORKING
// ============================================

// ===== GAME VARIABLES =====
let dialogueStep = 1;
let currentTargetStandard = null;
let isPracticeMode = false;
let lives = 5;
let maxLives = 5;
let score = 0;
let currentChallenge = 1;
let totalChallenges = 8;
let isGameOver = false;
let isAudioPlaying = false;

// ===== CHALLENGE DEFINITIONS =====
const challenges = {
  1: { name: 'RJ45 Crimping - T568B', hint: 'Drag wires to correct pins in T568B order', standard: 'T568B' },
  2: { name: 'Straight-Through Cable', hint: 'Both ends use T568B standard', standard: 'T568B' },
  3: { name: 'Crossover Cable', hint: 'One end T568A, other T568B', standard: 'T568A' },
  4: { name: 'IP Configuration', hint: 'Configure 192.168.1.1 with subnet 255.255.255.0', standard: 'T568B' },
  5: { name: 'Subnet Masking', hint: 'Calculate subnet mask for /24 network', standard: 'T568B' },
  6: { name: 'Network Topology', hint: 'Star topology with 8 devices', standard: 'T568B' },
  7: { name: 'Wi-Fi Setup', hint: 'Configure WPA2 with SSID "OfficeNet"', standard: 'T568B' },
  8: { name: 'Network Security', hint: 'Enable firewall and MAC filtering', standard: 'T568B' }
};

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

// ===== AUDIO SYSTEM =====
const bgMusic = document.getElementById('bg-music');

function playMusic() {
  if (!isAudioPlaying) {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
      console.log('Music playing');
    }).catch(e => {
      console.log('Audio play prevented:', e);
    });
  }
}

document.addEventListener('click', playMusic);
document.addEventListener('touchstart', playMusic);

// ===== SCREEN FUNCTIONS =====
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function goToMenu() {
  showScreen('main-menu');
  resetGameState();
  document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
  document.getElementById('pinout-list').classList.add('hidden');
  lives = maxLives;
  updateLivesDisplay();
}

function showChallengeSelect() {
  showScreen('challenge-select');
}

// ===== STORY FLOW =====
function startChallenge() {
  isPracticeMode = false;
  lives = maxLives;
  score = 0;
  isGameOver = false;
  dialogueStep = 1;
  updateLivesDisplay();
  updateScoreDisplay();
  showScreen('story-1');
}

function goToStory2() {
  showScreen('story-2');
}

function goToGame() {
  showScreen('challenge-2');
  resetGameState();
  initWirePalette();
  document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
  document.getElementById('challenge-title').textContent = "RJ45 CONNECTOR MASTER";
}

function startPractice() {
  isPracticeMode = true;
  lives = maxLives;
  score = 0;
  isGameOver = false;
  updateLivesDisplay();
  updateScoreDisplay();
  showScreen('challenge-2');
  document.getElementById('pinout-list').classList.remove('hidden');
  document.getElementById('game-status').innerHTML = "PRACTICE MODE: SELECT SCHEMATIC &amp; STUDY GUIDE";
  document.getElementById('challenge-title').textContent = "PRACTICE MODE";
  resetGameState();
  initWirePalette();
}

function startSpecificChallenge(challengeId) {
  currentChallenge = challengeId;
  isPracticeMode = false;
  lives = maxLives;
  score = 0;
  isGameOver = false;
  updateLivesDisplay();
  updateScoreDisplay();
  showScreen('challenge-2');
  document.getElementById('pinout-list').classList.add('hidden');
  document.getElementById('game-status').innerHTML = "STATUS: " + challenges[challengeId].name;
  document.getElementById('challenge-title').textContent = challenges[challengeId].name;
  document.getElementById('challenge-hint').textContent = challenges[challengeId].hint;
  resetGameState();
  initWirePalette();
}

// ===== LIVES & SCORE =====
function updateLivesDisplay() {
  const livesIcons = document.getElementById('lives-icons');
  let hearts = '';
  for (let i = 0; i < lives; i++) {
    hearts += '❤️';
  }
  for (let i = lives; i < maxLives; i++) {
    hearts += '🖤';
  }
  livesIcons.textContent = hearts;
}

function updateScoreDisplay() {
  document.getElementById('score-display').textContent = 'SCORE: ' + score;
}

function loseLife() {
  lives--;
  updateLivesDisplay();
  if (lives <= 0) {
    lives = 0;
    updateLivesDisplay();
    showGameOver();
  }
}

// ===== GAME OVER =====
function showGameOver() {
  document.getElementById('game-over-modal').classList.add('active');
  isGameOver = true;
}

function goToPracticeFromGameOver() {
  document.getElementById('game-over-modal').classList.remove('active');
  startPractice();
}

function resetAndRetry() {
  document.getElementById('game-over-modal').classList.remove('active');
  lives = maxLives;
  score = 0;
  isGameOver = false;
  updateLivesDisplay();
  updateScoreDisplay();
  resetGameState();
  initWirePalette();
  document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
  showScreen('challenge-2');
}

// ===== RESET GAME STATE =====
function resetGameState() {
  currentTargetStandard = null;
  document.querySelectorAll('.standard-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const wire = zone.querySelector('.drag-wire');
    if (wire) wire.remove();
  });
}

// ===== WIRE PALETTE =====
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

// ===== DRAG AND DROP =====
function dropWire(e) {
  e.preventDefault();
  const zone = e.target.closest('.drop-zone');
  if (!zone) return;

  // Check if game is over
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }

  const existing = zone.querySelector('.drag-wire');
  if (existing) {
    returnWireToPalette(existing);
  }

  try {
    const wireData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const sourceEl = document.querySelector(`.drag-wire[data-name="${wireData.name}"]`);
    if (sourceEl && sourceEl.parentElement && sourceEl.parentElement.id === 'wire-source-container') {
      sourceEl.remove();
    } else {
      // If wire not found in palette, create new one
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

// ===== SET TARGET STANDARD =====
function setTargetStandard(std) {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }
  
  currentTargetStandard = std;
  
  document.querySelectorAll('.standard-btn').forEach(b => b.classList.remove('selected'));
  if (std === 'T568A') {
    document.getElementById('btn-t568a').classList.add('selected');
  } else {
    document.getElementById('btn-t568b').classList.add('selected');
  }
  
  if (isPracticeMode) {
    const list = document.getElementById('pinout-list');
    list.innerHTML = `<b>${std} Sequence:</b><ol type="1" style="margin-left: 15px;">` + 
      standards[std].map(w => `<li>${w}</li>`).join('') + `</ol>`;
    list.classList.remove('hidden');
  }
  
  document.getElementById('game-status').innerHTML = `STATUS: TARGET SET TO ${std}`;
}

// ===== CRIMP CONNECTOR =====
function crimpConnector() {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }
  
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
    score += 100;
    updateScoreDisplay();
    document.getElementById('game-status').innerHTML = "STATUS: ✅ SUCCESS! WIRED CORRECTLY!";
    highlightCorrectWires(true);
    
    // Show success screen
    setTimeout(() => {
      showSuccessScreen();
    }, 800);
    
  } else {
    loseLife();
    document.getElementById('game-status').innerHTML = "STATUS: ❌ INCORRECT WIRING. TRY AGAIN.";
    showModal('❌ Incorrect wire ordering!\nCheck your pin alignment and try again.', 'error', '❌ CRIMP FAILED');
    highlightCorrectWires(false);
    
    if (isGameOver) {
      // Game over already triggered by loseLife
    }
  }
}

// ===== SUCCESS SCREEN =====
function showSuccessScreen() {
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-lives').textContent = lives;
  showScreen('success-screen');
}

function nextChallenge() {
  if (currentChallenge < totalChallenges) {
    currentChallenge++;
    startSpecificChallenge(currentChallenge);
  } else {
    showModal('🎉 You completed all challenges! Great job!', 'success', '🏆 CHAMPION!');
    goToMenu();
  }
}

// ===== HIGHLIGHT CORRECT WIRES =====
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

// ===== RESET WIRES =====
function resetWires() {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }
  
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
  
  showModal('🔄 All wires have been reset!', 'info', '🔄 RESET COMPLETE');
}

// ===== MODAL FUNCTIONS =====
let modalTimeout = null;

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

// ===== CONFIRM GO TO MENU =====
function confirmGoToMenu() {
  showModal('Are you sure you want to go back to the main menu? Your progress will be lost.', 'warning', '⚠️ CONFIRM');
  // Override modal OK button to go to menu
  const modalOk = document.getElementById('modal-ok');
  modalOk.onclick = function() {
    closeModal();
    goToMenu();
  };
}

// ===== DOM READY - SETUP ALL EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
  
  // Main Menu Buttons
  document.getElementById('btn-start').addEventListener('click', startChallenge);
  document.getElementById('btn-practice').addEventListener('click', startPractice);
  document.getElementById('btn-challenges').addEventListener('click', showChallengeSelect);
  
  // Back Buttons
  document.getElementById('btn-back-select').addEventListener('click', goToMenu);
  document.getElementById('btn-back-story1').addEventListener('click', goToMenu);
  document.getElementById('btn-back-story2').addEventListener('click', goToMenu);
  document.getElementById('btn-back-game').addEventListener('click', confirmGoToMenu);
  document.getElementById('btn-back-success').addEventListener('click', goToMenu);
  
  // Story Next Buttons
  document.getElementById('btn-next-story1').addEventListener('click', goToStory2);
  document.getElementById('btn-next-story2').addEventListener('click', goToGame);
  
  // Also click on images to advance story
  document.getElementById('story-image-1').addEventListener('click', goToStory2);
  document.getElementById('story-image-2').addEventListener('click', goToGame);
  
  // Challenge Selection
  document.querySelectorAll('.challenge-item').forEach(item => {
    item.addEventListener('click', function() {
      const challengeId = parseInt(this.dataset.challenge);
      startSpecificChallenge(challengeId);
    });
  });
  
  // Standard Buttons
  document.getElementById('btn-t568a').addEventListener('click', function() {
    setTargetStandard('T568A');
  });
  document.getElementById('btn-t568b').addEventListener('click', function() {
    setTargetStandard('T568B');
  });
  
  // Game Actions
  document.getElementById('btn-crimp').addEventListener('click', crimpConnector);
  document.getElementById('btn-reset').addEventListener('click', resetWires);
  
  // Success Screen Buttons
  document.getElementById('btn-next').addEventListener('click', nextChallenge);
  document.getElementById('btn-menu').addEventListener('click', goToMenu);
  
  // Game Over Buttons
  document.getElementById('btn-practice-gameover').addEventListener('click', goToPracticeFromGameOver);
  document.getElementById('btn-retry').addEventListener('click', resetAndRetry);
  
  // Modal OK Button
  document.getElementById('modal-ok').addEventListener('click', closeModal);
  
  // Close modal on outside click
  document.getElementById('custom-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  
  // Close game over modal on outside click
  document.getElementById('game-over-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      // Don't close on outside click for game over
    }
  });
  
  // Setup drop zones for drag and drop
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
    });
    zone.addEventListener('drop', dropWire);
  });
  
  // Initialize
  initWirePalette();
  updateLivesDisplay();
  updateScoreDisplay();
  console.log('🎮 Cable Connect - Game Loaded!');
});