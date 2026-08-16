// ============================================
// ConnectED - COMPLETE GAME SCRIPT
// WITH WORKING MICRO-LEARNING MODULE
// ============================================

// ===== GAME VARIABLES =====
let currentTargetStandard = null;
let isPracticeMode = false;
let lives = 5;
let maxLives = 5;
let score = 0;
let currentChallenge = 1;
let totalChallenges = 8;
let isGameOver = false;
let isAudioPlaying = false;
let modalTimeout = null;
let challengeOrder = [1, 4, 6, 7, 2, 5, 3, 8];
let challengeIndex = 0;

// ===== CHALLENGE DEFINITIONS =====
const challenges = {
  1: { name: 'RJ45 Crimping - T568B', hint: 'Drag wires to correct pins in T568B order', type: 'rj45' },
  2: { name: 'Straight-Through Cable', hint: 'Both ends use T568B standard', type: 'rj45' },
  3: { name: 'Crossover Cable', hint: 'One end T568A, other T568B', type: 'rj45' },
  4: { name: 'IP Configuration', hint: 'Configure PC1 with correct IP settings', type: 'ip' },
  5: { name: 'Subnet Masking', hint: 'Calculate subnet mask for /24 network', type: 'ip' },
  6: { name: 'Workgroup & Sharing Setup', hint: 'Configure computer name, workgroup and sharing', type: 'workgroup' },
  7: { name: 'Router & Connectivity Testing', hint: 'Configure SSID, security and test ping', type: 'router' },
  8: { name: 'Network Security', hint: 'Enable firewall and MAC filtering', type: 'rj45' }
};

