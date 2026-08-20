/* ==========================================================================
   EVERMINE — PREMIUM ROMANTIC REVEAL EXPERIENCE ENGINE
   ========================================================================== */

/* ==========================================================================
   1. MASTER CONFIGURATION OBJECT
   ==========================================================================
   Customize all names, messages, quote, colors, audio, and photo options here.
   ========================================================================== */
const LOVE_CONFIG = {
  // Recipient and Partner Names
  name: "Surya", // Recipient Name
  partnerName: "Tharani", // Partner's Name

  // Scene 1 text
  openingText: "I made something for you...",

  // Scene 3 typography
  salutation: "For You,",
  loveTitle: "Surya ♡",
  subtitle: "A little corner of the internet that belongs to us.",

  // Scene 4 quote & button
  quote: "You are my today and all of my tomorrows.",
  buttonText: "Let's Begin →",

  // Romantic Palette Tokens
  colors: {
    bgDark: "#0A0A0A",
    deepRose: "#7A1235",
    crimson: "#C2184B",
    pink: "#FF2D6B",
    softPink: "#FF6B9D",
    lightPink: "#FFB6C9",
    white: "#FFFFFF",
    warmCream: "#FFF3F5"
  },

  // Optional background music track (muted by default)
  // Change URL to any local audio asset (e.g., "assets/poove_mudhal_poove.m4a")
  musicUrl: "assets/poove_mudhal_poove.m4a",
  musicEnabled: true,

  // Scene timing parameters (ms)
  scene3Duration: 3500,    // Auto-advance time for Scene 3
  explosionDuration: 2200  // Heart explosion duration before Scene 3
};

/* ==========================================================================
   FUTURE PHOTO SUPPORT NOTE:
   To replace the abstract SVG couple silhouette with a real photo:
   1. Add your photo file to `assets/hero_couple.png` (or public/images/couple.jpg)
   2. In function createScene4HTML(), replace the <svg class="couple-silhouette-svg">
      with: <img src="assets/hero_couple.png" alt="Couple" class="reveal-couple-img">
   ========================================================================== */

// ENGINE STATE & CANVAS ANIMATION IDS
let currentRevealScene = 1;
let starfieldAnimId = null;
let explosionAnimId = null;
let petalsAnimId = null;
let scene3Timer = null;
let bgMusicAudio = null;
let isAudioPlaying = false;
let isExplosionRunning = false;

// DOM CONTENT LOAD INITIALIZER
document.addEventListener('DOMContentLoaded', () => {
  initRevealOverlay();
});

/* ==========================================================================
   2. INITIALIZE & BUILD REVEAL OVERLAY STRUCTURE
   ========================================================================== */
