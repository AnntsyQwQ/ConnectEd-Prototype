// ============================================
// ConnectED - COMPLETE GAME SCRIPT
// FIXED: Modal COMPLETELY removed from main menu
// ============================================

// ===== GAME VARIABLES =====
var currentTargetStandard = null;
var isPracticeMode = false;
var lives = 5;
var maxLives = 5;
var score = 0;
var currentChallenge = 1;
var totalChallenges = 8;
var isGameOver = false;
var isAudioPlaying = false;
var modalTimeout = null;
var challengeOrder = [1, 4, 6, 7, 2, 5, 3, 8];
var challengeIndex = 0;
var learningChallengeId = null;
var learningIsPractice = false;
var isIPStoryFlow = false;

// ===== PERFORMANCE TRACKING =====
var performanceData = {
    completed: new Set(),
    scores: {},
    attempts: {},
    totalScore: 0,
    totalAttempts: 0,
    successRate: 0
};

// ===== CHALLENGE DEFINITIONS =====
var challenges = {
    1: { name: 'RJ45 Crimping - T568B', hint: 'Drag wires to correct pins in T568B order', type: 'rj45' },
    2: { name: 'Straight-Through Cable', hint: 'Both ends use T568B standard', type: 'rj45' },
    3: { name: 'Crossover Cable', hint: 'One end T568A, other T568B', type: 'rj45' },
    4: { name: 'IP Configuration', hint: 'Configure PC1 with correct IP settings', type: 'ip' },
    5: { name: 'Network Topology', hint: 'Connect devices to build a working network', type: 'topology' },
    6: { name: 'Workgroup & Sharing Setup', hint: 'Configure computer name, workgroup and sharing', type: 'workgroup' },
    7: { name: 'Router & Connectivity Testing', hint: 'Configure SSID, security and test ping', type: 'router' },
    8: { name: 'Network Security', hint: 'Enable firewall, WPA2, MAC filtering, updates and set admin password', type: 'security' }
};

// ===== MICRO-LEARNING LESSONS =====
var microLessons = {
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
        remember: "Remember: T568B is the default standard for most networks. Always double-check your wire order before crimping! The orange pair comes first, followed by the green pair, then blue, then brown.",
        quiz: {
            question: "What is the correct wire order for T568B standard?",
            options: [
                "Orange/White, Orange, Green/White, Blue, Blue/White, Green, Brown/White, Brown",
                "Green/White, Green, Orange/White, Blue, Blue/White, Orange, Brown/White, Brown",
                "Brown/White, Brown, Green/White, Blue, Blue/White, Green, Orange/White, Orange",
                "Orange/White, Orange, Blue/White, Blue, Green/White, Green, Brown/White, Brown"
            ],
            correct: 0
        }
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
        remember: "Straight-through = same standard on both ends. Use this when connecting different types of devices (computer to switch).",
        quiz: {
            question: "When would you use a straight-through cable?",
            options: [
                "Connecting a computer to a switch",
                "Connecting two computers directly",
                "Connecting two switches directly",
                "Connecting a computer to a router directly"
            ],
            correct: 0
        }
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
        remember: "Crossover = different standards on each end. Use this for same-type devices (PC to PC, Switch to Switch). Modern devices often don't need it anymore!",
        quiz: {
            question: "What type of cable connects two computers directly?",
            options: [
                "Straight-through cable",
                "Crossover cable",
                "Rollover cable",
                "Fiber optic cable"
            ],
            correct: 1
        }
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
        remember: "IP address = your device's unique ID. Subnet mask = tells you which network you're on. Gateway = the door to the internet. DNS = the phonebook that turns names into addresses.",
        quiz: {
            question: "What is the correct IPv4 address format?",
            options: [
                "192.168.1.2",
                "192.168.1",
                "192.168.1.2.3",
                "192-168-1-2"
            ],
            correct: 0
        }
    },
    5: {
        topic: "Network Topology - Connecting Devices",
        description: "A network topology is the arrangement of devices and cables in a network. In a star topology, all devices connect to a central switch or router. This is the most common topology in modern networks.",
        points: [
            "A network topology defines how devices are connected.",
            "In a star topology, all devices connect to a central hub/switch.",
            "Routers connect different networks together.",
            "Switches connect devices within the same network.",
            "Each device needs a physical connection to the network."
        ],
        example: "In a small office network, a router connects to the internet. Three switches connect to the router, and each switch connects to multiple computers. This creates a hierarchical star topology.",
        remember: "Remember: Router → Switch → PC is the basic building block of a network. Each connection must be correct for the network to work properly!",
        quiz: {
            question: "What is the correct connection order in a typical network?",
            options: [
                "Router → Switch → PC",
                "PC → Router → Switch",
                "Switch → PC → Router",
                "PC → Switch → Router"
            ],
            correct: 0
        }
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
        remember: "Same workgroup name = computers can see each other. Network Discovery ON = visible to others. File Sharing ON = can share files. Password Protection OFF = easier access in a trusted environment.",
        quiz: {
            question: "What must all computers in a workgroup have in common?",
            options: [
                "The same workgroup name",
                "The same IP address",
                "The same computer name",
                "The same subnet mask"
            ],
            correct: 0
        }
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
        remember: "Ping = the network test tool. Start by pinging your own IP (localhost), then your gateway, then the internet. This helps you find where the problem is.",
        quiz: {
            question: "What does the ping command test?",
            options: [
                "Network connectivity",
                "File sharing",
                "Wireless signal strength",
                "IP address assignment"
            ],
            correct: 0
        }
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
        remember: "Security = protection. Firewall = gatekeeper. Encryption = scrambles data so only authorized users can read it. Keep your passwords strong and your software updated!",
        quiz: {
            question: "Which of these is a method to secure a wireless network?",
            options: [
                "WPA2 encryption",
                "Using a crossover cable",
                "Disabling DHCP",
                "Using static IP addresses"
            ],
            correct: 0
        }
    }
};

// ===== WIRE DEFINITIONS (for RJ45) =====
var standards = {
    T568A: ['Green+White', 'Green', 'Orange+White', 'Blue', 'Blue+White', 'Orange', 'Brown+White', 'Brown'],
    T568B: ['Orange+White', 'Orange', 'Green+White', 'Blue', 'Blue+White', 'Green', 'Brown+White', 'Brown']
};

var wireDefinitions = [
    { name: 'Green+White', bg: 'repeating-linear-gradient(45deg, #27ae60, #27ae60 4px, #ffffff 4px, #ffffff 8px)' },
    { name: 'Green', bg: '#27ae60' },
    { name: 'Orange+White', bg: 'repeating-linear-gradient(45deg, #e67e22, #e67e22 4px, #ffffff 4px, #ffffff 8px)' },
    { name: 'Orange', bg: '#e67e22' },
    { name: 'Blue', bg: '#2980b9' },
    { name: 'Blue+White', bg: 'repeating-linear-gradient(45deg, #2980b9, #2980b9 4px, #ffffff 4px, #ffffff 8px)' },
    { name: 'Brown+White', bg: 'repeating-linear-gradient(45deg, #6d4c41, #6d4c41 4px, #ffffff 4px, #ffffff 8px)' },
    { name: 'Brown', bg: '#6d4c41' }
];

