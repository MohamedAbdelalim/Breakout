// -------------------- CANVAS SETUP --------------------
export let canvas = document.querySelector("canvas")
export let ctx = canvas.getContext("2d") 
export let canvasWidth = canvas.width 
export let canvasHeight = canvas.height 


// -------------------- BRICK SETTINGS --------------------
export let brickRowCount = 5
export let brickColCount = 10
export let brickWidth = canvasWidth / brickColCount 
export let brickHeight = canvasHeight / 20

export let paddingTop = 100;       // space from the top of the canvas for putting the score.
export let bricks = []


// -------------------- BRICK FUNCTIONS --------------------
export function generateBricks(rows, cols, brickWidth, brickHeight) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() < .8){
                let x = c * brickWidth
                let y = r * brickHeight

                // Generate random bright colors
                let red = Math.floor(Math.random() * 206) + 50
                let green = Math.floor(Math.random() * 206) + 50
                let blue = Math.floor(Math.random() * 206) + 50

                // Push brick object to array    
                bricks.push({
                    x: x ,
                    y: y + paddingTop,
                    width: brickWidth,
                    height: brickHeight,
                    alive: true,
                    color: `rgb(${red}, ${green}, ${blue})`,                               
                })
            }
        }
    }
}

export function drawBricks() {
    for (let brick of bricks) {
        if (brick.alive) {
            ctx.fillStyle = brick.color
            ctx.fillRect(brick.x + 5, brick.y + 5, brickWidth - 10, brickHeight - 10)
        }
    }
}


// -------------------- SCORE & UI --------------------
export let score = 0;

export let topBox = {
    x: 10,
    y: 10,
    width: canvasWidth - 20,
    height: 80
};

export function drawTopBox() {
  ctx.strokeStyle = "white";  
  ctx.lineWidth = 3;        
  ctx.strokeRect(topBox.x, topBox.y, topBox.width, topBox.height); 
};

export let scoreBox = {
    x: topBox.width * .75,
    y: topBox.y * 1.4,
    width: canvasWidth * .25,
    height: topBox.height - 8
}

export function drawScoreBox(score) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(scoreBox.x, scoreBox.y, scoreBox.width, scoreBox.height);

    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 
    ctx.fillText(`Score: ${score}`, scoreBox.x + scoreBox.width / 2, scoreBox.y + scoreBox.height / 2);
};


// -------------------- GAME FLOW --------------------
export let level = 1;

export function startNextLevel(){
    level++;

    if(level <=4){
        brickRowCount++
    }
    else{
        brickColCount += 2
    }

    brickWidth = canvasWidth / brickColCount;
    brickHeight = canvasHeight / 20;

    bricks = []
    generateBricks(brickRowCount, brickColCount, brickWidth, brickHeight);
}

export function resetGame (){
    level = 1;
    score = 0;
    lives = 3;
    brickRowCount = 5;
    brickColCount = 10;
    brickWidth = canvasWidth / brickColCount;
    brickHeight = canvasHeight / 20;
    bricks = [];
    generateBricks(brickRowCount, brickColCount, brickWidth, brickHeight);
}

export function handleLevelCompletion(){
    let allBroken = bricks.every(brick => !brick.alive);
    if (allBroken) {
       startNextLevel()
    }
}


