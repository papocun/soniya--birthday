// ══════════════════════════════════════
// BIRTHDAY DATE CONFIG
// ══════════════════════════════════════
const BDAY_MONTH = 6;   // June (1-indexed)
const BDAY_DAY   = 20;
const BDAY_YEAR  = 2026;

// ══════════════════════════════════════
// DATE HELPERS
// ══════════════════════════════════════
const now   = new Date();
const bday  = new Date(BDAY_YEAR, BDAY_MONTH - 1, BDAY_DAY, 0, 0, 0);
const isBday = now.getDate() === BDAY_DAY &&
               now.getMonth() === BDAY_MONTH - 1 &&
               now.getFullYear() === BDAY_YEAR;
const isPast = now > new Date(BDAY_YEAR, BDAY_MONTH - 1, BDAY_DAY, 23, 59, 59);

const dateStr = now.toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
document.getElementById('letterDate').textContent = dateStr + ' • Dedicated with love';
document.getElementById('footerDate').textContent = dateStr;

// ══════════════════════════════════════
// HERO MODE  (countdown / birthday)
// ══════════════════════════════════════
function setupHero() {
  const banner  = document.getElementById('countdownBanner');
  const inner   = document.getElementById('countdownInner');
  const eyebrow = document.getElementById('heroEyebrow');
  const title   = document.getElementById('heroTitle');
  const tagline = document.getElementById('heroTagline');

  if (isBday) {
    // ── IT'S HER BIRTHDAY ──
    document.body.classList.add('is-bday');
    banner.style.display = 'none';
    eyebrow.textContent  = '🎉 today is your special day 🎉';
    title.innerHTML      = 'Happy Birthday,<br><span class="name">Soniya!</span>';
    tagline.textContent  = 'You are so loved 💖';
    launchPageConfetti();

  } else if (isPast) {
    // After birthday — keep site as memory
    banner.style.display = 'none';
    eyebrow.textContent  = '✦ thank you for the memories ✦';

  } else {
    // ── COUNTDOWN MODE ──
    banner.classList.add('visible');
    function tick() {
      const diff = bday - new Date();
      if (diff <= 0) { location.reload(); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      inner.innerHTML = `
        <p class="cd-label">🎂 Soniya's Birthday in</p>
        <div class="cd-blocks">
          <div class="cd-block"><span class="cd-num">${String(d).padStart(2,'0')}</span><span class="cd-unit">Days</span></div>
          <span class="cd-sep">:</span>
          <div class="cd-block"><span class="cd-num">${String(h).padStart(2,'0')}</span><span class="cd-unit">Hours</span></div>
          <span class="cd-sep">:</span>
          <div class="cd-block"><span class="cd-num">${String(m).padStart(2,'0')}</span><span class="cd-unit">Mins</span></div>
          <span class="cd-sep">:</span>
          <div class="cd-block"><span class="cd-num">${String(s).padStart(2,'0')}</span><span class="cd-unit">Secs</span></div>
        </div>
      `;
    }
    tick();
    setInterval(tick, 1000);
  }
}
setupHero();

// ══════════════════════════════════════
// MUSIC
// ══════════════════════════════════════
let musicOn   = false;
let audioCtx  = null;
const normalAudio = document.getElementById('normalMusic');
const bdayAudio   = document.getElementById('bdayMusic');

// Use Web Audio API to generate music tones (no external files needed)
function createAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Simple melody player using Web Audio
let melodyInterval = null;
let melodyNoteIdx  = 0;

// Normal gentle melody notes (Hz) — soft looping ambient
const normalNotes = [261.6, 293.7, 329.6, 349.2, 392, 349.2, 329.6, 293.7];

// Happy Birthday melody notes (Hz)
const bdayNotes = [
  261.6, 261.6, 293.7, 261.6, 349.2, 329.6,   // Happy birth-day to you
  261.6, 261.6, 293.7, 261.6, 392,   349.2,    // Happy birth-day to you
  261.6, 261.6, 523.2, 440,   349.2, 329.6, 293.7, // Happy birth-day dear So-ni-ya
  466.2, 466.2, 440,   349.2, 392,   349.2      // Happy birth-day to you
];
const bdayDurations = [
  0.4,0.15,0.5,0.5,0.5,0.9,
  0.4,0.15,0.5,0.5,0.5,0.9,
  0.4,0.15,0.5,0.5,0.5,0.5,0.9,
  0.4,0.15,0.5,0.5,0.5,0.9
];

function playNote(freq, duration, type='sine', volume=0.18) {
  const ctx  = createAudioContext();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type      = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration - 0.05);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function startNormalMusic() {
  if (melodyInterval) clearInterval(melodyInterval);
  melodyNoteIdx = 0;
  function playNext() {
    if (!musicOn) return;
    playNote(normalNotes[melodyNoteIdx % normalNotes.length], 0.5, 'sine', 0.12);
    melodyNoteIdx++;
  }
  playNext();
  melodyInterval = setInterval(playNext, 550);
}

function startBdayMusic() {
  if (melodyInterval) clearInterval(melodyInterval);
  let idx = 0;
  function playNextBday() {
    if (!musicOn) return;
    if (idx >= bdayNotes.length) { idx = 0; }
    const dur = bdayDurations[idx] || 0.5;
    playNote(bdayNotes[idx], dur, 'triangle', 0.2);
    idx++;
    if (idx < bdayNotes.length) {
      setTimeout(playNextBday, (bdayDurations[idx-1] || 0.5) * 1000 + 60);
    } else {
      setTimeout(playNextBday, 1200); // pause before repeat
    }
  }
  playNextBday();
}

function toggleMusic() {
  const btn = document.getElementById('musicBtn');
  // First click — need user gesture to unlock AudioContext
  if (!musicOn) {
    musicOn = true;
    btn.textContent = '🔊';
    btn.classList.add('playing');
    if (isBday) {
      startBdayMusic();
    } else {
      startNormalMusic();
    }
  } else {
    musicOn = false;
    btn.textContent = '🔇';
    btn.classList.remove('playing');
    if (melodyInterval) clearInterval(melodyInterval);
    melodyInterval = null;
    if (audioCtx) { audioCtx.suspend(); audioCtx = null; }
  }
}

// ══════════════════════════════════════
// BACKGROUND FLOATING DOTS
// ══════════════════════════════════════
const dotColors = ['#f9c6d0','#fde8d8','#e8355a33','#f5a62333','#d8f0fd','#e8d8fd'];
const bgContainer = document.getElementById('bgFloaters');
for (let i = 0; i < 18; i++) {
  const d    = document.createElement('div');
  const size = 20 + Math.random() * 60;
  d.className = 'floater';
  d.style.cssText = `
    width:${size}px;height:${size}px;
    background:${dotColors[Math.floor(Math.random()*dotColors.length)]};
    left:${Math.random()*100}%;
    animation-duration:${8+Math.random()*12}s;
    animation-delay:${Math.random()*10}s;
  `;
  bgContainer.appendChild(d);
}

// ══════════════════════════════════════
// SPARKLES IN HERO
// ══════════════════════════════════════
const sparkleEmojis = ['✦','✧','✨','⭐','💫','🌟'];
const sparkleContainer = document.getElementById('sparkles');
for (let i = 0; i < 12; i++) {
  const s = document.createElement('span');
  s.className   = 'sparkle';
  s.textContent = sparkleEmojis[Math.floor(Math.random()*sparkleEmojis.length)];
  s.style.cssText = `
    left:${5+Math.random()*90}%;top:${5+Math.random()*90}%;
    animation-delay:${Math.random()*3}s;
    animation-duration:${2+Math.random()*2}s;
    font-size:${0.8+Math.random()*1}rem;
  `;
  sparkleContainer.appendChild(s);
}

// ══════════════════════════════════════
// FLOATING HEARTS
// ══════════════════════════════════════
const heartsRow = document.getElementById('heartsRow');
['💗','💖','💕','💓','💝'].forEach((h,i) => {
  const el = document.createElement('span');
  el.className = 'heart-float';
  el.textContent = h;
  el.style.animationDelay = (i*0.2)+'s';
  heartsRow.appendChild(el);
});

// ══════════════════════════════════════
// CAROUSEL
// ══════════════════════════════════════
let carouselIdx = 0;
const totalSlides = document.querySelectorAll('.carousel-slide').length;
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');

// Build dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Slide ' + (i+1));
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(idx) {
  carouselIdx = (idx + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === carouselIdx);
  });
}

