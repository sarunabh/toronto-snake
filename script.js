const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let eatSound, moveSound, bgMusic; // Declare only — don't initialize yet

const gridSize = 20;
let paused = false;
let gameOver = false;
let gameStarted = false;
let snake = [{ x: 160, y: 160 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 320, y: 320 };
let score = 0;

// Unified key handler: handles movement, pause, start, and restart
document.addEventListener('keydown', function handleKeyPress(e) {
  // Restart after game over
  if (gameOver) {
    snake = [{ x: 160, y: 160 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    gameOver = false;
    paused = false;
    document.getElementById('startMsg').textContent = '';
    document.getElementById('startMsg').style.color = 'gray';
    return;
  }

  // Start game on first keypress
  if (!gameStarted) {
    eatSound = new Audio('yummy-82939.mp3');
    moveSound = new Audio('click-151673.mp3');
    bgMusic = new Audio('arcade-beat-323176.mp3');

    eatSound.volume = 1;
    moveSound.volume = 0.05;
    bgMusic.volume = 0.1;
    bgMusic.loop = true;

    // Prime playback to satisfy Chrome's gesture requirement
    eatSound.play().then(() => console.log("eatSound primed"));
    moveSound.play().then(() => console.log("moveSound primed"));
    bgMusic.play().then(() => console.log("bgMusic started"));

    gameLoop();
    gameStarted = true;
  }

  // Pause toggle
  if (e.key === 'p' || e.key === 'P') {
    paused = !paused;
    return;
  }

  // Movement (only if not paused)
  if (!paused) {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) direction = { x: 0, y: -gridSize };
        break;
      case 'ArrowDown':
        if (direction.y === 0) direction = { x: 0, y: gridSize };
        break;
      case 'ArrowLeft':
        if (direction.x === 0) direction = { x: -gridSize, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x === 0) direction = { x: gridSize, y: 0 };
        break;
    }
  }
});

function gameLoop() {
  setTimeout(gameLoop, 150);

  if (paused || gameOver) return;

  // Move snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);
  moveSound.currentTime = 0; // Reset to avoid overlap
  moveSound.play();

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    eatSound.currentTime = 0; // Reset to avoid overlap
    eatSound.play();
    score++;
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
    };
  } else {
    snake.pop();
  }

  // Check for wall collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    triggerGameOver();
    return;
  }

  // Check for self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      triggerGameOver();
      return;
    }
  }

  // Draw everything
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  ctx.fillStyle = 'lime';
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Handles game over visuals and flags
function triggerGameOver() {
  gameOver = true;
  paused = true;
  document.getElementById('startMsg').textContent = 'Game Over. Press any key to restart.';
  document.getElementById('startMsg').style.color = 'red';
}