// ===== CORRECT CONFIGURATIONS =====
var correctIPConfig = {
    ipAddress: '192.168.1.2',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.1.1',
    dnsServer: '8.8.8.8'
};

var correctWorkgroupConfig = {
    computerName: 'PC-01',
    workgroup: 'WORKGROUP',
    networkDiscovery: true,
    fileSharing: true,
    passwordProtection: false
};

var correctRouterConfig = {
    ssid: 'OfficeNet',
    security: 'WPA2',
    lanIp: '192.168.1.1',
    pingIp: '192.168.1.1'
};

var correctSecurityConfig = {
    firewall: true,
    wpa2: true,
    macFiltering: true,
    autoUpdates: true,
    minPasswordLength: 8
};

// ============================================
// TOPOLOGY CHALLENGE VARIABLES
// ============================================
var topologyConnections = {};
var topologySelected = null;
var topologyCorrect = {
    router: ['switch1', 'switch2', 'switch3'],
    switch1: ['router', 'pc1'],
    switch2: ['router', 'pc2'],
    switch3: ['router', 'pc3'],
    pc1: ['switch1'],
    pc2: ['switch2'],
    pc3: ['switch3']
};
var topologyMaxConnections = 6;
var topologyCurrentConnections = 0;

// ============================================
// AUDIO SYSTEM
// ============================================
var bgMusic = document.getElementById('bg-music');

bgMusic.volume = 0.15;
bgMusic.loop = true;

function playMusic() {
    var menuVideo = document.getElementById('menu-bg-video');
    if (menuVideo && menuVideo.paused && document.getElementById('main-menu') && document.getElementById('main-menu')
        .classList.contains('active')) {
        menuVideo.play().catch(function(e) { console.log('Menu video play on interaction:', e); });
    }
    if (!isAudioPlaying) {
        bgMusic.play().then(function() {
            isAudioPlaying = true;
            console.log('🎵 BGM playing continuously at low volume (15%)');
        }).catch(function(e) {
            console.log('Audio play prevented:', e);
        });
    }
}

document.addEventListener('click', playMusic);
document.addEventListener('touchstart', playMusic);
document.addEventListener('keydown', playMusic);

window.addEventListener('load', function() {
    var menuVideo = document.getElementById('menu-bg-video');
    if (menuVideo) {
        menuVideo.play().catch(function(e) { console.log('Menu video load play:', e); });
    }
    setTimeout(playMusic, 1000);
    loadPerformanceData();
    initTopology();
});

bgMusic.addEventListener('ended', function() {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(function(e) { console.log('Restart error:', e); });
});

// ============================================
// HELPER: Play story video with AUDIO
// ============================================
function playStoryVideo(videoElement) {
    if (!videoElement) return;
    videoElement.muted = false;
    videoElement.volume = 1.0;
    videoElement.play().catch(function(error) {
        console.warn('🔇 Video autoplay with sound blocked:', error);
        setTimeout(function() {
            videoElement.play().catch(function(e2) {
                console.log('Still blocked, user must interact with page.');
            });
        }, 300);
    });
}

// ============================================
// STORY FLOW FUNCTIONS (with audio)
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
    var storyVideo = document.getElementById('story-img-1');
    if (storyVideo) {
        storyVideo.currentTime = 0;
        playStoryVideo(storyVideo);
    }
    console.log('🎬 Starting story - cha1.mp4 with AUDIO');
}

function goToStory2() {
    var storyOneVideo = document.getElementById('story-img-1');
    if (storyOneVideo) {
        storyOneVideo.pause();
        storyOneVideo.currentTime = 0;
    }
    showScreen('story-2');
    var storyVideo = document.getElementById('story-img-2');
    if (storyVideo) {
        storyVideo.currentTime = 0;
        playStoryVideo(storyVideo);
    }
    console.log('📖 Going to story 2 - cha2.mp4 with AUDIO');
}

function goToGame() {
    var storyVideo = document.getElementById('story-img-2');
    if (storyVideo) {
        storyVideo.pause();
        storyVideo.currentTime = 0;
    }
    currentChallenge = challengeOrder[challengeIndex];
    if (currentChallenge === 4) {
        startIPStorySequence();
    } else {
        showMicroLearning(currentChallenge, false);
    }
}

function startIPStorySequence() {
    isIPStoryFlow = true;
    showScreen('story-ip1');
    var ipVideo1 = document.getElementById('story-ip1-video');
    if (ipVideo1) {
        ipVideo1.currentTime = 0;
        playStoryVideo(ipVideo1);
    }
    console.log('🎬 Starting IP story 1 - IP1.mp4 with AUDIO');
}

function goToIPStory2() {
    var ipVideo1 = document.getElementById('story-ip1-video');
    if (ipVideo1) {
        ipVideo1.pause();
        ipVideo1.currentTime = 0;
    }
    showScreen('story-ip2');
    var ipVideo2 = document.getElementById('story-ip2-video');
    if (ipVideo2) {
        ipVideo2.currentTime = 0;
        playStoryVideo(ipVideo2);
    }
    console.log('📖 Going to IP story 2 - IP2.mp4 with AUDIO');
}

function proceedToIPChallenge() {
    var ipVideo2 = document.getElementById('story-ip2-video');
    if (ipVideo2) {
        ipVideo2.pause();
        ipVideo2.currentTime = 0;
    }
    isIPStoryFlow = false;
    currentChallenge = 4;
    showMicroLearning(4, isPracticeMode);
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
    if (currentChallenge === 4) {
        startIPStorySequence();
    } else {
        showMicroLearning(currentChallenge, true);
    }
    console.log('📚 Practice mode started');
}

function startSpecificChallenge(challengeId) {
    isPracticeMode = false;
    lives = maxLives;
    score = 0;
    isGameOver = false;
    updateAllLives();
    updateAllScores();
    currentChallenge = challengeId;
    if (challengeId === 4) {
        startIPStorySequence();
    } else {
        showMicroLearning(challengeId, false);
    }
    console.log('🎯 Starting specific challenge:', challengeId);
}

// ============================================
// MICRO-LEARNING FUNCTIONS
// ============================================

