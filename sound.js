// --- AUDIO ASSETS ---
export const backgroundSound = new Audio('sound/backg.mp3');
backgroundSound.loop = true;
backgroundSound.volume = 0.2;



export const hitSound = new Audio('sound/12.mp3');
hitSound.volume = 0.05;

export const paddleSound = new Audio('sound/paddle.mp3'); 
paddleSound.volume = 0.05;


export function backgroundsound() {
  backgroundSound.play();
}

