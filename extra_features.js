const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("highScore")
              ? parseInt(localStorage.getItem("highScore"))                // instead of ifelse  "?" if this true ":" else 
              : 0;

function increaseScore() {
    score += 10;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
}

function drawScore() {
    ctx.font = "24px Helvetica";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("High Score: " + highScore, 20, 60);
}

function drawTopLine() {
    ctx.beginPath();
    ctx.moveTo(0, 80); // line starts at left edge (x=0, y=80)
    ctx.lineTo(canvas.width, 80);  // line goes all the way to the right
    ctx.strokeStyle = "white";   // line color
    ctx.lineWidth = 6;               // thickness
    ctx.stroke();
    ctx.closePath();
}

// Demo: increase score every 2 seconds
// setInterval(increaseScore, 2000);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScore();               // show score + highscore at top left
                               
    drawTopLine();                // draw separating line

    requestAnimationFrame(gameLoop);
}

gameLoop();
