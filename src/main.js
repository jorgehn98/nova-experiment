import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { ParticleSystem } from './particles.js';
import { initCursor, initMagnetic, initTilt, initCursorTrail } from './cursor.js';
import { TextScramble, generateNoiseTexture } from './textEffects.js';
import { initScrollAnimations } from './scrollAnimations.js';

gsap.registerPlugin(ScrollTrigger);

/* ── Smooth Scroll ─────────────────────────────── */
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Expose for section nav dots
  window.__lenis = lenis;
  return lenis;
}

/* ── Grain Overlay ─────────────────────────────── */
function initGrain() {
  const noiseUrl = generateNoiseTexture(256);
  const grain = document.querySelector('.grain');
  grain.style.backgroundImage = `url(${noiseUrl})`;
  grain.style.backgroundRepeat = 'repeat';
  grain.style.opacity = '0.035';
}

/* ── Split Hero Title into Characters ──────────── */
function splitHeroChars() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const text = title.textContent;
  title.innerHTML = text
    .split('')
    .map((c) => `<span class="char"><span class="char-inner">${c}</span></span>`)
    .join('');
}

/* ── Split Loader Title into Characters ────────── */
function splitLoaderChars() {
  const el = document.querySelector('.loader-title');
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = text
    .split('')
    .map((c) => `<span class="lchar"><span class="lchar-inner">${c}</span></span>`)
    .join('');
}

/* ── Loader (enhanced with chars + counter) ────── */
function playLoader() {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    const progress = loader.querySelector('.loader-progress');
    const percentEl = loader.querySelector('.loader-percent');

    const tl = gsap.timeline({
      onComplete: () => {
        loader.remove();
        resolve();
      },
    });

    // Chars slide in from below
    tl.from('.lchar-inner', {
      yPercent: 110,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power4.out',
    });

    // Progress bar + percent counter (in parallel)
    tl.to(progress, {
      width: '100%',
      duration: 1.6,
      ease: 'power2.inOut',
    }, '-=0.1');

    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate() {
          percentEl.textContent = Math.round(this.targets()[0].val);
        },
      },
      '<'
    );

    // Chars slide out upward
    tl.to('.lchar-inner', {
      yPercent: -110,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power3.in',
    });

    // Counter fades
    tl.to(percentEl, { opacity: 0, y: -10, duration: 0.3 }, '<');

    // Loader slides up
    tl.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, '-=0.2');
  });
}

/* ── Hero Intro Sequence ───────────────────────── */
function playHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Nav logo
  tl.to('.nav', { opacity: 1, y: 0, duration: 1 });

  // Nav links stagger
  tl.from('.nav-link', {
    y: 15, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
  }, '-=0.6');

  // Hero chars masked reveal
  tl.from('.hero-title .char-inner', {
    yPercent: 120, rotateZ: 6, duration: 1.1, stagger: 0.07,
  }, '-=0.4');

  // Particles
  tl.to('#particle-canvas', { opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=0.7');

  // Orbs
  tl.to('.orb', {
    opacity: (i) => [0.12, 0.08, 0.06][i],
    duration: 2, stagger: 0.2, ease: 'power2.out',
  }, '-=1.2');

  // Subtitle scramble
  const subtitleEl = document.querySelector('.hero-subtitle');
  const finalText = subtitleEl.textContent;
  subtitleEl.textContent = '';
  subtitleEl.style.opacity = '1';

  tl.add(() => {
    const scramble = new TextScramble(subtitleEl);
    scramble.setText(finalText);
  }, '-=1.0');

  // Badge
  tl.to('.rotating-badge', { opacity: 0.3, duration: 1.2, ease: 'power2.out' }, '-=0.8');

  // Scroll indicator
  tl.to('.scroll-indicator', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5');

  return tl;
}

/* ── Init ──────────────────────────────────────── */
async function init() {
  splitLoaderChars();
  splitHeroChars();

  initGrain();

  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const particles = new ParticleSystem(canvas);
    particles.start();
  }

  initSmoothScroll();

  initCursor();
  initMagnetic();
  initTilt();
  initCursorTrail();

  await playLoader();
  playHeroIntro();
  initScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
