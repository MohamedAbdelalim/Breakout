
const canvas=document.getElementById("canvas")
const ctx=canvas.getContext("2d")

const paddleWidth = 100, paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleY =canvas.height-paddleHeight-5;
let rightPressed=false, leftPressed=false;


// voice 
export let hitSound = new Audio("12.mp3");       // voice for crush bricks
export let paddleSound = new Audio("paddle.mp3"); //sound for cruch paddle
export let bgMusic = new Audio("backg.mp3");         // background music
bgMusic.loop = true;   // for make it alwas working
bgMusic.volume = 0.5;  // sound volum

// this for make back ground sound work when user start to push any button 

export function backgroundsound() {
  bgMusic.play();
}

// document.addEventListener("keydown", () => {
//   bgMusic.play();
// }, { once: true }); // to make it done for just one time 



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

export function drawPaddle(){
  ctx.fillStyle="blue";
  ctx.fillRect(paddleX,paddleY,paddleWidth,paddleHeight);
}

 
// ball
    let x = canvas.width/2, y = canvas.height-30;
    let dx = 6, dy = -6, ballRadius = 8;



   
    let lives = 3;

    // draw ball
    function drawBall(){
      ctx.beginPath();
      ctx.arc(x,y,ballRadius,0,Math.PI*2);
      ctx.fillStyle="yellow"; ctx.fill(); ctx.closePath();
    }

    // draw lives 
   export function drawLives(){
      ctx.font="16px Arial";
      ctx.fillStyle="white";
      ctx.fillText("Lives: "+lives, canvas.width-100, 20);
    }



        // 🔹 الطوب (Bricks)
const brickRowCount = 4;
const brickColumnCount = 7;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

let bricks = [];
for(let c=0;c<brickColumnCount;c++){
  bricks[c]=[];
  for(let r=0;r<brickRowCount;r++){
    bricks[c][r] = {x:0,y:0,status:1};
  }
}

function drawBricks(){
  for(let c=0;c<brickColumnCount;c++){
    for(let r=0;r<brickRowCount;r++){
      if(bricks[c][r].status==1){
        let brickX = c*(brickWidth+brickPadding)+brickOffsetLeft;
        let brickY = r*(brickHeight+brickPadding)+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle="red";
        ctx.fillRect(brickX,brickY,brickWidth,brickHeight);
      }
    }
  }
}

// الكشف عن التصادم مع الطوب
function collisionDetection(){
  for(let c=0;c<brickColumnCount;c++){
    for(let r=0;r<brickRowCount;r++){
      let b = bricks[c][r];
      if(b.status==1){
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
          dy = -dy;
          b.status = 0; // الطوبة تختفي
          hitSound.play(); // sound of cruch bricks 
        }
      }
    }
  }
}






function draw(){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     drawBall(); 
      drawPaddle(); 
      drawLives();


       drawBricks();

      collisionDetection();

      backgroundsound();


      // ball reverce on padding 
      if(x+dx>canvas.width-ballRadius||x+dx<ballRadius) dx=-dx;
      if(y+dy<ballRadius) dy=-dy;  // upper canves
      else if(y+dy>canvas.height-ballRadius){
        if(x>paddleX&&x<paddleX+paddleWidth){
          dy=-dy;

          paddleSound.play(); // sound when crush paddle




        } else {
          lives--;
          if(!lives){
            alert("Game Over");
            document.location.reload();
          } else {
            // reset cordenation for ball & paddle 
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 6;
            dy = -6;
            paddleX = (canvas.width-paddleWidth)/2;
          }
        }
      }

  

      // ball moving 
      x+=dx; y+=dy;
  
  if(rightPressed&&paddleX<canvas.width-paddleWidth) paddleX+=5;
  if(leftPressed&&paddleX>0) paddleX-=5;

  requestAnimationFrame(draw); 
  // make recall of draw function to can see effictive of moving because canves working as frame after fram like videos 
  // we use it instead of set interval (1 - browser speed ----- 2- the move not clear on screen cutting -----
  //  3- save energy its stop refreshing if browser not showen not use processor so much )
}
draw();



