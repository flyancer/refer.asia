/* ═══════════════════════════════════════════
   REFER.ASIA — script.js
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── SCROLL PROGRESS BAR ── */
gsap.to('#scrollProgress', {
  width: '100%',
  ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
});

/* ── REVEAL ON SCROLL ── */
document.querySelectorAll('.reveal').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 82%',
    onEnter: () => el.classList.add('visible'),
    once: true
  });
});

/* ── XP COUNTER ── */
const xpValueEl = document.getElementById('xpValue');
let currentXP = 0;

function animateXP(target) {
  gsap.to({ val: currentXP }, {
    val: target,
    duration: 0.9,
    ease: 'power2.out',
    onUpdate: function () {
      xpValueEl.textContent = Math.round(this.targets()[0].val);
    }
  });
  currentXP = target;
}

document.querySelectorAll('.scene[data-xp]').forEach(scene => {
  const xp = parseInt(scene.getAttribute('data-xp'), 10);
  ScrollTrigger.create({
    trigger: scene,
    start: 'top 50%',
    onEnter: () => animateXP(xp),
    onEnterBack: () => animateXP(xp)
  });
});

/* ── SCROLL TO SCENE HELPER (used by persistent CTA) ── */
function scrollToScene(n) {
  const scenes = document.querySelectorAll('.scene');
  const target = scenes[n - 1];
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}

/* ── SYNTHESIZED "POP" SOUND (no audio file needed) ── */
let audioCtx = null;
function playPopSound() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(680, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) {
    // Web Audio unsupported — fail silently, interaction still works visually
  }
}

/* ── TAP & HOLD INTERACTION (Scene 2) ── */
(function initHoldInteraction() {
  const wrap = document.getElementById('holdRingWrap');
  const ring = document.getElementById('ringFill');
  const label = document.getElementById('holdLabel');
  const hand = document.querySelector('.reach-hand');
  const line1 = document.getElementById('afterHoldLine1');
  const line2 = document.getElementById('afterHoldLine2');
  if (!wrap || !ring) return;

  const HOLD_MS = 1100;
  const CIRCUMFERENCE = 327;
  let holdTimer = null;
  let completed = false;

  function startHold() {
    if (completed) return;
    ring.style.transitionDuration = HOLD_MS + 'ms';
    ring.style.strokeDashoffset = '0';
    holdTimer = setTimeout(onComplete, HOLD_MS);
  }

  function cancelHold() {
    if (completed) return;
    clearTimeout(holdTimer);
    ring.style.transitionDuration = '250ms';
    ring.style.strokeDashoffset = CIRCUMFERENCE;
  }

  function onComplete() {
    completed = true;
    wrap.classList.add('completed');
    label.textContent = '✓';
    hand.classList.add('grabbed');
    playPopSound();

    gsap.to(line1, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 });
    gsap.to(line2, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 });
  }

  wrap.addEventListener('pointerdown', startHold);
  wrap.addEventListener('pointerup', cancelHold);
  wrap.addEventListener('pointerleave', cancelHold);
  wrap.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); }, { passive: false });
  wrap.addEventListener('touchend', cancelHold);
})();

/* ── CONFETTI BURST (Scene 7) ── */
(function initConfetti() {
  const layer = document.getElementById('confettiLayer');
  if (!layer) return;
  const colors = ['#FFFFFF', '#FFB347', '#FF6B4A', '#DFFFFB'];
  let fired = false;

  ScrollTrigger.create({
    trigger: '.scene-7',
    start: 'top 60%',
    onEnter: () => {
      if (fired) return;
      fired = true;
      for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        layer.appendChild(piece);

        const angle = Math.random() * Math.PI * 2;
        const dist = 150 + Math.random() * 250;
        gsap.to(piece, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 50,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 1.2 + Math.random() * 0.6,
          ease: 'power2.out',
          onComplete: () => piece.remove()
        });
      }
    }
  });
})();

/* ── EMAIL CAPTURE (frontend-only for now — wire to Supabase once the
   refer.asia project exists) ── */
function handleEmailCapture(e, type) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  if (!email) return;

  // Store locally for now — replace with a real Supabase insert later
  const key = 'referasia_leads';
  const leads = JSON.parse(localStorage.getItem(key) || '[]');
  leads.push({ email, type, ts: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(leads));

  const btn = form.querySelector('button');
  btn.textContent = "You're in! ✓";
  btn.disabled = true;
  form.querySelector('input').disabled = true;
}
