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




