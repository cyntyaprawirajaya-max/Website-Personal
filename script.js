/* ============================================
   NEON_HEART.exe — Cyberpunk Love Letter
   ============================================ */

// ============ PARTICLES SYSTEM ============
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 10;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.6 + 0.2;
    const colors = ['0, 240, 255', '255, 43, 214', '180, 0, 255'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${this.color}, 0.8)`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur = 0;
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============ STEP NAVIGATION ============
const sections = document.querySelectorAll('.section');
const nextButtons = document.querySelectorAll('.next-btn');

function showSection(stepNumber) {
  sections.forEach(section => {
    const step = parseInt(section.dataset.step);
    if (step === stepNumber) {
      section.classList.remove('hidden');
      // Re-trigger animation
      section.style.animation = 'none';
      section.offsetHeight; // force reflow
      section.style.animation = 'fadeInUp 0.8s ease-out';
      // Trigger child animations
      triggerChildAnimations(section, stepNumber);
    } else {
      section.classList.add('hidden');
    }
  });
  // Scroll to top of new section smoothly
  setTimeout(() => {
    document.getElementById(`step${stepNumber}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}

function triggerChildAnimations(section, stepNumber) {
  if (stepNumber === 1) {
    // Typewriter effect for greeting
    typewriterEffect(section.querySelector('.typewriter'));
  }
  if (stepNumber === 3) {
    // Staggered card animations
    const cards = section.querySelectorAll('.reason-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 200}ms`;
    });
  }
  if (stepNumber === 4) {
    // Staggered list animations
    const items = section.querySelectorAll('.hope-list li');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 250}ms`;
    });
  }
}

// Typewriter effect
function typewriterEffect(element) {
  if (!element) return;
  const fullText = element.textContent;
  element.textContent = '';
  element.style.borderRight = '2px solid var(--neon-cyan)';
  let i = 0;
  const speed = 40;
  function type() {
    if (i < fullText.length) {
      element.textContent += fullText.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Keep caret blinking
      setTimeout(() => {
        element.style.borderRight = 'none';
      }, 2000);
    }
  }
  type();
}

// Button click handlers
nextButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const nextStep = parseInt(btn.dataset.next);
    showSection(nextStep);
  });
});

// Restart button
document.getElementById('restartBtn').addEventListener('click', () => {
  showSection(1);
});

// ============ GLITCH EFFECT ON HOVER ============
document.querySelectorAll('.glitch').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'glitchText 0.5s';
    setTimeout(() => {
      el.style.animation = 'glitchText 4s infinite';
    }, 500);
  });
});

// ============ INITIAL LOAD ============
window.addEventListener('load', () => {
  showSection(1);
});