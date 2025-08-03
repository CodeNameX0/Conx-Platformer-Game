// 게임 요소들
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// 게임 상태
let score = 0;
let currentLevel = 1;
let gameRunning = true;

// 메시지 시스템
let showLevelMessage = false;
let levelMessageText = '';
let levelMessageTimer = 0;

// 플레이어 객체 (정사각형)
const player = {
    x: 50,
    y: 450,
    width: 35,
    height: 35,
    velX: 0,
    velY: 0,
    speed: 12, // 속도 증가 8 → 12
    jumpPower: 22, // 점프력 증가 (이동 속도에 맞춤)
    grounded: false,
    color: '#ff6b6b'
};

// 잔상 효과를 위한 배열
const afterImages = [];

// 레벨 데이터
const levels = {
    1: {
        platforms: [
            // 바닥
            { x: 0, y: 580, width: 800, height: 20, color: '#2d3748' },
            // 플랫폼들
            { x: 150, y: 500, width: 100, height: 20, color: '#4a5568' },
            { x: 300, y: 420, width: 100, height: 20, color: '#4a5568' },
            { x: 450, y: 340, width: 100, height: 20, color: '#4a5568' },
            { x: 600, y: 260, width: 100, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 175, y: 470, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 325, y: 390, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 475, y: 310, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 625, y: 230, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [],
        hazards: [],
        jumpPads: [],
        enemies: []
    },
    2: {
        platforms: [
            // 바닥
            { x: 0, y: 580, width: 800, height: 20, color: '#2d3748' },
            // 더 복잡한 플랫폼들
            { x: 100, y: 520, width: 80, height: 20, color: '#4a5568' },
            { x: 400, y: 400, width: 80, height: 20, color: '#4a5568' },
            { x: 200, y: 280, width: 100, height: 20, color: '#4a5568' },
            { x: 100, y: 160, width: 120, height: 20, color: '#4a5568' },
            { x: 350, y: 100, width: 100, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 125, y: 490, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 425, y: 370, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 225, y: 250, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 375, y: 70, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 250, y: 460, width: 80, height: 20, color: '#6b46c1', minX: 250, maxX: 450, speed: 2, direction: 1 }
        ],
        hazards: [
            { x: 300, y: 560, width: 60, height: 20, type: 'lava', color: '#ff4444' },
            { x: 500, y: 580, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [],
        enemies: []
    },
    3: {
        platforms: [
            // 바닥 (더 넓게)
            { x: 0, y: 580, width: 300, height: 20, color: '#2d3748' },
            { x: 500, y: 580, width: 300, height: 20, color: '#2d3748' },
            // 더 쉬운 플랫폼들 (더 크고 간격 줄임)
            { x: 80, y: 520, width: 80, height: 20, color: '#4a5568' },
            { x: 220, y: 460, width: 80, height: 20, color: '#4a5568' },
            { x: 380, y: 400, width: 80, height: 20, color: '#4a5568' },
            { x: 520, y: 340, width: 80, height: 20, color: '#4a5568' },
            { x: 200, y: 280, width: 120, height: 20, color: '#4a5568' },
            { x: 400, y: 220, width: 100, height: 20, color: '#4a5568' },
            { x: 150, y: 160, width: 120, height: 20, color: '#4a5568' },
            { x: 450, y: 120, width: 150, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 110, y: 490, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 250, y: 430, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 410, y: 370, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 240, y: 250, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 320, y: 360, width: 60, height: 20, color: '#6b46c1', minX: 320, maxX: 420, speed: 1.5, direction: 1 }
        ],
        hazards: [
            // 용암 구간 줄임
            { x: 300, y: 560, width: 200, height: 20, type: 'lava', color: '#ff4444' },
            // 가시 개수 줄임
            { x: 180, y: 440, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            // 점프패드 추가로 더 쉽게
            { x: 260, y: 570, width: 20, height: 10, color: '#00ff88', power: 18 },
            { x: 520, y: 570, width: 20, height: 10, color: '#00ff88', power: 18 }
        ],
        enemies: []
    },
    4: {
        platforms: [
            { x: 0, y: 580, width: 150, height: 20, color: '#2d3748' },
            { x: 650, y: 580, width: 150, height: 20, color: '#2d3748' },
            { x: 100, y: 480, width: 60, height: 20, color: '#4a5568' },
            { x: 300, y: 420, width: 80, height: 20, color: '#4a5568' },
            { x: 500, y: 360, width: 60, height: 20, color: '#4a5568' },
            { x: 200, y: 260, width: 100, height: 20, color: '#4a5568' },
            { x: 450, y: 200, width: 80, height: 20, color: '#4a5568' },
            { x: 100, y: 140, width: 120, height: 20, color: '#4a5568' },
            { x: 350, y: 80, width: 100, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 120, y: 450, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 320, y: 390, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 520, y: 330, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 220, y: 230, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 470, y: 170, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 380, y: 50, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 400, y: 520, width: 80, height: 20, color: '#6b46c1', minY: 450, maxY: 520, speed: 2, direction: 1, vertical: true },
            { x: 600, y: 300, width: 60, height: 20, color: '#6b46c1', minX: 550, maxX: 700, speed: 2.5, direction: 1 }
        ],
        hazards: [
            { x: 150, y: 560, width: 500, height: 20, type: 'lava', color: '#ff4444' },
            { x: 250, y: 400, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 420, y: 340, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 380, y: 180, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 80, y: 570, width: 20, height: 10, color: '#00ff88', power: 22 },
            { x: 730, y: 570, width: 20, height: 10, color: '#00ff88', power: 18 }
        ],
        enemies: [
            { x: 300, y: 390, width: 20, height: 20, color: '#ff0066', minX: 300, maxX: 360, speed: 1.5, direction: 1 }
        ]
    },
    5: {
        platforms: [
            { x: 0, y: 580, width: 100, height: 20, color: '#2d3748' },
            { x: 700, y: 580, width: 100, height: 20, color: '#2d3748' },
            { x: 50, y: 500, width: 40, height: 20, color: '#4a5568' },
            { x: 150, y: 440, width: 50, height: 20, color: '#4a5568' },
            { x: 350, y: 460, width: 60, height: 20, color: '#4a5568' },
            { x: 550, y: 400, width: 50, height: 20, color: '#4a5568' },
            { x: 650, y: 340, width: 40, height: 20, color: '#4a5568' },
            { x: 200, y: 320, width: 80, height: 20, color: '#4a5568' },
            { x: 450, y: 280, width: 70, height: 20, color: '#4a5568' },
            { x: 100, y: 240, width: 60, height: 20, color: '#4a5568' },
            { x: 300, y: 180, width: 100, height: 20, color: '#4a5568' },
            { x: 550, y: 160, width: 80, height: 20, color: '#4a5568' },
            { x: 150, y: 120, width: 90, height: 20, color: '#4a5568' },
            { x: 400, y: 80, width: 120, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 65, y: 470, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 170, y: 410, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 570, y: 370, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 220, y: 290, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 470, y: 250, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 320, y: 150, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 570, y: 130, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 440, y: 50, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 250, y: 380, width: 60, height: 20, color: '#6b46c1', minX: 250, maxX: 450, speed: 3, direction: 1 },
            { x: 500, y: 220, width: 50, height: 20, color: '#6b46c1', minY: 200, maxY: 320, speed: 2, direction: 1, vertical: true }
        ],
        hazards: [
            { x: 100, y: 560, width: 600, height: 20, type: 'lava', color: '#ff4444' },
            { x: 120, y: 420, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 420, y: 440, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 620, y: 380, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 320, y: 300, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 180, y: 220, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 520, y: 140, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 30, y: 570, width: 20, height: 10, color: '#00ff88', power: 25 },
            { x: 750, y: 570, width: 20, height: 10, color: '#00ff88', power: 25 }
        ],
        enemies: [
            { x: 350, y: 430, width: 20, height: 20, color: '#ff0066', minX: 320, maxX: 480, speed: 2, direction: 1 },
            { x: 200, y: 290, width: 20, height: 20, color: '#ff0066', minX: 200, maxX: 280, speed: 1.5, direction: 1 }
        ]
    },
    6: {
        platforms: [
            { x: 0, y: 580, width: 120, height: 20, color: '#2d3748' },
            { x: 680, y: 580, width: 120, height: 20, color: '#2d3748' },
            { x: 80, y: 520, width: 60, height: 20, color: '#4a5568' },
            { x: 200, y: 480, width: 40, height: 20, color: '#4a5568' },
            { x: 320, y: 440, width: 50, height: 20, color: '#4a5568' },
            { x: 480, y: 400, width: 40, height: 20, color: '#4a5568' },
            { x: 600, y: 360, width: 60, height: 20, color: '#4a5568' },
            { x: 150, y: 320, width: 70, height: 20, color: '#4a5568' },
            { x: 350, y: 280, width: 80, height: 20, color: '#4a5568' },
            { x: 550, y: 240, width: 60, height: 20, color: '#4a5568' },
            { x: 200, y: 200, width: 90, height: 20, color: '#4a5568' },
            { x: 450, y: 160, width: 100, height: 20, color: '#4a5568' },
            { x: 100, y: 120, width: 80, height: 20, color: '#4a5568' },
            { x: 300, y: 80, width: 120, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 100, y: 490, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 340, y: 410, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 620, y: 330, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 370, y: 250, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 220, y: 170, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 340, y: 50, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 400, y: 520, width: 60, height: 20, color: '#6b46c1', minX: 400, maxX: 600, speed: 2.5, direction: 1 },
            { x: 250, y: 380, width: 50, height: 20, color: '#6b46c1', minY: 340, maxY: 460, speed: 1.8, direction: 1, vertical: true }
        ],
        hazards: [
            { x: 120, y: 560, width: 560, height: 20, type: 'lava', color: '#ff4444' },
            { x: 180, y: 460, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 420, y: 420, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 300, y: 300, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 500, y: 220, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 50, y: 570, width: 20, height: 10, color: '#00ff88', power: 23 },
            { x: 730, y: 570, width: 20, height: 10, color: '#00ff88', power: 23 }
        ],
        enemies: [
            { x: 480, y: 370, width: 20, height: 20, color: '#ff0066', minX: 450, maxX: 580, speed: 2, direction: 1 },
            { x: 150, y: 290, width: 20, height: 20, color: '#ff0066', minX: 120, maxX: 220, speed: 1.8, direction: 1 }
        ]
    },
    7: {
        platforms: [
            { x: 0, y: 580, width: 80, height: 20, color: '#2d3748' },
            { x: 720, y: 580, width: 80, height: 20, color: '#2d3748' },
            { x: 40, y: 500, width: 40, height: 20, color: '#4a5568' },
            { x: 120, y: 460, width: 50, height: 20, color: '#4a5568' },
            { x: 220, y: 420, width: 40, height: 20, color: '#4a5568' },
            { x: 320, y: 380, width: 60, height: 20, color: '#4a5568' },
            { x: 450, y: 340, width: 40, height: 20, color: '#4a5568' },
            { x: 550, y: 300, width: 50, height: 20, color: '#4a5568' },
            { x: 650, y: 260, width: 40, height: 20, color: '#4a5568' },
            { x: 400, y: 220, width: 80, height: 20, color: '#4a5568' },
            { x: 200, y: 180, width: 70, height: 20, color: '#4a5568' },
            { x: 500, y: 140, width: 90, height: 20, color: '#4a5568' },
            { x: 100, y: 100, width: 100, height: 20, color: '#4a5568' },
            { x: 350, y: 60, width: 150, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 55, y: 470, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 235, y: 390, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 465, y: 310, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 420, y: 190, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 220, y: 150, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 520, y: 110, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 420, y: 30, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 150, y: 360, width: 50, height: 20, color: '#6b46c1', minX: 150, maxX: 280, speed: 2.2, direction: 1 },
            { x: 500, y: 480, width: 60, height: 20, color: '#6b46c1', minX: 480, maxX: 620, speed: 2.8, direction: 1 },
            { x: 300, y: 280, width: 40, height: 20, color: '#6b46c1', minY: 240, maxY: 340, speed: 2, direction: 1, vertical: true }
        ],
        hazards: [
            { x: 80, y: 560, width: 640, height: 20, type: 'lava', color: '#ff4444' },
            { x: 100, y: 440, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 280, y: 400, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 510, y: 320, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 360, y: 200, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 160, y: 160, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 460, y: 120, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 20, y: 570, width: 20, height: 10, color: '#00ff88', power: 26 },
            { x: 760, y: 570, width: 20, height: 10, color: '#00ff88', power: 26 }
        ],
        enemies: [
            { x: 320, y: 350, width: 20, height: 20, color: '#ff0066', minX: 300, maxX: 400, speed: 2.2, direction: 1 },
            { x: 550, y: 270, width: 20, height: 20, color: '#ff0066', minX: 530, maxX: 620, speed: 1.9, direction: 1 },
            { x: 200, y: 150, width: 20, height: 20, color: '#ff0066', minX: 180, maxX: 270, speed: 1.6, direction: 1 }
        ]
    },
    8: {
        platforms: [
            { x: 0, y: 580, width: 60, height: 20, color: '#2d3748' },
            { x: 740, y: 580, width: 60, height: 20, color: '#2d3748' },
            { x: 30, y: 520, width: 30, height: 20, color: '#4a5568' },
            { x: 100, y: 480, width: 40, height: 20, color: '#4a5568' },
            { x: 180, y: 440, width: 35, height: 20, color: '#4a5568' },
            { x: 260, y: 400, width: 45, height: 20, color: '#4a5568' },
            { x: 350, y: 360, width: 40, height: 20, color: '#4a5568' },
            { x: 440, y: 320, width: 50, height: 20, color: '#4a5568' },
            { x: 540, y: 280, width: 35, height: 20, color: '#4a5568' },
            { x: 620, y: 240, width: 45, height: 20, color: '#4a5568' },
            { x: 450, y: 200, width: 60, height: 20, color: '#4a5568' },
            { x: 300, y: 160, width: 80, height: 20, color: '#4a5568' },
            { x: 150, y: 120, width: 90, height: 20, color: '#4a5568' },
            { x: 450, y: 80, width: 100, height: 20, color: '#4a5568' },
            { x: 200, y: 40, width: 120, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 40, y: 490, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 115, y: 450, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 275, y: 370, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 455, y: 290, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 635, y: 210, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 470, y: 170, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 320, y: 130, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 480, y: 50, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 120, y: 380, width: 40, height: 20, color: '#6b46c1', minX: 120, maxX: 220, speed: 3, direction: 1 },
            { x: 500, y: 420, width: 50, height: 20, color: '#6b46c1', minX: 480, maxX: 600, speed: 2.5, direction: 1 },
            { x: 380, y: 260, width: 40, height: 20, color: '#6b46c1', minY: 220, maxY: 300, speed: 2.3, direction: 1, vertical: true },
            { x: 100, y: 220, width: 35, height: 20, color: '#6b46c1', minY: 180, maxY: 280, speed: 2, direction: 1, vertical: true }
        ],
        hazards: [
            { x: 60, y: 560, width: 680, height: 20, type: 'lava', color: '#ff4444' },
            { x: 160, y: 420, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 330, y: 340, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 520, y: 260, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 430, y: 180, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 10, y: 570, width: 20, height: 10, color: '#00ff88', power: 28 },
            { x: 770, y: 570, width: 20, height: 10, color: '#00ff88', power: 28 }
        ],
        enemies: [
            { x: 260, y: 370, width: 20, height: 20, color: '#ff0066', minX: 240, maxX: 320, speed: 2.5, direction: 1 },
            { x: 440, y: 290, width: 20, height: 20, color: '#ff0066', minX: 420, maxX: 520, speed: 2.3, direction: 1 },
            { x: 300, y: 130, width: 20, height: 20, color: '#ff0066', minX: 280, maxX: 380, speed: 2, direction: 1 }
        ]
    },
    9: {
        platforms: [
            { x: 0, y: 580, width: 50, height: 20, color: '#2d3748' },
            { x: 750, y: 580, width: 50, height: 20, color: '#2d3748' },
            { x: 25, y: 540, width: 25, height: 20, color: '#4a5568' },
            { x: 80, y: 500, width: 30, height: 20, color: '#4a5568' },
            { x: 140, y: 460, width: 35, height: 20, color: '#4a5568' },
            { x: 200, y: 420, width: 30, height: 20, color: '#4a5568' },
            { x: 260, y: 380, width: 40, height: 20, color: '#4a5568' },
            { x: 330, y: 340, width: 35, height: 20, color: '#4a5568' },
            { x: 400, y: 300, width: 45, height: 20, color: '#4a5568' },
            { x: 480, y: 260, width: 35, height: 20, color: '#4a5568' },
            { x: 550, y: 220, width: 40, height: 20, color: '#4a5568' },
            { x: 620, y: 180, width: 35, height: 20, color: '#4a5568' },
            { x: 400, y: 140, width: 60, height: 20, color: '#4a5568' },
            { x: 200, y: 100, width: 80, height: 20, color: '#4a5568' },
            { x: 500, y: 60, width: 100, height: 20, color: '#4a5568' },
            { x: 100, y: 20, width: 150, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 32, y: 510, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 90, y: 470, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 210, y: 390, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 340, y: 310, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 490, y: 230, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 630, y: 150, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 420, y: 110, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 540, y: 30, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 150, y: -10, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 120, y: 380, width: 30, height: 20, color: '#6b46c1', minX: 110, maxX: 180, speed: 3.2, direction: 1 },
            { x: 370, y: 460, width: 40, height: 20, color: '#6b46c1', minX: 350, maxX: 450, speed: 2.8, direction: 1 },
            { x: 520, y: 400, width: 35, height: 20, color: '#6b46c1', minX: 500, maxX: 580, speed: 3, direction: 1 },
            { x: 300, y: 200, width: 30, height: 20, color: '#6b46c1', minY: 160, maxY: 240, speed: 2.5, direction: 1, vertical: true },
            { x: 480, y: 120, width: 20, height: 20, color: '#6b46c1', minY: 80, maxY: 160, speed: 2.2, direction: 1, vertical: true }
        ],
        hazards: [
            { x: 50, y: 560, width: 700, height: 20, type: 'lava', color: '#ff4444' },
            { x: 180, y: 400, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 310, y: 320, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 460, y: 240, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 530, y: 200, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 380, y: 120, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 5, y: 570, width: 20, height: 10, color: '#00ff88', power: 30 },
            { x: 775, y: 570, width: 20, height: 10, color: '#00ff88', power: 30 }
        ],
        enemies: [
            { x: 140, y: 430, width: 20, height: 20, color: '#ff0066', minX: 120, maxX: 200, speed: 2.8, direction: 1 },
            { x: 330, y: 310, width: 20, height: 20, color: '#ff0066', minX: 310, maxX: 380, speed: 2.5, direction: 1 },
            { x: 550, y: 190, width: 20, height: 20, color: '#ff0066', minX: 530, maxX: 610, speed: 2.3, direction: 1 },
            { x: 200, y: 70, width: 20, height: 20, color: '#ff0066', minX: 180, maxX: 280, speed: 2, direction: 1 }
        ]
    },
    10: {
        platforms: [
            { x: 0, y: 580, width: 40, height: 20, color: '#2d3748' },
            { x: 760, y: 580, width: 40, height: 20, color: '#2d3748' },
            { x: 20, y: 540, width: 20, height: 20, color: '#4a5568' },
            { x: 60, y: 500, width: 25, height: 20, color: '#4a5568' },
            { x: 110, y: 460, width: 30, height: 20, color: '#4a5568' },
            { x: 160, y: 420, width: 25, height: 20, color: '#4a5568' },
            { x: 210, y: 380, width: 35, height: 20, color: '#4a5568' },
            { x: 270, y: 340, width: 30, height: 20, color: '#4a5568' },
            { x: 330, y: 300, width: 40, height: 20, color: '#4a5568' },
            { x: 400, y: 260, width: 30, height: 20, color: '#4a5568' },
            { x: 460, y: 220, width: 35, height: 20, color: '#4a5568' },
            { x: 520, y: 180, width: 30, height: 20, color: '#4a5568' },
            { x: 580, y: 140, width: 40, height: 20, color: '#4a5568' },
            { x: 450, y: 100, width: 50, height: 20, color: '#4a5568' },
            { x: 300, y: 60, width: 70, height: 20, color: '#4a5568' },
            { x: 150, y: 20, width: 90, height: 20, color: '#4a5568' },
            { x: 500, y: -20, width: 120, height: 20, color: '#4a5568' },
        ],
        collectibles: [
            { x: 25, y: 510, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 70, y: 470, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 170, y: 390, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 280, y: 310, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 410, y: 230, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 530, y: 150, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 470, y: 70, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 320, y: 30, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 180, y: -10, width: 15, height: 15, collected: false, color: '#ffdd59' },
            { x: 540, y: -50, width: 15, height: 15, collected: false, color: '#ffdd59' },
        ],
        movingPlatforms: [
            { x: 90, y: 380, width: 25, height: 20, color: '#6b46c1', minX: 80, maxX: 150, speed: 3.5, direction: 1 },
            { x: 250, y: 440, width: 30, height: 20, color: '#6b46c1', minX: 230, maxX: 320, speed: 3.2, direction: 1 },
            { x: 380, y: 360, width: 35, height: 20, color: '#6b46c1', minX: 360, maxX: 440, speed: 3, direction: 1 },
            { x: 500, y: 320, width: 30, height: 20, color: '#6b46c1', minX: 480, maxX: 570, speed: 2.8, direction: 1 },
            { x: 620, y: 280, width: 25, height: 20, color: '#6b46c1', minX: 600, maxX: 680, speed: 3.3, direction: 1 },
            { x: 350, y: 160, width: 25, height: 20, color: '#6b46c1', minY: 120, maxY: 200, speed: 2.8, direction: 1, vertical: true },
            { x: 200, y: 80, width: 20, height: 20, color: '#6b46c1', minY: 40, maxY: 120, speed: 2.5, direction: 1, vertical: true }
        ],
        hazards: [
            { x: 40, y: 560, width: 720, height: 20, type: 'lava', color: '#ff4444' },
            { x: 150, y: 400, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 260, y: 320, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 390, y: 240, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 510, y: 160, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 440, y: 80, width: 20, height: 20, type: 'spike', color: '#666' },
            { x: 290, y: 40, width: 20, height: 20, type: 'spike', color: '#666' }
        ],
        jumpPads: [
            { x: 0, y: 570, width: 20, height: 10, color: '#00ff88', power: 32 },
            { x: 780, y: 570, width: 20, height: 10, color: '#00ff88', power: 32 }
        ],
        enemies: [
            { x: 110, y: 430, width: 20, height: 20, color: '#ff0066', minX: 90, maxX: 170, speed: 3, direction: 1 },
            { x: 270, y: 310, width: 20, height: 20, color: '#ff0066', minX: 250, maxX: 330, speed: 2.8, direction: 1 },
            { x: 460, y: 190, width: 20, height: 20, color: '#ff0066', minX: 440, maxX: 520, speed: 2.6, direction: 1 },
            { x: 580, y: 110, width: 20, height: 20, color: '#ff0066', minX: 560, maxX: 640, speed: 2.4, direction: 1 },
            { x: 300, y: 30, width: 20, height: 20, color: '#ff0066', minX: 280, maxX: 370, speed: 2.2, direction: 1 }
        ]
    }
};

// 현재 레벨의 플랫폼과 코인
let platforms = [];
let collectibles = [];
let movingPlatforms = [];
let hazards = [];
let jumpPads = [];
let enemies = [];

// 레벨 로드 함수
function loadLevel(levelNum) {
    if (levels[levelNum]) {
        platforms = JSON.parse(JSON.stringify(levels[levelNum].platforms));
        collectibles = JSON.parse(JSON.stringify(levels[levelNum].collectibles));
        movingPlatforms = JSON.parse(JSON.stringify(levels[levelNum].movingPlatforms || []));
        hazards = JSON.parse(JSON.stringify(levels[levelNum].hazards || []));
        jumpPads = JSON.parse(JSON.stringify(levels[levelNum].jumpPads || []));
        enemies = JSON.parse(JSON.stringify(levels[levelNum].enemies || []));
        currentLevel = levelNum;
    }
}

// 키 입력 상태
const keys = {
    left: false,
    right: false,
    up: false
};

// 이벤트 리스너
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
            keys.right = true;
            e.preventDefault();
            break;
        case 'ArrowUp':
            keys.up = true;
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
    }
});

restartBtn.addEventListener('click', resetGame);

// 충돌 감지 함수
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 플레이어 업데이트
function updatePlayer() {
    // 잔상 효과 추가 (빠르게 움직일 때만)
    if (Math.abs(player.velX) > 2 || Math.abs(player.velY) > 5) {
        const currentColor = getCurrentPlayerColor();
        afterImages.push({
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            alpha: 0.6,
            life: 8,
            color: currentColor
        });
    }
    
    // 잔상 수명 관리
    for (let i = afterImages.length - 1; i >= 0; i--) {
        afterImages[i].life--;
        afterImages[i].alpha *= 0.85;
        if (afterImages[i].life <= 0) {
            afterImages.splice(i, 1);
        }
    }

    // 수평 이동
    if (keys.left) {
        player.velX = -player.speed;
    } else if (keys.right) {
        player.velX = player.speed;
    } else {
        player.velX *= 0.8; // 마찰
    }

    // 점프
    if (keys.up && player.grounded) {
        player.velY = -player.jumpPower;
        player.grounded = false;
    }

    // 중력 적용 (이동 속도에 맞춰 조정)
    player.velY += 0.75;

    // 공기 저항 (수평 이동 감속)
    player.velX *= 0.85;

    // 위치 업데이트
    player.x += player.velX;
    player.y += player.velY;

    // 화면 경계 체크
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // 바닥으로 떨어진 경우 리셋
    if (player.y > canvas.height) {
        resetPlayer();
    }

    // 플랫폼 충돌 검사
    player.grounded = false;
    for (let platform of platforms) {
        if (checkCollision(player, platform)) {
            // 위에서 떨어지는 경우
            if (player.velY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velY = 0;
                player.grounded = true;
            }
            // 아래에서 부딪히는 경우
            else if (player.velY < 0 && player.y > platform.y) {
                player.y = platform.y + platform.height;
                player.velY = 0;
            }
            // 좌우 충돌
            else if (player.velX > 0 && player.x < platform.x) {
                player.x = platform.x - player.width;
                player.velX = 0;
            }
            else if (player.velX < 0 && player.x > platform.x) {
                player.x = platform.x + platform.width;
                player.velX = 0;
            }
        }
    }
}

// 움직이는 플랫폼 업데이트
function updateMovingPlatforms() {
    for (let platform of movingPlatforms) {
        if (platform.vertical) {
            // 수직 이동
            platform.y += platform.speed * platform.direction;
            if (platform.y <= platform.minY || platform.y >= platform.maxY) {
                platform.direction *= -1;
            }
        } else {
            // 수평 이동
            platform.x += platform.speed * platform.direction;
            if (platform.x <= platform.minX || platform.x >= platform.maxX) {
                platform.direction *= -1;
            }
        }
    }
}

// 적 업데이트
function updateEnemies() {
    for (let enemy of enemies) {
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.direction *= -1;
        }
    }
}

// 위험 요소 충돌 체크
function checkHazards() {
    for (let hazard of hazards) {
        if (checkCollision(player, hazard)) {
            if (hazard.type === 'lava' || hazard.type === 'spike') {
                resetPlayer();
                return;
            }
        }
    }
    
    // 적과의 충돌 체크
    for (let enemy of enemies) {
        if (checkCollision(player, enemy)) {
            resetPlayer();
            return;
        }
    }
}

// 점프 패드 체크
function checkJumpPads() {
    for (let jumpPad of jumpPads) {
        if (checkCollision(player, jumpPad) && player.velY > 0) {
            player.velY = -jumpPad.power;
            player.grounded = false;
        }
    }
}

// 움직이는 플랫폼과의 충돌 체크
function checkMovingPlatformCollisions() {
    for (let platform of movingPlatforms) {
        if (checkCollision(player, platform)) {
            // 위에서 떨어지는 경우
            if (player.velY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velY = 0;
                player.grounded = true;
                
                // 플랫폼과 함께 이동
                if (!platform.vertical) {
                    player.x += platform.speed * platform.direction;
                }
            }
            // 아래에서 부딪히는 경우
            else if (player.velY < 0 && player.y > platform.y) {
                player.y = platform.y + platform.height;
                player.velY = 0;
            }
            // 좌우 충돌
            else if (player.velX > 0 && player.x < platform.x) {
                player.x = platform.x - player.width;
                player.velX = 0;
            }
            else if (player.velX < 0 && player.x > platform.x) {
                player.x = platform.x + platform.width;
                player.velX = 0;
            }
        }
    }
}

// 아이템 수집 체크
function checkCollectibles() {
    for (let item of collectibles) {
        if (!item.collected && checkCollision(player, item)) {
            item.collected = true;
            score += 10;
            scoreElement.textContent = score;
        }
    }
    
    // 모든 코인을 수집했는지 확인
    if (collectibles.every(item => item.collected)) {
        // 다음 레벨로 이동
        if (levels[currentLevel + 1]) {
            currentLevel++;
            loadLevel(currentLevel);
            resetPlayer();
            // 레벨 완료 메시지 표시
            showLevelMessage = true;
            levelMessageText = `레벨 ${currentLevel} 진입!`;
            levelMessageTimer = 60; // 1초간 표시 (60fps 기준)
        } else {
            // 모든 레벨 완료
            gameRunning = false;
        }
    }
}

// 그리기 함수들
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// 현재 플레이어 색상을 계산하는 함수 (적당한 톤)
function getCurrentPlayerColor() {
    const time = Date.now() * 0.004; // 적당한 변화 속도
    // 적당히 선명한 색상 범위 (120-220)
    const r = Math.sin(time) * 50 + 170;
    const g = Math.sin(time + 2) * 50 + 170; 
    const b = Math.sin(time + 4) * 50 + 170;
    return {
        r: Math.floor(r),
        g: Math.floor(g),
        b: Math.floor(b)
    };
}

// 잔상 그리기
function drawAfterImages() {
    for (let afterImage of afterImages) {
        // 잔상도 사각형으로, 단색 그라데이션
        const gradient = ctx.createLinearGradient(
            afterImage.x, afterImage.y,
            afterImage.x + afterImage.width, afterImage.y + afterImage.height
        );
        
        const color = afterImage.color;
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${afterImage.alpha})`);
        gradient.addColorStop(1, `rgba(${Math.floor(color.r*0.5)}, ${Math.floor(color.g*0.5)}, ${Math.floor(color.b*0.5)}, ${afterImage.alpha * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(afterImage.x, afterImage.y, afterImage.width, afterImage.height);
    }
}

function drawPlayer() {
    // 잔상 먼저 그리기
    drawAfterImages();
    
    // 현재 색상 계산
    const currentColor = getCurrentPlayerColor();
    
    // 메인 플레이어 - 단색 그라데이션 (왼쪽 위에서 오른쪽 아래로)
    const gradient = ctx.createLinearGradient(
        player.x, player.y,
        player.x + player.width, player.y + player.height
    );
    
    gradient.addColorStop(0, `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`);
    gradient.addColorStop(1, `rgb(${Math.floor(currentColor.r*0.7)}, ${Math.floor(currentColor.g*0.7)}, ${Math.floor(currentColor.b*0.7)})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    for (let platform of platforms) {
        drawRect(platform.x, platform.y, platform.width, platform.height, platform.color);
        
        // 플랫폼 테두리
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }
}

// 움직이는 플랫폼 그리기
function drawMovingPlatforms() {
    for (let platform of movingPlatforms) {
        drawRect(platform.x, platform.y, platform.width, platform.height, platform.color);
        
        // 움직이는 플랫폼 특별한 테두리
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // 움직임 표시 (작은 화살표들)
        ctx.fillStyle = '#a78bfa';
        if (platform.vertical) {
            // 위아래 화살표
            ctx.fillRect(platform.x + platform.width/2 - 2, platform.y + 5, 4, 3);
            ctx.fillRect(platform.x + platform.width/2 - 2, platform.y + platform.height - 8, 4, 3);
        } else {
            // 좌우 화살표
            ctx.fillRect(platform.x + 5, platform.y + platform.height/2 - 2, 3, 4);
            ctx.fillRect(platform.x + platform.width - 8, platform.y + platform.height/2 - 2, 3, 4);
        }
    }
}

// 위험 요소 그리기
function drawHazards() {
    for (let hazard of hazards) {
        if (hazard.type === 'lava') {
            // 용암 효과
            const time = Date.now() * 0.01;
            const gradient = ctx.createLinearGradient(hazard.x, hazard.y, hazard.x, hazard.y + hazard.height);
            gradient.addColorStop(0, '#ff6b35');
            gradient.addColorStop(0.5, '#ff4444');
            gradient.addColorStop(1, '#cc1100');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
            
            // 용암 거품 효과
            ctx.fillStyle = '#ffaa44';
            for (let i = 0; i < 3; i++) {
                const bubbleX = hazard.x + (hazard.width * (i + 1) / 4) + Math.sin(time + i) * 5;
                const bubbleY = hazard.y + 5 + Math.sin(time * 2 + i) * 3;
                ctx.beginPath();
                ctx.arc(bubbleX, bubbleY, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (hazard.type === 'spike') {
            // 가시 그리기
            ctx.fillStyle = hazard.color;
            ctx.beginPath();
            ctx.moveTo(hazard.x + hazard.width/2, hazard.y);
            ctx.lineTo(hazard.x, hazard.y + hazard.height);
            ctx.lineTo(hazard.x + hazard.width, hazard.y + hazard.height);
            ctx.closePath();
            ctx.fill();
            
            // 가시 테두리
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

// 점프 패드 그리기
function drawJumpPads() {
    for (let jumpPad of jumpPads) {
        // 점프 패드 베이스
        drawRect(jumpPad.x, jumpPad.y, jumpPad.width, jumpPad.height, jumpPad.color);
        
        // 스프링 효과
        ctx.strokeStyle = '#00dd66';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const springY = jumpPad.y - 5 - (i * 3);
            ctx.moveTo(jumpPad.x + 3, springY);
            ctx.lineTo(jumpPad.x + jumpPad.width - 3, springY);
        }
        ctx.stroke();
        
        // 글로우 효과
        const time = Date.now() * 0.01;
        const glowAlpha = 0.3 + Math.sin(time) * 0.2;
        ctx.fillStyle = `rgba(0, 255, 136, ${glowAlpha})`;
        ctx.fillRect(jumpPad.x - 2, jumpPad.y - 2, jumpPad.width + 4, jumpPad.height + 4);
    }
}

// 적 그리기
function drawEnemies() {
    for (let enemy of enemies) {
        // 적 몸체
        drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
        
        // 적 눈
        ctx.fillStyle = '#fff';
        ctx.fillRect(enemy.x + 4, enemy.y + 4, 4, 4);
        ctx.fillRect(enemy.x + 12, enemy.y + 4, 4, 4);
        
        // 적 입
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x + 6, enemy.y + 12, 8, 2);
        
        // 적 테두리
        ctx.strokeStyle = '#cc0044';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// 레벨 메시지 그리기
function drawLevelMessage() {
    if (showLevelMessage && levelMessageTimer > 0) {
        // 반투명 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 메시지 박스
        const boxWidth = 400;
        const boxHeight = 100;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;
        
        // 메시지 박스 배경
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // 메시지 박스 테두리
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // 메시지 텍스트
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(levelMessageText, canvas.width / 2, canvas.height / 2 + 10);
        
        // 타이머 감소
        levelMessageTimer--;
        
        // 타이머가 끝나면 메시지 숨기기
        if (levelMessageTimer <= 0) {
            showLevelMessage = false;
        }
    }
}

function drawCollectibles() {
    for (let item of collectibles) {
        if (!item.collected) {
            // 동전 모양 그리기
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // 동전 테두리
            ctx.strokeStyle = '#e69f00';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function drawBackground() {
    // 하늘 그라디언트
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 구름 그리기
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(100, 50);
    drawCloud(300, 80);
    drawCloud(600, 40);
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 15, 20, 0, Math.PI * 2);
    ctx.arc(x + 35, y - 15, 25, 0, Math.PI * 2);
    ctx.fill();
}

// 게임 리셋 함수들
function resetPlayer() {
    player.x = 50;
    player.y = 450;
    player.velX = 0;
    player.velY = 0;
    player.grounded = false;
    afterImages.length = 0; // 잔상 초기화
}

function resetGame() {
    currentLevel = 1;
    loadLevel(currentLevel);
    resetPlayer();
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    
    // 메시지 상태 초기화
    showLevelMessage = false;
    levelMessageTimer = 0;
}

// 메인 게임 루프
function gameLoop() {
    if (gameRunning) {
        // 업데이트
        updatePlayer();
        updateMovingPlatforms();
        updateEnemies();
        checkCollectibles();
        checkMovingPlatformCollisions();
        checkHazards();
        checkJumpPads();
        
        // 그리기
        drawBackground();
        drawPlatforms();
        drawMovingPlatforms();
        drawHazards();
        drawJumpPads();
        drawEnemies();
        drawCollectibles();
        drawPlayer();
        
        // 레벨 정보 표시
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`레벨: ${currentLevel}`, 20, 30);
        
        // 레벨 메시지 표시 (다른 요소들 위에)
        drawLevelMessage();
        
        // 최종 승리 조건 체크 (모든 레벨 완료)
        if (!gameRunning && currentLevel >= Object.keys(levels).length) {
            ctx.fillStyle = '#fff';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('축하합니다! 모든 레벨을 완료했습니다!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('재시작 버튼을 눌러 다시 플레이하세요', canvas.width/2, canvas.height/2 + 50);
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// 게임 시작 - 첫 번째 레벨 로드
loadLevel(1);
gameLoop();
