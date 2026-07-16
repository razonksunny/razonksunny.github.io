const USERNAME = "razonksunny";

// ── THEME TOGGLE ─────────────────────────────
(function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");

  const DARK_STATS = "https://github-stats-extended.vercel.app/api?username=razonksunny&show_icons=true&theme=dark";
  const LIGHT_STATS = "https://github-stats-extended.vercel.app/api?username=razonksunny&show_icons=true&bg_color=e0e5ec&text_color=555b62&title_color=6c5ce7&icon_color=6c5ce7";
  const DARK_STREAK = "https://github-readme-streak-stats.herokuapp.com/?user=razonksunny&theme=dark&background=111111&stroke=2a2a2a&ring=e8ff6b&fire=e8ff6b&currStreakLabel=e8ff6b&border_radius=10";
  const LIGHT_STREAK = "https://github-readme-streak-stats.herokuapp.com/?user=razonksunny&theme=light&background=e0e5ec&stroke=d1d9e6&ring=6c5ce7&fire=6c5ce7&currStreakLabel=6c5ce7&border_radius=10";

  function swapImg(id, src, fallbackId) {
    const img = document.getElementById(id);
    const fallback = document.getElementById(fallbackId);
    if (!img) return;
    img.style.display = "block";
    if (fallback) fallback.style.display = "none";
    img.src = src;
  }

  function applyTheme(isLight) {
    document.documentElement.classList.toggle("light-mode", isLight);
    swapImg("gh-stats", isLight ? LIGHT_STATS : DARK_STATS, "statsFallback");
    swapImg("gh-streak", isLight ? LIGHT_STREAK : DARK_STREAK, "streakFallback");
  }

  if (stored === null) {
    applyTheme(true);
    localStorage.setItem("theme", "light");
  } else {
    applyTheme(stored === "light");
  }

  toggle.addEventListener("click", () => {
    const isLight = !document.documentElement.classList.contains("light-mode");
    applyTheme(isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
})();

// ── CUSTOM CURSOR ──────────────────────────────
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top  = mouseY + "px";
});

(function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + "px";
  follower.style.top  = followerY + "px";
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("a, button, .skill-row, .contact-link").forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});

// ── NOISE CANVAS ───────────────────────────────
(function initNoise() {
  const c = document.getElementById("noise-canvas");
  if (!c) return;
  const ctx = c.getContext("2d");

  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  let frame = 0;
  function drawNoise() {
    if (frame++ % 3 !== 0) { requestAnimationFrame(drawNoise); return; }
    const w = c.width, h = c.height;
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(drawNoise);
  }
  drawNoise();
})();

