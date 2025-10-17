// Utilities for lives rendering, per-user high scores, and leaderboard persistence

// Draw lives count on the canvas (top-right)
export function drawLives(ctx, lives) {
    const canvas = ctx.canvas;
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.fillText("Lives: " + lives, canvas.width - 20, 30);
}

// ----- Per-user High Score (localStorage) -----

function userKey(username) {
    return `brickBreaker_${username}`;
}

export function getHighScore(username) {
    if (!username) return 0;
    const value = localStorage.getItem(userKey(username));
    return value ? parseInt(value) : 0;
}

export function checkAndUpdateHighScore(score, username) {
    if (!username) return;
    const current = getHighScore(username);
    if (score > current) {
        localStorage.setItem(userKey(username), String(score));
        // also reflect to leaderboard store
        upsertLeaderboardScore(username, score);
    }
}

// ----- Leaderboard (top scores across users) -----

const LEADERBOARD_KEY = "brickBreaker_leaderboard";

function getLeaderboard() {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    try {
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setLeaderboard(entries) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

export function upsertLeaderboardScore(username, score) {
    if (!username) return;
    const list = getLeaderboard();
    const existingIndex = list.findIndex(e => e.username === username);
    if (existingIndex >= 0) {
        // keep the highest score
        if (score > list[existingIndex].score) {
            list[existingIndex].score = score;
        }
    } else {
        list.push({ username, score });
    }
    // sort desc by score and keep top 10
    list.sort((a, b) => b.score - a.score);
    setLeaderboard(list.slice(0, 10));
}

export function getLeaderboardTop(limit = 10) {
    const list = getLeaderboard();
    return list
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}