function showMicroLearning(challengeId, isPractice) {
    learningChallengeId = challengeId;
    learningIsPractice = isPractice;

    var lesson = microLessons[challengeId];
    if (!lesson) {
        console.error('No lesson found for challenge:', challengeId);
        loadChallenge(challengeId);
        return;
    }

    document.getElementById('ml-topic').textContent = '📚 ' + lesson.topic;
    document.getElementById('ml-challenge-name').textContent = 'Challenge ' + challengeId + ': ' + challenges[
        challengeId].name;
    document.getElementById('ml-description').textContent = lesson.description;

    var pointsList = document.getElementById('ml-points');
    pointsList.innerHTML = '';
    lesson.points.forEach(function(point) {
        var li = document.createElement('li');
        li.textContent = point;
        pointsList.appendChild(li);
    });

    document.getElementById('ml-example-text').textContent = lesson.example;
    document.getElementById('ml-remember-text').textContent = lesson.remember;

    var progress = (challengeIndex / challengeOrder.length) * 100;
    document.getElementById('ml-progress-fill').style.width = progress + '%';
    document.getElementById('ml-progress-text').textContent = challengeIndex + ' / ' + challengeOrder.length;

    var badge = document.getElementById('ml-practice-badge');
    if (isPractice) {
        badge.classList.add('active');
    } else {
        badge.classList.remove('active');
    }

    if (lesson.quiz) {
        document.getElementById('ml-quiz-question').textContent = lesson.quiz.question;
        var optionsContainer = document.getElementById('ml-quiz-options');
        optionsContainer.innerHTML = '';
        lesson.quiz.options.forEach(function(opt, idx) {
            var div = document.createElement('div');
            div.className = 'ml-quiz-option';
            div.textContent = opt;
            div.dataset.index = idx;
            div.onclick = function() {
                checkQuizAnswer(this, lesson.quiz.correct);
            };
            optionsContainer.appendChild(div);
        });
    }

    var startBtn = document.getElementById('ml-start-btn');
    startBtn.disabled = false;
    startBtn.textContent = '🚀 START CHALLENGE';

    showScreen('micro-learning');
}

function checkQuizAnswer(element, correctIndex) {
    var options = document.querySelectorAll('.ml-quiz-option');
    options.forEach(function(opt) {
        opt.classList.remove('selected', 'correct', 'wrong');
        if (parseInt(opt.dataset.index) === correctIndex) {
            opt.classList.add('correct');
        }
    });

    var selected = parseInt(element.dataset.index);
    if (selected === correctIndex) {
        element.classList.add('correct');
        document.getElementById('ml-start-btn').textContent = '✅ GREAT! START CHALLENGE';
    } else {
        element.classList.add('wrong');
        document.getElementById('ml-start-btn').textContent = '❌ TRY AGAIN';
        setTimeout(function() {
            options.forEach(function(opt) {
                opt.classList.remove('correct', 'wrong', 'selected');
            });
            document.getElementById('ml-start-btn').textContent = '🚀 START CHALLENGE';
        }, 1500);
    }
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
// LOAD CHALLENGE
// ============================================

function loadChallenge(challengeId) {
    var challenge = challenges[challengeId];
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
    } else if (challenge.type === 'security') {
        showScreen('security-challenge');
        document.getElementById('security-status').innerHTML = "STATUS: " + challenge.name;
        document.querySelector('.security-title').textContent = "🔒 " + challenge.name;
        resetSecurityConfig();
        console.log('🔒 Starting Security challenge:', challengeId);
    } else if (challenge.type === 'topology') {
        showScreen('topology-challenge');
        document.getElementById('topology-status').innerHTML = "STATUS: " + challenge.name;
        document.querySelector('.topology-title').textContent = "🌐 " + challenge.name;
        resetTopology(true); // Silent reset
        console.log('🌐 Starting Topology challenge:', challengeId);
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
        if (currentChallenge === 4) {
            startIPStorySequence();
        } else {
            showMicroLearning(currentChallenge, isPracticeMode);
        }
    } else {
        showModal('🎉 You completed all challenges! Great job!', 'success', '🏆 CHAMPION!');
        goToMenu();
    }
}

// ============================================
// LIVES & SCORE
// ============================================

function updateAllLives() {
    var elements = ['lives-icons', 'ip-lives-icons', 'workgroup-lives-icons', 'router-lives-icons',
        'security-lives-icons', 'topology-lives-icons'
    ];
    elements.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            var hearts = '';
            for (var i = 0; i < lives; i++) hearts += '❤️';
            for (var i = lives; i < maxLives; i++) hearts += '🖤';
            el.textContent = hearts;
        }
    });
}

function updateAllScores() {
    var elements = ['score-display', 'ip-score-display', 'workgroup-score-display', 'router-score-display',
        'security-score-display', 'topology-score-display'
    ];
    elements.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = 'SCORE: ' + score;
    });
}

// ============================================
// LOSE LIFE
// ============================================

