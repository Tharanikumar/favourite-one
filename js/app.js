/* ==========================================================================
   EVERMINE — ROMANTIC COUPLE APPLICATION JAVASCRIPT ENGINE
   ========================================================================== */

// STATE MANAGEMENT & LOCAL STORAGE SETUP
const DEFAULT_STATE = {
  startDate: '2023-09-12T00:00:00',
  partnerNames: 'Tharani & Surya',
  siteTitle: 'Evermine — Tharani & Surya',
  favorites: [
    { cat: 'Food', val: 'Pasta, Biryani, Dark Chocolate', icon: 'fa-utensils', bg: 'bg-rose' },
    { cat: 'Movie', val: 'The Notebook, La La Land', icon: 'fa-film', bg: 'bg-purple' },
    { cat: 'Song', val: 'Kannukkullai Unnai Vaithai — Pennin Manathai Thottu', icon: 'fa-music', bg: 'bg-green' },
    { cat: 'Place', val: 'Sunset Beach, Cozy Mountains', icon: 'fa-location-dot', bg: 'bg-amber' },
    { cat: 'Color', val: 'Lavender & Rose Gold', icon: 'fa-palette', bg: 'bg-cyan' },
    { cat: 'Hobby', val: 'Dancing, Reading, Traveling', icon: 'fa-icons', bg: 'bg-pink' }
  ],
  milestones: [
    { date: '12 Sep 2023', title: 'We Met', desc: 'The day our story officially began with a shy smile.', icon: 'fa-heart', bg: 'icon-purple' },
    { date: '1 Jan 2024', title: 'First Conversation', desc: 'That late night conversation that never seemed to end.', icon: 'fa-comments', bg: 'icon-pink' },
    { date: '18 Apr 2024', title: 'First Date', desc: 'A full day of non-stop laughter, coffee, and butterflies.', icon: 'fa-face-smile-beam', bg: 'icon-amber' },
    { date: '19 Sep 2025', title: 'Trip Together', desc: 'Exploring new places and creating memories we cherish forever.', icon: 'fa-camera-retro', bg: 'icon-emerald' },
    { date: '14 Aug 2026', title: 'Still Together', desc: 'Looking forward to a lifetime full of tomorrows with you.', icon: 'fa-ring', bg: 'icon-rose' }
  ]
};

let appState = loadState();

function loadState() {
  const saved = localStorage.getItem('evermine_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migrate old default state if found
      if (parsed.startDate === '2023-02-14T00:00:00' || (parsed.milestones && parsed.milestones[0]?.date === '14 Feb 2023')) {
        parsed.startDate = DEFAULT_STATE.startDate;
        parsed.milestones = DEFAULT_STATE.milestones;
        localStorage.setItem('evermine_state', JSON.stringify(parsed));
      }
      if (parsed.favorites) {
        const songFav = parsed.favorites.find(f => f.cat === 'Song');
        if (songFav && (songFav.val.includes('Ed Sheeran') || songFav.val.includes('Perfect'))) {
          songFav.val = 'Kannukkullai Unnai Vaithai — Pennin Manathai Thottu';
          localStorage.setItem('evermine_state', JSON.stringify(parsed));
        }
      }
      return parsed;
    } catch (e) { console.error(e); }
  }
  return DEFAULT_STATE;
}

function saveState() {
  localStorage.setItem('evermine_state', JSON.stringify(appState));
}

// INITIALIZE APP ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  initLiveTimer();
  initSpinWheel();
  initClickHearts();
  initFallingHeartsBackground();
  initAudioSynthesizer();
  renderTimelineList();
  renderFavoritesList();
  renderReasonsGrid();
  updateUIFromState();
  initDailyQuotesEngine();
});