// ============================================
// MICRO-LEARNING MODULE - LESSON DATA
// ============================================
const microLessons = {
  1: {
    topic: "RJ45 Crimping - T568B Standard",
    description: "The T568B is a standard wiring scheme for RJ45 connectors used in Ethernet networks. It defines the color order of the eight wires inside a twisted pair cable. This is the most commonly used standard in the Philippines and worldwide.",
    points: [
      "T568B is the most widely used wiring standard for Ethernet cables.",
      "The wire order: Orange/White, Orange, Green/White, Blue, Blue/White, Green, Brown/White, Brown.",
      "Used for both straight-through and crossover cables.",
      "Both ends of a straight-through cable use the same standard.",
      "The T568B standard ensures compatibility with most network devices."
    ],
    example: "If you are making a network cable to connect a computer to a switch, you would use the T568B standard on both ends. The colors go: Pin 1 = Orange/White, Pin 2 = Orange, Pin 3 = Green/White, Pin 4 = Blue, Pin 5 = Blue/White, Pin 6 = Green, Pin 7 = Brown/White, Pin 8 = Brown.",
    remember: "Remember: T568B is the default standard for most networks. Always double-check your wire order before crimping! The orange pair comes first, followed by the green pair, then blue, then brown."
  },
  2: {
    topic: "Straight-Through Cable",
    description: "A straight-through cable is a type of Ethernet cable where both ends use the same wiring standard (usually T568B). It is used to connect different types of devices, such as a computer to a switch or a router.",
    points: [
      "Both ends of a straight-through cable use the same wiring standard.",
      "Most commonly used for connecting computers to network switches.",
      "The wire order is identical on both ends.",
      "It is the most common type of network cable.",
      "Color order: Orange/White, Orange, Green/White, Blue, Blue/White, Green, Brown/White, Brown."
    ],
    example: "When connecting your PC to the school's network switch, you would use a straight-through cable. Both ends of the cable follow the T568B standard so the signals pass through correctly.",
    remember: "Straight-through = same standard on both ends. Use this when connecting different types of devices (computer to switch)."
  },
  3: {
    topic: "Crossover Cable",
    description: "A crossover cable is a type of Ethernet cable where one end uses T568A and the other uses T568B. It is used to connect two similar devices directly, such as two computers or two switches.",
    points: [
      "One end uses T568A, the other uses T568B.",
      "Used to connect similar devices directly (PC to PC, Switch to Switch).",
      "The transmit and receive pairs are crossed over.",
      "Less common today because modern devices auto-detect cable types.",
      "Still useful for direct connections without a switch."
    ],
    example: "If you want to connect two laptops directly to share files without a switch, you would use a crossover cable. One end is T568A and the other is T568B so the signals cross properly.",
    remember: "Crossover = different standards on each end. Use this for same-type devices (PC to PC, Switch to Switch). Modern devices often don't need it anymore!"
  },
  4: {
    topic: "IP Configuration",
    description: "IP Configuration is the process of assigning a unique IP address to a device on a network. This allows the device to communicate with other devices. A proper IP configuration includes an IP address, subnet mask, default gateway, and DNS server.",
    points: [
      "Every device on a network needs a unique IP address.",
      "IP addresses identify devices on the network.",
      "The subnet mask determines which part is the network and which is the host.",
      "The default gateway is the router that connects to other networks.",
      "DNS servers translate domain names (like google.com) to IP addresses."
    ],
    example: "A computer is configured with: IP: 192.168.1.2, Subnet: 255.255.255.0, Gateway: 192.168.1.1, DNS: 8.8.8.8. This allows it to communicate with other devices on the network and access the internet.",
    remember: "IP address = your device's unique ID. Subnet mask = tells you which network you're on. Gateway = the door to the internet. DNS = the phonebook that turns names into addresses."
  },
  5: {
    topic: "Subnet Masking",
    description: "A subnet mask is a 32-bit number that divides an IP address into network and host portions. It helps devices determine whether a destination is on the same local network or requires routing through a gateway.",
    points: [
      "The subnet mask separates the network ID from the host ID.",
      "Common subnet mask: 255.255.255.0 (/24) supports up to 254 devices.",
      "It helps improve network performance and security.",
      "Subnetting creates smaller, manageable network segments.",
      "The number after the slash (/24) indicates how many bits are for the network."
    ],
    example: "With IP 192.168.1.5 and subnet mask 255.255.255.0, the network is 192.168.1.0 and the host is 5. This device can directly talk to any device from 192.168.1.1 to 192.168.1.254 without going through a router.",
    remember: "Subnet mask = network boundaries. It tells you which part of the IP is the network and which part is the device. /24 means the first 3 numbers are the network."
  },
  6: {
    topic: "Workgroup & Sharing Setup",
    description: "A workgroup is a peer-to-peer network setup where computers communicate directly with each other without a central server. Sharing setup involves enabling network discovery and file sharing so computers can see and access each other's files.",
    points: [
      "A workgroup is a small network without a central server.",
      "All computers should have the same workgroup name (e.g., WORKGROUP).",
      "Turn on Network Discovery to see other computers on the network.",
      "Turn on File and Printer Sharing to share resources.",
      "Turn off password-protected sharing for easier access in a lab setting."
    ],
    example: "In a computer lab, all PCs are set to the same workgroup 'WORKGROUP'. Network Discovery is turned on so students can see each other's computers. File Sharing is enabled so they can share project files easily.",
    remember: "Same workgroup name = computers can see each other. Network Discovery ON = visible to others. File Sharing ON = can share files. Password Protection OFF = easier access in a trusted environment."
  },
  7: {
    topic: "Router & Connectivity Testing",
    description: "Routers connect different networks together and direct traffic between them. Connectivity testing using the ping command verifies that devices can communicate successfully. It tests the physical connection and IP configuration.",
    points: [
      "Routers connect networks and direct internet traffic.",
      "The ping command tests network connectivity.",
      "Ping sends ICMP echo requests to a target IP address.",
      "A successful ping means the connection is working.",
      "Troubleshoot by pinging your gateway, then internet addresses."
    ],
    example: "To test your network connection, you can ping the router's IP: ping 192.168.1.1. If you get replies, your connection to the router is working. Then ping google.com to check internet connectivity.",
    remember: "Ping = the network test tool. Start by pinging your own IP (localhost), then your gateway, then the internet. This helps you find where the problem is."
  },
  8: {
    topic: "Network Security",
    description: "Network security involves protecting the network from unauthorized access and threats. This includes enabling firewalls, using strong passwords, implementing MAC filtering, and securing wireless networks with encryption like WPA2.",
    points: [
      "Firewalls block unauthorized access to the network.",
      "WPA2/WPA3 encryption secures wireless networks.",
      "MAC filtering allows only approved devices to connect.",
      "Strong passwords prevent unauthorized access.",
      "Regular updates and monitoring keep the network secure."
    ],
    example: "A school network has a firewall that blocks unauthorized traffic, WPA2 encryption on the Wi-Fi so only students with the password can connect, and MAC filtering to allow only registered school devices.",
    remember: "Security = protection. Firewall = gatekeeper. Encryption = scrambles data so only authorized users can read it. Keep your passwords strong and your software updated!"
  }
};