function loseLife() {
    if (isPracticeMode) {
        var status = document.getElementById('ip-status') ||
            document.getElementById('workgroup-status') ||
            document.getElementById('router-status') ||
            document.getElementById('security-status') ||
            document.getElementById('topology-status') ||
            document.getElementById('game-status');
        if (status) {
            status.innerHTML = "⚠️ PRACTICE MODE: No lives lost!";
            status.style.color = '#f39c12';
            setTimeout(function() {
                status.style.color = '#f1c40f';
            }, 1500);
        }
        return;
    }

    lives--;
    updateAllLives();

    var livesIcons = document.getElementById('lives-icons');
    if (livesIcons) {
        livesIcons.classList.remove('life-lost');
        void livesIcons.offsetWidth;
        livesIcons.classList.add('life-lost');
    }

    var status = document.getElementById('game-status') ||
        document.getElementById('ip-status') ||
        document.getElementById('workgroup-status') ||
        document.getElementById('router-status') ||
        document.getElementById('security-status') ||
        document.getElementById('topology-status');

    if (status) {
        status.innerHTML = "💔 LIFE LOST! " + lives + " lives remaining. Try again!";
        status.style.color = '#e74c3c';
        setTimeout(function() {
            status.style.color = '#f1c40f';
        }, 2000);
    }

    console.log('💔 Lost a life. Lives left:', lives);

    if (lives <= 0) {
        lives = 0;
        updateAllLives();
        setTimeout(function() {
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

function retryCurrentChallenge() {
    document.getElementById('game-over-modal').classList.remove('active');
    isGameOver = false;
    lives = maxLives;
    updateAllLives();
    resetCurrentChallenge();
    console.log('🔄 Retrying challenge:', currentChallenge);
}

function practiceCurrentChallenge() {
    document.getElementById('game-over-modal').classList.remove('active');
    isGameOver = false;
    isPracticeMode = true;
    lives = maxLives;
    updateAllLives();
    resetCurrentChallenge();
    var status = document.getElementById('game-status') ||
        document.getElementById('ip-status') ||
        document.getElementById('workgroup-status') ||
        document.getElementById('router-status') ||
        document.getElementById('security-status') ||
        document.getElementById('topology-status');
    if (status) {
        status.innerHTML = "📚 PRACTICE MODE - No lives lost!";
        status.style.color = '#f39c12';
    }
    console.log('📚 Practice mode for challenge:', currentChallenge);
}

function resetCurrentChallenge() {
    closeModal(); // close any open modal
    var challenge = challenges[currentChallenge];
    if (!challenge) return;

    switch (challenge.type) {
        case 'rj45':
            resetGameState();
            initWirePalette();
            document.getElementById('game-status').innerHTML = "STATUS: WIRES RESET - SELECT SCHEMATIC";
            document.getElementById('pinout-list').classList.add('hidden');
            currentTargetStandard = null;
            document.querySelectorAll('.standard-btn').forEach(function(b) { b.classList.remove('selected'); });
            break;
        case 'ip':
            resetIPConfig();
            document.getElementById('ip-status').innerHTML = "STATUS: CONFIGURE IP ADDRESS SETTINGS";
            break;
        case 'workgroup':
            resetWorkgroupConfig();
            document.getElementById('workgroup-status').innerHTML = "STATUS: CONFIGURE WORKGROUP SETTINGS";
            break;
        case 'router':
            resetRouterConfig();
            document.getElementById('router-status').innerHTML = "STATUS: CONFIGURE ROUTER SETTINGS";
            break;
        case 'security':
            resetSecurityConfig();
            document.getElementById('security-status').innerHTML = "STATUS: CONFIGURE SECURITY SETTINGS";
            break;
        case 'topology':
            resetTopology(true); // silent reset
            document.getElementById('topology-status').innerHTML = "STATUS: CONNECT THE DEVICES";
            break;
        default:
            break;
    }
    document.querySelectorAll('.config-input, .workgroup-input, .router-input, .security-input').forEach(function(el) {
        el.classList.remove('correct', 'wrong');
    });
    console.log('🔄 Challenge reset:', currentChallenge);
}

// ============================================
// RJ45 FUNCTIONS
// ============================================

function resetGameState() {
    currentTargetStandard = null;
    document.querySelectorAll('.standard-btn').forEach(function(b) { b.classList.remove('selected'); });
    document.querySelectorAll('.drop-zone').forEach(function(zone) {
        var wire = zone.querySelector('.drag-wire');
        if (wire) wire.remove();
    });
}

function initWirePalette() {
    var container = document.getElementById('wire-source-container');
    container.innerHTML = '';
    var shuffled = wireDefinitions.slice().sort(function() { return Math.random() - 0.5; });
    shuffled.forEach(function(wire) {
        var el = document.createElement('div');
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
    var zone = e.target.closest('.drop-zone');
    if (!zone) return;
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    var existing = zone.querySelector('.drag-wire');
    if (existing) {
        returnWireToPalette(existing);
    }
    try {
        var wireData = JSON.parse(e.dataTransfer.getData('text/plain'));
        var sourceEl = document.querySelector('.drag-wire[data-name="' + wireData.name + '"]');
        if (sourceEl && sourceEl.parentElement && sourceEl.parentElement.id === 'wire-source-container') {
            sourceEl.remove();
        }
        var newWire = document.createElement('div');
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
    var container = document.getElementById('wire-source-container');
    var wireName = wireElement.dataset.name;
    var wireDef = wireDefinitions.find(function(w) { return w.name === wireName; });
    if (wireDef) {
        var newWire = document.createElement('div');
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
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    currentTargetStandard = std;
    document.querySelectorAll('.standard-btn').forEach(function(b) { b.classList.remove('selected'); });
    if (std === 'T568A') {
        document.querySelectorAll('.standard-btn')[0].classList.add('selected');
    } else {
        document.querySelectorAll('.standard-btn')[1].classList.add('selected');
    }
    if (isPracticeMode) {
        var list = document.getElementById('pinout-list');
        list.innerHTML = '<b>' + std + ' Sequence:</b><ol type="1" style="margin-left: 15px;">' +
            standards[std].map(function(w) { return '<li>' + w + '</li>'; }).join('') + '</ol>';
        list.classList.remove('hidden');
    }
    document.getElementById('game-status').innerHTML = 'STATUS: TARGET SET TO ' + std;
}

function crimpConnector() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    if (!currentTargetStandard) {
        showModal('Please select a schematic (T568A or T568B) target first!', 'warning', '⚠️ SCHEMATIC REQUIRED');
        return;
    }
    var dropZones = document.querySelectorAll('.drop-zone');
    var targetSequence = standards[currentTargetStandard];
    var isCorrect = true;
    var filledSlots = 0;
    var wrongPin = -1;
    var emptyPins = [];
    dropZones.forEach(function(zone, idx) {
        var placedWire = zone.querySelector('.drag-wire');
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
        var errorMsg = '';
        if (emptyPins.length > 0) {
            errorMsg = '❌ Empty pins: ' + emptyPins.join(', ') + '. You crimped with ' + filledSlots + '/8 wires!';
        } else if (wrongPin > 0) {
            errorMsg = '❌ Pin ' + wrongPin + ' has the wrong wire. Check the correct sequence!';
        }
        errorMsg += '\n💔 -1 Life!';
        showModal(errorMsg, 'error', '❌ CRIMP FAILED');
        highlightCorrectWires(false);
        return;
    }
    if (isCorrect && filledSlots === 8) {
        score += 100;
        updateAllScores();
        document.getElementById('game-status').innerHTML = "STATUS: ✅ SUCCESS! WIRED CORRECTLY! +100 POINTS";
        highlightCorrectWires(true);
        trackChallengeCompletion(currentChallenge, true);
        setTimeout(function() {
            showSuccessScreen();
        }, 800);
    }
}

function highlightCorrectWires(success) {
    var dropZones = document.querySelectorAll('.drop-zone');
    var targetSequence = standards[currentTargetStandard];
    dropZones.forEach(function(zone, idx) {
        var wire = zone.querySelector('.drag-wire');
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
    setTimeout(function() {
        document.querySelectorAll('.drop-zone .drag-wire').forEach(function(wire) {
            wire.style.border = '1px solid #000';
            wire.style.boxShadow = 'none';
        });
    }, 3000);
}

function resetWires() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    document.querySelectorAll('.drop-zone').forEach(function(zone) {
        var wire = zone.querySelector('.drag-wire');
        if (wire) wire.remove();
    });
    initWirePalette();
    document.getElementById('game-status').innerHTML = "STATUS: WIRES RESET";
    document.querySelectorAll('.drop-zone .drag-wire').forEach(function(wire) {
        wire.style.border = '1px solid #000';
        wire.style.boxShadow = 'none';
    });
    showModal('🔄 All wires have been reset!', 'info', '🔄 RESET COMPLETE');
}

// ============================================
// IP FUNCTIONS
// ============================================

function checkIPConfig() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    var ipAddress = document.getElementById('ip-address').value.trim();
    var subnetMask = document.getElementById('subnet-mask').value.trim();
    var defaultGateway = document.getElementById('default-gateway').value.trim();
    var dnsServer = document.getElementById('dns-server').value.trim();
    var ipInput = document.getElementById('ip-address');
    var subnetInput = document.getElementById('subnet-mask');
    var gatewayInput = document.getElementById('default-gateway');
    var dnsInput = document.getElementById('dns-server');
    if (!ipAddress || !subnetMask || !defaultGateway || !dnsServer) {
        showModal('❌ Please fill in all fields before verifying!', 'warning', '⚠️ INCOMPLETE');
        return;
    }
    var isCorrect = true;
    var errors = [];
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
        trackChallengeCompletion(currentChallenge, true);
        setTimeout(function() {
            showSuccessScreen();
        }, 800);
    } else {
        loseLife();
        document.getElementById('ip-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
        document.getElementById('ip-status').style.color = '#e74c3c';
        showModal('❌ Wrong values: ' + errors.join(', ') + '\n💔 -1 Life!', 'error', '❌ CONFIG FAILED');
        trackChallengeCompletion(currentChallenge, false);
    }
}

function resetIPConfig() {
    ['ip-address', 'subnet-mask', 'default-gateway', 'dns-server'].forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.classList.remove('correct', 'wrong');
        }
    });
    var status = document.getElementById('ip-status');
    if (status) {
        status.innerHTML = "STATUS: CONFIGURE IP ADDRESS SETTINGS";
        status.style.color = '#f1c40f';
    }
}

// ============================================
// WORKGROUP FUNCTIONS
// ============================================

function checkWorkgroupConfig() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    var computerName = document.getElementById('computer-name').value.trim();
    var workgroup = document.getElementById('workgroup-name').value.trim();
    var networkDiscovery = document.getElementById('network-discovery').checked;
    var fileSharing = document.getElementById('file-sharing').checked;
    var passwordProtection = document.getElementById('password-protection').checked;
    var nameInput = document.getElementById('computer-name');
    var workgroupInput = document.getElementById('workgroup-name');
    if (!computerName || !workgroup) {
        showModal('❌ Please fill in Computer Name and Workgroup!', 'warning', '⚠️ INCOMPLETE');
        return;
    }
    var isCorrect = true;
    var errors = [];
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
        document.getElementById('workgroup-status').innerHTML =
            "✅ SUCCESS! WORKGROUP CONFIGURATION CORRECT! +100 POINTS";
        document.getElementById('workgroup-status').style.color = '#2ecc71';
        trackChallengeCompletion(currentChallenge, true);
        setTimeout(function() {
            showSuccessScreen();
        }, 800);
    } else {
        loseLife();
        document.getElementById('workgroup-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
        document.getElementById('workgroup-status').style.color = '#e74c3c';
        showModal('❌ Wrong values: ' + errors.join(', ') + '\n💔 -1 Life!', 'error', '❌ CONFIG FAILED');
        trackChallengeCompletion(currentChallenge, false);
    }
}

function resetWorkgroupConfig() {
    ['computer-name', 'workgroup-name'].forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.classList.remove('correct', 'wrong');
        }
    });
    ['network-discovery', 'file-sharing', 'password-protection'].forEach(function(id) {
        var checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });
    var status = document.getElementById('workgroup-status');
    if (status) {
        status.innerHTML = "STATUS: CONFIGURE WORKGROUP SETTINGS";
        status.style.color = '#f1c40f';
    }
}

// ============================================
// ROUTER FUNCTIONS
// ============================================

function checkRouterConfig() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    var ssid = document.getElementById('router-ssid').value.trim();
    var security = document.getElementById('router-security').value;
    var lanIp = document.getElementById('router-lan').value.trim();
    var ssidInput = document.getElementById('router-ssid');
    var securityInput = document.getElementById('router-security');
    var lanInput = document.getElementById('router-lan');
    if (!ssid || !security || !lanIp) {
        showModal('❌ Please fill in all router fields!', 'warning', '⚠️ INCOMPLETE');
        return;
    }
    var isCorrect = true;
    var errors = [];
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
        trackChallengeCompletion(currentChallenge, true);
        setTimeout(function() {
            showSuccessScreen();
        }, 800);
    } else {
        loseLife();
        document.getElementById('router-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
        document.getElementById('router-status').style.color = '#e74c3c';
        showModal('❌ Wrong values: ' + errors.join(', ') + '\n💔 -1 Life!', 'error', '❌ CONFIG FAILED');
        trackChallengeCompletion(currentChallenge, false);
    }
}

