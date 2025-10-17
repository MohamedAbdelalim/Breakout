# 🎮 Brick Breaker - A Classic Arcade Game

Welcome to **Brick Breaker**, a modern take on the classic arcade game
built with **HTML5 Canvas** and **JavaScript**.

This project uses a modular structure with **ES6 modules** to create a
clean, organized, and feature-rich gameplay experience.

The objective is simple: clear all the bricks on the screen using a
bouncing ball and a movable paddle.

------------------------------------------------------------------------

## ✨ Features

This game includes a variety of modern features to enhance gameplay:

-   ✅ **Dynamic Level Progression**: The game gets progressively
    harder. After clearing a level, a new one is generated with more
    bricks and a faster ball.\
-   ✅ **Randomized Brick Layouts**: Each level has a unique, randomly
    generated pattern of bricks, making every playthrough different.\
-   ✅ **Scoring and High Score System**: Your score is tracked, and the
    highest score is saved to your browser's `localStorage`.\
-   ✅ **Dual Controls**: Control the paddle using either the mouse for
    precise movements or the left/right arrow keys for a classic feel.\
-   ✅ **Visual Effects**:
    -   Paddle Glow: A cool neon glow effect on the paddle.\
    -   Particle Animations: Bricks explode into a shower of particles
        when broken.\
-   ✅ **Sound and Music**: Includes background music and sound effects
    for hitting bricks and the paddle.

------------------------------------------------------------------------

## 🎮 How to Play

-   **Objective**: Break all the colored bricks on the screen without
    letting the ball fall past your paddle.\
-   **Controls**:
    -   🖱 **Mouse**: Move left/right to control the paddle.\
    -   ⌨️ **Keyboard**: Use the **Left Arrow** and **Right Arrow**
        keys.\
-   **Lives**: You start with **3 lives**. You lose a life each time the
    ball falls past the paddle. The game is over when you run out of
    lives.

------------------------------------------------------------------------

## 🚀 How to Run the Project

Because this project uses **JavaScript ES6 Modules (import/export)**,
you cannot run it by simply opening `index.html`.\
You must serve the files from a **local web server**.

The easiest way is with the **Live Server extension in Visual Studio
Code**:

1.  **Install VS Code** (if you don't already have it).\
2.  **Install Live Server**:
    -   Open VS Code → Extensions view.\
    -   Search for `Live Server` and install it.\
3.  **Run the Server**:
    -   Open your project folder in VS Code.\
    -   Right-click on `index.html`.\
    -   Select **Open with Live Server**.\
    -   Your browser will automatically open the game.

------------------------------------------------------------------------

## 📂 File Structure

The project is broken down into several JavaScript modules, each with a
specific responsibility:

\`\`\` 📦 Brick Breaker ┣ 📜 index.html \# Main HTML file with the game
canvas ┣ 📜 main.css \# Basic styling for the page and canvas ┣ 📜
game.js \# Game engine: manages state, score, lives, loop ┣ 📜 ball.js
\# Ball properties and drawing ┣ 📜 paddle.js \# Paddle properties and
drawing ┣ 📜 bricks.js \# Level progression & brick layouts ┣ 📜
collision.js \# Collision logic ┣ 📜 game_input.js \# Handles user input
(keyboard/mouse) ┣ 📜 extra_features.js \# Score, lives, high score
system (localStorage) ┣ 📜 bricks_animations.js# Particle explosion
effects ┗ 📜 sound.js \# Loads & plays audio effects and music \`\`\`