// ============================================
// MICRO-LEARNING VARIABLES
// ============================================
let learningChallengeId = null;
let learningIsPractice = false;

// ============================================
// MICRO-LEARNING FUNCTIONS
// ============================================

function showMicroLearning(challengeId, isPractice = false) {
  learningChallengeId = challengeId;
  learningIsPractice = isPractice;
  
  const lesson = microLessons[challengeId];
  if (!lesson) {
    console.error('No lesson found for challenge:', challengeId);
    loadChallenge(challengeId);
    return;
  }
  
  document.getElementById('ml-topic').textContent = '📚 ' + lesson.topic;
  document.getElementById('ml-challenge-name').textContent = 'Challenge ' + challengeId + ': ' + challenges[challengeId].name;
  document.getElementById('ml-description').textContent = lesson.description;
  
  const pointsList = document.getElementById('ml-points');
  pointsList.innerHTML = '';
  lesson.points.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    pointsList.appendChild(li);
  });
  
  document.getElementById('ml-example-text').textContent = lesson.example;
  document.getElementById('ml-remember-text').textContent = lesson.remember;
  
  const progress = ((challengeIndex) / challengeOrder.length) * 100;
  document.getElementById('ml-progress-fill').style.width = progress + '%';
  document.getElementById('ml-progress-text').textContent = challengeIndex + ' / ' + challengeOrder.length;
  
  const badge = document.getElementById('ml-practice-badge');
  if (isPractice) {
    badge.classList.add('active');
  } else {
    badge.classList.remove('active');
  }
  
  showScreen('micro-learning');
}

function exitMicroLearning() {
  if (learningIsPractice) {
    goToMenu();
  } else {
    showScreen('challenge-select');
  }
}

function startChallengeFromLearning() {
  if (learningIsPractice) {
    isPracticeMode = true;
  } else {
    isPracticeMode = false;
  }
  loadChallenge(learningChallengeId);
}

// ============================================
// WIRE DEFINITIONS
// ============================================
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

// ============================================
// CORRECT CONFIGURATIONS
// ============================================
const correctIPConfig = {
  ipAddress: '192.168.1.2',
  subnetMask: '255.255.255.0',
  defaultGateway: '192.168.1.1',
  dnsServer: '8.8.8.8'
};

const correctWorkgroupConfig = {
  computerName: 'PC-01',
  workgroup: 'WORKGROUP',
  networkDiscovery: true,
  fileSharing: true,
  passwordProtection: false
};

const correctRouterConfig = {
  ssid: 'OfficeNet',
  security: 'WPA2',
  lanIp: '192.168.1.1',
  pingIp: '192.168.1.1'
};

// ============================================
// AUDIO SYSTEM
// ============================================
const bgMusic = document.getElementById('bg-music');

function playMusic() {
  if (!isAudioPlaying) {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
      console.log('🎵 Music playing');
    }).catch(e => {
      console.log('Audio play prevented:', e);
    });
  }
}

document.addEventListener('click', playMusic);
document.addEventListener('touchstart', playMusic);
document.addEventListener('keydown', playMusic);

window.addEventListener('load', function() {
  setTimeout(playMusic, 1000);
});

bgMusic.addEventListener('ended', function() {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(e => console.log('Restart error:', e));
});

// ============================================
// SCREEN FUNCTIONS
// ============================================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  console.log('📺 Showing screen:', screenId);
}

function goToMenu() {
  showScreen('main-menu');
  resetGameState();
  resetIPConfig();
  resetWorkgroupConfig();
  resetRouterConfig();
  document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
  document.getElementById('pinout-list').classList.add('hidden');
  lives = maxLives;
  challengeIndex = 0;
  updateAllLives();
  isGameOver = false;
  console.log('🏠 Returned to menu');
}

function showChallengeSelect() {
  showScreen('challenge-select');
  console.log('📋 Showing challenge select');
}

// ============================================
// STORY FLOW
// ============================================
function startChallenge() {
  isPracticeMode = false;
  lives = maxLives;
  score = 0;
  isGameOver = false;
  challengeIndex = 0;
  updateAllLives();
  updateAllScores();
  showScreen('story-1');
  console.log('🎬 Starting story - cha1.jpg');
}

