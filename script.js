// ============================================
        // ConnectED - COMPLETE GAME SCRIPT
        // NEW: Network Topology Challenge (Challenge 5)
        // ============================================

        // ===== GAME VARIABLES =====
        var currentTargetStandard = null;
        var isPracticeMode = false;
        var lives = 5;
        var maxLives = 5;
        var score = 0;
        var currentChallenge = 1;
        var totalChallenges = 9;
        var isGameOver = false;
        var isAudioPlaying = false;
        var modalTimeout = null;
        var challengeOrder = [1, 4, 9, 6, 7, 2, 5, 3, 8];
        var challengeIndex = 0;
        var learningChallengeId = null;
        var learningIsPractice = false;
        var isIPStoryFlow = false;
        var fileShareCompleted = false;
        var quizQuestionIndex = 0;
        var quizScore = 0;
        var quizOnlyMode = false;
        var quizQuestionLimit = 3;
        var modalCloseAction = null;

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
        // Challenge 5 is now 'topology'
        var challenges = {
            1: { name: 'RJ45 Crimping - T568B', hint: 'Drag wires to correct pins in T568B order', type: 'rj45' },
            2: { name: 'Straight-Through Cable', hint: 'Both ends use T568B standard', type: 'rj45' },
            3: { name: 'Crossover Cable', hint: 'Drag wires into T568A on one end and T568B on the other', type: 'crossover' },
            4: { name: 'IP Configuration', hint: 'Configure PC1 with correct IP settings', type: 'ip' },
            9: { name: 'Find IP Address Using CMD', hint: 'Type ipconfig and read the IPv4 address', type: 'cmd-ip' },
            5: { name: 'Network Topology', hint: 'Connect devices to build a working network', type: 'topology' },
            6: { name: 'Workgroup & Sharing Setup', hint: 'Configure computer name, workgroup and sharing', type: 'workgroup' },
            7: { name: 'Router & Connectivity Testing', hint: 'Configure SSID, security and test ping', type: 'router' },
            8: { name: 'Network Security', hint: 'Enable firewall, WPA2, MAC filtering, updates and set admin password', type: 'security' }
        };

        var challengeQuizQuestions = {
            1: [
                { question: 'Which TIA/EIA standard is used for this RJ45 module?', options: ['T568A', 'T568B', 'WPA2', 'IPv6'], correct: 1 },
                { question: 'Which color is pin 1 in T568B?', options: ['Green/White', 'Orange/White', 'Blue', 'Brown'], correct: 1 },
                { question: 'How many conductors are terminated in an RJ45 plug?', options: ['4', '6', '8', '10'], correct: 2 },
                { question: 'What tool attaches an RJ45 plug to the cable?', options: ['Punch-down tool', 'Crimping tool', 'Multimeter', 'Cable tester only'], correct: 1 },
                { question: 'What should be checked before crimping?', options: ['Wire sequence', 'Monitor brightness', 'IP gateway', 'Wi-Fi password'], correct: 0 },
                { question: 'Which pair is on pins 3 and 6 in T568B?', options: ['Blue pair', 'Green pair', 'Orange pair', 'Brown pair'], correct: 1 },
                { question: 'What does a cable tester check?', options: ['Continuity and pinout', 'Internet speed only', 'Password strength', 'Screen resolution'], correct: 0 },
                { question: 'What protects each Ethernet pair from interference?', options: ['Twisting', 'Painting', 'DHCP', 'Routing'], correct: 0 },
                { question: 'What is the recommended jacket strip length?', options: ['Only enough to expose pairs', 'One meter', 'The entire cable', 'No exposed wires'], correct: 0 },
                { question: 'A wrong pinout can cause what result?', options: ['Link failure', 'More bandwidth', 'Automatic encryption', 'A stronger signal'], correct: 0 }
            ],
            9: [
                { question: 'Which command displays Windows IP configuration?', options: ['ipconfig', 'ping', 'format', 'mkdir'], correct: 0 },
                { question: 'Which value identifies the computer on the local network?', options: ['IPv4 Address', 'Subnet Mask', 'Default Gateway', 'DNS Suffix'], correct: 0 },
                { question: 'What IPv4 address is shown in this challenge?', options: ['192.168.136.128', '255.255.255.0', '192.168.136.2', '127.0.0.1'], correct: 0 }
            ],
            2: [
                { question: 'What wiring standard is normally used on both ends of a straight-through cable?', options: ['T568B', 'T568A on one end only', 'WPA2', 'RS-232'], correct: 0 },
                { question: 'What is the defining feature of a straight-through cable?', options: ['Same pinout on both ends', 'No pinout', 'Fiber on one end', 'Reversed power wires'], correct: 0 },
                { question: 'Which connection commonly uses straight-through wiring?', options: ['PC to switch', 'PC to PC only', 'Switch to switch only', 'Printer to printer'], correct: 0 },
                { question: 'What does a switch primarily connect?', options: ['Devices on a LAN', 'Different continents', 'Power outlets', 'Passwords'], correct: 0 },
                { question: 'What does UTP mean?', options: ['Unshielded Twisted Pair', 'Universal Transfer Port', 'Unused Test Pin', 'Ultra Thin Plug'], correct: 0 },
                { question: 'What is the maximum common Cat5e channel length?', options: ['10 m', '50 m', '100 m', '500 m'], correct: 2 },
                { question: 'Which connector is used with common UTP Ethernet cable?', options: ['RJ11', 'RJ45', 'USB-C', 'BNC only'], correct: 1 },
                { question: 'What should both ends have for a reliable cable?', options: ['Matching correct pinouts', 'Different IP addresses', 'The same MAC address', 'A router password'], correct: 0 },
                { question: 'Which device forwards frames using MAC addresses?', options: ['Switch', 'Modem only', 'Keyboard', 'Monitor'], correct: 0 },
                { question: 'What is a link light used to indicate?', options: ['Physical link status', 'DNS status', 'User permission', 'File size'], correct: 0 }
            ],
            3: [
                { question: 'How are the ends of a traditional crossover cable wired?', options: ['T568A and T568B', 'T568B and T568B', 'Both with no standard', 'USB and RJ45'], correct: 0 },
                { question: 'What pairs are crossed?', options: ['Transmit and receive', 'Power and ground', 'Blue and brown only', 'DNS and DHCP'], correct: 0 },
                { question: 'What devices were commonly connected directly with crossover cable?', options: ['PC to PC', 'PC to keyboard', 'Monitor to printer', 'Router to internet'], correct: 0 },
                { question: 'Which device type can also use a crossover connection?', options: ['Switch to switch', 'Mouse to mouse', 'Speaker to speaker', 'Printer to paper'], correct: 0 },
                { question: 'What feature reduces the need for crossover cables?', options: ['Auto-MDI/MDIX', 'DHCP', 'DNS', 'WPA3'], correct: 0 },
                { question: 'What is the purpose of crossing pairs?', options: ['Match transmit to receive', 'Increase voltage', 'Assign an IP', 'Encrypt files'], correct: 0 },
                { question: 'Which standard has the green pair first?', options: ['T568A', 'T568B', '802.11', '802.3af'], correct: 0 },
                { question: 'Which standard has the orange pair first?', options: ['T568A', 'T568B', 'WPA2', 'IPv4'], correct: 1 },
                { question: 'Should a crossover cable still be tested after termination?', options: ['Yes', 'No, never', 'Only over Wi-Fi', 'Only with DNS'], correct: 0 },
                { question: 'What happens with an incorrect crossover pinout?', options: ['The link may fail', 'The cable becomes wireless', 'The IP changes automatically', 'The switch reboots'], correct: 0 }
            ],
            4: [
                { question: 'What identifies a host on an IP network?', options: ['IP address', 'Cable color', 'Monitor size', 'Computer wallpaper'], correct: 0 },
                { question: 'How many octets are in an IPv4 address?', options: ['2', '4', '6', '8'], correct: 1 },
                { question: 'Which is a valid IPv4 address?', options: ['192.168.1.2', '192.168.1', '192.168.1.2.3', '192-168-1-2'], correct: 0 },
                { question: 'What does a subnet mask identify?', options: ['Network and host portions', 'Wi-Fi password', 'Cable category', 'MAC vendor only'], correct: 0 },
                { question: 'What is the purpose of a default gateway?', options: ['Reach other networks', 'Test a cable', 'Name a computer', 'Encrypt a file'], correct: 0 },
                { question: 'What service translates names to IP addresses?', options: ['DNS', 'DHCP', 'FTP', 'ARP only'], correct: 0 },
                { question: 'What service can assign IP settings automatically?', options: ['DHCP', 'DNS', 'HTTP', 'SSH'], correct: 0 },
                { question: 'Which address is in the private 192.168.1.0/24 network?', options: ['192.168.1.25', '8.8.8.8', '172.40.1.1', '1.1.1.1'], correct: 0 },
                { question: 'What command displays Windows IP configuration?', options: ['ipconfig', 'format', 'mkdir', 'netstat only'], correct: 0 },
                { question: 'What can duplicate IP addresses cause?', options: ['Communication problems', 'Faster browsing', 'More storage', 'Stronger encryption'], correct: 0 }
            ],
            5: [
                { question: 'In a star topology, devices connect to a...', options: ['Central switch', 'Single bus cable', 'Ring only', 'Printer'], correct: 0 },
                { question: 'What does a router connect?', options: ['Different networks', 'Only USB devices', 'Power cables', 'Files'], correct: 0 },
                { question: 'What does a switch connect?', options: ['Hosts within a LAN', 'Only WAN providers', 'Passwords', 'DNS names'], correct: 0 },
                { question: 'Which topology uses one main backbone cable?', options: ['Bus', 'Star', 'Mesh', 'Tree only'], correct: 0 },
                { question: 'Which topology provides many redundant paths?', options: ['Mesh', 'Bus', 'Single point', 'Line only'], correct: 0 },
                { question: 'What is a LAN?', options: ['Local Area Network', 'Long Access Node', 'Link Address Name', 'Local Audio Network'], correct: 0 },
                { question: 'What device connects a LAN to the internet?', options: ['Router', 'Patch panel', 'Keyboard', 'Cable tester'], correct: 0 },
                { question: 'What is a network diagram used for?', options: ['Planning and troubleshooting', 'Increasing RAM', 'Changing passwords only', 'Formatting disks'], correct: 0 },
                { question: 'What physical medium carries Ethernet signals?', options: ['Copper or fiber cable', 'Printer ink', 'Keyboard keys', 'DNS records'], correct: 0 },
                { question: 'A single central switch failure in a star affects...', options: ['Connected devices', 'Only the internet name', 'The keyboard battery', 'Nothing at all'], correct: 0 }
            ],
            6: [
                { question: 'What must computers in one Windows workgroup share?', options: ['Workgroup name', 'IP address', 'Computer name', 'MAC address'], correct: 0 },
                { question: 'What lets a PC discover other PCs?', options: ['Network Discovery', 'Airplane Mode', 'Screen sharing only', 'DNS cache'], correct: 0 },
                { question: 'What enables shared files and printers?', options: ['File and Printer Sharing', 'Changing wallpaper', 'Disabling TCP/IP', 'Changing DNS only'], correct: 0 },
                { question: 'What should each computer have on a LAN?', options: ['A unique computer name', 'The same IP address', 'No password ever', 'The same MAC address'], correct: 0 },
                { question: 'Which Windows feature controls network visibility?', options: ['Network profile', 'Recycle Bin', 'Task Manager only', 'Display settings'], correct: 0 },
                { question: 'What is a shared folder used for?', options: ['Network file access', 'Changing IP class', 'Testing voltage', 'Crimping cable'], correct: 0 },
                { question: 'What is required to access a protected share?', options: ['Permission or credentials', 'A crossover cable always', 'A new monitor', 'A public DNS only'], correct: 0 },
                { question: 'Which protocol commonly supports Windows file sharing?', options: ['SMB', 'FTP only', 'SMTP', 'ICMP'], correct: 0 },
                { question: 'Why should passwords not be shared publicly?', options: ['To prevent unauthorized access', 'To improve cable speed', 'To change topology', 'To increase screen size'], correct: 0 },
                { question: 'What should be checked when a share is inaccessible?', options: ['Permissions and connectivity', 'Monitor color', 'Cable brand only', 'Browser theme'], correct: 0 }
            ],
            7: [
                { question: 'What is the main role of a router?', options: ['Forward packets between networks', 'Crimp cables', 'Store passwords', 'Print documents'], correct: 0 },
                { question: 'Which command tests reachability?', options: ['ping', 'copy', 'format', 'mkdir'], correct: 0 },
                { question: 'What protocol does ping use?', options: ['ICMP', 'FTP', 'SMTP', 'SMB'], correct: 0 },
                { question: 'What identifies a wireless network name?', options: ['SSID', 'MAC mask', 'DNS', 'Subnet'], correct: 0 },
                { question: 'Which security standard is preferred over WEP?', options: ['WPA2', 'HTTP', 'FTP', 'Telnet'], correct: 0 },
                { question: 'What is the router LAN IP used for?', options: ['Local management and gateway', 'Cable testing only', 'Naming files', 'Encrypting email'], correct: 0 },
                { question: 'What does a successful ping reply indicate?', options: ['The target responded', 'The password is correct', 'The cable is fiber', 'DNS is disabled'], correct: 0 },
                { question: 'What should be pinged first during troubleshooting?', options: ['Local gateway', 'A random printer', 'A file name', 'The monitor'], correct: 0 },
                { question: 'What does SSID stand for?', options: ['Service Set Identifier', 'Secure Server Internet ID', 'Switch System Interface Data', 'Static Subnet IP Device'], correct: 0 },
                { question: 'What can interference affect?', options: ['Wireless connectivity', 'File names only', 'Monitor brightness', 'Keyboard layout'], correct: 0 }
            ],
            8: [
                { question: 'What blocks unauthorized network traffic?', options: ['Firewall', 'Patch cable', 'DNS name', 'Switch label'], correct: 0 },
                { question: 'Which option secures Wi-Fi?', options: ['WPA2 encryption', 'Open access', 'Disabling updates', 'Sharing the key'], correct: 0 },
                { question: 'What limits access to approved device hardware addresses?', options: ['MAC filtering', 'DHCP only', 'DNS', 'Ping'], correct: 0 },
                { question: 'What makes an administrator password stronger?', options: ['Length and complexity', 'Using a name', 'Using 123456', 'Leaving it blank'], correct: 0 },
                { question: 'Why install security updates?', options: ['To fix vulnerabilities', 'To change cable colors', 'To increase monitor size', 'To remove all users'], correct: 0 },
                { question: 'What does encryption provide?', options: ['Confidentiality', 'More cable length', 'Automatic wiring', 'A new IP class'], correct: 0 },
                { question: 'What is social engineering?', options: ['Manipulating people for information', 'Routing packets', 'Testing a cable', 'Assigning an IP'], correct: 0 },
                { question: 'What should be done with unused network services?', options: ['Disable them when possible', 'Publish passwords', 'Remove the firewall', 'Use default credentials'], correct: 0 },
                { question: 'What is a backup useful for after an incident?', options: ['Restoring data', 'Increasing Wi-Fi range', 'Changing a MAC address', 'Crimping RJ45'], correct: 0 },
                { question: 'What is a secure practice for network administration?', options: ['Change default credentials', 'Use the default password', 'Disable logging', 'Share admin accounts'], correct: 0 }
            ]
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
            9: {
                topic: "Find IP Address Using CMD",
                description: "Use the Windows ipconfig command to display the computer's network information, then identify its IPv4 address.",
                points: [
                    "Open Command Prompt inside the challenge.",
                    "Type ipconfig and press Run.",
                    "Find the active Ethernet adapter.",
                    "Read the IPv4 Address value.",
                    "Enter the IPv4 address in the answer field."
                ],
                example: "The IPv4 Address in this challenge is 192.168.136.128.",
                remember: "Use the IPv4 Address, not the Subnet Mask or Default Gateway.",
                quiz: {
                    question: "Which command displays Windows IP configuration?",
                    options: ["ipconfig", "ping", "format", "mkdir"],
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
        var topologyConnections = {}; // { deviceId: [connectedDeviceIds] }
        var topologySelected = null;
        var topologyCorrect = {
            server: ['hub1', 'hub2', 'hub3'],
            hub1: ['server', 'pc1', 'pc2'],
            hub2: ['server', 'pc3', 'pc4'],
            hub3: ['server', 'pc5', 'pc6'],
            pc1: ['hub1'],
            pc2: ['hub1'],
            pc3: ['hub2'],
            pc4: ['hub2'],
            pc5: ['hub3'],
            pc6: ['hub3']
        };
        var topologyMaxConnections = 9; // Total connections needed
        var topologyCurrentConnections = 0;
        var routerQuizIndex = 0;
        var crossoverDragWire = null;
        var topologyPCConfigs = {};
        var activePCConfig = null;

        // ============================================
        // AUDIO SYSTEM
        // ============================================
        var bgMusic = document.getElementById('bg-music');
        var clickSound = new Audio('music/CLICKSOUND.wav');
        clickSound.preload = 'auto';
        var menuVoice = document.getElementById('menu-voice');
        var menuVoiceInterval = null;
        var savedMasterVolume = localStorage.getItem('connected-master-volume');
        var savedMusicVolume = localStorage.getItem('connected-music-volume');
        var savedFontSize = localStorage.getItem('connected-font-size');
        var savedFontFamily = localStorage.getItem('connected-font-family');
        var masterVolume = savedMasterVolume === null ? 1 : Number(savedMasterVolume);
        var musicVolume = savedMusicVolume === null ? 0.15 : Number(savedMusicVolume);
        var fontSize = savedFontSize === null ? 100 : Number(savedFontSize);
        var fontFamily = savedFontFamily === null ? "'Press Start 2P'" : savedFontFamily;
        var soundMuted = localStorage.getItem('connected-sound-muted') === 'true';

        bgMusic.loop = true;

        function applyAudioSettings() {
            bgMusic.volume = musicVolume * masterVolume;
            bgMusic.muted = soundMuted;
            menuVoice.volume = masterVolume;
            menuVoice.muted = soundMuted;
            document.querySelectorAll('video').forEach(function(video) {
                video.volume = masterVolume;
                video.muted = true;
                if (video.id !== 'menu-bg-video' && video.id !== 'success-video' &&
                    document.getElementById('main-menu').classList.contains('active')) {
                    video.pause();
                }
            });
        }

        function playMenuVoiceOnce() {
            var mainMenu = document.getElementById('main-menu');
            var menuVideo = document.getElementById('menu-bg-video');
            if (!mainMenu || !mainMenu.classList.contains('active') || soundMuted) {
                menuVoice.pause();
                if (menuVideo) menuVideo.pause();
                return;
            }
            if (menuVideo) {
                menuVideo.currentTime = 0;
                menuVideo.play().catch(function(e) { console.log('Menu video play prevented:', e); });
            }
            menuVoice.currentTime = 0;
            menuVoice.play().catch(function(e) { console.log('Menu voice play prevented:', e); });
            setTimeout(function() {
                menuVoice.pause();
                menuVoice.currentTime = 0;
                if (menuVideo) {
                    menuVideo.pause();
                    menuVideo.currentTime = 0;
                }
            }, 9900);
        }

        function startMenuVoiceCycle() {
            if (menuVoiceInterval === null) {
                menuVoiceInterval = setInterval(playMenuVoiceOnce, 10000);
            }
            playMenuVoiceOnce();
        }

        function applyFontSettings() {
            document.documentElement.style.fontSize = (16 * fontSize / 100) + 'px';
            document.body.style.setProperty('--game-font', fontFamily);
            document.body.classList.add('font-adjusted');
        }

        function updateSoundSetting(setting, value) {
            if (setting === 'master') masterVolume = Number(value) / 100;
            if (setting === 'music') musicVolume = Number(value) / 100;
            if (setting === 'font-size') fontSize = Number(value);
            if (setting === 'font-family') fontFamily = value;
            if (setting === 'muted') soundMuted = value;
            localStorage.setItem('connected-master-volume', masterVolume);
            localStorage.setItem('connected-music-volume', musicVolume);
            localStorage.setItem('connected-font-size', fontSize);
            localStorage.setItem('connected-font-family', fontFamily);
            localStorage.setItem('connected-sound-muted', soundMuted);
            applyAudioSettings();
            if (soundMuted) menuVoice.pause();
            if (!soundMuted && document.getElementById('main-menu').classList.contains('active')) {
                startMenuVoiceCycle();
            }
            applyFontSettings();
            updateSettingsLabels();
        }

        function updateSettingsLabels() {
            document.getElementById('master-volume').value = Math.round(masterVolume * 100);
            document.getElementById('music-volume').value = Math.round(musicVolume * 100);
            document.getElementById('font-size').value = fontSize;
            document.getElementById('font-family').value = fontFamily;
            document.getElementById('sound-muted').checked = soundMuted;
            document.getElementById('master-volume-value').textContent = Math.round(masterVolume * 100) + '%';
            document.getElementById('music-volume-value').textContent = Math.round(musicVolume * 100) + '%';
            document.getElementById('font-size-value').textContent = fontSize + '%';
        }

        function toggleSettings(open) {
            document.getElementById('settings-overlay').classList.toggle('open', open);
        }

        document.getElementById('master-volume').addEventListener('input', function(event) {
            updateSoundSetting('master', event.target.value);
        });
        document.getElementById('music-volume').addEventListener('input', function(event) {
            updateSoundSetting('music', event.target.value);
        });
        document.getElementById('font-size').addEventListener('input', function(event) {
            updateSoundSetting('font-size', event.target.value);
        });
        document.getElementById('font-family').addEventListener('change', function(event) {
            updateSoundSetting('font-family', event.target.value);
        });
        document.getElementById('sound-muted').addEventListener('change', function(event) {
            updateSoundSetting('muted', event.target.checked);
        });
        document.getElementById('settings-overlay').addEventListener('click', function(event) {
            if (event.target === event.currentTarget) toggleSettings(false);
        });
        updateSettingsLabels();
        applyAudioSettings();
        applyFontSettings();

        function playMusic() {
            var menuVideo = document.getElementById('menu-bg-video');
            var mainMenu = document.getElementById('main-menu');
            if (menuVideo && mainMenu && mainMenu.classList.contains('active')) {
                menuVideo.volume = masterVolume;
                menuVideo.muted = true;
                startMenuVoiceCycle();
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
        document.addEventListener('click', function(event) {
            var button = event.target.closest('button');
            if (!button) return;

            clickSound.currentTime = 0;
            clickSound.play().catch(function(e) {
                console.log('Click sound play prevented:', e);
            });
        });
        document.addEventListener('touchstart', playMusic);
        document.addEventListener('keydown', playMusic);

        window.addEventListener('load', function() {
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
            videoElement.muted = soundMuted;
            videoElement.volume = masterVolume;
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

        function startRouterStorySequence() {
            showScreen('story-router1');
            var routerVideo1 = document.getElementById('story-router1-video');
            if (routerVideo1) {
                routerVideo1.currentTime = 0;
                playStoryVideo(routerVideo1);
            }
            console.log('🎬 Starting router story 1 - R1.mp4');
        }

        function goToRouterStory2() {
            var routerVideo1 = document.getElementById('story-router1-video');
            if (routerVideo1) {
                routerVideo1.pause();
                routerVideo1.currentTime = 0;
            }
            showScreen('story-router2');
            var routerVideo2 = document.getElementById('story-router2-video');
            if (routerVideo2) {
                routerVideo2.currentTime = 0;
                playStoryVideo(routerVideo2);
            }
            console.log('📖 Going to router story 2 - R2.mp4');
        }

        function proceedToRouterChallenge() {
            var routerVideo2 = document.getElementById('story-router2-video');
            if (routerVideo2) {
                routerVideo2.pause();
                routerVideo2.currentTime = 0;
            }
            showScreen('router-challenge');
            document.getElementById('router-status').innerHTML = "STATUS: " + challenges[7].name;
            resetRouterConfig();
            initRouterQuiz();
            console.log('📶 Starting Router challenge setup');
        }

        function startWorkgroupStorySequence() {
            showScreen('story-workgroup1');
            var workgroupVideo1 = document.getElementById('story-workgroup1-video');
            if (workgroupVideo1) {
                workgroupVideo1.currentTime = 0;
                playStoryVideo(workgroupVideo1);
            }
            console.log('🎬 Starting Workgroup story 1 - W1.mp4');
        }

        function goToWorkgroupStory2() {
            var workgroupVideo1 = document.getElementById('story-workgroup1-video');
            if (workgroupVideo1) {
                workgroupVideo1.pause();
                workgroupVideo1.currentTime = 0;
            }
            showScreen('story-workgroup2');
            var workgroupVideo2 = document.getElementById('story-workgroup2-video');
            if (workgroupVideo2) {
                workgroupVideo2.currentTime = 0;
                playStoryVideo(workgroupVideo2);
            }
            console.log('📖 Going to Workgroup story 2 - W2.mp4');
        }

        function proceedToWorkgroupChallenge() {
            var workgroupVideo2 = document.getElementById('story-workgroup2-video');
            if (workgroupVideo2) {
                workgroupVideo2.pause();
                workgroupVideo2.currentTime = 0;
            }
            showScreen('workgroup-challenge');
            document.getElementById('workgroup-status').innerHTML = "STATUS: " + challenges[6].name;
            resetWorkgroupConfig();
            console.log('🏢 Starting Workgroup challenge setup');
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

        function startQuizMode() {
            startModuleQuiz(1, true);
            console.log('📝 Quiz mode started');
        }

        function startModuleQuiz(moduleId, onlyQuiz) {
            quizOnlyMode = onlyQuiz === true;
            quizQuestionLimit = quizOnlyMode ? 10 : 3;
            isPracticeMode = true;
            lives = maxLives;
            score = 0;
            isGameOver = false;
            currentChallenge = moduleId;
            challengeIndex = challengeOrder.indexOf(moduleId);
            if (challengeIndex < 0) challengeIndex = 0;
            updateAllLives();
            updateAllScores();
            showMicroLearning(moduleId, true);
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
            } else if (challengeId === 6) {
                startWorkgroupStorySequence();
            } else if (challengeId === 7) {
                startRouterStorySequence();
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
            quizScore = 0;
            quizQuestionLimit = quizOnlyMode ? 10 : 3;

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

            quizQuestionIndex = 0;
            renderQuizQuestion(challengeId);

            showScreen('micro-learning');
        }

        function renderQuizQuestion(challengeId) {
            var questions = challengeQuizQuestions[challengeId] || [];
            var question = questions[quizQuestionIndex];
            var optionsContainer = document.getElementById('ml-quiz-options');
            var progress = document.getElementById('ml-quiz-progress');
            var startBtn = document.getElementById('ml-start-btn');
            if (!question) return;
            progress.textContent = 'Question ' + (quizQuestionIndex + 1) + ' of ' + quizQuestionLimit;
            document.getElementById('ml-score').textContent = 'Score: ' + quizScore + ' / ' + quizQuestionLimit;
            document.getElementById('ml-quiz-question').textContent = question.question;
            optionsContainer.innerHTML = '';
            question.options.forEach(function(option, index) {
                if (index >= 4) return;
                var answer = document.createElement('div');
                answer.className = 'ml-quiz-option';
                answer.textContent = String.fromCharCode(65 + index) + '. ' + option;
                answer.dataset.index = index;
                answer.onclick = function() {
                    checkQuizAnswer(this, question.correct, challengeId);
                };
                optionsContainer.appendChild(answer);
            });
            startBtn.disabled = true;
            startBtn.textContent = '🔒 ANSWER ALL QUESTIONS';
        }

        function checkQuizAnswer(element, correctIndex, challengeId) {
            var options = document.querySelectorAll('.ml-quiz-option');
            var selected = parseInt(element.dataset.index);
            options.forEach(function(option) {
                option.style.pointerEvents = 'none';
            });
            if (selected === correctIndex) {
                element.classList.add('correct');
                quizScore++;
                document.getElementById('ml-score').textContent = 'Score: ' + quizScore + ' / ' + quizQuestionLimit;
                quizQuestionIndex++;
                if (quizQuestionIndex >= quizQuestionLimit) {
                    document.getElementById('ml-quiz-progress').textContent = 'All ' + quizQuestionLimit + ' questions complete';
                    document.getElementById('ml-quiz-question').textContent = 'Excellent! Module quiz complete.';
                    document.getElementById('ml-quiz-options').innerHTML = '';
                    var completeButton = document.getElementById('ml-start-btn');
                    completeButton.disabled = false;
                    completeButton.textContent = quizOnlyMode ? 'NEXT MODULE' : '🚀 START CHALLENGE';
                } else {
                    setTimeout(function() {
                        renderQuizQuestion(challengeId);
                    }, 450);
                }
            } else {
                element.classList.add('wrong');
                document.getElementById('ml-quiz-question').textContent = 'Not quite. Try this question again.';
                setTimeout(function() {
                    options.forEach(function(option) {
                        option.classList.remove('wrong');
                        option.style.pointerEvents = 'auto';
                    });
                }, 700);
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
            if (quizOnlyMode) {
                var nextModuleIndex = challengeOrder.indexOf(learningChallengeId) + 1;
                if (nextModuleIndex < challengeOrder.length) {
                    startModuleQuiz(challengeOrder[nextModuleIndex]);
                } else {
                    showChallengeSelect();
                }
                return;
            }
            if (learningIsPractice) {
                isPracticeMode = true;
            } else {
                isPracticeMode = false;
            }
            if (learningChallengeId === 6) {
                startWorkgroupStorySequence();
            } else if (learningChallengeId === 7) {
                startRouterStorySequence();
            } else {
                loadChallenge(learningChallengeId);
            }
        }

        // ============================================
        // LOAD CHALLENGE
        // ============================================

        function loadChallenge(challengeId) {
            var challenge = challenges[challengeId];
            if (challenge.type === 'crossover') {
                showScreen('crossover-challenge');
                resetCrossoverCable();
            } else if (challenge.type === 'cmd-ip') {
                showScreen('cmd-ip-challenge');
                resetCmdIPChallenge();
            } else if (challenge.type === 'ip') {
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
                startRouterStorySequence();
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
                resetTopology();
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
                } else if (currentChallenge === 7) {
                    startRouterStorySequence();
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
                'security-lives-icons', 'topology-lives-icons', 'cmd-ip-lives-icons', 'crossover-lives-icons'
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
                'security-score-display', 'topology-score-display', 'cmd-ip-score-display', 'crossover-score-display'
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
                    document.getElementById('cmd-ip-status') ||
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
                document.getElementById('cmd-ip-status') ||
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
                case 'cmd-ip':
                    resetCmdIPChallenge();
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
                    resetTopology();
                    document.getElementById('topology-status').innerHTML = "STATUS: CONNECT THE DEVICES";
                    break;
                default:
                    break;
            }
            document.querySelectorAll('.config-input, .workgroup-input, .router-input, .security-input').forEach(function(
            el) {
                el.classList.remove('correct', 'wrong');
            });
            console.log('🔄 Challenge reset:', currentChallenge);
        }

        // ============================================
        // RJ45 FUNCTIONS
        // ============================================

        function resetCrossoverCable() {
            var sequences = { a: standards.T568A, b: standards.T568B };
            ['a', 'b'].forEach(function(end) {
                var pins = document.getElementById('crossover-' + end + '-pins');
                if (!pins) return;
                var oldSource = document.getElementById('crossover-' + end + '-source');
                if (oldSource) oldSource.remove();
                pins.innerHTML = '';
                sequences[end].forEach(function(wireName, index) {
                    var pin = document.createElement('div');
                    pin.className = 'crossover-pin';
                    pin.dataset.pin = index + 1;
                    pin.ondragover = function(event) {
                        event.preventDefault();
                        drawCrossoverPreview(event, end, index + 1);
                    };
                    pin.ondrop = dropCrossoverWire;
                    pin.innerHTML = '<span class="crossover-pin-label">' + (index + 1) + '</span>';
                    pins.appendChild(pin);
                });
                var source = document.createElement('div');
                source.className = 'crossover-source';
                source.id = 'crossover-' + end + '-source';
                wireDefinitions.forEach(function(wire) {
                    var item = document.createElement('div');
                    item.className = 'drag-wire';
                    item.draggable = true;
                    item.dataset.name = wire.name;
                    item.style.background = wire.bg;
                    item.textContent = wire.name;
                    item.ondragstart = function(event) {
                        crossoverDragWire = { wire: wire, end: end };
                        event.dataTransfer.setData('text/plain', JSON.stringify(wire));
                    };
                    item.ondragend = function() {
                        crossoverDragWire = null;
                        drawCrossoverWires();
                    };
                    source.appendChild(item);
                });
                pins.parentElement.appendChild(source);
            });
            drawCrossoverWires();
            var guide = document.getElementById('crossover-guide');
            if (guide) {
                guide.innerHTML = '<div class="crossover-guide-title">PRACTICE GUIDE: HOW TO MAKE A CROSSOVER CABLE</div>' +
                    '<div class="crossover-guide-steps">' +
                    '<div><span>1.</span> Fill Computer A using T568A.</div>' +
                    '<div><span>2.</span> Fill Computer B using T568B.</div>' +
                    '<div><span>3.</span> Match each wire color on both ends.</div>' +
                    '<div><span>4.</span> Click VERIFY CABLE.</div>' +
                    '</div>' +
                    '<table class="crossover-guide-table"><tr><th>Pin</th><th>Computer A: T568A</th><th>Computer B: T568B</th></tr>' +
                    '<tr><td>1</td><td>Green/White</td><td>Orange/White</td></tr>' +
                    '<tr><td>2</td><td>Green</td><td>Orange</td></tr>' +
                    '<tr><td>3</td><td>Orange/White</td><td>Green/White</td></tr>' +
                    '<tr><td>4</td><td>Blue</td><td>Blue</td></tr>' +
                    '<tr><td>5</td><td>Blue/White</td><td>Blue/White</td></tr>' +
                    '<tr><td>6</td><td>Orange</td><td>Green</td></tr>' +
                    '<tr><td>7</td><td>Brown/White</td><td>Brown/White</td></tr>' +
                    '<tr><td>8</td><td>Brown</td><td>Brown</td></tr></table>' +
                    '<div class="crossover-guide-note">Only pins 1, 2, 3, and 6 cross. Pins 4, 5, 7, and 8 stay straight.</div>';
                var guideToggle = document.getElementById('crossover-guide-toggle');
                guide.classList.remove('visible');
                guide.setAttribute('aria-hidden', 'true');
                if (guideToggle) {
                    guideToggle.style.display = isPracticeMode ? 'block' : 'none';
                    guideToggle.textContent = 'SHOW KEY POINTS';
                    guideToggle.setAttribute('aria-hidden', isPracticeMode ? 'false' : 'true');
                }
            }
            var status = document.getElementById('crossover-status');
            if (status) status.innerHTML = 'STATUS: DRAG WIRES TO BOTH ENDS';
        }

        function toggleCrossoverGuide() {
            var guide = document.getElementById('crossover-guide');
            var guideToggle = document.getElementById('crossover-guide-toggle');
            if (!guide || !guideToggle) return;
            var isVisible = guide.classList.toggle('visible');
            guide.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
            guideToggle.textContent = isVisible ? 'HIDE KEY POINTS' : 'SHOW KEY POINTS';
        }

        function dropCrossoverWire(event) {
            event.preventDefault();
            var pin = event.currentTarget;
            var wireData = JSON.parse(event.dataTransfer.getData('text/plain'));
            var oldWire = pin.querySelector('.drag-wire');
            if (oldWire) oldWire.remove();
            var wire = document.createElement('div');
            wire.className = 'drag-wire';
            wire.dataset.name = wireData.name;
            wire.style.background = wireData.bg;
            wire.textContent = wireData.name;
            pin.appendChild(wire);
            crossoverDragWire = null;
            drawCrossoverWires();
        }

        function drawCrossoverPreview(event, end, pinNumber) {
            var svg = document.getElementById('crossover-wire-svg');
            if (!svg || !crossoverDragWire) return;
            drawCrossoverWires();
            var body = document.querySelector('.crossover-body').getBoundingClientRect();
            var source = crossoverDragWire.wire;
            var sourceRect = source.getBoundingClientRect();
            var x1 = sourceRect.left + sourceRect.width / 2 - body.left;
            var y1 = sourceRect.top + sourceRect.height / 2 - body.top;
            var x2 = event.clientX - body.left;
            var y2 = event.clientY - body.top;
            drawCrossoverPath(svg, x1, y1, x2, y2, source.bg, true);
        }

        function drawCrossoverWires() {
            var svg = document.getElementById('crossover-wire-svg');
            var body = document.querySelector('.crossover-body');
            if (!svg || !body) return;
            svg.innerHTML = '';
            var bodyRect = body.getBoundingClientRect();
            var mapping = [3, 6, 1, 4, 5, 2, 7, 8];
            var leftPins = document.querySelectorAll('#crossover-a-pins .crossover-pin');
            var rightPins = document.querySelectorAll('#crossover-b-pins .crossover-pin');
            leftPins.forEach(function(pin, index) {
                var wire = pin.querySelector('.drag-wire');
                var target = rightPins[mapping[index] - 1];
                if (!wire || !target || !target.querySelector('.drag-wire')) return;
                var start = pin.getBoundingClientRect();
                var finish = target.getBoundingClientRect();
                drawCrossoverPath(svg,
                    start.right - bodyRect.left,
                    start.top + start.height / 2 - bodyRect.top,
                    finish.left - bodyRect.left,
                    finish.top + finish.height / 2 - bodyRect.top,
                    wire.style.background || '#2bf1c9', false);
            });
        }

        function drawCrossoverPath(svg, x1, y1, x2, y2, background, preview) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var bend = (x1 + x2) / 2;
            path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + bend + ' ' + y1 + ', ' + bend + ' ' + y2 + ', ' + x2 + ' ' + y2);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', background.indexOf('gradient') >= 0 ? '#ecf0f1' : background);
            path.setAttribute('stroke-width', preview ? '3' : '5');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('opacity', preview ? '0.7' : '0.9');
            if (preview) path.setAttribute('stroke-dasharray', '6 4');
            svg.appendChild(path);
        }

        function checkCrossoverCable() {
            var correct = true;
            ['a', 'b'].forEach(function(end) {
                var sequence = end === 'a' ? standards.T568A : standards.T568B;
                document.querySelectorAll('#crossover-' + end + '-pins .crossover-pin').forEach(function(pin, index) {
                    var wire = pin.querySelector('.drag-wire');
                    if (!wire || wire.dataset.name !== sequence[index]) correct = false;
                });
            });
            if (correct) {
                score += 100;
                updateAllScores();
                document.getElementById('crossover-status').innerHTML = 'SUCCESS! CROSSOVER CABLE CORRECT! +100 POINTS';
                document.getElementById('crossover-status').style.color = '#2ecc71';
                trackChallengeCompletion(currentChallenge, true);
                setTimeout(function() { showSuccessScreen(); }, 800);
            } else {
                loseLife();
                document.getElementById('crossover-status').innerHTML = 'INCORRECT: T568A AND T568B MUST BE OPPOSITE ENDS';
                document.getElementById('crossover-status').style.color = '#e74c3c';
                showModal('Check both connector ends and try again.\n-1 Life!', 'error', 'CABLE FAILED');
                trackChallengeCompletion(currentChallenge, false);
            }
        }

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
                loseLife();
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

        function runCmdIPConfig() {
            var commandInput = document.getElementById('cmd-ip-input');
            var output = document.getElementById('cmd-ip-output');
            var command = commandInput.value.trim().toLowerCase();
            if (command !== 'ipconfig' && command !== 'ipconfig /all') {
                output.textContent = "'" + commandInput.value.trim() + "' is not recognized. Type ipconfig and press Run.";
                output.classList.add('visible');
                return;
            }
            output.innerHTML = 'Windows IP Configuration\n\nEthernet adapter Ethernet0:\n\n   IPv4 Address. . . . . . . . . . . : <strong>192.168.136.128</strong>\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.136.2';
            output.classList.add('visible');
            document.getElementById('cmd-ip-answer').disabled = false;
            document.getElementById('cmd-ip-answer').focus();
            document.getElementById('cmd-ip-status').innerHTML = 'STATUS: ENTER THE IPv4 ADDRESS';
        }

        function checkCmdIPAnswer() {
            if (isGameOver) return;
            var answer = document.getElementById('cmd-ip-answer');
            if (answer.disabled) {
                showModal('Type ipconfig and press Run first.', 'warning', 'CMD REQUIRED');
                return;
            }
            if (answer.value.trim() === '192.168.136.128') {
                answer.classList.add('correct');
                score += 100;
                updateAllScores();
                document.getElementById('cmd-ip-status').innerHTML = 'SUCCESS! IPv4 ADDRESS CORRECT! +100 POINTS';
                trackChallengeCompletion(currentChallenge, true);
                setTimeout(function() { showSuccessScreen(); }, 800);
            } else {
                answer.classList.add('wrong');
                loseLife();
                document.getElementById('cmd-ip-status').innerHTML = 'INCORRECT IPv4 ADDRESS';
                showModal('Wrong IPv4 address.\n-1 Life!', 'error', 'CONFIG FAILED');
                trackChallengeCompletion(currentChallenge, false);
            }
        }

        function resetCmdIPChallenge() {
            var commandInput = document.getElementById('cmd-ip-input');
            var output = document.getElementById('cmd-ip-output');
            var answer = document.getElementById('cmd-ip-answer');
            if (commandInput) commandInput.value = '';
            if (output) {
                output.innerHTML = 'Type ipconfig and press Run.';
                output.classList.remove('visible');
            }
            if (answer) {
                answer.value = '';
                answer.disabled = true;
                answer.classList.remove('correct', 'wrong');
            }
            document.getElementById('cmd-ip-status').innerHTML = 'STATUS: TYPE IPCONFIG';
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
                    showFileSharingChallenge();
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

        function showFileSharingChallenge() {
            fileShareCompleted = false;
            var sourceFile = document.getElementById('source-sample-file');
            var destinationFile = document.getElementById('destination-sample-file');
            var copyButton = document.getElementById('copy-file-btn');
            if (sourceFile) sourceFile.classList.remove('copied');
            if (destinationFile) {
                destinationFile.hidden = true;
                destinationFile.classList.remove('copied');
            }
            if (copyButton) {
                copyButton.disabled = false;
                copyButton.textContent = 'COPY FILE TO PC 1';
            }
            document.getElementById('file-sharing-status').textContent = 'STATUS: COPY THE SAMPLE FILE TO PC 1';
            document.getElementById('file-sharing-status').style.color = '#f1c40f';
            showScreen('file-sharing-challenge');
        }

        function copySampleFileToPC1() {
            if (fileShareCompleted || isGameOver) return;
            fileShareCompleted = true;
            score += 100;
            updateAllScores();
            document.getElementById('source-sample-file').classList.add('copied');
            document.getElementById('destination-sample-file').hidden = false;
            document.getElementById('destination-sample-file').classList.add('copied');
            document.getElementById('copy-file-btn').disabled = true;
            document.getElementById('copy-file-btn').textContent = 'FILE COPIED';
            document.getElementById('file-sharing-status').textContent = 'SUCCESS! PC 1 RECEIVED THE SHARED FILE! +100 POINTS';
            document.getElementById('file-sharing-status').style.color = '#2ecc71';
            setTimeout(function() {
                showSuccessScreen();
            }, 900);
        }

        // ============================================
        // ROUTER FUNCTIONS
        // ============================================

        var routerQuizQuestions = [
            { question: 'What does a router connect?', options: ['Different networks', 'Only monitors', 'Power cables'], correct: 0 },
            { question: 'Which security option protects the Wi-Fi network?', options: ['WPA2', 'DHCP range', 'Ping'], correct: 0 },
            { question: 'What does ping test?', options: ['Network connectivity', 'Screen brightness', 'File size'], correct: 0 }
        ];

        function initRouterQuiz() {
            routerQuizIndex = 0;
            renderRouterQuizQuestion();
        }

        function renderRouterQuizQuestion() {
            var question = routerQuizQuestions[routerQuizIndex];
            var optionsContainer = document.getElementById('router-quiz-options');
            if (!question || !optionsContainer) return;
            document.getElementById('router-quiz-progress').textContent = 'Question ' + (routerQuizIndex + 1) + ' of ' + routerQuizQuestions.length;
            document.getElementById('router-quiz-question').textContent = question.question;
            optionsContainer.innerHTML = '';
            question.options.forEach(function(option, index) {
                var answer = document.createElement('div');
                answer.className = 'router-quiz-option';
                answer.textContent = String.fromCharCode(65 + index) + '. ' + option;
                answer.dataset.index = index;
                answer.onclick = function() {
                    checkRouterQuizAnswer(this, question.correct);
                };
                optionsContainer.appendChild(answer);
            });
        }

        function checkRouterQuizAnswer(element, correctIndex) {
            var options = document.querySelectorAll('.router-quiz-option');
            options.forEach(function(option) {
                option.style.pointerEvents = 'none';
            });
            if (parseInt(element.dataset.index, 10) === correctIndex) {
                element.classList.add('correct');
                routerQuizIndex++;
                if (routerQuizIndex >= routerQuizQuestions.length) {
                    document.getElementById('router-quiz-progress').textContent = 'All 3 questions correct';
                    document.getElementById('router-quiz-question').textContent = 'Great work! Continue configuring the router.';
                    document.getElementById('router-quiz-options').innerHTML = '';
                } else {
                    setTimeout(renderRouterQuizQuestion, 450);
                }
            } else {
                element.classList.add('wrong');
                document.getElementById('router-quiz-question').textContent = 'Not quite. Try again.';
                setTimeout(function() {
                    options.forEach(function(option) {
                        option.classList.remove('wrong');
                        option.style.pointerEvents = 'auto';
                    });
                }, 700);
            }
        }

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
        // TOPOLOGY FUNCTIONS (NEW)
        // ============================================

        function initTopology() {
            topologyConnections = {};
            topologyPCConfigs = {};
            closePCConfig();
            topologySelected = null;
            topologyCurrentConnections = 0;
            var deviceIds = ['server', 'hub1', 'hub2', 'hub3', 'pc1', 'pc2', 'pc3', 'pc4', 'pc5', 'pc6'];
            deviceIds.forEach(function(id) {
                topologyConnections[id] = [];
                updateConnCount(id);
            });
            // Clear SVG
            var svg = document.getElementById('topology-svg');
            svg.innerHTML = '';
            // Remove connected class from all devices
            document.querySelectorAll('.device-node').forEach(function(el) {
                el.classList.remove('connected', 'selected', 'wrong');
            });
            document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
            document.getElementById('topology-status').style.color = '#f1c40f';
        }

        function resetTopology(silent) {
            if (isGameOver) {
                showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
                return;
            }
            initTopology();
            if (!silent) {
                showModal('🔄 Topology reset! Start connecting devices.', 'info', '🔄 RESET COMPLETE');
            }
            console.log('🔄 Topology reset');
        }

        function selectDevice(deviceId) {
            if (isGameOver) {
                showModal('Game is over! Please restart.', 'warning', '⚠️ GAME OVER');
                return;
            }

            var el = document.querySelector('.device-node[data-id="' + deviceId + '"]');
            if (!el) return;

            // If device already has max connections (router has 3, others have 2 or 1)
            var maxConn = 1;
            if (deviceId === 'server') maxConn = 3;
            else if (deviceId.startsWith('hub')) maxConn = 3;

            if (topologyConnections[deviceId] && topologyConnections[deviceId].length >= maxConn) {
                showModal('⚠️ This device already has the maximum number of connections!', 'warning', '⚠️ MAX CONNECTIONS');
                return;
            }

            if (topologySelected === null) {
                // Select first device
                topologySelected = deviceId;
                el.classList.add('selected');
                document.getElementById('topology-status').innerHTML = "STATUS: SELECTED " + deviceId.toUpperCase() +
                    " - Click another device to connect";
                document.getElementById('topology-status').style.color = '#f1c40f';
                return;
            }

            if (topologySelected === deviceId) {
                // Deselect
                el.classList.remove('selected');
                topologySelected = null;
                document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
                document.getElementById('topology-status').style.color = '#f1c40f';
                return;
            }

            // Second device selected - try to connect
            var firstId = topologySelected;
            var firstEl = document.querySelector('.device-node[data-id="' + firstId + '"]');
            var secondEl = el;

            // Check if already connected
            if (topologyConnections[firstId].indexOf(deviceId) !== -1) {
                showModal('⚠️ These devices are already connected!', 'warning', '⚠️ ALREADY CONNECTED');
                firstEl.classList.remove('selected');
                topologySelected = null;
                document.getElementById('topology-status').innerHTML = "STATUS: CLICK TWO DEVICES TO CONNECT";
                document.getElementById('topology-status').style.color = '#f1c40f';
                return;
            }

            // Check if connection is correct (bidirectional)
            var isCorrect = false;
            if (topologyCorrect[firstId] && topologyCorrect[firstId].indexOf(deviceId) !== -1) {
                isCorrect = true;
            } else if (topologyCorrect[deviceId] && topologyCorrect[deviceId].indexOf(firstId) !== -1) {
                isCorrect = true;
            }

            if (isCorrect) {
                // Correct connection!
                topologyConnections[firstId].push(deviceId);
                topologyConnections[deviceId].push(firstId);
                topologyCurrentConnections++;

                // Draw line
                drawTopologyLine(firstId, deviceId, '#2ecc71');

                // Mark devices as connected
                firstEl.classList.remove('selected');
                firstEl.classList.add('connected');
                secondEl.classList.add('connected');

                updateConnCount(firstId);
                updateConnCount(deviceId);

                topologySelected = null;
                document.getElementById('topology-status').innerHTML = "STATUS: ✅ CONNECTION CORRECT! (" + topologyCurrentConnections +
                    "/6)";
                document.getElementById('topology-status').style.color = '#2ecc71';

                // Check if all connections are made
                if (topologyCurrentConnections >= 6) {
                    setTimeout(function() {
                        verifyTopology();
                    }, 500);
                }
            } else {
                // Wrong connection!
                firstEl.classList.remove('selected');
                firstEl.classList.add('wrong');
                secondEl.classList.add('wrong');
                topologySelected = null;

                // Draw red line temporarily
                drawTopologyLine(firstId, deviceId, '#e74c3c');

                loseLife();
                document.getElementById('topology-status').innerHTML = "STATUS: ❌ WRONG CONNECTION! -1 Life";
                document.getElementById('topology-status').style.color = '#e74c3c';

                setTimeout(function() {
                    firstEl.classList.remove('wrong');
                    secondEl.classList.remove('wrong');
                    // Remove the red line
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

        function startTopologyDrag(event, deviceId) {
            event.dataTransfer.setData('text/plain', deviceId);
            event.dataTransfer.effectAllowed = 'link';
        }

        function dropTopologyConnection(event, deviceId) {
            event.preventDefault();
            var sourceId = event.dataTransfer.getData('text/plain');
            if (!sourceId || sourceId === deviceId) return;
            topologySelected = sourceId;
            selectDevice(deviceId);
        }

        function openPCConfig(deviceId) {
            activePCConfig = deviceId;
            document.getElementById('pc-config-title').textContent = deviceId.toUpperCase() + ' NETWORK CONFIGURATION';
            var config = topologyPCConfigs[deviceId] || {
                ip: '192.168.1.2', mask: '255.255.255.0', gateway: '192.168.1.1', dns: '8.8.8.8'
            };
            document.getElementById('pc-config-ip').value = config.ip;
            document.getElementById('pc-config-mask').value = config.mask;
            document.getElementById('pc-config-gateway').value = config.gateway;
            document.getElementById('pc-config-dns').value = config.dns;
            document.getElementById('pc-config-modal').classList.add('open');
            document.getElementById('pc-config-modal').setAttribute('aria-hidden', 'false');
        }

        function closePCConfig() {
            document.getElementById('pc-config-modal').classList.remove('open');
            document.getElementById('pc-config-modal').setAttribute('aria-hidden', 'true');
            activePCConfig = null;
        }

        function savePCConfig() {
            var config = {
                ip: document.getElementById('pc-config-ip').value.trim(),
                mask: document.getElementById('pc-config-mask').value.trim(),
                gateway: document.getElementById('pc-config-gateway').value.trim(),
                dns: document.getElementById('pc-config-dns').value.trim()
            };
            var correct = config.ip === '192.168.1.2' && config.mask === '255.255.255.0' &&
                config.gateway === '192.168.1.1' && config.dns === '8.8.8.8';
            if (!correct) {
                showModal('Use the required IPv4, subnet mask, gateway, and DNS values.', 'warning', 'INVALID PC CONFIG');
                return;
            }
            topologyPCConfigs[activePCConfig] = config;
            document.querySelector('.device-node[data-id="' + activePCConfig + '"]').classList.add('connected');
            closePCConfig();
            document.getElementById('topology-status').innerHTML = activePCConfig.toUpperCase() + ' CONFIGURED. DRAG A CABLE TO CONNECT IT.';
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

            // Check if line already exists
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

            // Count total connections
            var total = 0;
            for (var id in topologyConnections) {
                total += topologyConnections[id].length;
            }
            total = total / 2; // Each connection counted twice

            if (total < 9) {
                showModal('❌ You need to make all 9 connections! (' + total + '/9)', 'warning', '⚠️ INCOMPLETE');
                return;
            }

            if (['pc1', 'pc2', 'pc3', 'pc4', 'pc5', 'pc6'].some(function(id) { return !topologyPCConfigs[id]; })) {
                showModal('Click each PC and save the required IP configuration first.', 'warning', '⚠️ CONFIGURE PCS');
                return;
            }

            // Verify all connections are correct
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

            if (allCorrect && total >= 9) {
                // SUCCESS!
                score += 100;
                updateAllScores();
                document.getElementById('topology-status').innerHTML = "✅ SUCCESS! ALL DEVICES CONNECTED CORRECTLY! +100 POINTS";
                document.getElementById('topology-status').style.color = '#2ecc71';
                trackChallengeCompletion(currentChallenge, true);
                setTimeout(function() {
                    showSuccessScreen();
                }, 800);
            } else {
                // Some connections are wrong
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
                successVideo.muted = false;
                successVideo.currentTime = 0;
            }
            var nextIdx = challengeIndex + 1;
            if (nextIdx < challengeOrder.length) {
                var nextChallengeId = challengeOrder[nextIdx];
                var nextType = challenges[nextChallengeId].type;
                var typeLabels = {
                    'rj45': '🔌 RJ45',
                    'crossover': '🔄 CROSSOVER CABLE',
                    'ip': '💻 IP CONFIG',
                    'cmd-ip': '💻 CMD IP CONFIG',
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
            if (successVideo) {
                successVideo.play().catch(function(error) {
                    console.warn('RJ45 thank-you video audio autoplay blocked:', error);
                    successVideo.muted = true;
                    successVideo.play().catch(function(playError) {
                        console.warn('RJ45 thank-you video playback blocked:', playError);
                    });
                });
            }
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
            for (var i = 1; i <= 9; i++) {
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
        // MODAL FUNCTIONS
        // ============================================

        function showModal(message, type, title) {
            type = type || 'warning';
            modalCloseAction = null;
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
            var action = modalCloseAction;
            modalCloseAction = null;
            if (action) action();
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
            modalCloseAction = goToMenu;
        }

        // ============================================
        // SCREEN FUNCTIONS
        // ============================================

        function showScreen(screenId) {
            var menuVideo = document.getElementById('menu-bg-video');
            var story1 = document.getElementById('story-img-1');
            var story2 = document.getElementById('story-img-2');
            var ipStory1 = document.getElementById('story-ip1-video');
            var ipStory2 = document.getElementById('story-ip2-video');
            var routerStory1 = document.getElementById('story-router1-video');
            var routerStory2 = document.getElementById('story-router2-video');
            var workgroupStory1 = document.getElementById('story-workgroup1-video');
            var workgroupStory2 = document.getElementById('story-workgroup2-video');
            var successVideo = document.getElementById('success-video');
            var isVideoScene = screenId === 'story-1' || screenId === 'story-2' ||
                screenId === 'story-ip1' || screenId === 'story-ip2' ||
                screenId === 'story-router1' || screenId === 'story-router2' ||
                screenId === 'story-workgroup1' || screenId === 'story-workgroup2' ||
                screenId === 'success-screen';

            if (successVideo && screenId !== 'success-screen') {
                successVideo.pause();
                successVideo.currentTime = 0;
            }

            if (screenId === 'main-menu') {
                if (menuVideo) {
                    menuVideo.muted = true;
                }
                startMenuVoiceCycle();
                bgMusic.volume = musicVolume * masterVolume;
                if (isAudioPlaying) {
                    bgMusic.play().catch(function(e) { console.log('Menu bgMusic play:', e); });
                }
            } else {
                if (menuVideo) {
                    menuVideo.pause();
                }
                menuVoice.pause();
                menuVoice.currentTime = 0;
                if (isVideoScene) {
                    bgMusic.volume = 0.05;
                    if (isAudioPlaying) {
                        bgMusic.play().catch(function(e) { console.log('BGM continues:', e); });
                    }
                } else {
                    bgMusic.volume = 0.08;
                    if (isAudioPlaying) {
                        bgMusic.play().catch(function(e) { console.log('BGM continues:', e); });
                    }
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
            if (screenId !== 'story-router1' && routerStory1) { routerStory1.pause();
                routerStory1.currentTime = 0; }
            if (screenId !== 'story-router2' && routerStory2) { routerStory2.pause();
                routerStory2.currentTime = 0; }
            if (screenId !== 'story-workgroup1' && workgroupStory1) { workgroupStory1.pause();
                workgroupStory1.currentTime = 0; }
            if (screenId !== 'story-workgroup2' && workgroupStory2) { workgroupStory2.pause();
                workgroupStory2.currentTime = 0; }

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
            var successVideo = document.getElementById('success-video');
            if (successVideo) {
                successVideo.pause();
                successVideo.currentTime = 0;
            }
            var story1 = document.getElementById('story-img-1');
            var story2 = document.getElementById('story-img-2');
            var ipStory1 = document.getElementById('story-ip1-video');
            var ipStory2 = document.getElementById('story-ip2-video');
            var routerStory1 = document.getElementById('story-router1-video');
            var routerStory2 = document.getElementById('story-router2-video');
            var workgroupStory1 = document.getElementById('story-workgroup1-video');
            var workgroupStory2 = document.getElementById('story-workgroup2-video');
            if (story1) { story1.pause();
                story1.currentTime = 0; }
            if (story2) { story2.pause();
                story2.currentTime = 0; }
            if (ipStory1) { ipStory1.pause();
                ipStory1.currentTime = 0; }
            if (ipStory2) { ipStory2.pause();
                ipStory2.currentTime = 0; }
            if (routerStory1) { routerStory1.pause();
                routerStory1.currentTime = 0; }
            if (routerStory2) { routerStory2.pause();
                routerStory2.currentTime = 0; }
            if (workgroupStory1) { workgroupStory1.pause();
                workgroupStory1.currentTime = 0; }
            if (workgroupStory2) { workgroupStory2.pause();
                workgroupStory2.currentTime = 0; }

            showScreen('main-menu');
            resetGameState();
            resetIPConfig();
            resetWorkgroupConfig();
            resetRouterConfig();
            resetSecurityConfig();
            resetTopology(true);
            document.getElementById('game-status').innerHTML = "STATUS: SELECT SCHEMATIC &amp; DRAG WIRES";
            document.getElementById('pinout-list').classList.add('hidden');
            lives = maxLives;
            challengeIndex = 0;
            isPracticeMode = false;
            quizOnlyMode = false;
            updateAllLives();
            isGameOver = false;
            loadPerformanceData();
            bgMusic.volume = musicVolume * masterVolume;
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
        initWirePalette();
        initTopology();
        initRouterQuiz();
        updateAllLives();
        updateAllScores();
        loadPerformanceData();
        document.getElementById('menu-bg-video').pause();
