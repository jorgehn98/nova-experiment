export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.dpr = Math.min(window.devicePixelRatio, 2);
    this.resize();
    this.init();
    this.bindEvents();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  init() {
    this.particles = [];
    const isMobile = this.width < 768;
    const count = isMobile
      ? Math.min(60, Math.floor((this.width * this.height) / 15000))
      : Math.min(150, Math.floor((this.width * this.height) / 8000));

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        baseOpacity: Math.random() * 0.4 + 0.1,
        opacity: 0,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  update() {
    const connectionDist = this.width < 768 ? 80 : 120;
    const mouseDist = 150;

    for (const p of this.particles) {
      // Mouse repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseDist && dist > 0) {
        const force = (mouseDist - dist) / mouseDist;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }

      // Damping
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Fade in
      if (p.opacity < p.baseOpacity) {
        p.opacity += 0.002;
      }

      // Wrap edges
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const connectionDist = this.width < 768 ? 80 : 120;

    // Connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          const alpha = (1 - dist / connectionDist) * 0.12 * Math.min(a.opacity, b.opacity) / 0.4;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 77, 0, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    // Particles
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 77, 0, ${p.opacity})`;
      this.ctx.fill();

      // Subtle glow for larger particles
      if (p.radius > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 77, 0, ${p.opacity * 0.1})`;
        this.ctx.fill();
      }
    }
  }

  animate() {
    this.update();
    this.draw();
    this.raf = requestAnimationFrame(() => this.animate());
  }

  start() {
    this.animate();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}