function goToStory2() {
  showScreen('story-2');
  console.log('📖 Going to story 2 - cha2.PNG');
}

function goToGame() {
  currentChallenge = challengeOrder[challengeIndex];
  showMicroLearning(currentChallenge, false);
}

function startPractice() {
  isPracticeMode = true;
  lives = maxLives;
  score = 0;
  isGameOver = false;
  challengeIndex = 0;
  updateAllLives();
  updateAllScores();
  currentChallenge = challengeOrder[0];
  showMicroLearning(currentChallenge, true);
  console.log('📚 Practice mode started');
}

// ============================================
// FIXED: startSpecificChallenge - Shows micro-learning first
// ============================================
function startSpecificChallenge(challengeId) {
  isPracticeMode = false;
  lives = maxLives;
  score = 0;
  isGameOver = false;
  updateAllLives();
  updateAllScores();
  currentChallenge = challengeId;
  // THIS IS THE FIX - Show micro-learning first
  showMicroLearning(challengeId, false);
  console.log('🎯 Starting specific challenge:', challengeId);
}

// ============================================
// loadChallenge - Loads the actual challenge
// ============================================
function loadChallenge(challengeId) {
  const challenge = challenges[challengeId];
  if (challenge.type === 'ip') {
    showScreen('ip-challenge');
    document.getElementById('ip-status').innerHTML = "STATUS: " + challenge.name;
    document.getElementById('ip-title').textContent = "💻 " + challenge.name;
    resetIPConfig();
    console.log('💻 Starting IP challenge:', challengeId);
  } else if (challenge.type === 'workgroup') {
    showScreen('workgroup-challenge');
    document.getElementById('workgroup-status').innerHTML = "STATUS: " + challenge.name;
    resetWorkgroupConfig();
    console.log('🏢 Starting Workgroup challenge:', challengeId);
  } else if (challenge.type === 'router') {
    showScreen('router-challenge');
    document.getElementById('router-status').innerHTML = "STATUS: " + challenge.name;
    resetRouterConfig();
    console.log('📶 Starting Router challenge:', challengeId);
  } else {
    showScreen('challenge-2');
    document.getElementById('pinout-list').classList.add('hidden');
    document.getElementById('game-status').innerHTML = "STATUS: " + challenge.name;
    document.getElementById('challenge-title').textContent = challenge.name;
    document.getElementById('challenge-hint').textContent = challenge.hint;
    resetGameState();
    initWirePalette();
    console.log('🎯 Starting RJ45 challenge:', challengeId);
  }
}

// ============================================
// GO TO NEXT CHALLENGE
// ============================================
function goToNextChallenge() {
  challengeIndex++;
  if (challengeIndex < challengeOrder.length) {
    currentChallenge = challengeOrder[challengeIndex];
    showMicroLearning(currentChallenge, isPracticeMode);
  } else {
    showModal('🎉 You completed all challenges! Great job!', 'success', '🏆 CHAMPION!');
    goToMenu();
  }
}

// ============================================
// LIVES & SCORE
// ============================================
function updateAllLives() {
  const elements = ['lives-icons', 'ip-lives-icons', 'workgroup-lives-icons', 'router-lives-icons'];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      let hearts = '';
      for (let i = 0; i < lives; i++) hearts += '❤️';
      for (let i = lives; i < maxLives; i++) hearts += '🖤';
      el.textContent = hearts;
    }
  });
}

function updateAllScores() {
  const elements = ['score-display', 'ip-score-display', 'workgroup-score-display', 'router-score-display'];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = 'SCORE: ' + score;
  });
}

// ============================================
// LOSE LIFE FUNCTION
// ============================================
function loseLife() {
  if (isPracticeMode) {
    const status = document.getElementById('ip-status') || 
                   document.getElementById('workgroup-status') || 
                   document.getElementById('router-status') || 
                   document.getElementById('game-status');
    status.innerHTML = "⚠️ PRACTICE MODE: No lives lost!";
    status.style.color = '#f39c12';
    setTimeout(() => {
      status.style.color = '#f1c40f';
    }, 1500);
    return;
  }
  
  lives--;
  updateAllLives();
  
  const livesIcons = document.getElementById('lives-icons');
  livesIcons.classList.remove('life-lost');
  void livesIcons.offsetWidth;
  livesIcons.classList.add('life-lost');
  
  const status = document.getElementById('game-status') || 
                 document.getElementById('ip-status') || 
                 document.getElementById('workgroup-status') || 
                 document.getElementById('router-status');
  status.innerHTML = "💔 LIFE LOST! " + lives + " lives remaining. Try again!";
  status.style.color = '#e74c3c';
  
  setTimeout(() => {
    status.style.color = '#f1c40f';
  }, 2000);
  
  console.log('💔 Lost a life. Lives left:', lives);
  
  if (lives <= 0) {
    lives = 0;
    updateAllLives();
    setTimeout(() => {
      showGameOver();
    }, 600);
  }
}

