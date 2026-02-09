import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextIntoWords } from './textEffects.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  scrollProgress();
  navEffect();
  heroExit();
  dividers();
  manifestoReveal();
  workHorizontalScroll();
  marqueeVelocity();
  statsReveal();
  footerReveal();
  heroMouseParallax();
  backgroundShifts();
  sectionDots();
}

/* ── Scroll Progress Bar ─────────────────────────── */
function scrollProgress() {
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

/* ── Nav Background on Scroll ────────────────────── */
function navEffect() {
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 90%',
    onEnter: () => document.getElementById('nav').classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('nav').classList.remove('scrolled'),
  });
}

/* ── Hero Exit (parallax + scale + fade) ─────────── */
function heroExit() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  tl.to('.hero-content', { yPercent: -40, scale: 0.88, opacity: 0, ease: 'none' }, 0);
  tl.to('#particle-canvas', { opacity: 0, ease: 'none' }, 0.2);
  tl.to('.hero-orbs', { opacity: 0, scale: 1.3, ease: 'none' }, 0);
  tl.to('.scroll-indicator', { opacity: 0, yPercent: 80, ease: 'none' }, 0);
  tl.to('.rotating-badge', { opacity: 0, scale: 0.4, rotate: 90, ease: 'none' }, 0);
}