function initRevealOverlay() {
  let overlay = document.getElementById('romantic-reveal-overlay');
  
  // Create overlay container dynamically if not present in HTML
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'romantic-reveal-overlay';
    document.body.prepend(overlay);
  }

  // Populate inner HTML with discreet controls, canvas layers, and scenes
  overlay.innerHTML = `
    <!-- DISCREET CONTROL BAR -->
    <div class="reveal-top-bar">
      <button id="reveal-audio-btn" class="reveal-control-btn" onclick="toggleRevealAudio()" title="Toggle Romantic Audio">
        <i class="fa-solid fa-volume-xmark" id="audio-icon"></i> <span id="audio-label">Music</span>
      </button>
      <button id="reveal-skip-btn" class="reveal-control-btn" onclick="skipToMainWebsite()" title="Skip Reveal">
        <span>Skip Intro</span> <i class="fa-solid fa-forward"></i>
      </button>
    </div>

    <!-- AUDIO PLAYER WITH MULTI-SOURCE FALLBACKS -->
    <audio id="reveal-bg-music" loop preload="auto">
      <source src="assets/kannukkullai_unnai_vaithai.wav" type="audio/wav">
      <source src="assets/kannukkullai_unnai_vaithai.m4a" type="audio/mp4">
      <source src="assets/poove_mudhal_poove.m4a" type="audio/mp4">
      <source src="assets/ennai_thaalattum.m4a" type="audio/mp4">
    </audio>

    <!-- BACKGROUND GRADIENT LAYERS -->
    <div id="reveal-bg-scene3" class="reveal-bg-layer"></div>
    <div id="reveal-bg-scene4" class="reveal-bg-layer"></div>

    <!-- CANVAS LAYERS -->
    <canvas id="reveal-starfield-canvas" class="reveal-canvas-layer"></canvas>
    <canvas id="reveal-explosion-canvas" class="reveal-canvas-layer"></canvas>
    <canvas id="reveal-petals-canvas" class="reveal-canvas-layer"></canvas>

    <!-- EXPLOSION FLASH -->
    <div id="reveal-flash-overlay"></div>

    <!-- SCENE 1: I MADE SOMETHING FOR YOU -->
    <div id="reveal-scene-1" class="reveal-scene active">
      <div class="neon-heart-wrapper" id="scene1-heart-container">
        <svg viewBox="0 0 100 100" class="neon-heart-svg" id="neon-heart-svg">
          <path d="M50 88 C20 62, 5 45, 5 28 C5 14, 16 5, 30 5 C39 5, 46 10, 50 16 C54 10, 61 5, 70 5 C84 5, 95 14, 95 28 C95 45, 80 62, 50 88 Z" />
        </svg>
      </div>
      <h2 class="reveal-scene1-text">${LOVE_CONFIG.openingText}</h2>
      <button class="reveal-btn-heart" id="btn-open-heart" onclick="triggerScene2Explosion()">
        Open My Heart 💗
      </button>
    </div>

    <!-- SCENE 3: NAME REVEAL -->
    <div id="reveal-scene-3" class="reveal-scene reveal-scene-3" onclick="advanceFromScene3()">
      <p class="reveal-for-you">${LOVE_CONFIG.salutation}</p>
      <h1 class="reveal-my-love">${LOVE_CONFIG.name ? LOVE_CONFIG.name + ' ♡' : LOVE_CONFIG.loveTitle}</h1>
      <p class="reveal-subtitle">${LOVE_CONFIG.subtitle}</p>
      <div class="reveal-divider">
        <span class="line"></span>
        <span class="heart-icon">♡</span>
        <span class="line"></span>
      </div>
    </div>

    <!-- SCENE 4: WELCOME PAGE -->
    <div id="reveal-scene-4" class="reveal-scene reveal-scene-4">
      <div class="sunset-bokeh-container">
        <div class="bokeh-circle bokeh-1"></div>
        <div class="bokeh-circle bokeh-2"></div>
        <div class="bokeh-circle bokeh-3"></div>
      </div>

      <!-- City Skyline Silhouette -->
      <svg class="skyline-svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,120 L0,95 L40,95 L40,70 L70,70 L70,95 L110,95 L110,60 L150,60 L150,95 L210,95 L210,40 L260,40 L260,95 L320,95 L320,80 L380,80 L380,95 L450,95 L450,50 L510,50 L510,95 L580,95 L580,30 L630,30 L630,95 L700,95 L700,75 L760,75 L760,95 L820,95 L820,45 L880,45 L880,95 L950,95 L950,65 L1010,65 L1010,95 L1080,95 L1080,85 L1200,85 L1200,120 Z" fill="#0A0A0A" opacity="0.85"/>
      </svg>

      <!-- ARTISTIC COUPLE SILHOUETTE & SUNSET ARTWORK -->
      <div class="reveal-couple-container" id="reveal-couple-slot">
        <div class="reveal-couple-artwork">
          <img src="assets/couple_sunset_illustration.jpg" alt="Tharani & Surya Couple Sunset" class="reveal-couple-img">
          <div class="couple-img-overlay-glow"></div>
        </div>
      </div>

      <!-- QUOTE & ACTION BUTTON -->
      <p class="reveal-quote">"${LOVE_CONFIG.quote}"</p>
      <button class="reveal-btn-begin" id="btn-reveal-begin" onclick="triggerScene5Launch()">
        ${LOVE_CONFIG.buttonText}
      </button>
    </div>

    <!-- SCENE 5 APP ICON SHOWCASE -->
    <div id="reveal-app-icon-wrap">
      <img src="assets/romantic_app_icon.png" alt="Evermine Romantic App Icon" class="reveal-app-icon-img">
    </div>
  `;

  // Audio setup
  bgMusicAudio = document.getElementById('reveal-bg-music');

  // Start background starfield canvas animation
  initStarfieldCanvas();

  // Keyboard Navigation Handler
  window.addEventListener('keydown', handleGlobalKeydown);
}

