/*
const canvas=document.getElementById("canvas")
const ctx=canvas.getContext("2d")

const paddleWidth = 75, paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleY =canvas.height-paddleHeight-5;
let rightPressed=false, leftPressed=false;

// events effect

document.addEventListener("keydown",e=>{
  if(e.key=="ArrowRight") rightPressed=true;
  if(e.key=="ArrowLeft") leftPressed=true;
});
document.addEventListener("keyup",e=>{
  if(e.key=="ArrowRight") rightPressed=false;
  if(e.key=="ArrowLeft") leftPressed=false;
});

document.addEventListener("mousemove", e => {
  let mouseX = e.clientX - canvas.offsetLeft;
  // e.clientx  detect mouse location on x directory on screen for browser
  //canvas.offsetLeft detect begining of canvas from left 

  paddleX = mouseX - paddleWidth / 2;
  // to make center of paddle follow up mouse moving 
  
  if (paddleX < 0) paddleX = 0;
  if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
});

// paddel shape

function drawPaddle(){
  ctx.fillStyle="blue";
  ctx.fillRect(paddleX,paddleY,paddleWidth,paddleHeight);
}





function draw(){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     drawPaddle();

  

  
  if(rightPressed&&paddleX<canvas.width-paddleWidth) paddleX+=5;
  if(leftPressed&&paddleX>0) paddleX-=5;

  requestAnimationFrame(draw); 
  // make recall of draw function to can see effictive of moving because canves working as frame after fram like videos 
  // we use it instead of set interval (1 - browser speed ----- 2- the move not clear on screen cutting -----
  //  3- save energy its stop refreshing if browser not showen not use processor so much )
}
draw();



// -------------------------------------

let lives = 3;

function drawLives(){
  ctx.font="16px Arial";
  ctx.fillStyle="red";
  ctx.fillText("Lives: "+lives, canvas.width-80, 20);
}


*/


    const canvas = document.getElementById("game");
        const ctx = canvas.getContext("2d");

        // الكرة
        let x = canvas.width / 2, y = canvas.height - 30;
        let dx = 2, dy = -2, ballRadius = 8;

        // اللوح
        const paddleWidth = 75, paddleHeight = 10;
        let paddleX = (canvas.width - paddleWidth) / 2;
        let rightPressed = false, leftPressed = false;

        // الأرواح
        let lives = 3;

        // لوحة المفاتيح
        document.addEventListener("keydown", e => {
            if (e.key == "ArrowRight") rightPressed = true;
            if (e.key == "ArrowLeft") leftPressed = true;
        });
        document.addEventListener("keyup", e => {
            if (e.key == "ArrowRight") rightPressed = false;
            if (e.key == "ArrowLeft") leftPressed = false;
        });

        document.addEventListener("mousemove", e => {
            let mouseX = e.clientX - canvas.offsetLeft;
            // e.clientx  detect mouse location on x directory on screen for browser
            //canvas.offsetLeft detect begining of canvas from left 

            paddleX = mouseX - paddleWidth / 2;
            // to make center of paddle follow up mouse moving 

            if (paddleX < 0) paddleX = 0;
            if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
        });

        // رسم الكرة
        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "yellow"; ctx.fill(); ctx.closePath();
        }

        // رسم اللوح
        function drawPaddle() {
            ctx.fillStyle = "lime";
            ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        }

        // رسم الأرواح
        function drawLives() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
        }

        // الحلقة الرئيسية
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawPaddle();
            drawLives();

            // ارتداد الكرة من الحواف
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
            if (y + dy < ballRadius) dy = -dy;
            else if (y + dy > canvas.height - ballRadius) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    lives--;
                    if (!lives) {
                        alert("Game Over");
                        document.location.reload();
                    } else {
                        // إعادة ضبط الكرة واللوح فقط
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 2;
                        dy = -2;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }

            // تحريك اللوح
            if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
            if (leftPressed && paddleX > 0) paddleX -= 5;

            // تحريك الكرة
            x += dx; y += dy;
            requestAnimationFrame(draw);
        }
        draw();