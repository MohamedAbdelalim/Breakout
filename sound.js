// --- AUDIO ASSETS ---
export const backgroundSound = new Audio('sound/backg.mp3'); // background sound 
backgroundSound.loop = true;
backgroundSound.volume = 0.2;



export const hitSound = new Audio('sound/12.mp3');  // collision sound 
hitSound.volume = 0.05;

export const paddleSound = new Audio('sound/paddle.mp3');  // paddle sound 
paddleSound.volume = 0.05;

// fuction to make background sound work automatic when start loading the page 
export function backgroundsound() {
  backgroundSound.play();
}