/* ==========================================================================
   3. STARFIELD CANVAS ANIMATION (SCENE 1)
   ========================================================================== */
function initStarfieldCanvas() {
  const canvas = document.getElementById('reveal-starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    if (currentRevealScene !== 1) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const starCount = Math.min(80, Math.floor(width / 15));
  const stars = [];
  const starColors = ['#FFFFFF', '#FFB6C9', '#FF2D6B', '#C2184B'];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15
    });
  }

  function drawStarfield() {
    if (currentRevealScene > 2) return;
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.alpha += s.alphaSpeed;

      if (s.alpha >= 1 || s.alpha <= 0.1) s.alphaSpeed = -s.alphaSpeed;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.size * 3;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    starfieldAnimId = requestAnimationFrame(drawStarfield);
  }

  if (starfieldAnimId) cancelAnimationFrame(starfieldAnimId);
  drawStarfield();
}

/* ==========================================================================
   4. SCENE 2: HEART EXPLOSION CANVASES
   ========================================================================== */
function triggerScene2Explosion() {
  if (isExplosionRunning) return;
  isExplosionRunning = true;

  // Start romantic audio on user gesture
  playRevealAudio();

  const scene1 = document.getElementById('reveal-scene-1');
  const heartSvg = document.getElementById('neon-heart-svg');
  const btn = document.getElementById('btn-open-heart');
  const flash = document.getElementById('reveal-flash-overlay');

  if (btn) btn.disabled = true;

  // Step 1 (0–500ms): Heart intensifies & pulses rapidly
  if (heartSvg) {
    heartSvg.style.transition = 'transform 0.4s ease-in, filter 0.4s ease-in';
    heartSvg.style.transform = 'scale(1.25)';
    heartSvg.style.filter = 'drop-shadow(0 0 35px #FF2D6B) drop-shadow(0 0 60px #FFFFFF)';
  }

  // Step 2 (500–800ms): Radial flash peak
  setTimeout(() => {
    if (flash) flash.classList.add('active');
    if (scene1) scene1.style.opacity = '0';
  }, 500);

  // Step 3 (800ms): Launch particle explosion
  setTimeout(() => {
    if (flash) flash.classList.remove('active');
    if (scene1) {
      scene1.classList.remove('active');
      scene1.style.display = 'none';
    }
    runExplosionParticles();
  }, 800);

  // Step 4 (2200ms): Auto transition to Scene 3
  setTimeout(() => {
    if (starfieldAnimId) cancelAnimationFrame(starfieldAnimId);
    goToScene3();
  }, LOVE_CONFIG.explosionDuration);
}

