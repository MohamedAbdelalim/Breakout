
// Particle Effect properties
const PARTICLE_COUNT = 8; // Number of particles per broken brick
const PARTICLE_LIFETIME = 60; // Frames a particle lives
let particles = []; // Array to hold active particles


// Function to create particles when a brick breaks
export function createParticles(brickX, brickY, brickColor) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: brickX + brickInfo.width / 2, // Start at brick center
            y: brickY + brickInfo.height / 2,
            size: Math.random() * 8 + 3, // Random size for particles
            dx: (Math.random() - 0.5) * 8, // Random horizontal velocity
            dy: (Math.random() - 0.5) * 8, // Random vertical velocity
            color: brickColor,
            lifetime: PARTICLE_LIFETIME,
            maxLifetime: PARTICLE_LIFETIME
        });
    }
}



// Function to update and draw particles
export function drawParticles(ctx) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        // Update particle position
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.2; // Gravity effect

        // Reduce lifetime
        p.lifetime--;

        // Calculate opacity and size based on lifetime
        let opacity = p.lifetime / p.maxLifetime;
        let currentSize = p.size * opacity;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2); // Divide by 2 for radius
        ctx.fillStyle = `rgba(${parseInt(p.color.slice(1,3), 16)}, ${parseInt(p.color.slice(3,5), 16)}, ${parseInt(p.color.slice(5,7), 16)}, ${opacity})`;
        ctx.fill();
        ctx.closePath();

        // Remove dead particles
        if (p.lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}