// UPDATE UI FROM STATE
function updateUIFromState() {
  const startDateObj = new Date(appState.startDate);
  const formattedDate = startDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const displayDateEl = document.getElementById('display-start-date');
  if (displayDateEl) {
    displayDateEl.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Since ${formattedDate}`;
  }

  const namesHeaderEl = document.getElementById('header-partner-names');
  if (namesHeaderEl && appState.partnerNames) {
    namesHeaderEl.textContent = `${appState.partnerNames} — Our Love Story`;
  }

  const startDateInput = document.getElementById('input-start-date');
  if (startDateInput) {
    const isoString = startDateObj.toISOString().slice(0, 16);
    startDateInput.value = isoString;
  }

  const partnerNamesInput = document.getElementById('input-partner-names');
  if (partnerNamesInput) partnerNamesInput.value = appState.partnerNames;

  const siteTitleInput = document.getElementById('input-site-title');
  if (siteTitleInput) siteTitleInput.value = appState.siteTitle;
}

// 1. LIVE "TOGETHER FOR ♡" TIMER
function initLiveTimer() {
  updateTimerDisplay();
  setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
  const start = new Date(appState.startDate).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, now - start);

  const secondsTotal = Math.floor(diff / 1000);
  const minutesTotal = Math.floor(secondsTotal / 60);
  const hoursTotal = Math.floor(minutesTotal / 60);
  const daysTotal = Math.floor(hoursTotal / 24);

  // Approximate Years, Months, Days calculation
  const years = Math.floor(daysTotal / 365);
  const months = Math.floor((daysTotal % 365) / 30);
  const days = Math.floor((daysTotal % 365) % 30);
  const hours = hoursTotal % 24;
  const minutes = minutesTotal % 60;
  const seconds = secondsTotal % 60;

  const countYearsEl = document.getElementById('count-years');
  if (countYearsEl) countYearsEl.textContent = String(years).padStart(2, '0');
  const countMonthsEl = document.getElementById('count-months');
  if (countMonthsEl) countMonthsEl.textContent = String(months).padStart(2, '0');
  const countDaysEl = document.getElementById('count-days');
  if (countDaysEl) countDaysEl.textContent = String(days).padStart(2, '0');
  const countHoursEl = document.getElementById('count-hours');
  if (countHoursEl) countHoursEl.textContent = String(hours).padStart(2, '0');
  const countMinutesEl = document.getElementById('count-minutes');
  if (countMinutesEl) countMinutesEl.textContent = String(minutes).padStart(2, '0');
  const countSecondsEl = document.getElementById('count-seconds');
  if (countSecondsEl) countSecondsEl.textContent = String(seconds).padStart(2, '0');

  // Hero Quick Stats dynamic update
  const heroDaysEl = document.getElementById('hero-stat-days');
  if (heroDaysEl) heroDaysEl.textContent = daysTotal.toLocaleString() + '+';
  const heroMilestonesEl = document.getElementById('hero-stat-milestones');
  if (heroMilestonesEl) heroMilestonesEl.textContent = appState.milestones ? appState.milestones.length : '5';
}

// 2. SPIN THE WHEEL MINI-GAME ENGINE
const WHEEL_SLICES = [
  { name: '🕯️ Candlelight Dinner', color: '#f472b6' },
  { name: '🍦 Ice Cream Date', color: '#fbbf24' },
  { name: '🎬 Movie Night Choice', color: '#a855f7' },
  { name: '💆 Relaxing Back Massage', color: '#3b82f6' },
  { name: '💌 Love Poem Written For You', color: '#10b981' },
  { name: '🎁 Secret Surprise Treat', color: '#f43f5e' }
];

let currentRotation = 0;
let isSpinning = false;

function initSpinWheel() {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  drawWheel(canvas, 0);
}

function drawWheel(canvas, rotationAngle) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2 - 8;
  const sliceAngle = (2 * Math.PI) / WHEEL_SLICES.length;

  ctx.clearRect(0, 0, width, height);

  WHEEL_SLICES.forEach((slice, index) => {
    const startAngle = rotationAngle + index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Slice background
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Slice text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(slice.name.split(' ')[0], radius - 15, 4);
    ctx.restore();
  });

  // Center gold pin
  ctx.beginPath();
  ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f472b6';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#e11d48';
  ctx.fill();
}

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;

  const canvas = document.getElementById('wheel-canvas');
  const spinBtn = document.getElementById('spin-wheel-btn');
  if (spinBtn) spinBtn.disabled = true;

  const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full turns
  const winningIndex = Math.floor(Math.random() * WHEEL_SLICES.length);
  const sliceAngle = (2 * Math.PI) / WHEEL_SLICES.length;
  
  // Calculate target rotation angle so pointer (top center, -PI/2) points to slice
  const targetSliceAngle = (WHEEL_SLICES.length - winningIndex - 0.5) * sliceAngle;
  const targetRotation = currentRotation + (extraSpins * 2 * Math.PI) + targetSliceAngle - (currentRotation % (2 * Math.PI));

  const duration = 4000;
  const startTime = performance.now();

  function animateSpin(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const angle = currentRotation + (targetRotation - currentRotation) * easeOut;

    drawWheel(canvas, angle);

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      currentRotation = angle;
      isSpinning = false;
      if (spinBtn) spinBtn.disabled = false;
      showWheelWinner(WHEEL_SLICES[winningIndex]);
    }
  }

  requestAnimationFrame(animateSpin);
}

function showWheelWinner(slice) {
  triggerConfetti();
  const prizeNameEl = document.getElementById('winner-prize-name');
  if (prizeNameEl) prizeNameEl.textContent = slice.name;
  openModal('modal-wheel-winner');
}

// 3. MEMORY JAR RANDOM DRAWER
const MEMORY_JAR_NOTES = [
  { title: 'The Starry Night Talk', text: 'Remember when we sat under the stars and talked until 3 AM about everything and nothing?', date: 'Special Memory ❤️' },
  { title: 'The Rainy Day Coffee', text: 'Sharing one warm cup of hot chocolate on a chilly rainy afternoon while watching the rain drops on the window.', date: 'Cozy Memory ☕' },
  { title: 'Our First Road Trip', text: 'Singing out loud to our favorite songs at the top of our lungs with the wind in our hair.', date: 'Adventure Memory 🚗' },
  { title: 'Uncontrollable Laughs', text: 'That moment when we couldn\'t stop laughing over the silliest joke until our stomachs hurt.', date: 'Joy Memory 😂' },
  { title: 'Sunset Walk', text: 'Holding hands while walking along the beach as the golden sun melted into the ocean horizon.', date: 'Romantic Memory 🌅' },
  { title: 'Surprise Hugs', text: 'The random unexpected warm hugs when least expected that instantly make any bad day better.', date: 'Warm Memory 🤗' },
  { title: 'Cooking Together', text: 'Making a giant mess in the kitchen trying to bake a cake, but it turned out amazingly sweet anyway!', date: 'Fun Memory 🍳' }
];

function drawMemoryFromJar() {
  triggerHeartBurstAtCenter();
  const randomNote = MEMORY_JAR_NOTES[Math.floor(Math.random() * MEMORY_JAR_NOTES.length)];
  
  const titleEl = document.getElementById('draw-memory-title');
  const textEl = document.getElementById('draw-memory-text');
  const dateEl = document.getElementById('draw-memory-date');

  if (titleEl) titleEl.textContent = randomNote.title;
  if (textEl) textEl.textContent = `"${randomNote.text}"`;
  if (dateEl) dateEl.textContent = `♥ ${randomNote.date}`;

  openModal('modal-memory-draw');
}

// 4. LOVE LETTER TYPEWRITER EFFECT
const LOVE_LETTER_TEXT = `My Dearest Surya,

From the very first moment our eyes met, I knew there was something magical about you. You brought warmth into my life, turned simple days into unforgettable adventures, and showed me what true love really feels like.

Thank you for being my listener, my best friend, my favorite laughter, and my safest home. Every single day spent with you is my absolute favorite day.

I still fall for you every single day. Here's to us, our journey, and all of our tomorrows.

Forever & Always Yours,
Tharani ❤️`;

let typewriterIndex = 0;
let typewriterTimer = null;

function openLoveLetterModal() {
  openModal('modal-love-letter');
  const textContainer = document.getElementById('typewriter-text');
  if (!textContainer) return;

  textContainer.innerHTML = '';
  typewriterIndex = 0;
  if (typewriterTimer) clearInterval(typewriterTimer);

  typewriterTimer = setInterval(() => {
    if (typewriterIndex < LOVE_LETTER_TEXT.length) {
      const char = LOVE_LETTER_TEXT.charAt(typewriterIndex);
      textContainer.innerHTML += char === '\n' ? '<br>' : char;
      typewriterIndex++;
    } else {
      clearInterval(typewriterTimer);
    }
  }, 35);
}

// 5. AUDIO SYNTHESIZER & MULTI-TRACK PLAYLIST ENGINE
let audioCtx = null;
let isAudioPlaying = false;
let melodyInterval = null;
let masterVolume = 0.8;

const PLAYLIST = [
  {
    title: 'Kannukkullai Unnai Vaithai',
    artist: 'Pennin Manathai Thottu (Unni Menon)',
    src: 'assets/kannukkullai_unnai_vaithai.m4a'
  },
  {
    title: 'Poove Mudhal Poove (Male)',
    artist: 'Kadhal Kondein (Yuvan Shankar Raja)',
    src: 'assets/poove_mudhal_poove.m4a'
  },
  {
    title: 'Ennai Thaalattum',
    artist: 'Unnidathil Ennai Koduthen (S.A. Rajkumar)',
    src: 'assets/ennai_thaalattum.m4a'
  }
];

let currentTrackIndex = 0;

// Signature notes for "Kannukkullai Unnai Vaithai" synth fallback
const ROMANTIC_NOTES = [
  392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00,
  392.00, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63, 293.66,
  261.63, 329.63, 392.00, 523.25, 659.25, 587.33, 523.25, 440.00,
  392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25
];

function initAudioSynthesizer() {
  // Lazy init on first user interaction
}

function playSynthNote(freq, duration = 1.2) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18 * masterVolume, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function loadTrack(index) {
  currentTrackIndex = (index + PLAYLIST.length) % PLAYLIST.length;
  const track = PLAYLIST[currentTrackIndex];
  
  const barTitle = document.getElementById('bar-track-title');
  const barArtist = document.getElementById('bar-track-artist');
  const activeTitle = document.getElementById('active-song-title');
  const audioEl = document.getElementById('audio-element');

  if (barTitle) barTitle.textContent = track.title;
  if (barArtist) barArtist.textContent = track.artist;
  if (activeTitle) activeTitle.textContent = track.title;

  if (audioEl) {
    audioEl.src = track.src;
    audioEl.load();
  }

  // Update playlist items UI active state
  const container = document.getElementById('playlist-container');
  if (container) {
    const items = container.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
      if (idx === currentTrackIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

function selectTrack(index) {
  loadTrack(index);
  const audioEl = document.getElementById('audio-element');
  const mainIcon = document.getElementById('main-play-icon');
  const barPlayBtn = document.getElementById('bar-play-btn');
  const disc = document.getElementById('music-disc');

  isAudioPlaying = true;
  if (mainIcon) mainIcon.className = 'fa-solid fa-pause';
  if (barPlayBtn) barPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  if (disc) disc.classList.add('playing');

  if (audioEl) {
    audioEl.volume = masterVolume;
    audioEl.play().catch(err => {
      console.log('Audio file play fallback to synth:', err);
      startRomanticArpeggio();
    });
  }
}

function toggleMainSong() {
  isAudioPlaying = !isAudioPlaying;

  const mainIcon = document.getElementById('main-play-icon');
  const barPlayBtn = document.getElementById('bar-play-btn');
  const disc = document.getElementById('music-disc');
  const audioEl = document.getElementById('audio-element');

  if (isAudioPlaying) {
    if (mainIcon) mainIcon.className = 'fa-solid fa-pause';
    if (barPlayBtn) barPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (disc) disc.classList.add('playing');

    if (audioEl) {
      audioEl.volume = masterVolume;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Playing native audio file successfully
        }).catch(err => {
          console.log('Audio file play fallback to synth:', err);
          startRomanticArpeggio();
        });
      }
    } else {
      startRomanticArpeggio();
    }
  } else {
    if (mainIcon) mainIcon.className = 'fa-solid fa-play';
    if (barPlayBtn) barPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (disc) disc.classList.remove('playing');

    if (audioEl) {
      audioEl.pause();
    }
    stopRomanticArpeggio();
  }
}

function prevTrack() {
  selectTrack((currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
}

function nextTrack() {
  selectTrack((currentTrackIndex + 1) % PLAYLIST.length);
}

// 6. INTERACTIVE FLOATING CLICK HEARTS & FALLING HEARTS BACKGROUND
function initClickHearts() {
  document.addEventListener('click', (e) => {
    triggerHeartBurstAt(e.clientX, e.clientY, 16);
  });
}

function triggerHeartBurstAt(x, y, count = 16) {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const icons = ['❤️', '💖', '💕', '💗', '💓', '💞', '🌸', '✨', '🌹'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'click-heart-particle';
    particle.textContent = icons[Math.floor(Math.random() * icons.length)];

    // Radiate outwards 360 degrees
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
    const distance = Math.random() * 110 + 45;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const rotation = (Math.random() - 0.5) * 120;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);
    particle.style.setProperty('--rot', `${rotation}deg`);

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1400);
  }
}

function triggerHeartBurstAtCenter() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  triggerHeartBurstAt(x, y, 24);
}

function triggerHeartBurst(event) {
  if (event) event.stopPropagation();
  const x = event ? event.clientX : window.innerWidth / 2;
  const y = event ? event.clientY : window.innerHeight / 2;
  triggerHeartBurstAt(x, y, 20);
}

function triggerConfetti() {
  triggerHeartBurstAtCenter();
}

// CONTINUOUS FALLING HEARTS BACKGROUND CANVAS ENGINE
let fallingHeartsCanvas = null;
let fallingHeartsCtx = null;
let fallingHeartsList = [];
let fallingHeartsAnimId = null;

function initFallingHeartsBackground() {
  fallingHeartsCanvas = document.getElementById('falling-hearts-canvas');
  if (!fallingHeartsCanvas) return;
  fallingHeartsCtx = fallingHeartsCanvas.getContext('2d');

  function resizeCanvas() {
    fallingHeartsCanvas.width = window.innerWidth;
    fallingHeartsCanvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const heartTypes = ['❤️', '💖', '💕', '💗', '🌸', '✨', '🌹'];
  fallingHeartsList = [];

  for (let i = 0; i < 55; i++) {
    fallingHeartsList.push({
      x: Math.random() * fallingHeartsCanvas.width,
      y: Math.random() * fallingHeartsCanvas.height,
      size: Math.random() * 16 + 12,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.5,
      swaySpeed: Math.random() * 0.03 + 0.01,
      swayAngle: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.55 + 0.25,
      type: heartTypes[Math.floor(Math.random() * heartTypes.length)]
    });
  }

  function renderFallingHearts() {
    fallingHeartsCtx.clearRect(0, 0, fallingHeartsCanvas.width, fallingHeartsCanvas.height);

    fallingHeartsList.forEach(h => {
      h.y += h.speedY;
      h.swayAngle += h.swaySpeed;
      h.x += Math.sin(h.swayAngle) * 0.75;
      h.rotation += h.rotSpeed;

      if (h.y > fallingHeartsCanvas.height + 30) {
        h.y = -30;
        h.x = Math.random() * fallingHeartsCanvas.width;
      }

      fallingHeartsCtx.save();
      fallingHeartsCtx.globalAlpha = h.opacity;
      fallingHeartsCtx.translate(h.x, h.y);
      fallingHeartsCtx.rotate((h.rotation * Math.PI) / 180);
      fallingHeartsCtx.font = `${h.size}px sans-serif`;
      fallingHeartsCtx.textAlign = 'center';
      fallingHeartsCtx.textBaseline = 'middle';
      fallingHeartsCtx.fillText(h.type, 0, 0);
      fallingHeartsCtx.restore();
    });

    fallingHeartsAnimId = requestAnimationFrame(renderFallingHearts);
  }

  if (fallingHeartsAnimId) cancelAnimationFrame(fallingHeartsAnimId);
  renderFallingHearts();
}

// 7. LIGHTBOX PHOTO GALLERY
function openLightbox(src, title, desc) {
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');

  if (imgEl) imgEl.src = src;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  openModal('modal-lightbox');
}

function openGalleryModal() {
  openLightbox('assets/hero_couple.png', 'Golden Hour Sunset', 'Our favorite memory together enjoying the warm evening sunset over the city.');
}

// 8. DYNAMIC RENDERERS FOR TIMELINE & FAVORITES
function renderTimelineList() {
  const container = document.getElementById('timeline-container');
  const fullContainer = document.getElementById('full-timeline-list');
  const countEl = document.getElementById('timeline-count');

  if (countEl) countEl.textContent = `${appState.milestones.length} Milestones`;

  const html = appState.milestones.map((item) => `
    <div class="timeline-item">
      <div class="timeline-icon ${item.bg}"><i class="fa-solid ${item.icon}"></i></div>
      <div class="timeline-content">
        <span class="timeline-date">${item.date}</span>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join('');

  if (container) container.innerHTML = html;
  if (fullContainer) fullContainer.innerHTML = html;
}

function openFullTimelineModal() {
  renderTimelineList();
  openModal('modal-timeline');
}

function promptAddMilestone() {
  const date = prompt('Enter Milestone Date (e.g., 25 Dec 2024):');
  if (!date) return;
  const title = prompt('Enter Milestone Title (e.g., Christmas Trip):');
  if (!title) return;
  const desc = prompt('Enter Description:');

  appState.milestones.push({
    date: date,
    title: title,
    desc: desc || '',
    icon: 'fa-heart',
    bg: 'icon-rose'
  });

  saveState();
  renderTimelineList();
}

// FAVORITES RENDERER
function renderFavoritesList() {
  const previewContainer = document.getElementById('favorites-list-preview');
  const fullContainer = document.getElementById('full-favorites-grid');

  const previewHtml = appState.favorites.map((fav) => `
    <li class="fav-item">
      <div class="fav-icon ${fav.bg}"><i class="fa-solid ${fav.icon}"></i></div>
      <div class="fav-details">
        <span class="fav-category">${fav.cat}</span>
        <span class="fav-value">${fav.val}</span>
      </div>
    </li>
  `).join('');

  if (previewContainer) previewContainer.innerHTML = previewHtml;

  if (fullContainer) {
    fullContainer.innerHTML = appState.favorites.map((fav, index) => `
      <div class="form-group">
        <label>${fav.cat}</label>
        <input type="text" value="${fav.val}" id="fav-input-${index}">
      </div>
    `).join('');
  }
}

function openFavoritesModal() {
  renderFavoritesList();
  openModal('modal-favorites');
}

function saveFavorites() {
  appState.favorites.forEach((fav, index) => {
    const input = document.getElementById(`fav-input-${index}`);
    if (input) fav.val = input.value;
  });
  saveState();
  renderFavoritesList();
  closeModal('modal-favorites');
}

// REASONS GRID RENDERER
const ALL_REASONS = [
  "Your smile lights up my entire world instantly.",
  "You understand me like no one else ever could.",
  "You make every ordinary moment feel special.",
  "Your warmth, kindness, and incredible heart.",
  "You are simply you, and that is perfection.",
  "The way your eyes sparkle when you laugh.",
  "Your endless support for all my dreams.",
  "How cozy it feels just sitting quietly next to you.",
  "The cute little voice you make when excited.",
  "You always know how to comfort me when down.",
  "Our inside jokes that no one else gets.",
  "Your gentle touch and warm bear hugs."
];

function renderReasonsGrid() {
  const fullContainer = document.getElementById('full-reasons-grid');
  if (!fullContainer) return;

  fullContainer.innerHTML = ALL_REASONS.map((reason, index) => `
    <div class="fav-item" style="margin-bottom: 10px;">
      <span class="reason-num">${String(index + 1).padStart(2, '0')}</span>
      <span class="reason-text" style="font-weight: 600;">${reason}</span>
    </div>
  `).join('');
}

function openReasonsModal() {
  renderReasonsGrid();
  openModal('modal-reasons');
}

// SETTINGS HANDLER
function openSettingsModal() {
  updateUIFromState();
  openModal('modal-settings');
}

function saveSettings(e) {
  e.preventDefault();
  const dateVal = document.getElementById('input-start-date').value;
  const namesVal = document.getElementById('input-partner-names').value;
  const titleVal = document.getElementById('input-site-title').value;

  if (dateVal) appState.startDate = new Date(dateVal).toISOString();
  if (namesVal) appState.partnerNames = namesVal;
  if (titleVal) appState.siteTitle = titleVal;

  saveState();
  updateUIFromState();
  updateTimerDisplay();
  closeModal('modal-settings');
}

// GENERAL MODAL HELPERS
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   THARANI & SURYA DAY-BY-DAY QUOTES ENGINE & ANIMATED POPUP SYSTEM
   ========================================================================== */

// 365+ DAILY CURATED ROMANTIC & INSPIRATIONAL QUOTES FOR THARANI & SURYA
const THARANI_SURYA_QUOTES = [
  { text: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.", author: "— Dedicated to Tharani & Surya" },
  { text: "Whatever our souls are made of, Tharani & Surya's are the same.", author: "— Inspired by Emily Brontë" },
  { text: "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.", author: "— Tharani & Surya's Love Story" },
  { text: "You are my today and all of my tomorrows.", author: "— Dedicated to Tharani & Surya" },
  { text: "If I had a flower for every time I thought of you, I could walk through my garden forever.", author: "— Forever & Always" },
  { text: "To love and be loved by you is to feel the sun from both sides.", author: "— Tharani & Surya" },
  { text: "I swear I couldn't love you more than I do right now, and yet I know I will tomorrow.", author: "— Daily Heartbeat Note" },
  { text: "You are the finest, loveliest, tenderest, and most beautiful person I have ever known.", author: "— F. Scott Fitzgerald" },
  { text: "Every love story is beautiful, but ours is my absolute favorite.", author: "— Tharani & Surya" },
  { text: "Home is not a place, it's a person. And for me, that person is you.", author: "— For Tharani & Surya" },
  { text: "My heart is and always will be yours.", author: "— Dedicated to Tharani & Surya" },
  { text: "When I look into your eyes, I see the reflection of a future I always dreamed of.", author: "— Daily Inspiration" },
  { text: "You make every single day feel like a magical celebration.", author: "— Tharani & Surya" },
  { text: "I fell in love with the way you touched my soul without using your hands.", author: "— Deep Love Note" },
  { text: "Together with you is my favorite place to be.", author: "— Tharani & Surya" },
  { text: "You are my sunshine on a rainy day, my calm in every storm.", author: "— Dedicated to Tharani & Surya" },
  { text: "I love you not only for what you are, but for what I am when I am with you.", author: "— Roy Croft" },
  { text: "You are my dream come true, today, tomorrow, and forever.", author: "— Tharani & Surya" },
  { text: "No matter where I go, I always find my way back to you.", author: "— Heartbeat Note" },
  { text: "Loving you is as natural as breathing, and just as vital to my life.", author: "— Dedicated to Tharani & Surya" },
  { text: "You are the missing piece I never knew I was searching for.", author: "— Tharani & Surya" },
  { text: "Two souls with but a single thought, two hearts that beat as one.", author: "— Friedrich Halm" },
  { text: "With you, forever doesn't seem long enough.", author: "— Dedicated to Tharani & Surya" },
  { text: "Your smile is my favorite visual in the entire world.", author: "— Tharani & Surya" },
  { text: "I choose you. And I'll choose you over and over and over. Without pause, without a doubt, in a heartbeat.", author: "— Daily Promise" },
  { text: "You bring out the best, happiest, and brightest version of me.", author: "— Dedicated to Tharani & Surya" },
  { text: "Distance means so little when someone means so much.", author: "— For Tharani & Surya" },
  { text: "You are the poetry I never knew how to write.", author: "— Romantic Reflection" },
  { text: "Holding your hand is like finding peace in the middle of chaos.", author: "— Tharani & Surya" },
  { text: "I loved you yesterday, love you still, always have, always will.", author: "— Dedicated to Tharani & Surya" },
  { text: "You are my best friend, my soulmate, and my greatest adventure.", author: "— Tharani & Surya" },
  { text: "Every day with you is a new page in our favorite storybook.", author: "— Daily Chapter" },
  { text: "Your love is the anchor that grounds me and the wings that help me fly.", author: "— Dedicated to Tharani & Surya" },
  { text: "I want all of my lasts to be with you.", author: "— Tharani & Surya" },
  { text: "You are the quiet comfort my soul craved.", author: "— Deep Connection" },
  { text: "My heart beats your name in every rhythm.", author: "— Tharani & Surya" },
  { text: "Thank you for being my constant light in this big world.", author: "— Dedicated to Tharani & Surya" },
  { text: "You are the best decision my heart ever made.", author: "— Tharani & Surya" },
  { text: "Life with you is a sweet melody that never ends.", author: "— Romantic Thought" },
  { text: "You are my safe haven, my sweet comfort, and my forever love.", author: "— Dedicated to Tharani & Surya" }
];

let currentQuoteIndex = 0;
let particleCanvasAnimationId = null;

// GET DAY OF YEAR INDEX (1 to 365)
function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// INITIALIZE QUOTES ENGINE ON LOAD
function initDailyQuotesEngine() {
  const dayOfYear = getDayOfYear();
  const allQuotes = getAllQuotes();
  currentQuoteIndex = (dayOfYear - 1) % allQuotes.length;

  renderQuote(currentQuoteIndex, false);

  // Auto popup trigger on page load / first link visit
  setTimeout(() => {
    openDailyQuotePopup();
  }, 600);
}

// COMBINE DEFAULT + CUSTOM QUOTES
function getAllQuotes() {
  const custom = appState.customQuotes || [];
  return [...THARANI_SURYA_QUOTES, ...custom];
}

// RENDER QUOTE TO BOTH POPUP AND IN-PAGE CARD
function renderQuote(index, animate = true) {
  const allQuotes = getAllQuotes();
  if (index < 0) index = allQuotes.length - 1;
  if (index >= allQuotes.length) index = 0;
  currentQuoteIndex = index;

  const quote = allQuotes[currentQuoteIndex];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const dayOfYear = getDayOfYear();

  const popupTextEl = document.getElementById('popup-quote-text');
  const popupAuthorEl = document.getElementById('popup-quote-author');
  const popupDateEl = document.getElementById('popup-date-text');
  const popupDayCountEl = document.getElementById('popup-day-count');

  const inpageTextEl = document.getElementById('inpage-quote-text');
  const inpageAuthorEl = document.getElementById('inpage-quote-author');
  const inpageDateEl = document.getElementById('inpage-date-text');
  const inpageDayCountEl = document.getElementById('inpage-day-count');

  const updateDOM = () => {
    if (popupTextEl) popupTextEl.textContent = `"${quote.text}"`;
    if (popupAuthorEl) popupAuthorEl.textContent = quote.author || "— Dedicated to Tharani & Surya";
    if (popupDateEl) popupDateEl.innerHTML = `<i class="fa-regular fa-calendar-heart"></i> ${dateStr}`;
    if (popupDayCountEl) popupDayCountEl.innerHTML = `<i class="fa-solid fa-star"></i> Day ${dayOfYear} of 365`;

    if (inpageTextEl) inpageTextEl.textContent = `"${quote.text}"`;
    if (inpageAuthorEl) inpageAuthorEl.textContent = quote.author || "— Dedicated to Tharani & Surya";
    if (inpageDateEl) inpageDateEl.innerHTML = `<i class="fa-regular fa-calendar-heart"></i> ${dateStr}`;
    if (inpageDayCountEl) inpageDayCountEl.innerHTML = `<i class="fa-solid fa-star"></i> Day ${dayOfYear} of 365`;

    updateFavButtonState();
  };

  if (animate && popupTextEl) {
    popupTextEl.classList.add('fade-out');
    if (inpageTextEl) inpageTextEl.style.opacity = '0';
    setTimeout(() => {
      updateDOM();
      popupTextEl.classList.remove('fade-out');
      if (inpageTextEl) inpageTextEl.style.opacity = '1';
    }, 250);
  } else {
    updateDOM();
  }
}

// NAVIGATE QUOTE (NEXT / PREV)
function navigateQuote(direction) {
  playChimeSound();
  renderQuote(currentQuoteIndex + direction, true);
}

// RANDOM QUOTE TRIGGER
function triggerRandomQuote() {
  playChimeSound();
  const allQuotes = getAllQuotes();
  let randomIndex = Math.floor(Math.random() * allQuotes.length);
  if (randomIndex === currentQuoteIndex && allQuotes.length > 1) {
    randomIndex = (randomIndex + 1) % allQuotes.length;
  }
  renderQuote(randomIndex, true);
  showToast("✨ Random inspiration generated!");
}

// COPY CURRENT QUOTE
function copyCurrentQuote() {
  const allQuotes = getAllQuotes();
  const quote = allQuotes[currentQuoteIndex];
  const fullText = `"${quote.text}" ${quote.author} (Tharani & Surya's Daily Quote)`;
  
  navigator.clipboard.writeText(fullText).then(() => {
    showToast("📋 Quote copied to clipboard!");
  }).catch(() => {
    showToast("📋 Quote ready!");
  });
}

// TOGGLE FAVORITE QUOTE
function toggleFavoriteCurrentQuote() {
  if (!appState.favoriteQuotes) appState.favoriteQuotes = [];
  const allQuotes = getAllQuotes();
  const currentQuote = allQuotes[currentQuoteIndex];

  const existsIdx = appState.favoriteQuotes.findIndex(q => q.text === currentQuote.text);
  if (existsIdx > -1) {
    appState.favoriteQuotes.splice(existsIdx, 1);
    showToast("💔 Removed from favorite quotes.");
  } else {
    appState.favoriteQuotes.push(currentQuote);
    showToast("❤️ Saved to your favorite quotes!");
  }
  saveState();
  updateFavButtonState();
}

function updateFavButtonState() {
  const btn = document.getElementById('fav-quote-btn');
  if (!btn) return;
  const allQuotes = getAllQuotes();
  const currentQuote = allQuotes[currentQuoteIndex];
  const isFav = appState.favoriteQuotes && appState.favoriteQuotes.some(q => q.text === currentQuote.text);
  
  if (isFav) {
    btn.classList.add('active-fav');
  } else {
    btn.classList.remove('active-fav');
  }
}

// OPEN / CLOSE POPUP MODAL
function openDailyQuotePopup() {
  const popup = document.getElementById('modal-daily-quote-popup');
  if (!popup) return;
  popup.classList.add('active');
  renderQuote(currentQuoteIndex, false);
  initQuoteParticlesCanvas();
  playChimeSound();
}

function closeDailyQuotePopup() {
  const popup = document.getElementById('modal-daily-quote-popup');
  if (popup) popup.classList.remove('active');
  if (particleCanvasAnimationId) {
    cancelAnimationFrame(particleCanvasAnimationId);
    particleCanvasAnimationId = null;
  }
}

// CUSTOM QUOTE MODAL HANDLER
function openAddCustomQuoteModal() {
  openModal('modal-add-custom-quote');
}

function saveCustomQuote(e) {
  e.preventDefault();
  const textInput = document.getElementById('input-custom-quote-text');
  const authorInput = document.getElementById('input-custom-quote-author');

  if (!textInput || !textInput.value.trim()) return;

  if (!appState.customQuotes) appState.customQuotes = [];
  const newQuote = {
    text: textInput.value.trim(),
    author: authorInput.value.trim() || "— Dedicated to Tharani & Surya"
  };

  appState.customQuotes.push(newQuote);
  saveState();

  textInput.value = '';
  closeModal('modal-add-custom-quote');

  const allQuotes = getAllQuotes();
  renderQuote(allQuotes.length - 1, true);
  showToast("❤️ Custom quote added to Tharani & Surya's collection!");
}

// PARTICLE CANVAS ANIMATION FOR POPUP
function initQuoteParticlesCanvas() {
  const canvas = document.getElementById('quote-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1.5,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      isHeart: Math.random() > 0.6
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;

      if (p.isHeart) {
        ctx.fillStyle = '#f472b6';
        ctx.font = `${p.size * 3}px sans-serif`;
        ctx.fillText('♥', p.x, p.y);
      } else {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    particleCanvasAnimationId = requestAnimationFrame(drawParticles);
  }

  if (particleCanvasAnimationId) cancelAnimationFrame(particleCanvasAnimationId);
  drawParticles();
}

// AUDIO CHIME SYNTHESIZER
function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

// TOAST NOTIFICATION UTILITY
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ADVANCED TAB SWIPE CONTROLLER WITH GESTURES & ANIMATIONS
const TABS_LIST = [
  'home',
  'journey',
  'memories',
  'favorites',
  'music-player',
  'reasons',
  'daily-quotes-sec',
  'surprises'
];

let activeTabIdx = 0;

function swipeNextTab() {
  const nextIdx = (activeTabIdx + 1) % TABS_LIST.length;
  showTab(TABS_LIST[nextIdx], null, 'right');
}

function swipePrevTab() {
  const prevIdx = (activeTabIdx - 1 + TABS_LIST.length) % TABS_LIST.length;
  showTab(TABS_LIST[prevIdx], null, 'left');
}

function showTab(tabId, event, animDirection) {
  if (event) event.preventDefault();

  const prevIdx = activeTabIdx;
  const newIdx = TABS_LIST.indexOf(tabId) !== -1 ? TABS_LIST.indexOf(tabId) : 0;
  activeTabIdx = newIdx;

  // Determine direction if not explicit
  if (!animDirection) {
    if (newIdx > prevIdx) animDirection = 'right';
    else if (newIdx < prevIdx) animDirection = 'left';
    else animDirection = 'right';
  }

  // Highlight active link in navbar
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + tabId || (tabId === 'home' && href === '#hero')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const body = document.body;
  const heroSec = document.getElementById('hero');
  const catStrip = document.querySelector('.category-strip');
  const dashGrid = document.querySelector('.dashboard-grid-section');
  const journeyCard = document.getElementById('journey');
  const memoriesCard = document.getElementById('memories');
  const favoritesCard = document.getElementById('favorites');
  const timerBanner = document.querySelector('.timer-banner-section');
  const surprisesSec = document.getElementById('surprises');
  const reasonsCard = document.getElementById('reasons');
  const memoryJarCard = document.querySelector('.memory-jar-card');
  const wheelCard = document.querySelector('.wheel-card');
  const loveNoteCard = document.querySelector('.love-note-card');
  const dailyQuotesSec = document.getElementById('daily-quotes-sec');
  const musicPlayerSec = document.getElementById('music-player');

  const breadcrumb = document.getElementById('tab-breadcrumb');
  const breadcrumbTitle = document.getElementById('tab-breadcrumb-title');
  const progressBadge = document.getElementById('tab-progress-badge');
  const sideLeft = document.getElementById('side-swipe-left');
  const sideRight = document.getElementById('side-swipe-right');

  // Remove previous swipe animation classes
  const allContainers = [heroSec, catStrip, dashGrid, timerBanner, surprisesSec, dailyQuotesSec, musicPlayerSec];
  allContainers.forEach(c => {
    if (c) {
      c.classList.remove('tab-swipe-left-in', 'tab-swipe-right-in');
    }
  });

  const animClass = animDirection === 'left' ? 'tab-swipe-right-in' : 'tab-swipe-left-in';

  if (tabId === 'home' || tabId === 'hero') {
    body.classList.remove('single-tab-mode');
    allContainers.forEach(c => { if (c) c.classList.remove('tab-hidden'); });
    if (journeyCard) journeyCard.classList.remove('tab-hidden');
    if (memoriesCard) memoriesCard.classList.remove('tab-hidden');
    if (favoritesCard) favoritesCard.classList.remove('tab-hidden');
    if (reasonsCard) reasonsCard.classList.remove('tab-hidden');
    if (memoryJarCard) memoryJarCard.classList.remove('tab-hidden');
    if (wheelCard) wheelCard.classList.remove('tab-hidden');
    if (loveNoteCard) loveNoteCard.classList.remove('tab-hidden');

    if (breadcrumb) breadcrumb.classList.add('tab-hidden');
    if (sideLeft) sideLeft.classList.add('tab-hidden');
    if (sideRight) sideRight.classList.add('tab-hidden');
  } else {
    body.classList.add('single-tab-mode');

    // Hide all sections first
    allContainers.forEach(c => { if (c) c.classList.add('tab-hidden'); });
    if (journeyCard) journeyCard.classList.add('tab-hidden');
    if (memoriesCard) memoriesCard.classList.add('tab-hidden');
    if (favoritesCard) favoritesCard.classList.add('tab-hidden');
    if (reasonsCard) reasonsCard.classList.add('tab-hidden');
    if (memoryJarCard) memoryJarCard.classList.add('tab-hidden');
    if (wheelCard) wheelCard.classList.add('tab-hidden');
    if (loveNoteCard) loveNoteCard.classList.add('tab-hidden');

    if (breadcrumb) breadcrumb.classList.remove('tab-hidden');
    if (sideLeft) sideLeft.classList.remove('tab-hidden');
    if (sideRight) sideRight.classList.remove('tab-hidden');

    let titleText = 'Feature Showcase';
    let iconClass = 'fa-sparkles';
    let targetElement = null;

    if (tabId === 'journey') {
      if (dashGrid) { dashGrid.classList.remove('tab-hidden'); targetElement = dashGrid; }
      if (journeyCard) journeyCard.classList.remove('tab-hidden');
      titleText = 'Our Story Timeline';
      iconClass = 'fa-book-open';
    } else if (tabId === 'memories') {
      if (dashGrid) { dashGrid.classList.remove('tab-hidden'); targetElement = dashGrid; }
      if (memoriesCard) memoriesCard.classList.remove('tab-hidden');
      titleText = 'Recent Memories Gallery';
      iconClass = 'fa-images';
    } else if (tabId === 'favorites') {
      if (dashGrid) { dashGrid.classList.remove('tab-hidden'); targetElement = dashGrid; }
      if (favoritesCard) favoritesCard.classList.remove('tab-hidden');
      titleText = 'Your Favorites';
      iconClass = 'fa-star';
    } else if (tabId === 'music-player') {
      if (musicPlayerSec) { musicPlayerSec.classList.remove('tab-hidden'); targetElement = musicPlayerSec; }
      titleText = 'Our Playlist & Music Player';
      iconClass = 'fa-music';
    } else if (tabId === 'reasons') {
      if (surprisesSec) { surprisesSec.classList.remove('tab-hidden'); targetElement = surprisesSec; }
      if (reasonsCard) reasonsCard.classList.remove('tab-hidden');
      titleText = 'Reasons I Love You';
      iconClass = 'fa-heart-circle-check';
    } else if (tabId === 'daily-quotes-sec') {
      if (dailyQuotesSec) { dailyQuotesSec.classList.remove('tab-hidden'); targetElement = dailyQuotesSec; }
      titleText = 'Daily Thoughts & Quotes';
      iconClass = 'fa-quote-left';
    } else if (tabId === 'surprises') {
      if (surprisesSec) { surprisesSec.classList.remove('tab-hidden'); targetElement = surprisesSec; }
      if (memoryJarCard) memoryJarCard.classList.remove('tab-hidden');
      if (wheelCard) wheelCard.classList.remove('tab-hidden');
      if (loveNoteCard) loveNoteCard.classList.remove('tab-hidden');
      titleText = 'Interactive Surprises & Games';
      iconClass = 'fa-gift';
    }

    if (targetElement) {
      targetElement.classList.add(animClass);
    }

    if (breadcrumbTitle) {
      breadcrumbTitle.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${titleText}`;
    }
    if (progressBadge) {
      progressBadge.textContent = `${activeTabIdx + 1} of ${TABS_LIST.length}`;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  playChimeSound();
}

// GESTURE & TOUCH SWIPE DETECTOR
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!document.body.classList.contains('single-tab-mode')) return;
  if (!e.changedTouches || e.changedTouches.length === 0) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // Check if horizontal swipe was dominant
  if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
    if (diffX < 0) {
      swipeNextTab(); // Swiped left -> Go Next
    } else {
      swipePrevTab(); // Swiped right -> Go Prev
    }
  }
}, { passive: true });

// KEYBOARD ARROW NAVIGATION (Left / Right keys to swipe)
document.addEventListener('keydown', (e) => {
  if (!document.body.classList.contains('single-tab-mode')) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'ArrowRight') {
    swipeNextTab();
  } else if (e.key === 'ArrowLeft') {
    swipePrevTab();
  }
});

/* ==========================================================================
   THEME ENGINE (DARK / LIGHT MODE PERSISTENCE)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('evermine_theme') || 'light';
  applyTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  localStorage.setItem('evermine_theme', newTheme);
  
  if (typeof triggerConfetti === 'function') triggerConfetti();
}

function applyTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  const btnIcon = document.querySelector('#theme-toggle-btn i');
  if (btnIcon) {
    if (themeName === 'dark') {
      btnIcon.className = 'fa-solid fa-sun';
    } else {
      btnIcon.className = 'fa-solid fa-moon';
    }
  }
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.cat-card, .fav-card, .reason-card, .timeline-item, .stat-pill');
  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}