function resetRouterConfig() {
    ['router-ssid', 'router-lan'].forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.classList.remove('correct', 'wrong');
        }
    });
    var security = document.getElementById('router-security');
    if (security) security.value = '';
    var pingInput = document.getElementById('ping-ip');
    if (pingInput) pingInput.value = '';
    var result = document.getElementById('ping-result');
    if (result) result.innerHTML = '<span class="info">📡 Ready to ping...</span>';
    var status = document.getElementById('router-status');
    if (status) {
        status.innerHTML = "STATUS: CONFIGURE ROUTER SETTINGS";
        status.style.color = '#f1c40f';
    }
}

function runPingTest() {
    var pingIp = document.getElementById('ping-ip').value.trim();
    var result = document.getElementById('ping-result');
    if (!pingIp) {
        result.innerHTML = '<span class="fail">❌ Please enter an IP address to ping!</span>';
        return;
    }
    result.innerHTML = '<span class="info">⏳ Pinging ' + pingIp + '...</span>';
    setTimeout(function() {
        if (pingIp === correctRouterConfig.pingIp) {
            result.innerHTML =
                '<span class="success">✅ Reply from ' + pingIp +
                ': bytes=32 time=1ms TTL=64</span><br>' +
                '<span class="success">✅ Reply from ' + pingIp +
                ': bytes=32 time=1ms TTL=64</span><br>' +
                '<span class="success">✅ Reply from ' + pingIp +
                ': bytes=32 time=2ms TTL=64</span><br>' +
                '<span class="success">✅ Reply from ' + pingIp +
                ': bytes=32 time=1ms TTL=64</span><br>' +
                '<span class="info">📊 Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)</span>';
            document.getElementById('router-status').innerHTML = "✅ PING SUCCESSFUL! Network is stable!";
            document.getElementById('router-status').style.color = '#2ecc71';
        } else {
            result.innerHTML =
                '<span class="fail">❌ Request timed out.</span><br>' +
                '<span class="fail">❌ Request timed out.</span><br>' +
                '<span class="fail">❌ Request timed out.</span><br>' +
                '<span class="fail">❌ Request timed out.</span><br>' +
                '<span class="info">📊 Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)</span>';
            document.getElementById('router-status').innerHTML = "❌ PING FAILED! Check network connectivity!";
            document.getElementById('router-status').style.color = '#e74c3c';
        }
    }, 1500);
}

// ============================================
// SECURITY FUNCTIONS
// ============================================

function resetSecurityConfig() {
    ['security-firewall', 'security-wpa2', 'security-mac', 'security-updates'].forEach(function(id) {
        var cb = document.getElementById(id);
        if (cb) {
            cb.checked = false;
            updateSecurityLabel(id);
        }
    });
    var password = document.getElementById('security-password');
    if (password) {
        password.value = '';
        password.classList.remove('correct', 'wrong');
    }
    var status = document.getElementById('security-status');
    if (status) {
        status.innerHTML = "STATUS: CONFIGURE SECURITY SETTINGS";
        status.style.color = '#f1c40f';
    }
}