// ============================================
// GAME OVER
// ============================================
function showGameOver() {
  document.getElementById('game-over-modal').classList.add('active');
  isGameOver = true;
  console.log('💀 Game Over!');
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
  challengeIndex = 0;
  updateAllLives();
  updateAllScores();
  resetGameState();
  resetIPConfig();
  resetWorkgroupConfig();
  resetRouterConfig();
  initWirePalette();
  currentChallenge = challengeOrder[0];
  showMicroLearning(currentChallenge, isPracticeMode);
  console.log('🔄 Retry - lives reset to 5');
}

// ============================================
// RESET GAME STATE
// ============================================
function resetGameState() {
  currentTargetStandard = null;
  document.querySelectorAll('.standard-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const wire = zone.querySelector('.drag-wire');
    if (wire) wire.remove();
  });
}

// ============================================
// WIRE PALETTE
// ============================================
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

// ============================================
// DRAG AND DROP
// ============================================
function dropWire(e) {
  e.preventDefault();
  const zone = e.target.closest('.drop-zone');
  if (!zone) return;

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

// ============================================
// SET TARGET STANDARD
// ============================================
function setTargetStandard(std) {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }
  
  currentTargetStandard = std;
  
  document.querySelectorAll('.standard-btn').forEach(b => b.classList.remove('selected'));
  if (std === 'T568A') {
    document.querySelectorAll('.standard-btn')[0].classList.add('selected');
  } else {
    document.querySelectorAll('.standard-btn')[1].classList.add('selected');
  }
  
  if (isPracticeMode) {
    const list = document.getElementById('pinout-list');
    list.innerHTML = `<b>${std} Sequence:</b><ol type="1" style="margin-left: 15px;">` + 
      standards[std].map(w => `<li>${w}</li>`).join('') + `</ol>`;
    list.classList.remove('hidden');
  }
  
  document.getElementById('game-status').innerHTML = `STATUS: TARGET SET TO ${std}`;
  console.log('🎯 Target standard set to:', std);
}

// ============================================
// CRIMP CONNECTOR
// ============================================
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
  let wrongPin = -1;
  let emptyPins = [];

  dropZones.forEach((zone, idx) => {
    const placedWire = zone.querySelector('.drag-wire');
    if (!placedWire) {
      isCorrect = false;
      emptyPins.push(idx + 1);
    } else if (placedWire.dataset.name !== targetSequence[idx]) {
      isCorrect = false;
      wrongPin = idx + 1;
    } else {
      filledSlots++;
    }
  });

  if (!isCorrect || filledSlots < 8) {
    loseLife();
    
    let errorMsg = '';
    if (emptyPins.length > 0) {
      errorMsg = `❌ Empty pins: ${emptyPins.join(', ')}. `;
      errorMsg += `You crimped with ${filledSlots}/8 wires!`;
    } else if (wrongPin > 0) {
      errorMsg = `❌ Pin ${wrongPin} has the wrong wire. `;
      errorMsg += `Check the correct sequence!`;
    }
    errorMsg += '\n💔 -1 Life!';
    
    showModal(errorMsg, 'error', '❌ CRIMP FAILED');
    highlightCorrectWires(false);
    console.log('❌ CRIMP FAILED - Life lost, staying on same challenge');
    return;
  }

  if (isCorrect && filledSlots === 8) {
    score += 100;
    updateAllScores();
    document.getElementById('game-status').innerHTML = "STATUS: ✅ SUCCESS! WIRED CORRECTLY! +100 POINTS";
    highlightCorrectWires(true);
    
    setTimeout(() => {
      showSuccessScreen();
    }, 800);
    console.log('✅ CRIMP SUCCESS! Score:', score);
  }
}

