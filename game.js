import { ball, drawBall } from "./ball.js";
import { paddle, drawPaddle ,expandPaddle, boostPaddleSpeed,shrinkagePaddle} from "./paddle.js";
import { bricks, generateBricks, drawBricks, handleLevelCompletion } from "./bricks.js";
import { brickCollisionDetection } from "./collision.js";
import { rightPressed, leftPressed } from "./game_input.js";
import { drawParticles } from "./bricks_animations.js";
import { drawScore, drawLives, checkAndUpdateHighScore } from "./extra_features.js";
import { backgroundsound, hitSound, paddleSound, backgroundSound } from "./sound.js";




const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// menu
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startBtn');
const scoreBtn = document.getElementById('scoreBtn');
const levelsBtn = document.getElementById('levelsBtn');
const soundBtn = document.getElementById('soundBtn'); 
const infoText = document.getElementById('infoText');

let gameState = { score: 0, lives: 3 };
let isSoundOn = false; // sound default 

// back ground sound button
soundBtn.addEventListener('click', () => {
  if (isSoundOn) {
    backgroundSound.pause();
    isSoundOn = false;
    soundBtn.textContent = " Sound: OFF";
  } else {
    backgroundSound.play();
    isSoundOn = true;
    soundBtn.textContent = " Sound: ON";
  }
});

// high score button
scoreBtn.addEventListener('click', () => {


  //  const scores = loadScores();
  // if (scores.length === 0) {
  //   alert("🚫 No scores saved yet!");
  //   return;
  // }
  // showLeaderboard();

  // showLeaderboard(); // show leaderboard table

  const highScore = localStorage.getItem('highScore') || 0;
  infoText.textContent = `🏆 Highest Score: ${highScore}`;
});

// levels button
levelsBtn.addEventListener('click', () => {
  infoText.textContent = " Levels feature coming soon!";
});

// start button
startBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  if (isSoundOn) backgroundSound.play(); // for chech sound


  // const name = prompt("enter your name");
  //     if (!name) return alert("You must enter a name!");

  //     // Here you can calculate the score based on your game
  //     const randomScore = Math.floor(Math.random() * 100); // Temporary example
  //     alert(`Your score: ${randomScore}`);

  //     saveScore(name, randomScore);
  //     console.log("Saved score:", loadScores());



  startGame();
});



function init() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 50;
  paddle.x = (canvas.width - paddle.width) / 2;
  generateBricks(canvas);
}

let animationId; // var for save fram number

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks(ctx);
  drawParticles(ctx);
  drawBall(ctx);
  drawPaddle(ctx);
  drawScore(ctx, gameState.score);
  drawLives(ctx, gameState.lives);
  backgroundsound();

  let scoreFromCollision = brickCollisionDetection(ball, bricks);
  if (scoreFromCollision > 0) {
    gameState.score += scoreFromCollision;
    checkAndUpdateHighScore(gameState.score);
     if (isSoundOn) hitSound.play(); // make collection sound play when be in on mode 
  }

  handleLevelCompletion(ball, paddle, canvas);

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.speed;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius)
    ball.dx = -ball.dx;

  if (ball.y + ball.dy < ball.radius)
    ball.dy = -ball.dy;
  else if (ball.y + ball.dy > canvas.height - (ball.radius * 2)) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
      if (isSoundOn) paddleSound.play(); // make padle sound play when be in on mode 

    } else {
      gameState.lives--;
      if (gameState.lives <= 0) {
        // for return to main menu when lost 
        alert(`GAME OVER\nFinal Score: ${gameState.score}`);
        showMenu();
        return; // stop game
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        paddle.x = (canvas.width - paddle.width) / 2;
        ball.dy *= -1;
      }
    }
  }

  animationId = requestAnimationFrame(draw);
}

function startGame() {
  init();
  draw();
}

window.onload = () => {
  canvas.style.display = 'none';
};



function showMenu() {
  // sound off
  backgroundSound.pause();
  backgroundSound.currentTime = 0;

  // stop drawing in frames 
  cancelAnimationFrame(animationId);

  // stop canvas and show menu 
  canvas.style.display = 'none';
  menu.style.display = 'block';

  // reset
  gameState.score = 0;
  gameState.lives = 3;

  // update high score text 
  const highScore = localStorage.getItem('highScore') || 0;
  infoText.textContent = ` Highest Score: ${highScore}`;

  // update sound button text
  soundBtn.textContent = isSoundOn ? " Sound: ON" : " Sound: OFF";
}




// const STORAGE_KEY = "game_scores";

    // // دالة لتحميل النتائج القديمة
    // function loadScores() {
    //   return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // }

    // // دالة لحفظ نتيجة جديدة
    // function saveScore(name, score) {
    //   const scores = loadScores();
    //   scores.push({ name, score, time: new Date().toLocaleString() });
    //   localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    // }

    // // عرض الجدول
    // function showLeaderboard() {
    //   const table = document.getElementById("leaderboard");
    //   const tbody = table.querySelector("tbody");
    //   tbody.innerHTML = "";

    //   const scores = loadScores().sort((a, b) => b.score - a.score);

    //   scores.forEach((s, i) => {
    //     const row = `<tr>
    //       <td>${i + 1}</td>
    //       <td>${s.name}</td>
    //       <td>${s.score}</td>
    //       <td>${s.time}</td>
    //     </tr>`;
    //     tbody.innerHTML += row;
    //   });

    //   table.style.display = "table";
    // }



    // document.getElementById("startBtn").addEventListener("click", () => {
    //   const name = prompt("enter your name");
    //   if (!name) return alert("You must enter a name!");

    //   // Here you can calculate the score based on your game
    //   const randomScore = Math.floor(Math.random() * 100); // Temporary example
    //   alert(`Your score: ${randomScore}`);

    //   saveScore(name, randomScore);
    // });


     
    // document.getElementById("scoreBtn").addEventListener("click", showLeaderboard);
 





//     function loadScores() {
//   try {
//     return JSON.parse(localStorage.getItem("game_scores")) || [];
//   } catch {
//     return [];
//   }
// }

// function saveScore(name, score) {
//   const scores = loadScores();
//   scores.push({ name, score, time: new Date().toLocaleString() });
//   localStorage.setItem("game_scores", JSON.stringify(scores));
//   console.log("✅ Saved:", scores);
// }

// function showLeaderboard() {
//   const table = document.getElementById("leaderboard");
//   const tbody = table.querySelector("tbody");
//   tbody.innerHTML = "";

//   const scores = loadScores().sort((a, b) => b.score - a.score);
//   if (scores.length === 0) {
//     alert("🚫 No saved scores yet!");
//     return;
//   }

//   scores.forEach((s, i) => {
//     const row = `<tr>
//       <td>${i + 1}</td>
//       <td>${s.name}</td>
//       <td>${s.score}</td>
//       <td>${s.time}</td>
//     </tr>`;
//     tbody.innerHTML += row;
//   });

//   table.style.display = "table";
// }


