// Import ball object for reference
import { ball } from "./ball.js";
import { showLevelCompleteModal } from "./extra_features.js";
import { applyPowerUp } from "./paddle.js";

// Game state variables
let level = 1;
let brickRowCount = 4;
let brickColCount = 5;
let speed = 5;

// Arrays to store bricks and power-ups
export let bricks = [];
export let powerUps = [];

// Available power-up types
const POWERUP_TYPES = ["life", "expand", "shrink"];

// Generate bricks for the current level
export function generateBricks(canvas) {
    bricks.length = 0; // Clear existing bricks

    const brickWidth = canvas.width / brickColCount;
    const brickHeight = canvas.height / 20;
    const paddingTop = 100;

    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColCount; c++) {
            if (Math.random() < 0.8) { // 80% chance to spawn a brick
                let x = c * brickWidth;
                let y = r * brickHeight;

                // Generate random color for brick
                let red = Math.floor(Math.random() * 200) + 55;
                let green = Math.floor(Math.random() * 200) + 55;
                let blue = Math.floor(Math.random() * 200) + 55;

                // 20% chance for a brick to be frozen (requires 2 hits)
                const isFrozen = Math.random() < 0.2;
                
                bricks.push({
                    x: x,
                    y: y + paddingTop,
                    width: brickWidth,
                    height: brickHeight,
                    alive: true,
                    color: `rgb(${red}, ${green}, ${blue})`,
                    frozen: isFrozen,
                    hits: isFrozen ? 2 : 1, // Frozen bricks need 2 hits
                    checked: false // Track if brick has been checked for power-up
                });
            }
        }
    }
}