// ============================================
// IP CONFIGURATION CHECK
// ============================================
function checkIPConfig() {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }

  const ipAddress = document.getElementById('ip-address').value.trim();
  const subnetMask = document.getElementById('subnet-mask').value.trim();
  const defaultGateway = document.getElementById('default-gateway').value.trim();
  const dnsServer = document.getElementById('dns-server').value.trim();

  const ipInput = document.getElementById('ip-address');
  const subnetInput = document.getElementById('subnet-mask');
  const gatewayInput = document.getElementById('default-gateway');
  const dnsInput = document.getElementById('dns-server');

  if (!ipAddress || !subnetMask || !defaultGateway || !dnsServer) {
    showModal('❌ Please fill in all fields before verifying!', 'warning', '⚠️ INCOMPLETE');
    return;
  }

  let isCorrect = true;
  let errors = [];

  if (ipAddress !== correctIPConfig.ipAddress) {
    isCorrect = false;
    errors.push('IPv4 Address');
    ipInput.classList.add('wrong');
    ipInput.classList.remove('correct');
  } else {
    ipInput.classList.add('correct');
    ipInput.classList.remove('wrong');
  }

  if (subnetMask !== correctIPConfig.subnetMask) {
    isCorrect = false;
    errors.push('Subnet Mask');
    subnetInput.classList.add('wrong');
    subnetInput.classList.remove('correct');
  } else {
    subnetInput.classList.add('correct');
    subnetInput.classList.remove('wrong');
  }

  if (defaultGateway !== correctIPConfig.defaultGateway) {
    isCorrect = false;
    errors.push('Default Gateway');
    gatewayInput.classList.add('wrong');
    gatewayInput.classList.remove('correct');
  } else {
    gatewayInput.classList.add('correct');
    gatewayInput.classList.remove('wrong');
  }

  if (dnsServer !== correctIPConfig.dnsServer) {
    isCorrect = false;
    errors.push('DNS Server');
    dnsInput.classList.add('wrong');
    dnsInput.classList.remove('correct');
  } else {
    dnsInput.classList.add('correct');
    dnsInput.classList.remove('wrong');
  }

  if (isCorrect) {
    score += 100;
    updateAllScores();
    document.getElementById('ip-status').innerHTML = "✅ SUCCESS! IP CONFIGURATION CORRECT! +100 POINTS";
    document.getElementById('ip-status').style.color = '#2ecc71';
    
    setTimeout(() => {
      showSuccessScreen();
    }, 800);
    console.log('✅ IP CONFIG SUCCESS! Score:', score);
  } else {
    loseLife();
    document.getElementById('ip-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
    document.getElementById('ip-status').style.color = '#e74c3c';
    showModal(`❌ Wrong values: ${errors.join(', ')}\n💔 -1 Life!`, 'error', '❌ CONFIG FAILED');
    console.log('❌ IP CONFIG FAILED - Life lost, staying on same challenge');
  }
}

// ============================================
// RESET IP CONFIG
// ============================================
function resetIPConfig() {
  const inputs = ['ip-address', 'subnet-mask', 'default-gateway', 'dns-server'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.value = '';
      input.classList.remove('correct', 'wrong');
    }
  });
  const status = document.getElementById('ip-status');
  if (status) {
    status.innerHTML = "STATUS: CONFIGURE IP ADDRESS SETTINGS";
    status.style.color = '#f1c40f';
  }
}