function updateSecurityLabel(id) {
    var cb = document.getElementById(id);
    var label = document.getElementById(id + '-label');
    if (cb && label) {
        if (cb.checked) {
            label.textContent = '✅ ENABLED';
            label.style.color = '#2ecc71';
        } else {
            label.textContent = '❌ DISABLED';
            label.style.color = '#e74c3c';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    ['security-firewall', 'security-wpa2', 'security-mac', 'security-updates'].forEach(function(id) {
        var cb = document.getElementById(id);
        if (cb) {
            cb.addEventListener('change', function() {
                updateSecurityLabel(id);
            });
        }
    });
    var password = document.getElementById('security-password');
    if (password) {
        password.addEventListener('input', function() {
            if (this.value.length >= 8) {
                this.classList.add('correct');
                this.classList.remove('wrong');
            } else if (this.value.length > 0) {
                this.classList.add('wrong');
                this.classList.remove('correct');
            } else {
                this.classList.remove('correct', 'wrong');
            }
        });
    }
});

function checkSecurityConfig() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }

    var firewall = document.getElementById('security-firewall').checked;
    var wpa2 = document.getElementById('security-wpa2').checked;
    var mac = document.getElementById('security-mac').checked;
    var updates = document.getElementById('security-updates').checked;
    var password = document.getElementById('security-password').value.trim();

    var errors = [];

    if (!firewall) errors.push('Firewall');
    if (!wpa2) errors.push('WPA2 Encryption');
    if (!mac) errors.push('MAC Filtering');
    if (!updates) errors.push('Auto Updates');
    if (password.length < 8) errors.push('Admin Password (min 8 chars)');

    if (errors.length === 0) {
        score += 100;
        updateAllScores();
        document.getElementById('security-status').innerHTML = "✅ SUCCESS! SECURITY CONFIGURATION CORRECT! +100 POINTS";
        document.getElementById('security-status').style.color = '#2ecc71';
        trackChallengeCompletion(currentChallenge, true);
        setTimeout(function() {
            showSuccessScreen();
        }, 800);
    } else {
        loseLife();
        document.getElementById('security-status').innerHTML = "❌ INCORRECT: " + errors.join(', ');
        document.getElementById('security-status').style.color = '#e74c3c';
        showModal('❌ Wrong settings: ' + errors.join(', ') + '\n💔 -1 Life!', 'error', '❌ SECURITY CONFIG FAILED');
        trackChallengeCompletion(currentChallenge, false);
    }
}

// ============================================
// TOPOLOGY FUNCTIONS - FIXED: checks if main menu is active
// ============================================

function initTopology() {
    topologyConnections = {};
    topologySelected = null;
    topologyCurrentConnections = 0;
    var deviceIds = ['router', 'switch1', 'switch2', 'switch3', 'pc1', 'pc2', 'pc3'];
    deviceIds.forEach(function(id) {
        topologyConnections[id] = [];
        updateConnCount(id);
    });
    var svg = document.getElementById('topology-svg');
    svg.innerHTML = '';
    document.querySelectorAll('.device-node').forEach(function(el) {
        el.classList.remove('connected', 'selected', 'wrong');
    });
    document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
    document.getElementById('topology-status').style.color = '#f1c40f';
}

function resetTopology(silent) {
    silent = silent || false;
    
    // CRITICAL FIX: If main menu is active, ALWAYS do silent reset
    var mainMenu = document.getElementById('main-menu');
    if (mainMenu && mainMenu.classList.contains('active')) {
        silent = true;
    }
    
    if (isGameOver && !silent) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }
    initTopology();
    if (!silent) {
        showModal('🔄 Topology reset! Start connecting devices.', 'info', '🔄 RESET COMPLETE');
    }
    console.log('🔄 Topology reset (silent=' + silent + ')');
}

function selectDevice(deviceId) {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }

    var el = document.querySelector('.device-node[data-id="' + deviceId + '"]');
    if (!el) return;

    var maxConn = 3;
    if (deviceId === 'router') maxConn = 3;
    else if (deviceId.startsWith('switch')) maxConn = 2;
    else maxConn = 1;

    if (topologyConnections[deviceId] && topologyConnections[deviceId].length >= maxConn) {
        showModal('⚠️ This device already has the maximum number of connections!', 'warning', '⚠️ MAX CONNECTIONS');
        return;
    }

    if (topologySelected === null) {
        topologySelected = deviceId;
        el.classList.add('selected');
        document.getElementById('topology-status').innerHTML = "STATUS: SELECTED " + deviceId.toUpperCase() +
            " - Click another device to connect";
        document.getElementById('topology-status').style.color = '#f1c40f';
        return;
    }

    if (topologySelected === deviceId) {
        el.classList.remove('selected');
        topologySelected = null;
        document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
        document.getElementById('topology-status').style.color = '#f1c40f';
        return;
    }

    var firstId = topologySelected;
    var firstEl = document.querySelector('.device-node[data-id="' + firstId + '"]');
    var secondEl = el;

    if (topologyConnections[firstId].indexOf(deviceId) !== -1) {
        showModal('⚠️ These devices are already connected!', 'warning', '⚠️ ALREADY CONNECTED');
        firstEl.classList.remove('selected');
        topologySelected = null;
        document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
        document.getElementById('topology-status').style.color = '#f1c40f';
        return;
    }

    var isCorrect = false;
    if (topologyCorrect[firstId] && topologyCorrect[firstId].indexOf(deviceId) !== -1) {
        isCorrect = true;
    } else if (topologyCorrect[deviceId] && topologyCorrect[deviceId].indexOf(firstId) !== -1) {
        isCorrect = true;
    }

    if (isCorrect) {
        topologyConnections[firstId].push(deviceId);
        topologyConnections[deviceId].push(firstId);
        topologyCurrentConnections++;

        drawTopologyLine(firstId, deviceId, '#2ecc71');

        firstEl.classList.remove('selected');
        firstEl.classList.add('connected');
        secondEl.classList.add('connected');

        updateConnCount(firstId);
        updateConnCount(deviceId);

        topologySelected = null;
        document.getElementById('topology-status').innerHTML = "STATUS: ✅ CONNECTION CORRECT! (" + topologyCurrentConnections +
            "/6)";
        document.getElementById('topology-status').style.color = '#2ecc71';

        if (topologyCurrentConnections >= 6) {
            setTimeout(function() {
                verifyTopology();
            }, 500);
        }
    } else {
        firstEl.classList.remove('selected');
        firstEl.classList.add('wrong');
        secondEl.classList.add('wrong');
        topologySelected = null;

        drawTopologyLine(firstId, deviceId, '#e74c3c');

        loseLife();
        document.getElementById('topology-status').innerHTML = "STATUS: ❌ WRONG CONNECTION! -1 Life";
        document.getElementById('topology-status').style.color = '#e74c3c';

        setTimeout(function() {
            firstEl.classList.remove('wrong');
            secondEl.classList.remove('wrong');
            var svg = document.getElementById('topology-svg');
            var lines = svg.querySelectorAll('line');
            lines.forEach(function(line) {
                if (line.getAttribute('data-wrong') === 'true') {
                    line.remove();
                }
            });
            document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
            document.getElementById('topology-status').style.color = '#f1c40f';
        }, 1200);
    }
}

