// Generate stars
const starsContainer = document.getElementById('stars');
const starCount = 200;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const size = Math.random() * 3;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    starsContainer.appendChild(star);
}

// Random shooting stars
setInterval(() => {
    if (Math.random() > 0.7) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.top = Math.random() * 50 + '%';
        starsContainer.appendChild(shootingStar);
        
        setTimeout(() => {
            shootingStar.remove();
        }, 2000);
    }
}, 3000);