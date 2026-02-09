import gsap from 'gsap';

/* ── Custom cursor ─────────────────────────────── */
export function initCursor() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const cursor = document.querySelector('.cursor');
    if (cursor) cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  const cursor = document.querySelector('.cursor');
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  const text = cursor.querySelector('.cursor-text');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(ring, { x: ringX, y: ringY });
    gsap.set(text, { x: ringX, y: ringY });
  });

  const hoverTargets = 'a, button, .nav-link, .nav-logo, .footer-cta';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('[data-cursor="view"]')) {
      cursor.classList.remove('hovering');
      cursor.classList.add('viewing');
    } else if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('viewing');
      cursor.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-cursor="view"]')) {
      cursor.classList.remove('viewing');
    } else if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
    }
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to(cursor, { opacity: 1, duration: 0.3 });
  });
}

/* ── Magnetic hover ────────────────────────────── */
export function initMagnetic() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = parseFloat(el.dataset.strength) || 0.3;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });

    // Press effect
    el.addEventListener('mousedown', () => {
      gsap.to(el, { scale: 0.93, duration: 0.15, ease: 'power2.out' });
    });
    el.addEventListener('mouseup', () => {
      gsap.to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ── 3D tilt on work cards ─────────────────────── */
export function initTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.work-card').forEach((card) => {
    const image = card.querySelector('.work-card-image');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(image, {
        rotateY: x * 10,
        rotateX: -y * 10,
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(image, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 0.8, ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

/* ── Cursor trail (subtle particle trail) ──────── */
export function initCursorTrail() {
  if (window.innerWidth < 768 || 'ontouchstart' in window) return;

  const count = 10;
  const trails = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = 4 - i * 0.3;
    const alpha = 0.35 - i * 0.03;
    el.style.cssText = `
      position:fixed; top:0; left:0;
      width:${size}px; height:${size}px;
      background:rgba(255,77,0,${alpha});
      border-radius:50%; pointer-events:none;
      z-index:9999; transform:translate(-50%,-50%);
      mix-blend-mode:screen;
    `;
    document.body.appendChild(el);
    trails.push({ el, x: -100, y: -100 });
  }

  let mx = -100, my = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  gsap.ticker.add(() => {
    trails.forEach((t, i) => {
      const leader = i === 0 ? { x: mx, y: my } : trails[i - 1];
      const ease = 0.32 - i * 0.022;
      t.x += (leader.x - t.x) * ease;
      t.y += (leader.y - t.y) * ease;
      gsap.set(t.el, { x: t.x, y: t.y });
    });
  });
}