// Draw bricks with gradient and frozen effects
export function drawBricks(ctx, canvas, difficulty = 'easy', currentLevel = 1) {
    // Draw level text only for infinity mode
    if (difficulty === 'infinity') {
        ctx.font = "24px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        // ctx.fillText("Level: " + currentLevel, canvas.width / 2, 30);
    }

    for (const brick of bricks) {
        if (brick.alive) {
            const brickWidth = brick.width;
            const brickHeight = brick.height;
            
            if (brick.frozen) {
                // Draw base brick color (dimmed under ice)
                const rgbMatch = brick.color.match(/\d+/g);
                const r = parseInt(rgbMatch[0]);
                const g = parseInt(rgbMatch[1]);
                const b = parseInt(rgbMatch[2]);
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
                ctx.fillRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight - 4);
                
                // Draw ice layer with gradient
                const iceGradient = ctx.createLinearGradient(
                    brick.x, 
                    brick.y, 
                    brick.x + brickWidth, 
                    brick.y + brickHeight
                );
                
                iceGradient.addColorStop(0, 'rgba(220, 240, 255, 0.95)');
                iceGradient.addColorStop(0.3, 'rgba(180, 220, 255, 0.9)');
                iceGradient.addColorStop(0.7, 'rgba(140, 200, 255, 0.9)');
                iceGradient.addColorStop(1, 'rgba(100, 180, 240, 0.95)');
                
                ctx.fillStyle = iceGradient;
                ctx.fillRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight - 4);
                
                // Draw ice shine at top
                const shineGradient = ctx.createLinearGradient(
                    brick.x, 
                    brick.y + 2, 
                    brick.x, 
                    brick.y + brickHeight * 0.4
                );
                shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
                shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = shineGradient;
                ctx.fillRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight * 0.4);
                
                // Draw ice crystals pattern
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                const centerX = brick.x + brickWidth / 2;
                const centerY = brick.y + brickHeight / 2;
                
                // Snowflake pattern
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 * i) / 6;
                    const length = Math.min(brickWidth, brickHeight) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(
                        centerX + Math.cos(angle) * length,
                        centerY + Math.sin(angle) * length
                    );
                    ctx.stroke();
                }
                
                // Draw frost border
                ctx.strokeStyle = 'rgba(200, 230, 255, 0.9)';
                ctx.lineWidth = 3;
                ctx.strokeRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight - 4);
                
                // Draw icicles at bottom
                ctx.fillStyle = 'rgba(180, 220, 255, 0.8)';
                const icicleCount = 4;
                for (let i = 0; i < icicleCount; i++) {
                    const icicleX = brick.x + (brickWidth / icicleCount) * i + (brickWidth / icicleCount / 2);
                    ctx.beginPath();
                    ctx.moveTo(icicleX - 3, brick.y + brickHeight - 2);
                    ctx.lineTo(icicleX, brick.y + brickHeight + 4);
                    ctx.lineTo(icicleX + 3, brick.y + brickHeight - 2);
                    ctx.closePath();
                    ctx.fill();
                }
                
            } else {
                // Draw normal bricks with gradient
                const gradient = ctx.createLinearGradient(
                    brick.x, 
                    brick.y, 
                    brick.x, 
                    brick.y + brickHeight
                );
                
                const rgbMatch = brick.color.match(/\d+/g);
                const r = parseInt(rgbMatch[0]);
                const g = parseInt(rgbMatch[1]);
                const b = parseInt(rgbMatch[2]);
                
                gradient.addColorStop(0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, 1)`);
                gradient.addColorStop(0.5, brick.color);
                gradient.addColorStop(1, `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 1)`);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight - 4);
            }
        }
    }
}

// Spawn a power-up when a brick is fully broken
export function spawnPowerUp(brick) {
    if (Math.random() < 0.3) { // 30% chance to spawn a power-up
        const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
        powerUps.push({
            x: brick.x + brick.width / 2,
            y: brick.y + brick.height / 2,
            radius: 10,
            type: type,
            color:
                type === "life"
                    ? "lime"
                    : type === "expand"
                    ? "deepskyblue"
                    : "red",
            active: true,
        });
    }
}

// Handle brick hit logic
export function hitBrick(brick) {
    brick.hits--;
    
    if (brick.hits > 0) {
        brick.frozen = false; // Remove ice layer if frozen
        return; // Brick is still alive
    }
    
    // Brick is fully broken
    brick.alive = false;
    brick.checked = true; // Mark as checked for power-up spawning
    spawnPowerUp(brick);
}

// Draw power-ups with custom shapes
export function drawPowerUps(ctx) {
    for (const p of powerUps) {
        if (p.active) {
            ctx.save();
            
            if (p.type === "life") {
                // Draw heart shape for life power-up
                ctx.fillStyle = "#DC143C";
                ctx.beginPath();
                
                const x = p.x;
                const y = p.y;
                const size = p.radius * 1.8;
                
                ctx.moveTo(x, y + size / 2);
                ctx.bezierCurveTo(x, y, x - size / 2, y - size / 3, x - size / 2, y + size / 6);
                ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size);
                ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 6);
                ctx.bezierCurveTo(x + size / 2, y - size / 3, x, y, x, y + size / 2);
                ctx.closePath();
                ctx.fill();
                
                ctx.strokeStyle = "#8B0000";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
            } else if (p.type === "expand") {
                // Draw expand arrows
                ctx.fillStyle = "#00BFFF";
                ctx.strokeStyle = "#00BFFF";
                ctx.lineWidth = 2;
                
                const x = p.x;
                const y = p.y;
                const size = p.radius;
                
                ctx.beginPath();
                ctx.moveTo(x - size * 1.2, y);
                ctx.lineTo(x - size * 0.3, y - size * 0.7);
                ctx.lineTo(x - size * 0.3, y - size * 0.3);
                ctx.lineTo(x + size * 0.3, y - size * 0.3);
                ctx.lineTo(x + size * 0.3, y + size * 0.3);
                ctx.lineTo(x - size * 0.3, y + size * 0.3);
                ctx.lineTo(x - size * 0.3, y + size * 0.7);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(x + size * 1.2, y);
                ctx.lineTo(x + size * 0.3, y - size * 0.7);
                ctx.lineTo(x + size * 0.3, y - size * 0.3);
                ctx.lineTo(x - size * 0.3, y - size * 0.3);
                ctx.lineTo(x - size * 0.3, y + size * 0.3);
                ctx.lineTo(x + size * 0.3, y + size * 0.3);
                ctx.lineTo(x + size * 0.3, y + size * 0.7);
                ctx.closePath();
                ctx.fill();
                
            } else if (p.type === "shrink") {
                // Draw shrink arrows
                ctx.fillStyle = "#FF4500";
                ctx.strokeStyle = "#FF4500";
                ctx.lineWidth = 2;
                
                const x = p.x;
                const y = p.y;
                const size = p.radius;
                
                ctx.beginPath();
                ctx.moveTo(x - size * 0.3, y);
                ctx.lineTo(x - size * 1.2, y - size * 0.7);
                ctx.lineTo(x - size * 1.2, y + size * 0.7);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(x + size * 0.3, y);
                ctx.lineTo(x + size * 1.2, y - size * 0.7);
                ctx.lineTo(x + size * 1.2, y + size * 0.7);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(x - size * 0.3, y - size * 0.5);
                ctx.lineTo(x - size * 0.3, y + size * 0.5);
                ctx.moveTo(x + size * 0.3, y - size * 0.5);
                ctx.lineTo(x + size * 0.3, y + size * 0.5);
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }
}

// Update power-up positions and handle collisions with paddle
export function updatePowerUps(paddle, canvas, livesObj) {
    for (const p of powerUps) {
        if (p.active) {
            p.y += 3; // Move power-up downward

            if (p.y > canvas.height) {
                p.active = false; // Remove power-up if it goes off-screen
            }

            // Check for collision with paddle
            const paddleY = canvas.height - paddle.height - 10;
            if (
                p.y + p.radius > paddleY &&
                p.x > paddle.x &&
                p.x < paddle.x + paddle.width
            ) {
                p.active = false; // Deactivate power-up

                if (p.type === "life") {
                    livesObj.lives++; // Add a life
                } else if (p.type === "expand") {
                    applyPowerUp("expand", 5000); // Expand paddle for 5 seconds
                } else if (p.type === "shrink") {
                    applyPowerUp("shrink", 5000); // Shrink paddle for 5 seconds
                }
            }
        }
    }
}

// Start the next level
function startNextLevel(canvas) {
    level++; // Increment level

    // Increase difficulty
    if (level <= 2) {
        brickRowCount++;
    } else {
        brickColCount += 2;
    }

    // Reset ball speed
    ball.dx = speed;
    ball.dy = -speed;
    speed++; // Increase speed for next level

    generateBricks(canvas); // Generate new bricks
}

// Check for level completion and handle progression
export function handleLevelCompletion(ball, paddle, canvas) {
    const allBroken = bricks.every((brick) => !brick.alive);

    if (allBroken) {
        // Show level complete modal and start next level on callback
        showLevelCompleteModal(level, () => {
            startNextLevel(canvas);
            ball.x = canvas.width / 2;
            ball.y = canvas.height - 50;
            paddle.x = (canvas.width - paddle.width) / 2;
        });
    }
}


// NEW: Reset progression back to level 1 and base difficulty
export function resetToLevelOne(canvas) {
    level = 1;
    brickRowCount = 4;
    brickColCount = 5;
    speed = 5;
    generateBricks(canvas);
}