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