function moveCarousel(dir) {
  goToSlide(carouselIdx + dir);
}

// Auto-advance every 3 seconds
setInterval(() => moveCarousel(1), 3000);

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) moveCarousel(diff > 0 ? 1 : -1);
});

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('polaroid')) {
      entry.target.parentElement.querySelectorAll('.polaroid').forEach((p,i) => {
        setTimeout(() => p.classList.add('visible'), i*120);
      });
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.letter-card, .polaroid').forEach(el => observer.observe(el));

// ══════════════════════════════════════
// GIFT REVEAL
// ══════════════════════════════════════
function revealGift() {
  document.getElementById('giftFront').style.display = 'none';
  document.getElementById('giftReveal').classList.add('show');
  launchConfetti();
}
function foldBack() {
  document.getElementById('giftReveal').classList.remove('show');
  document.getElementById('giftFront').style.display = 'block';
}

// ══════════════════════════════════════
// CONFETTI (section burst)
// ══════════════════════════════════════
function launchConfetti() {
  const burst  = document.getElementById('confettiBurst');
  burst.innerHTML = '';
  const cc = ['#e8355a','#f5a623','#3590e8','#9035e8','#35c8a0','#f9c6d0'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      background:${cc[Math.floor(Math.random()*cc.length)]};
      left:${Math.random()*100}%;top:0;
      animation-duration:${1.2+Math.random()*1.5}s;
      animation-delay:${Math.random()*0.5}s;
      width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
    `;
    burst.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

// ══════════════════════════════════════
// FULL PAGE CONFETTI (birthday mode)
// ══════════════════════════════════════
function launchPageConfetti() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(overlay);
  const cc = ['#e8355a','#f5a623','#3590e8','#9035e8','#35c8a0','#f9c6d0','#fff'];
  for (let i = 0; i < 120; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      background:${cc[Math.floor(Math.random()*cc.length)]};
      left:${Math.random()*100}%;
      top:-20px;
      width:${6+Math.random()*10}px;height:${6+Math.random()*10}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation:confettiFall ${2+Math.random()*3}s linear ${Math.random()*2}s forwards;
    `;
    overlay.appendChild(p);
  }
  // Repeat every 4s on birthday
  setInterval(() => {
    overlay.innerHTML = '';
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position:absolute;
        background:${cc[Math.floor(Math.random()*cc.length)]};
        left:${Math.random()*100}%;top:-20px;
        width:${6+Math.random()*10}px;height:${6+Math.random()*10}px;
        border-radius:${Math.random()>0.5?'50%':'2px'};
        animation:confettiFall ${2+Math.random()*3}s linear ${Math.random()*1}s forwards;
      `;
      overlay.appendChild(p);
    }
  }, 4000);
}