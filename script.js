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
    if (window.referAsiaOrb) window.referAsiaOrb.setHolding(true);
  }

  function cancelHold() {
    if (completed) return;
    clearTimeout(holdTimer);
    ring.style.transitionDuration = '250ms';
    ring.style.strokeDashoffset = CIRCUMFERENCE;
    if (window.referAsiaOrb) window.referAsiaOrb.setHolding(false);
  }

  function onComplete() {
    completed = true;
    wrap.classList.add('completed');
    label.textContent = '✓';
    playPopSound();
    if (window.referAsiaOrb) window.referAsiaOrb.pulseComplete();

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

/* ── 3D ORB (Three.js) — replaces the flat hand illustration ── */
(function initOrb3D() {
  const wrap = document.getElementById('orbCanvasWrap');
  if (!wrap || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SIZE = 180;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.4;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(SIZE, SIZE);
  wrap.appendChild(renderer.domElement);

  const group = new THREE.Group();

  const wireGeo = new THREE.IcosahedronGeometry(1.05, 1);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xFF6B4A, wireframe: true, transparent: true, opacity: 0.9 });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  group.add(wireMesh);

  const innerGeo = new THREE.IcosahedronGeometry(1.0, 1);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xFFB347, transparent: true, opacity: 0.12 });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  scene.add(group);

  let baseSpeed = 0.006;
  let holding = false;
  let running = true;

  function setHolding(state) {
    holding = state;
  }

  function pulseComplete() {
    // Quick scale-and-flash pulse on successful hold
    wireMat.color.setHex(0xFFFFFF);
    innerMat.color.setHex(0xFF6B4A);
    const tl = gsap.timeline();
    tl.to(group.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.22, ease: 'back.out(3)' })
      .to(group.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out' });
    setTimeout(() => {
      wireMat.color.setHex(0xFF6B4A);
      innerMat.color.setHex(0xFFB347);
    }, 500);
  }

  window.referAsiaOrb = { setHolding, pulseComplete };

  function animate() {
    if (!running) return;
    const speed = holding ? baseSpeed * 6 : baseSpeed;
    group.rotation.y += speed;
    group.rotation.x += speed * 0.4;
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animate);
  }
  animate();
  if (reduceMotion) renderer.render(scene, camera); // static single frame

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reduceMotion) requestAnimationFrame(animate);
  });
})();

/* ── 3D TILT ON HOVER (pricing cards, stat card) ── */
(function initTilt3D() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch
  const els = document.querySelectorAll('.tilt-3d');

  els.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 8;   // max 8deg
      const rotateX = -((y - cy) / cy) * 8;
      el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
})();

/* ── ENHANCED PARALLAX DEPTH (Scene 4 floating papers) ── */
(function initPaperParallax() {
  const papers = document.querySelectorAll('.floating-papers .paper');
  if (!papers.length) return;

  papers.forEach((p, i) => {
    const speed = 40 + (i % 3) * 30; // vary depth per paper
    gsap.to(p, {
      y: (i % 2 === 0 ? -1 : 1) * speed,
      rotation: '+=25',
      ease: 'none',
      scrollTrigger: {
        trigger: '.scene-4',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
})();