// ============================================
// WORKGROUP CONFIGURATION CHECK
// ============================================
function checkWorkgroupConfig() {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }

  const computerName = document.getElementById('computer-name').value.trim();
  const workgroup = document.getElementById('workgroup-name').value.trim();
  const networkDiscovery = document.getElementById('network-discovery').checked;
  const fileSharing = document.getElementById('file-sharing').checked;
  const passwordProtection = document.getElementById('password-protection').checked;

  const nameInput = document.getElementById('computer-name');
  const workgroupInput = document.getElementById('workgroup-name');

  if (!computerName || !workgroup) {
    showModal('❌ Please fill in Computer Name and Workgroup!', 'warning', '⚠️ INCOMPLETE');
    return;
  }

  let isCorrect = true;
  let errors = [];

  if (computerName !== correctWorkgroupConfig.computerName) {
    isCorrect = false;
    errors.push('Computer Name');
    nameInput.classList.add('wrong');
    nameInput.classList.remove('correct');
  } else {
    nameInput.classList.add('correct');
    nameInput.classList.remove('wrong');
  }

  if (workgroup !== correctWorkgroupConfig.workgroup) {
    isCorrect = false;
    errors.push('Workgroup');
    workgroupInput.classList.add('wrong');
    workgroupInput.classList.remove('correct');
  } else {
    workgroupInput.classList.add('correct');
    workgroupInput.classList.remove('wrong');
  }

  if (networkDiscovery !== correctWorkgroupConfig.networkDiscovery) {
    isCorrect = false;
    errors.push('Network Discovery');
  }

  if (fileSharing !== correctWorkgroupConfig.fileSharing) {
    isCorrect = false;
    errors.push('File Sharing');
  }

  if (passwordProtection !== correctWorkgroupConfig.passwordProtection) {
    isCorrect = false;
    errors.push('Password Protection');
  }

  if (isCorrect) {
    score += 100;
    updateAllScores();
    document.getElementById('workgroup-status').innerHTML = "✅ SUCCESS! WORKGROUP CONFIGURATION CORRECT! +100 POINTS";
    document.getElementById('workgroup-status').style.color = '#2ecc71';
    
    setTimeout(() => {
      showSuccessScreen();
    }, 800);
    console.log('✅ WORKGROUP SUCCESS! Score:', score);
  } else {
    loseLife();
    document.getElementById('workgroup-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
    document.getElementById('workgroup-status').style.color = '#e74c3c';
    showModal(`❌ Wrong values: ${errors.join(', ')}\n💔 -1 Life!`, 'error', '❌ CONFIG FAILED');
    console.log('❌ WORKGROUP CONFIG FAILED - Life lost, staying on same challenge');
  }
}

// ============================================
// RESET WORKGROUP CONFIG
// ============================================
function resetWorkgroupConfig() {
  ['computer-name', 'workgroup-name'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.value = '';
      input.classList.remove('correct', 'wrong');
    }
  });
  ['network-discovery', 'file-sharing', 'password-protection'].forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) checkbox.checked = false;
  });
  const status = document.getElementById('workgroup-status');
  if (status) {
    status.innerHTML = "STATUS: CONFIGURE WORKGROUP SETTINGS";
    status.style.color = '#f1c40f';
  }
}

// ============================================
// ROUTER CONFIGURATION CHECK
// ============================================
function checkRouterConfig() {
  if (isGameOver) {
    showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
    return;
  }

  const ssid = document.getElementById('router-ssid').value.trim();
  const security = document.getElementById('router-security').value;
  const lanIp = document.getElementById('router-lan').value.trim();

  const ssidInput = document.getElementById('router-ssid');
  const securityInput = document.getElementById('router-security');
  const lanInput = document.getElementById('router-lan');

  if (!ssid || !security || !lanIp) {
    showModal('❌ Please fill in all router fields!', 'warning', '⚠️ INCOMPLETE');
    return;
  }

  let isCorrect = true;
  let errors = [];

  if (ssid !== correctRouterConfig.ssid) {
    isCorrect = false;
    errors.push('SSID');
    ssidInput.classList.add('wrong');
    ssidInput.classList.remove('correct');
  } else {
    ssidInput.classList.add('correct');
    ssidInput.classList.remove('wrong');
  }

  if (security !== correctRouterConfig.security) {
    isCorrect = false;
    errors.push('Security');
    securityInput.classList.add('wrong');
    securityInput.classList.remove('correct');
  } else {
    securityInput.classList.add('correct');
    securityInput.classList.remove('wrong');
  }

  if (lanIp !== correctRouterConfig.lanIp) {
    isCorrect = false;
    errors.push('LAN IP');
    lanInput.classList.add('wrong');
    lanInput.classList.remove('correct');
  } else {
    lanInput.classList.add('correct');
    lanInput.classList.remove('wrong');
  }

  if (isCorrect) {
    score += 100;
    updateAllScores();
    document.getElementById('router-status').innerHTML = "✅ SUCCESS! ROUTER CONFIGURATION CORRECT! +100 POINTS";
    document.getElementById('router-status').style.color = '#2ecc71';
    
    setTimeout(() => {
      showSuccessScreen();
    }, 800);
    console.log('✅ ROUTER SUCCESS! Score:', score);
  } else {
    loseLife();
    document.getElementById('router-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
    document.getElementById('router-status').style.color = '#e74c3c';
    showModal(`❌ Wrong values: ${errors.join(', ')}\n💔 -1 Life!`, 'error', '❌ CONFIG FAILED');
    console.log('❌ ROUTER CONFIG FAILED - Life lost, staying on same challenge');
  }
}

// ============================================
// RESET ROUTER CONFIG
// ============================================
function resetRouterConfig() {
  ['router-ssid', 'router-lan'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.value = '';
      input.classList.remove('correct', 'wrong');
    }
  });
  const security = document.getElementById('router-security');
  if (security) security.value = '';
  const pingInput = document.getElementById('ping-ip');
  if (pingInput) pingInput.value = '';
  const result = document.getElementById('ping-result');
  if (result) result.innerHTML = '<span class="info">📡 Ready to ping...</span>';
  
  const status = document.getElementById('router-status');
  if (status) {
    status.innerHTML = "STATUS: CONFIGURE ROUTER SETTINGS";
    status.style.color = '#f1c40f';
  }
}

