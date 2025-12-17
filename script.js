const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const lifeElement = document.getElementById("life-count");
const startBtn = document.getElementById("start-btn");
const speedSelect = document.getElementById("speed-select");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let lives = 10;
let dx = 0;
let dy = 0;
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let gameInterval;

// スタートボタン
startBtn.addEventListener("click", () => {
    if (lives <= 0) {
        lives = 10;
        score = 0;
    }
    resetGame();
    startGame();
});

// キー操作
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    if (keyPressed === LEFT_KEY && dx === 0) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && dy === 0) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && dx === 0) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && dy === 0) { dx = 0; dy = 1; }
}

function startGame() {
    clearInterval(gameInterval);
    const speed = parseInt(speedSelect.value);
    gameInterval = setInterval(main, speed);
}

function main() {
    if (didGameEnd()) {
        lives--;
        lifeElement.innerText = lives;
        clearInterval(gameInterval);
        
        if (lives > 0) {
            alert("NG! 壁にぶつかりました。");
            resetGame();
        } else {
            alert("ゲーム終了！スコア: " + score);
        }
        return;
    }

    drawCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function drawCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    const head = snake[0];
    // 壁衝突判定
    const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
    // 自分に衝突判定
    let hitSelf = false;
    for(let i = 4; i < snake.length; i++) {
        if(snake[i].x === head.x && snake[i].y === head.y) hitSelf = true;
    }
    return hitWall || hitSelf;
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawSnake() {
    ctx.fillStyle = "#2ecc71";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    createFood();
    drawCanvas();
    drawSnake();
    scoreElement.innerText = score;
}