/* ── Divider Line Draw ───────────────────────────── */
function dividers() {
  gsap.utils.toArray('.divider-line').forEach((line) => {
    gsap.to(line, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: line, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
  });
}

/* ── Manifesto: word-by-word reveal with accent words */
function manifestoReveal() {
  const el = document.querySelector('.manifesto-text');
  if (!el) return;

  const accentWords = ['deliberate', 'purposeful', 'worlds', 'perception', 'redefine'];
  splitTextIntoWords(el, accentWords);

  const label = document.querySelector('.manifesto .section-label');
  if (label) {
    gsap.to(label, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto', start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  }

  gsap.to('.manifesto-text .word', {
    opacity: 1,
    y: 0,
    stagger: 0.04,
    ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 55%', end: 'bottom 40%', scrub: 1 },
  });

  // Hover glow on manifesto words
  if (window.innerWidth > 768) {
    document.querySelectorAll('.manifesto-text .word').forEach((w) => {
      w.addEventListener('mouseenter', () => {
        gsap.to(w, { color: '#fff', textShadow: '0 0 20px rgba(255,77,0,0.3)', duration: 0.3 });
      });
      w.addEventListener('mouseleave', () => {
        const isAccent = w.classList.contains('word--accent');
        gsap.to(w, {
          color: isAccent ? '' : '',
          textShadow: 'none',
          duration: 0.5,
          clearProps: 'color',
        });
      });
    });
  }
}

/* ── Work: horizontal scroll (pinned) + image reveal + counters */
function workHorizontalScroll() {
  const workLabel = document.querySelector('.work-section .section-label');
  const workCount = document.querySelector('.work-count');

  [workLabel, workCount].forEach((el) => {
    if (!el) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-section', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });

  const cards = gsap.utils.toArray('.work-card');

  // ── Mobile ──
  if (window.innerWidth < 768) {
    cards.forEach((card, i) => {
      const img = card.querySelector('.work-card-image');
      const numEl = card.querySelector('.work-card-number');
      const targetNum = i + 1;

      // Card enter
      gsap.from(card, {
        y: 80, opacity: 0, scale: 0.92, duration: 1, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      });

      // Image clip-path reveal
      gsap.fromTo(img,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut',
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Number counter
      ScrollTrigger.create({
        trigger: card, start: 'top 80%', once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: targetNum, duration: 0.8, ease: 'power2.out',
            onUpdate() { numEl.textContent = String(Math.round(this.targets()[0].val)).padStart(2, '0'); },
          });
        },
      });
    });
    return;
  }

  // ── Desktop: horizontal scroll ──
  const track = document.querySelector('.work-track');
  if (!track) return;

  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  const scrollTween = gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: '.work-section',
      start: 'top top',
      end: () => `+=${Math.abs(getScrollAmount())}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // Card scale + opacity on enter
  cards.forEach((card) => {
    gsap.fromTo(card,
      { opacity: 0.15, scale: 0.82 },
      {
        opacity: 1, scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: card, start: 'left 100%', end: 'left 50%',
          scrub: 1, containerAnimation: scrollTween,
        },
      }
    );
  });

  // Image clip-path reveal
  document.querySelectorAll('.work-card-image').forEach((img) => {
    gsap.fromTo(img,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)', ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.work-card'),
          start: 'left 95%', end: 'left 55%',
          scrub: 1, containerAnimation: scrollTween,
        },
      }
    );
  });

  // Image parallax inside card
  document.querySelectorAll('.work-card-image').forEach((img) => {
    gsap.fromTo(img,
      { xPercent: -8 },
      {
        xPercent: 8, ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.work-card'),
          start: 'left right', end: 'right left',
          scrub: 1, containerAnimation: scrollTween,
        },
      }
    );
  });

  // Number counters
  cards.forEach((card, i) => {
    const numEl = card.querySelector('.work-card-number');
    const targetNum = i + 1;

    ScrollTrigger.create({
      trigger: card, start: 'left 70%',
      containerAnimation: scrollTween, once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: targetNum, duration: 0.8, ease: 'power2.out',
          onUpdate() { numEl.textContent = String(Math.round(this.targets()[0].val)).padStart(2, '0'); },
        });
      },
    });
  });
}

/* ── Marquee: velocity-based skew ────────────────── */
function marqueeVelocity() {
  const tracks = document.querySelectorAll('.marquee-track');
  if (!tracks.length) return;

  ScrollTrigger.create({
    trigger: '.marquee-section',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const skew = gsap.utils.clamp(-5, 5, self.getVelocity() / 350);
      gsap.to(tracks, { skewX: skew, duration: 0.4, ease: 'power2.out', overwrite: true });
    },
  });

  gsap.from('.marquee-section', {
    opacity: 0, duration: 1,
    scrollTrigger: { trigger: '.marquee-section', start: 'top 85%', toggleActions: 'play none none reverse' },
  });
}

/* ── Stats: counter + stagger reveal ─────────────── */
function statsReveal() {
  gsap.utils.toArray('.stat-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.12,
      scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });

  gsap.utils.toArray('.stat-number').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val); },
        });
      },
    });
  });
}

/* ── Footer: dramatic reveal ─────────────────────── */
function footerReveal() {
  const footerLabel = document.querySelector('.footer .section-label');
  if (footerLabel) {
    gsap.to(footerLabel, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-content', start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  }

  gsap.utils.toArray('.footer-title .line').forEach((line, i) => {
    gsap.to(line, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.inOut', delay: i * 0.15,
      scrollTrigger: { trigger: '.footer-title', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });

  gsap.to('.footer-cta', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4,
    scrollTrigger: { trigger: '.footer-cta', start: 'top 90%', toggleActions: 'play none none reverse' },
  });

  // Footer glow pulse
  gsap.to('.footer-glow', {
    opacity: 1, scale: 1.15, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
    scrollTrigger: { trigger: '.footer', start: 'top 80%', toggleActions: 'play pause resume pause' },
  });
}

/* ── Hero: mouse-driven parallax ─────────────────── */
function heroMouseParallax() {
  if (window.innerWidth < 768) return;

  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const badge = document.querySelector('.rotating-badge');
  const orbs = document.querySelectorAll('.orb');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to(title, { x: x * 30, y: y * 18, duration: 1.2, ease: 'power2.out' });
    gsap.to(subtitle, { x: x * 15, y: y * 10, duration: 1.2, ease: 'power2.out' });
    if (badge) gsap.to(badge, { x: -x * 20, y: -y * 15, duration: 1.5, ease: 'power2.out' });

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      gsap.to(orb, { x: -x * factor, y: -y * factor, duration: 1.8 + i * 0.3, ease: 'power2.out' });
    });
  });
}

/* ── Background color shifts between sections ────── */
function backgroundShifts() {
  const shifts = [
    { trigger: '.manifesto', color: '#080808' },
    { trigger: '.work-section', color: '#050505' },
    { trigger: '.marquee-section', color: '#070707' },
    { trigger: '.stats', color: '#080606' },
    { trigger: '.footer', color: '#050505' },
  ];

  shifts.forEach(({ trigger, color }) => {
    ScrollTrigger.create({
      trigger,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => gsap.to('body', { backgroundColor: color, duration: 1.2, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to('body', { backgroundColor: '#050505', duration: 1.2 }),
    });
  });
}

/* ── Section navigation dots ─────────────────────── */
function sectionDots() {
  const nav = document.getElementById('section-nav');
  if (!nav) return;

  const dots = nav.querySelectorAll('.section-dot');
  const sectionIds = ['hero', 'about', 'work', 'stats', 'contact'];

  // Show dots after loader
  gsap.to(nav, {
    opacity: 1, duration: 1, delay: 0.5,
    scrollTrigger: { trigger: '.manifesto', start: 'top bottom', toggleActions: 'play none none reverse' },
  });

  // Track active section
  sectionIds.forEach((id, i) => {
    const section = document.getElementById(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(i),
      onEnterBack: () => setActiveDot(i),
    });
  });

  function setActiveDot(index) {
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  // Click to scroll
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target && window.__lenis) {
        window.__lenis.scrollTo(target);
      }
    });
  });
}