function runExplosionParticles() {
  const canvas = document.getElementById('reveal-explosion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height / 2;

  const particleCount = window.innerWidth < 480 ? 200 : 350;
  const particles = [];
  const colors = ['#FF2D6B', '#C2184B', '#FF6B9D', '#FFB6C9', '#FFFFFF', '#FFF3F5'];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 11 + 2.5;
    const isHeart = Math.random() < 0.28;

    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: isHeart ? Math.random() * 8 + 8 : Math.random() * 4.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.014 + 0.008,
      gravity: 0.06,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      isHeart: isHeart
    });
  }

  function drawExplosion() {
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;
    particles.forEach(p => {
      if (p.alpha <= 0) return;
      activeCount++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.isHeart) {
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText('♥', -p.size / 2, p.size / 2);
      } else {
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (activeCount > 0) {
      explosionAnimId = requestAnimationFrame(drawExplosion);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  if (explosionAnimId) cancelAnimationFrame(explosionAnimId);
  drawExplosion();
}

/* ==========================================================================
   5. SCENE 3: NAME REVEAL & FALLING PETALS
   ========================================================================== */
function goToScene3() {
  currentRevealScene = 3;

  const bg3 = document.getElementById('reveal-bg-scene3');
  const scene3 = document.getElementById('reveal-scene-3');

  if (bg3) bg3.classList.add('active');
  if (scene3) {
    scene3.classList.add('active');
    setTimeout(() => scene3.classList.add('animated'), 50);
  }

  // Start falling rose petals & heart particles
  initPetalsCanvas();

  // Auto-advance timer (3.5s)
  scene3Timer = setTimeout(() => {
    goToScene4();
  }, LOVE_CONFIG.scene3Duration);
}

function advanceFromScene3() {
  if (currentRevealScene !== 3) return;
  if (scene3Timer) clearTimeout(scene3Timer);
  goToScene4();
}

function initPetalsCanvas() {
  const canvas = document.getElementById('reveal-petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const petalCount = 30;
  const petals = [];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 10 + 8,
      speedY: Math.random() * 1.2 + 0.6,
      sway: Math.random() * 2 + 0.5,
      swayAngle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.6 + 0.3,
      isHeart: Math.random() > 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04
    });
  }

  function drawPetals() {
    if (currentRevealScene > 4) return;
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y += p.speedY;
      p.swayAngle += 0.02;
      p.x += Math.sin(p.swayAngle) * p.sway * 0.5;
      p.rotation += p.rotSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.isHeart) {
        ctx.fillStyle = '#C2184B';
        ctx.font = `${p.size * 1.2}px sans-serif`;
        ctx.fillText('♡', 0, 0);
      } else {
        // Soft Rose Petal Path
        ctx.fillStyle = '#E99AAD';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    petalsAnimId = requestAnimationFrame(drawPetals);
  }

  if (petalsAnimId) cancelAnimationFrame(petalsAnimId);
  drawPetals();
}

/* ==========================================================================
   6. SCENE 4: WELCOME PAGE (ABSTRACT SUNSET & COUPLE)
   ========================================================================== */
function goToScene4() {
  currentRevealScene = 4;

  const bg3 = document.getElementById('reveal-bg-scene3');
  const bg4 = document.getElementById('reveal-bg-scene4');
  const scene3 = document.getElementById('reveal-scene-3');
  const scene4 = document.getElementById('reveal-scene-4');

  if (bg3) bg3.classList.remove('active');
  if (scene3) scene3.classList.remove('active');

  if (bg4) bg4.classList.add('active');
  if (scene4) scene4.classList.add('active');
}

/* ==========================================================================
   7. SCENE 5: WEBSITE SHOWCASE REVEAL (APP ICON EXPANSION)
   ========================================================================== */
function triggerScene5Launch() {
  if (currentRevealScene === 'launch' || currentRevealScene === 'completed') return;
  currentRevealScene = 'launch';

  const scene4 = document.getElementById('reveal-scene-4');
  const iconWrap = document.getElementById('reveal-app-icon-wrap');
  const overlay = document.getElementById('romantic-reveal-overlay');
  const btn = document.getElementById('btn-reveal-begin');

  if (btn) btn.disabled = true;

  // Step 1 (0–400ms): Scene 4 zoom & blur transition out
  if (scene4) scene4.classList.add('zoom-out');

  // Step 2 (400ms): Centered App Icon appears with sparkle burst
  setTimeout(() => {
    if (scene4) scene4.classList.remove('active');
    if (iconWrap) iconWrap.classList.add('appear');
  }, 400);

  // Step 3 (900ms): Icon pop feedback effect
  setTimeout(() => {
    if (iconWrap) iconWrap.classList.add('pop');
  }, 900);

  // Step 4 (1150ms): Website launch rapid expansion zoom
  setTimeout(() => {
    if (iconWrap) {
      iconWrap.classList.remove('pop');
      iconWrap.classList.add('expand-launch');
    }
  }, 1150);

  // Final Reveal (1700ms): Fade out reveal overlay & present existing homepage
  setTimeout(() => {
    completeRevealExperience();
  }, 1700);
}

/* ==========================================================================
   8. COMPLETE & SKIP HANDLERS
   ========================================================================== */
function completeRevealExperience() {
  currentRevealScene = 'completed';

  const overlay = document.getElementById('romantic-reveal-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 800);
  }

  // Cancel all active canvas animation frames to free CPU
  if (starfieldAnimId) cancelAnimationFrame(starfieldAnimId);
  if (explosionAnimId) cancelAnimationFrame(explosionAnimId);
  if (petalsAnimId) cancelAnimationFrame(petalsAnimId);

  // Seamlessly transition audio to main website player if music was playing
  if (isAudioPlaying) {
    if (bgMusicAudio) bgMusicAudio.pause();
    if (typeof stopRomanticArpeggio === 'function') stopRomanticArpeggio();
    if (typeof selectTrack === 'function') {
      selectTrack(0);
    }
  }
}

function skipToMainWebsite() {
  if (scene3Timer) clearTimeout(scene3Timer);
  completeRevealExperience();
}

/* ==========================================================================
   9. AUDIO TOGGLE ENGINE & AUTO-PLAY
   ========================================================================== */
function playRevealAudio() {
  if (!bgMusicAudio) {
    bgMusicAudio = document.getElementById('reveal-bg-music');
  }

  if (bgMusicAudio) {
    const playPromise = bgMusicAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        updateAudioControlUI(true);
      }).catch(err => {
        console.warn("Native audio file play fallback to synth:", err);
        if (typeof startRomanticArpeggio === 'function') {
          startRomanticArpeggio();
          isAudioPlaying = true;
          updateAudioControlUI(true);
        }
      });
    }
  } else if (typeof startRomanticArpeggio === 'function') {
    startRomanticArpeggio();
    isAudioPlaying = true;
    updateAudioControlUI(true);
  }
}