function drawTopologyLine(device1, device2, color) {
    var svg = document.getElementById('topology-svg');
    var el1 = document.querySelector('.device-node[data-id="' + device1 + '"]');
    var el2 = document.querySelector('.device-node[data-id="' + device2 + '"]');
    if (!el1 || !el2) return;

    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    var container = document.querySelector('.topology-canvas');
    var containerRect = container.getBoundingClientRect();

    var x1 = rect1.left + rect1.width / 2 - containerRect.left;
    var y1 = rect1.top + rect1.height / 2 - containerRect.top;
    var x2 = rect2.left + rect2.width / 2 - containerRect.left;
    var y2 = rect2.top + rect2.height / 2 - containerRect.top;

    var existing = svg.querySelectorAll('line');
    var exists = false;
    existing.forEach(function(line) {
        var d1 = line.getAttribute('data-device1');
        var d2 = line.getAttribute('data-device2');
        if ((d1 === device1 && d2 === device2) || (d1 === device2 && d2 === device1)) {
            exists = true;
        }
    });
    if (exists && color !== '#e74c3c') return;

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', color === '#e74c3c' ? '4' : '3');
    line.setAttribute('data-device1', device1);
    line.setAttribute('data-device2', device2);
    if (color === '#e74c3c') {
        line.setAttribute('data-wrong', 'true');
        line.setAttribute('stroke-dasharray', '8,4');
    } else {
        line.setAttribute('data-wrong', 'false');
    }
    svg.appendChild(line);
}

function updateConnCount(deviceId) {
    var el = document.getElementById('conn-' + deviceId);
    if (el) {
        el.textContent = topologyConnections[deviceId] ? topologyConnections[deviceId].length : 0;
    }
}

function verifyTopology() {
    if (isGameOver) {
        showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
        return;
    }

    var total = 0;
    for (var id in topologyConnections) {
        total += topologyConnections[id].length;
    }
    total = total / 2;

    if (total < 6) {
        showModal('❌ You need to make all 6 connections! (' + total + '/6)', 'warning', '⚠️ INCOMPLETE');
        return;
    }

    var allCorrect = true;
    for (var id in topologyConnections) {
        var conns = topologyConnections[id];
        var correct = topologyCorrect[id];
        if (!correct) continue;
        for (var i = 0; i < conns.length; i++) {
            if (correct.indexOf(conns[i]) === -1) {
                allCorrect = false;
                break;
            }
        }
        if (!allCorrect) break;
    }

    if (allCorrect && total >= 6) {
        score += 100;
        updateAllScores();
        document.getElementById('topology-status').innerHTML = "✅ SUCCESS! ALL DEVICES CONNECTED CORRECTLY! +100 POINTS";
        document.getElementById('topology-status').style.color = '#2ecc71';
        trackChallengeCompletion(currentChallenge, true);
        setTimeout(function() {
            showSuccessScreen();
        }, 800);
    } else {
        loseLife();
        document.getElementById('topology-status').innerHTML = "❌ INCORRECT TOPOLOGY! Some connections are wrong.";
        document.getElementById('topology-status').style.color = '#e74c3c';
        showModal('❌ Incorrect topology! Check your connections.\n💔 -1 Life!', 'error', '❌ TOPOLOGY FAILED');
        trackChallengeCompletion(currentChallenge, false);
    }
}

// ============================================
// SUCCESS SCREEN
// ============================================

function showSuccessScreen() {
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-lives').textContent = lives;
    var successVideo = document.getElementById('success-video');
    if (successVideo) {
        successVideo.currentTime = 0;
        successVideo.play().catch(function(error) {
            console.warn('RJ45 thank-you video autoplay blocked:', error);
        });
    }
    var nextIdx = challengeIndex + 1;
    if (nextIdx < challengeOrder.length) {
        var nextChallengeId = challengeOrder[nextIdx];
        var nextType = challenges[nextChallengeId].type;
        var typeLabels = {
            'rj45': '🔌 RJ45',
            'ip': '💻 IP CONFIG',
            'workgroup': '🏢 WORKGROUP',
            'router': '📶 ROUTER',
            'security': '🔒 SECURITY',
            'topology': '🌐 TOPOLOGY'
        };
        document.getElementById('next-btn').textContent = '➜ ' + (typeLabels[nextType] || 'NEXT');
    } else {
        document.getElementById('next-btn').textContent = '🏆 FINISH ➜';
    }
    showScreen('success-screen');
}

// ============================================
// PERFORMANCE TRACKING
// ============================================

function trackChallengeCompletion(challengeId, success) {
    var key = challengeId.toString();
    if (!performanceData.attempts[key]) {
        performanceData.attempts[key] = 0;
    }
    performanceData.attempts[key]++;
    performanceData.totalAttempts++;
    if (success) {
        performanceData.completed.add(key);
        performanceData.scores[key] = (performanceData.scores[key] || 0) + 100;
        performanceData.totalScore += 100;
    }
    var completed = performanceData.completed.size;
    var attempted = Object.keys(performanceData.attempts).length;
    performanceData.successRate = attempted > 0 ? Math.round((completed / attempted) * 100) : 0;
    savePerformanceData();
    updateDashboard();
}

function savePerformanceData() {
    try {
        localStorage.setItem('connected_performance', JSON.stringify({
            completed: Array.from(performanceData.completed),
            scores: performanceData.scores,
            attempts: performanceData.attempts,
            totalScore: performanceData.totalScore,
            totalAttempts: performanceData.totalAttempts,
            successRate: performanceData.successRate
        }));
    } catch (e) { console.log(e); }
}

function loadPerformanceData() {
    try {
        var data = localStorage.getItem('connected_performance');
        if (data) {
            var parsed = JSON.parse(data);
            performanceData.completed = new Set(parsed.completed || []);
            performanceData.scores = parsed.scores || {};
            performanceData.attempts = parsed.attempts || {};
            performanceData.totalScore = parsed.totalScore || 0;
            performanceData.totalAttempts = parsed.totalAttempts || 0;
            performanceData.successRate = parsed.successRate || 0;
        }
    } catch (e) { console.log(e); }
}

