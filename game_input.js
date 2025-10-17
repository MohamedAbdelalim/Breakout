import {paddle} from "./paddle.js";

// Get canvas reference
const canvas = document.getElementById('canvas');

// INPUT HANDLING 
export let rightPressed = false;
export let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// for right and left paddle movement
export function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
    else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
}

// for unpressed the left and right keys
export function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
    else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
}

// for mouse paddle movement
export function mouseMoveHandler(e) {
    // Get canvas position relative to viewport
    const canvasRect = canvas.getBoundingClientRect();
    let relativeX = e.clientX - canvasRect.left;
    
    // Scale mouse position to canvas coordinates
    const scaleX = canvas.width / canvasRect.width;
    relativeX *= scaleX;
    
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
}