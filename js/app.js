/* ==========================================================================
   EVERMINE — ROMANTIC COUPLE APPLICATION JAVASCRIPT ENGINE
   ========================================================================== */

// STATE MANAGEMENT & LOCAL STORAGE SETUP
const DEFAULT_STATE = {
  startDate: '2023-02-14T00:00:00',
  partnerNames: 'Alex & Sam',
  siteTitle: 'Evermine — Just You, Me & Our Story',
  favorites: [
    { cat: 'Food', val: 'Pasta, Biryani, Dark Chocolate', icon: 'fa-utensils', bg: 'bg-rose' },
    { cat: 'Movie', val: 'The Notebook, La La Land', icon: 'fa-film', bg: 'bg-purple' },
    { cat: 'Song', val: 'Perfect — Ed Sheeran', icon: 'fa-music', bg: 'bg-green' },
    { cat: 'Place', val: 'Sunset Beach, Cozy Mountains', icon: 'fa-location-dot', bg: 'bg-amber' },
    { cat: 'Color', val: 'Lavender & Rose Gold', icon: 'fa-palette', bg: 'bg-cyan' },
    { cat: 'Hobby', val: 'Dancing, Reading, Traveling', icon: 'fa-icons', bg: 'bg-pink' }
  ],
  milestones: [
    { date: '14 Feb 2023', title: 'We Met', desc: 'The day our story officially began with a shy smile.', icon: 'fa-heart', bg: 'icon-purple' },
    { date: '28 Feb 2023', title: 'First Conversation', desc: 'That late night conversation that never seemed to end.', icon: 'fa-comments', bg: 'icon-pink' },
    { date: '20 Mar 2023', title: 'First Date', desc: 'A full day of non-stop laughter, coffee, and butterflies.', icon: 'fa-face-smile-beam', bg: 'icon-amber' },
    { date: '15 May 2023', title: 'Trip Together', desc: 'Exploring new places and creating memories we cherish forever.', icon: 'fa-camera-retro', bg: 'icon-emerald' },
    { date: '14 Feb 2024', title: 'Still Together', desc: 'Looking forward to a lifetime full of tomorrows with you.', icon: 'fa-ring', bg: 'icon-rose' }
  ]
};

let appState = loadState();

function loadState() {
  const saved = localStorage.getItem('evermine_state');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { console.error(e); }
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
  initAudioSynthesizer();
  renderTimelineList();
  renderFavoritesList();
  renderReasonsGrid();
  updateUIFromState();
});

// UPDATE UI FROM STATE
function updateUIFromState() {
  const startDateObj = new Date(appState.startDate);
  const formattedDate = startDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const displayDateEl = document.getElementById('display-start-date');
  if (displayDateEl) {
    displayDateEl.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Since ${formattedDate}`;
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

  document.getElementById('count-years').textContent = String(years).padStart(2, '0');
  document.getElementById('count-months').textContent = String(months).padStart(2, '0');
  document.getElementById('count-days').textContent = String(days).padStart(2, '0');
  document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('count-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('count-seconds').textContent = String(seconds).padStart(2, '0');
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
const LOVE_LETTER_TEXT = `My Dearest,

From the very first moment our eyes met, I knew there was something magical about you. You brought warmth into my life, turned simple days into unforgettable adventures, and showed me what true love really feels like.

Thank you for being my listener, my best friend, my favorite laughter, and my safest home. Every single day spent with you is my absolute favorite day.

I still fall for you every single day. Here's to us, our journey, and all of our tomorrows.

Forever & Always Yours,
With all my heart ❤️`;

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

// 5. AUDIO SYNTHESIZER ENGINE (ROMANTIC MELODY WEB AUDIO API)
let audioCtx = null;
let isAudioPlaying = false;
let melodyInterval = null;
let masterVolume = 0.8;

const ROMANTIC_NOTES = [
  261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
  220.00, 261.63, 329.63, 440.00, // A3, C4, E4, A4
  174.61, 220.00, 261.63, 349.23, // F3, A3, C4, F4
  196.00, 246.94, 293.66, 392.00  // G3, B3, D4, G4
];

function initAudioSynthesizer() {
  // Lazy init on first user click
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
  gain.gain.linearRampToValueAtTime(0.15 * masterVolume, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function toggleMainSong() {
  isAudioPlaying = !isAudioPlaying;

  const mainIcon = document.getElementById('main-play-icon');
  const barPlayBtn = document.getElementById('bar-play-btn');
  const disc = document.getElementById('music-disc');

  if (isAudioPlaying) {
    if (mainIcon) mainIcon.className = 'fa-solid fa-pause';
    if (barPlayBtn) barPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (disc) disc.classList.add('playing');
    startRomanticArpeggio();
  } else {
    if (mainIcon) mainIcon.className = 'fa-solid fa-play';
    if (barPlayBtn) barPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (disc) disc.classList.remove('playing');
    stopRomanticArpeggio();
  }
}

let noteStep = 0;
function startRomanticArpeggio() {
  if (melodyInterval) clearInterval(melodyInterval);
  melodyInterval = setInterval(() => {
    const note = ROMANTIC_NOTES[noteStep % ROMANTIC_NOTES.length];
    playSynthNote(note, 1.4);
    noteStep++;
  }, 450);
}

function stopRomanticArpeggio() {
  if (melodyInterval) clearInterval(melodyInterval);
}

function setVolume(val) {
  masterVolume = val / 100;
}

function prevTrack() {
  toggleMainSong();
  setTimeout(toggleMainSong, 200);
}

function nextTrack() {
  toggleMainSong();
  setTimeout(toggleMainSong, 200);
}

// 6. INTERACTIVE FLOATING CLICK HEARTS
function initClickHearts() {
  document.addEventListener('click', (e) => {
    // Ignore clicks on buttons/inputs to avoid clutter
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;

    createFloatingHeart(e.clientX, e.clientY);
  });
}

function createFloatingHeart(x, y) {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const heart = document.createElement('div');
  heart.className = 'floating-heart-el';
  heart.style.left = `${x - 12}px`;
  heart.style.top = `${y - 12}px`;

  const icons = ['❤️', '💖', '💕', '💗', '✨'];
  heart.textContent = icons[Math.floor(Math.random() * icons.length)];

  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2500);
}

function triggerHeartBurstAtCenter() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const offsetX = x + (Math.random() * 200 - 100);
      const offsetY = y + (Math.random() * 200 - 100);
      createFloatingHeart(offsetX, offsetY);
    }, i * 80);
  }
}

function triggerHeartBurst(event) {
  event.stopPropagation();
  const x = event.clientX;
  const y = event.clientY;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createFloatingHeart(x + (Math.random() * 60 - 30), y + (Math.random() * 60 - 30));
    }, i * 60);
  }
}

function triggerConfetti() {
  triggerHeartBurstAtCenter();
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