function updateDashboard() {
    document.getElementById('stat-completed').textContent = performanceData.completed.size;
    document.getElementById('stat-total-score').textContent = performanceData.totalScore;
    document.getElementById('stat-attempts').textContent = performanceData.totalAttempts;
    document.getElementById('stat-success-rate').textContent = performanceData.successRate + '%';
    var container = document.getElementById('challenge-results');
    container.innerHTML = '';
    for (var i = 1; i <= 8; i++) {
        var item = document.createElement('div');
        item.className = 'result-item';
        var completed = performanceData.completed.has(i.toString());
        var attempts = performanceData.attempts[i] || 0;
        if (completed) {
            item.classList.add('completed');
        } else if (attempts > 0) {
            item.classList.add('failed');
        }
        var name = document.createElement('span');
        name.className = 'name';
        name.textContent = challenges[i].name;
        var status = document.createElement('span');
        status.className = 'status';
        if (completed) {
            status.textContent = '✅ PASS';
            status.classList.add('pass');
        } else if (attempts > 0) {
            status.textContent = '❌ FAIL';
            status.classList.add('fail');
        } else {
            status.textContent = '⏳ PENDING';
            status.classList.add('pending');
        }
        item.appendChild(name);
        item.appendChild(status);
        container.appendChild(item);
    }
}

function updateChallengeBadges() {
    document.querySelectorAll('.challenge-item').forEach(function(item) {
        var id = item.dataset.id;
        if (performanceData.completed.has(id)) {
            if (!item.querySelector('.completed-badge')) {
                var badge = document.createElement('span');
                badge.className = 'completed-badge';
                badge.textContent = '✓';
                item.appendChild(badge);
            }
        }
    });
}

// ============================================
// MODAL FUNCTIONS - FIXED: checks if main menu is active
// ============================================

function showModal(message, type, title) {
    type = type || 'warning';
    
    // CRITICAL FIX: NEVER show modal if main menu is active
    var mainMenu = document.getElementById('main-menu');
    if (mainMenu && mainMenu.classList.contains('active')) {
        console.log('🔇 Modal blocked: Main menu is active');
        return;
    }
    
    var modal = document.getElementById('custom-modal');
    var icon = document.getElementById('modal-icon');
    var titleEl = document.getElementById('modal-title');
    var messageEl = document.getElementById('modal-message');
    var titles = { error: '❌ ERROR', success: '✅ SUCCESS', warning: '⚠️ NOTICE', info: 'ℹ️ INFO' };
    var icons = { error: '❌', success: '✅', warning: '⚠️', info: 'ℹ️' };
    icon.textContent = icons[type] || icons.warning;
    titleEl.textContent = title || titles[type] || titles.warning;
    messageEl.textContent = message;
    modal.className = 'modal-overlay';
    modal.classList.add('modal-' + type);
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
    showModal('Are you sure you want to go back to the main menu? Your progress will be lost.', 'warning',
        '⚠️ CONFIRM');
    var origClose = closeModal;
    closeModal = function() {
        origClose();
        goToMenu();
    };
}

// ============================================
// SCREEN FUNCTIONS - FIXED
// ============================================

function showScreen(screenId) {
    // CLOSE ANY OPEN MODAL IMMEDIATELY
    closeModal();

    var successVideo = document.getElementById('success-video');
    if (successVideo && screenId !== 'success-screen') {
        successVideo.pause();
        successVideo.currentTime = 0;
    }

    var menuVideo = document.getElementById('menu-bg-video');
    var story1 = document.getElementById('story-img-1');
    var story2 = document.getElementById('story-img-2');
    var ipStory1 = document.getElementById('story-ip1-video');
    var ipStory2 = document.getElementById('story-ip2-video');

    if (screenId === 'main-menu') {
        if (menuVideo) {
            menuVideo.muted = false;
            menuVideo.play().catch(function(e) { console.log('Menu video play:', e); });
        }
        bgMusic.volume = 0.15;
        if (isAudioPlaying) {
            bgMusic.play().catch(function(e) { console.log('Menu bgMusic play:', e); });
        }
    } else {
        if (menuVideo) {
            menuVideo.pause();
        }
        if (screenId === 'story-1' || screenId === 'story-2' ||
            screenId === 'story-ip1' || screenId === 'story-ip2') {
            bgMusic.volume = 0.05;
        } else {
            bgMusic.volume = 0.08;
        }
        if (isAudioPlaying) {
            bgMusic.play().catch(function(e) { console.log('BGM continues:', e); });
        }
    }

    if (screenId !== 'story-1' && story1) { story1.pause();
        story1.currentTime = 0; }
    if (screenId !== 'story-2' && story2) { story2.pause();
        story2.currentTime = 0; }
    if (screenId !== 'story-ip1' && ipStory1) { ipStory1.pause();
        ipStory1.currentTime = 0; }
    if (screenId !== 'story-ip2' && ipStory2) { ipStory2.pause();
        ipStory2.currentTime = 0; }

    document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
    });
    var targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    console.log('📺 Showing screen:', screenId, '| BGM volume:', bgMusic.volume);
}

function goToMenu() {
    closeModal(); // Close any modal first

    var story1 = document.getElementById('story-img-1');
    var story2 = document.getElementById('story-img-2');
    var ipStory1 = document.getElementById('story-ip1-video');
    var ipStory2 = document.getElementById('story-ip2-video');
    if (story1) { story1.pause();
        story1.currentTime = 0; }
    if (story2) { story2.pause();
        story2.currentTime = 0; }
    if (ipStory1) { ipStory1.pause();
        ipStory1.currentTime = 0; }
    if (ipStory2) { ipStory2.pause();
        ipStory2.currentTime = 0; }

    showScreen('main-menu');
    resetGameState();
    resetIPConfig();
    resetWorkgroupConfig();
    resetRouterConfig();
    resetSecurityConfig();
    resetTopology(true); // Silent reset
    document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
    document.getElementById('pinout-list').classList.add('hidden');
    lives = maxLives;
    challengeIndex = 0;
    isPracticeMode = false;
    updateAllLives();
    isGameOver = false;
    loadPerformanceData();
    bgMusic.volume = 0.15;
    console.log('🏠 Returned to menu');
}

function showChallengeSelect() {
    showScreen('challenge-select');
    updateChallengeBadges();
    console.log('📋 Showing challenge select');
}

function showDashboard() {
    showScreen('dashboard');
    updateDashboard();
    console.log('📊 Showing dashboard');
}

// ============================================
// INIT
// ============================================

console.log('🎮 ConnectED Game Loaded!');
console.log('🔊 BGM plays continuously. Story videos have AUDIO!');
console.log('🌐 Network Topology is a NEW UNIQUE challenge!');
console.log('✅ On failure: stay in challenge, just lose a life.');
console.log('✅ On Game Over: RETRY → same challenge, PRACTICE → same challenge.');
console.log('✅ Challenge select shows ✓ badges only on completed challenges.');
console.log('🔇 Modal is BLOCKED on main menu screen.');
initWirePalette();
initTopology();
updateAllLives();
updateAllScores();
loadPerformanceData();
var initMenuVideo = document.getElementById('menu-bg-video');
if (initMenuVideo) {
    initMenuVideo.play().catch(function(e) { console.log('Init video play:', e); });
}