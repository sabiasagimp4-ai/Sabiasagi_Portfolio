(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  const progress = qs('.scroll-progress span');
  const heroLines = qsa('.hero-line[data-speed]');
  const statementLines = qsa('.statement-line[data-marquee]');

  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if (progress) progress.style.width = `${p * 100}%`;

    if (!reduceMotion) {
      heroLines.forEach((line) => {
        const speed = Number(line.dataset.speed || 0);
        line.style.transform = `translate3d(${scrollY * speed}px, ${scrollY * 0.035}px, 0)`;
      });

      const statement = qs('.statement');
      if (statement) {
        const rect = statement.getBoundingClientRect();
        const local = clamp((innerHeight - rect.top) / (innerHeight + rect.height), 0, 1);
        statementLines.forEach((line, i) => {
          const dir = line.dataset.marquee === 'right' ? 1 : -1;
          const x = (local - .5) * 22 * dir;
          line.style.transform = `translate3d(calc(${x}vw - ${i ? 12 : 4}vw),0,0)`;
        });
      }
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  qsa('.reveal').forEach((el) => revealObserver.observe(el));

  const grid = qs('#work-grid');
  const count = qs('#works-count');

  const formatDate = (dateString) => {
    const d = new Date(String(dateString).trim());
    if (Number.isNaN(d.getTime())) return String(dateString).trim();
    return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(d).replaceAll('-', '.');
  };

  const createWorkCard = (work, index) => {
    const article = document.createElement('article');
    article.className = 'work-card reveal is-loading';

    const link = document.createElement('a');
    link.className = 'work-link work-hover-target';
    link.href = work.linkUrl || work.youtubeUrl || '#';
    link.setAttribute('aria-label', `${work.title} の詳細を見る`);

    const media = document.createElement('div');
    media.className = 'work-media';

    const num = document.createElement('span');
    num.className = 'work-index';
    num.textContent = String(index + 1).padStart(2, '0');
    media.appendChild(num);

    const open = document.createElement('span');
    open.className = 'work-open';
    open.textContent = '↗';
    media.appendChild(open);

    if (work.imageUrl) {
      const img = document.createElement('img');
      img.src = encodeURI(work.imageUrl);
      img.alt = '';
      img.loading = index < 3 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => article.classList.remove('is-loading'));
      img.addEventListener('error', () => {
        article.classList.remove('is-loading');
        media.classList.add('image-error');
      });
      media.appendChild(img);
    } else {
      article.classList.remove('is-loading');
    }

    const bottom = document.createElement('div');
    bottom.className = 'work-bottom';
    const title = document.createElement('h3');
    title.className = 'work-title';
    title.textContent = work.title;
    const date = document.createElement('time');
    date.className = 'work-date';
    date.textContent = formatDate(work.date);
    bottom.append(title, date);

    link.append(media, bottom);

    if (work.description) {
      const desc = document.createElement('p');
      desc.className = 'work-description';
      desc.textContent = work.description;
      link.appendChild(desc);
    }

    article.appendChild(link);
    return article;
  };

  fetch('data.json')
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((works) => {
      works.sort((a, b) => new Date(String(b.date).trim()) - new Date(String(a.date).trim()));
      if (count) count.textContent = `${String(works.length).padStart(2, '0')} WORKS`;
      const fragment = document.createDocumentFragment();
      works.forEach((work, index) => fragment.appendChild(createWorkCard(work, index)));
      grid.replaceChildren(fragment);
      qsa('.work-card.reveal').forEach((el) => revealObserver.observe(el));
      setupCardMotion();
      setupCursorTargets();
    })
    .catch((err) => {
      console.error('Failed to load works:', err);
      grid.innerHTML = '<p class="mono">WORK DATA COULD NOT BE LOADED.</p>';
    });

  const cursor = qs('.cursor');
  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  function setupCursorTargets() {
    if (!finePointer || reduceMotion || !cursor) return;
    qsa('a, .work-hover-target').forEach((el) => {
      if (el.dataset.cursorReady) return;
      el.dataset.cursorReady = '1';
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('visible');
        cursor.classList.toggle('small', !el.classList.contains('work-hover-target'));
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('visible', 'small'));
    });
  }

  if (finePointer && !reduceMotion && cursor) {
    addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * .16;
      cursorY += (mouseY - cursorY) * .16;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    setupCursorTargets();

    qsa('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * .16}px, ${y * .16}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  function setupCardMotion() {
    if (!finePointer || reduceMotion) return;
    qsa('.work-card').forEach((card) => {
      if (card.dataset.motionReady) return;
      card.dataset.motionReady = '1';
      const media = qs('.work-media', card);
      const img = qs('img', card);
      if (!media) return;

      card.addEventListener('pointermove', (e) => {
        const r = media.getBoundingClientRect();
        const nx = clamp((e.clientX - r.left) / r.width, 0, 1) - .5;
        const ny = clamp((e.clientY - r.top) / r.height, 0, 1) - .5;
        media.style.transform = `perspective(800px) rotateX(${ny * -2.8}deg) rotateY(${nx * 3.6}deg)`;
        if (img) img.style.transform = `scale(1.07) translate(${nx * -8}px, ${ny * -8}px)`;
      });
      card.addEventListener('pointerleave', () => {
        media.style.transform = '';
        if (img) img.style.transform = '';
      });
    });
  }

  const canvas = qs('#motion-field');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const pointer = { x: innerWidth * .5, y: innerHeight * .5 };

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener('resize', resize, { passive:true });
    addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive:true });

    let t = 0;
    const draw = () => {
      t += .008;
      ctx.clearRect(0, 0, w, h);
      if (scrollY < innerHeight * 1.15) {
        const gap = clamp(w / 18, 34, 72);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(200,255,0,.09)';
        for (let x = -gap; x < w + gap; x += gap) {
          ctx.beginPath();
          for (let y = -gap; y < h + gap; y += 10) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - dist / 320);
            const warp = influence * 18;
            const px = x + Math.sin(y * .012 + t * 3) * 2 + (dx / (dist || 1)) * warp;
            const py = y + Math.cos(x * .01 + t * 2) * 1.5 + (dy / (dist || 1)) * warp;
            if (y === -gap) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
})();
