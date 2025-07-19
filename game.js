const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let player;
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Player properties
const playerWidth = 50;
const playerHeight = 50;
const playerSpeed = 5;

// Bullet properties
const bulletWidth = 5;
const bulletHeight = 15;
const bulletSpeed = 7;

// Enemy properties
const enemyWidth = 40;
const enemyHeight = 40;
const enemySpeed = 2;
const enemySpawnInterval = 1000; // milliseconds

// Player object
class Player {
    constructor() {
        this.x = canvas.width / 2 - playerWidth / 2;
        this.y = canvas.height - playerHeight - 20;
        this.width = playerWidth;
        this.height = playerHeight;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'left' && this.x > 0) {
            this.x -= playerSpeed;
        } else if (direction === 'right' && this.x < canvas.width - this.width) {
            this.x += playerSpeed;
        } else if (direction === 'up' && this.y > 0) {
            this.y -= playerSpeed;
        } else if (direction === 'down' && this.y < canvas.height - this.height) {
            this.y += playerSpeed;
        }
    }

    shoot() {
        bullets.push(new Bullet(this.x + this.width / 2 - bulletWidth / 2, this.y));
    }
}

// Bullet object
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = bulletWidth;
        this.height = bulletHeight;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= bulletSpeed;
    }
}

// Enemy object
class Enemy {
    constructor() {
        this.x = Math.random() * (canvas.width - enemyWidth);
        this.y = -enemyHeight; // Start above the canvas
        this.width = enemyWidth;
        this.height = enemyHeight;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += enemySpeed;
    }
}

// Initialize game
function init() {
    player = new Player();
    score = 0;
    gameOver = false;
    bullets = [];
    enemies = [];
    spawnEnemies();
    gameLoop();
}

// Game Loop
function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    player.draw();

    // Update and draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.update();
        bullet.draw();
        if (bullet.y < 0) {
            bullets.splice(i, 1); // Remove off-screen bullets
        }
    }

    // Update and draw enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
        enemy.draw();

        // Check for collision with player
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver = true;
        }

        // Check for collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(i, 1); // Remove enemy
                bullets.splice(j, 1); // Remove bullet
                score += 10;
                break; // Break inner loop after hitting an enemy
            }
        }

        if (enemy.y > canvas.height) {
            enemies.splice(i, 1); // Remove off-screen enemies
        }
    }

    drawScore();
    requestAnimationFrame(gameLoop);
}

// Spawn enemies
let enemySpawnTimer;
function spawnEnemies() {
    enemySpawnTimer = setInterval(() => {
        enemies.push(new Enemy());
    }, enemySpawnInterval);
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Draw Game Over screen
function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);
    clearInterval(enemySpawnTimer); // Stop spawning enemies
}

// Event Listeners for player movement and shooting
document.addEventListener('keydown', (e) => {
    if (gameOver && e.key === 'r') {
        init(); // Restart game
        return;
    }

    if (!gameOver) {
        switch (e.key) {
            case 'ArrowLeft':
                player.move('left');
                break;
            case 'ArrowRight':
                player.move('right');
                break;
            case 'ArrowUp':
                player.move('up');
                break;
            case 'ArrowDown':
                player.move('down');
                break;
            case ' ': // Spacebar
                player.shoot();
                break;
        }
    }
});

// Start the game
init();