// ============================================
// RUN PING TEST
// ============================================
function runPingTest() {
  const pingIp = document.getElementById('ping-ip').value.trim();
  const result = document.getElementById('ping-result');
  
  if (!pingIp) {
    result.innerHTML = '<span class="fail">❌ Please enter an IP address to ping!</span>';
    return;
  }

  result.innerHTML = '<span class="info">⏳ Pinging ' + pingIp + '...</span>';
  
  setTimeout(() => {
    if (pingIp === correctRouterConfig.pingIp) {
      result.innerHTML = `
        <span class="success">✅ Reply from ${pingIp}: bytes=32 time=1ms TTL=64</span><br>
        <span class="success">✅ Reply from ${pingIp}: bytes=32 time=1ms TTL=64</span><br>
        <span class="success">✅ Reply from ${pingIp}: bytes=32 time=2ms TTL=64</span><br>
        <span class="success">✅ Reply from ${pingIp}: bytes=32 time=1ms TTL=64</span><br>
        <span class="info">📊 Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)</span>
      `;
      document.getElementById('router-status').innerHTML = "✅ PING SUCCESSFUL! Network is stable!";
      document.getElementById('router-status').style.color = '#2ecc71';
    } else {
      result.innerHTML = `
        <span class="fail">❌ Request timed out.</span><br>
        <span class="fail">❌ Request timed out.</span><br>
        <span class="fail">❌ Request timed out.</span><br>
        <span class="fail">❌ Request timed out.</span><br>
        <span class="info">📊 Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)</span>
      `;
      document.getElementById('router-status').innerHTML = "❌ PING FAILED! Check network connectivity!";
      document.getElementById('router-status').style.color = '#e74c3c';
    }
  }, 1500);
}

// ============================================
// HIGHLIGHT CORRECT WIRES
// ============================================
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

// ============================================
// RESET WIRES
// ============================================
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

// ============================================
// SUCCESS SCREEN
// ============================================
function showSuccessScreen() {
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-lives').textContent = lives;
  
  const nextIdx = challengeIndex + 1;
  if (nextIdx < challengeOrder.length) {
    const nextChallengeId = challengeOrder[nextIdx];
    const nextType = challenges[nextChallengeId].type;
    const typeLabels = {
      'rj45': '🔌 RJ45',
      'ip': '💻 IP CONFIG',
      'workgroup': '🏢 WORKGROUP',
      'router': '📶 ROUTER'
    };
    document.getElementById('next-btn').textContent = '➜ ' + (typeLabels[nextType] || 'NEXT');
  } else {
    document.getElementById('next-btn').textContent = '🏆 FINISH ➜';
  }
  
  showScreen('success-screen');
  console.log('🏆 Success screen shown!');
}

// ============================================
// MODAL FUNCTIONS
// ============================================
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

// ============================================
// CONFIRM GO TO MENU
// ============================================
function confirmGoToMenu() {
  showModal('Are you sure you want to go back to the main menu? Your progress will be lost.', 'warning', '⚠️ CONFIRM');
  const origClose = closeModal;
  closeModal = function() {
    origClose();
    goToMenu();
  };
}

// ============================================
// INIT
// ============================================
console.log('🎮 ConnectED Game Loaded!');
console.log('📚 Micro-Learning Module shows before each challenge!');
console.log('❤️ You have 5 lives. Each wrong answer costs 1 life!');
console.log('✅ Correct = +100 points!');
console.log('Click START CHALLENGE to begin!');
initWirePalette();
updateAllLives();
updateAllScores();