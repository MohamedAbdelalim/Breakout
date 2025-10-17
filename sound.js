// --- AUDIO ASSETS ---
export const backgroundSound = new Audio('./sound/ibrkr01-20169.mp3'); // background sound 
backgroundSound.loop = true;
backgroundSound.volume = 0.05;
backgroundSound.preload = 'auto';

export const hitSound = new Audio('./sound/block-2-328875.mp3');  // collision sound 
hitSound.volume = 0.5;
hitSound.preload = 'auto';

export const paddleSound = new Audio('./sound/paddle.mp3');  // paddle sound 
paddleSound.volume = 0.05;
paddleSound.preload = 'auto';

// Sound state management
let isSoundEnabled = true;
let animationId = null;

// Function to play background sound
export function playBackgroundSound() {
    if (isSoundEnabled && backgroundSound.paused) {
        // Try to play the audio
        const playPromise = backgroundSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log('Background audio play failed:', e);
                // Try to load the audio again
                backgroundSound.load();
            });
        }
    }
}

// Function to play sound effect
export function playSound(sound) {
    if (isSoundEnabled) {
        sound.currentTime = 0; // Reset to beginning
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log('Sound effect play failed:', e);
                sound.load();
            });
        }
    }
}

// Function to stop background sound
export function stopBackgroundSound() {
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
}

// Function to toggle sound on/off
export function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    
    if (isSoundEnabled) {
        backgroundSound.volume = 0.2;
        hitSound.volume = 0.5;
        paddleSound.volume = 0.5;
        playBackgroundSound();
    } else {
        stopBackgroundSound();
        backgroundSound.volume = 0;
        hitSound.volume = 0;
        paddleSound.volume = 0;
    }
    
    return isSoundEnabled;
}

// Function to set music volume
export function setMusicVolume(volume) {
    const normalizedVolume = volume / 100;
    backgroundSound.volume = normalizedVolume * 0.2; // Keep max at 0.2
}

// Function to set SFX volume
export function setSFXVolume(volume) {
    const normalizedVolume = volume / 100;
    hitSound.volume = normalizedVolume * 0.5;
    paddleSound.volume = normalizedVolume * 0.5;
}

// Legacy function for compatibility
export function backgroundsound() {
    playBackgroundSound();
}

// Export sound state
export { isSoundEnabled };