// ── PARTICLE HERO CANVAS ───────────────────────
(function initParticles() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener("resize", () => { resize(); init(); });
  document.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  const ACCENT  = [232, 255, 107];
  const ACCENT2 = [107, 255, 216];
  const PARTICLE_COUNT = Math.min(120, Math.floor(window.innerWidth / 12));

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.ox = this.x;
      this.oy = this.y;
      this.size   = Math.random() * 1.5 + 0.3;
      this.speed  = Math.random() * 0.3 + 0.05;
      this.angle  = Math.random() * Math.PI * 2;
      this.range  = Math.random() * 60 + 20;
      this.color  = Math.random() > 0.5 ? ACCENT : ACCENT2;
      this.alpha  = Math.random() * 0.4 + 0.1;
      this.twinkle = Math.random() * 0.02 + 0.005;
      this.phase  = Math.random() * Math.PI * 2;
    }
    update(t) {
      this.angle += this.speed * 0.01;
      this.x = this.ox + Math.cos(this.angle) * (this.range * 0.3);
      this.y = this.oy + Math.sin(this.angle * 1.3) * (this.range * 0.3);

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += dx / dist * force * 40;
        this.y += dy / dist * force * 40;
      }

      this.currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(t * this.twinkle + this.phase));
    }
    draw() {
      const [r,g,b] = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.currentAlpha})`;
      ctx.fill();
    }
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.018)";
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawConnections() {
    const MAX_DIST = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(232,255,107,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  let animT = 0;
  function animate() {
    animT += 0.5;
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawConnections();
    particles.forEach(p => { p.update(animT); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
})();

// ── NAV SCROLL ─────────────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// ── TYPING ANIMATION ───────────────────────────
(function initTyping() {
  const el = document.getElementById("typing-text");
  if (!el) return;
  const phrases = [
    "// developer",
    "// builder",
    "// open source fan",
    "// python lover",
    "// always learning",
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1600); return; }
      setTimeout(type, 65);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 300); return; }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 1200);
})();

// ── SCROLL REVEAL ──────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".sr, .skill-row, .project-card").forEach(el => revealObs.observe(el));

// ── SECTION ENTRIES ───────────────────────────────
const sectionEls = document.querySelectorAll(".section-label, .section-title, .contact-title, .about-right, .about-left, .stats-grid, .contact-links, .stat-img-card");
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = "1";
      e.target.style.transform = "translateY(0)";
      sectionObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

sectionEls.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
  sectionObs.observe(el);
});

// ── SKILL BARS ─────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      const bar = e.target.querySelector(".sk-bar");
      if (bar) {
        const pct = bar.dataset.pct;
        setTimeout(() => { bar.style.width = pct + "%"; }, 100 + parseInt(e.target.style.getPropertyValue("--i") || 0) * 80);
      }
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".skill-row").forEach(el => skillObs.observe(el));

// ── COUNTER ANIMATION ──────────────────────────
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach(el => counterObs.observe(el));

// ── MAGNETIC BUTTONS ───────────────────────────
document.querySelectorAll(".mag-btn").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
    btn.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
    setTimeout(() => { btn.style.transition = ""; }, 500);
  });
});

// ── LOAD GITHUB PROJECTS ───────────────────────
async function loadProjects() {
  const list = document.getElementById("project-list");
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=9`);
    if (!res.ok) throw new Error();
    const repos = await res.json();
    const filtered = repos.filter(r => r.name !== `${USERNAME}.github.io`).slice(0, 6);

    list.innerHTML = "";

    filtered.forEach((repo, i) => {
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "project-card";
      card.style.transitionDelay = `${i * 0.1}s`;

      const badge = repo.language
        ? `<span class="project-lang-badge">${repo.language}</span>`
        : repo.stargazers_count > 0
        ? `<span class="project-lang-badge">⭐ ${repo.stargazers_count}</span>`
        : `<span class="project-lang-badge">code</span>`;

      const name = repo.name.replace(/-/g, " ").replace(/_/g, " ");

      card.innerHTML = `
        <div class="project-card-num">0${i + 1}</div>
        <h3>${name}</h3>
        <p>${repo.description || "No description available."}</p>
        <div class="project-card-footer">
          <span class="project-link-text">View on GitHub ↗</span>
          ${badge}
        </div>
      `;

      list.appendChild(card);

      setTimeout(() => {
        revealObs.observe(card);
        document.body.addEventListener("mouseenter", () => {}, { once: true });
      }, 50);
    });

    if (filtered.length === 0) {
      list.innerHTML = `<p style="color:var(--muted);font-family:var(--font-mono);font-size:.82rem;grid-column:1/-1;">No public repos found.</p>`;
    }

  } catch {
    list.innerHTML = `<p style="color:var(--muted);font-family:var(--font-mono);font-size:.82rem;grid-column:1/-1;padding:2rem 0;">Couldn't load projects — <a href="https://github.com/${USERNAME}" style="color:var(--accent)">visit GitHub directly ↗</a></p>`;
  }
}

window.addEventListener("DOMContentLoaded", loadProjects);

// ── AVATAR TILT ────────────────────────────────
const avatarWrap = document.querySelector(".avatar-wrap");
if (avatarWrap) {
  avatarWrap.addEventListener("mousemove", e => {
    const rect = avatarWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -20;
    const ry = ((e.clientX - cx) / rect.width) * 20;
    avatarWrap.style.transform = `perspective(400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  avatarWrap.addEventListener("mouseleave", () => {
    avatarWrap.style.transform = "";
  });
}

// ── PARALLAX HERO ──────────────────────────────
const heroContent = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  if (!heroContent) return;
  const y = window.scrollY;
  heroContent.style.transform = `translateY(${y * 0.25}px)`;
  heroContent.style.opacity = 1 - y / (window.innerHeight * 0.7);
}, { passive: true });
