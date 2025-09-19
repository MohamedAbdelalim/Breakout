let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d") 
let canvasWidth = canvas.width 
let canvasHeight = canvas.height 
let brickRowCount =  5  
let brickColCount = 10
let brickWidth = canvasWidth / brickColCount 
let brickHeight = canvasHeight / 20

let paddingTop = 100;
let paddingX = 20;
let bricks = []
let powerUpTypes = ["extraLife", "biggerPaddle", "multiBall"];


function generateBricks(rows, cols, brickWidth, brickHeight) {


    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
    

                let x = c * brickWidth
                let y = r * brickHeight
                let red = Math.floor(Math.random() * 256)
                let green = Math.floor(Math.random() * 256)
                let blue = Math.floor(Math.random() * 256)

                let powerUp = null;
                if (Math.random() < 0.3) { 

                    powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                }

    
                bricks.push({
                                x: x ,
                                y: y + paddingTop,
                                width: brickWidth,
                                height: brickHeight,
                                alive: true,
                                colors: `rgb(${red}, ${green}, ${blue})`,
                                powerUpType: powerUp,
                                
                                

                            })
                 }
    }
}

generateBricks(brickRowCount, brickColCount, brickWidth, brickHeight)


function drawBricks() {
    for (let brick of bricks) {
        if (brick.alive) {
            ctx.fillStyle = brick.colors
            ctx.fillRect(brick.x, brick.y, brickWidth - 10, brickHeight - 10)
        }
    }
}



let score =0;

// topBox for declare the the score, high score , and lives.

let topBox = {
    x: 10,
    y: 10,
    width: canvasWidth - 20,
    height: 80
};

function drawTopBox() {
  ctx.strokeStyle = "white";  
  ctx.lineWidth = 3;        
  ctx.strokeRect(topBox.x, topBox.y,topBox.width, topBox.height); 
};

drawTopBox()

// draw the score box and its text 

let scoreBox = {
      x: topBox.width * .75,
      y: topBox.y * 1.4,
      width: canvasWidth * .25,
      height: topBox.height - 8
}

function drawScoreBox(score) {

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(scoreBox.x, scoreBox.y, scoreBox.width, scoreBox.height);

    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    ctx.fillText(`Score: ${score}`, scoreBox.x + scoreBox.width / 2, scoreBox.y + scoreBox.height / 2);
   };

drawScoreBox(score)