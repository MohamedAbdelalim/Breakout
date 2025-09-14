                                                   //LocalStorage & Score counting.


var currentScore = 0;  //score 0 at the begg.
var highscore = 0; 
   



function  ballcollision () {                                         // collision detection function.


    
}

function scoreDrawing () {                                           // drawing score function.
ctx.font = "25px , helvetica"                                       //Score font
ctx.fillStyle = "#000"                                           // score will be shown in black.
ctx.fillText = ("score : "+currentScore, 400 , 20)                          // x,y represent the place of the "Score" text 20px down and 20px up.
ctx.fillText("High Score: " + highScore, 400, 40);
}


function draw (){                                                   //calling the score function.

}


// if (localStorage.getItem("highScore")) {
//   highScore = parseInt(localStorage.getItem("highScore"));
// }