function toggleRevealAudio() {
  if (!bgMusicAudio) bgMusicAudio = document.getElementById('reveal-bg-music');

  if (isAudioPlaying) {
    if (bgMusicAudio) bgMusicAudio.pause();
    if (typeof stopRomanticArpeggio === 'function') stopRomanticArpeggio();
    isAudioPlaying = false;
    updateAudioControlUI(false);
  } else {
    playRevealAudio();
  }
}

function updateAudioControlUI(playing) {
  const audioBtn = document.getElementById('reveal-audio-btn');
  const icon = document.getElementById('audio-icon');
  const label = document.getElementById('audio-label');

  if (playing) {
    if (icon) icon.className = 'fa-solid fa-volume-high';
    if (label) label.textContent = 'Playing';
    if (audioBtn) audioBtn.style.borderColor = '#FF2D6B';
  } else {
    if (icon) icon.className = 'fa-solid fa-volume-xmark';
    if (label) label.textContent = 'Muted';
    if (audioBtn) audioBtn.style.borderColor = 'rgba(255, 45, 107, 0.4)';
  }
}

/* ==========================================================================
   10. KEYBOARD ACCESSIBILITY (ENTER / SPACE)
   ========================================================================== */
function handleGlobalKeydown(e) {
  if (currentRevealScene === 'completed') return;

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (currentRevealScene === 1) {
      triggerScene2Explosion();
    } else if (currentRevealScene === 3) {
      advanceFromScene3();
    } else if (currentRevealScene === 4) {
      triggerScene5Launch();
    }
  } else if (e.key === 'Escape') {
    skipToMainWebsite();
  }
}
