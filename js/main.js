/**
 * TAGGY — Exact Blinq.me Duplicate Interactions & Core Logic
 * High-Performance, Fluid 60fps/120fps Animations & Smooth Scrolling Engine
 * Features: Taggy Cards Train Conveyor Evolution, SpaceFS Constellation Canvas,
 * Stacking Deck with Visible Docked Tabs, FAQ Accordion, Dark/Light Mode.
 * Strict Rules: Zero "PVC" wording, Zero blinking bubbles, Zero glowing effects, Zero emojis,
 * Zero unexpected auto-scrolling of the page.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. THEME TOGGLE (LIGHT / DARK THEME)
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');

  const savedTheme = localStorage.getItem('taggy-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('taggy-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
    } else {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    }
    window.dispatchEvent(new CustomEvent('taggy-theme-changed', { detail: { theme } }));
  }

  // ==========================================================================
  // 2. SPACEFS INTERACTIVE PARTICLE CONSTELLATION CANVAS (HIGH-PERFORMANCE RAF)
  // ==========================================================================
  const canvas = document.getElementById('spacefs-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let particles = [];
    const particleCount = 36;
    const mouse = { x: -1000, y: -1000, radius: 130, radiusSq: 130 * 130 };

    let isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    let dotColor = isDarkTheme ? 'rgba(255, 255, 255, 0.22)' : 'rgba(31, 21, 17, 0.12)';
    let lineColor = isDarkTheme ? 'rgba(255, 255, 255, 0.04)' : 'rgba(31, 21, 17, 0.035)';

    window.addEventListener('taggy-theme-changed', (e) => {
      isDarkTheme = e.detail.theme === 'dark';
      dotColor = isDarkTheme ? 'rgba(255, 255, 255, 0.22)' : 'rgba(31, 21, 17, 0.12)';
      lineColor = isDarkTheme ? 'rgba(255, 255, 255, 0.04)' : 'rgba(31, 21, 17, 0.035)';
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          radius: Math.random() * 1.4 + 0.8
        });
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    resizeCanvas();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // 1. Batch draw all particles in a single path
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouse.radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.6;
          p.y -= (dy / dist) * force * 1.6;
        }

        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fillStyle = dotColor;
      ctx.fill();

      // 2. Batch draw constellation lines
      ctx.beginPath();
      const maxDistSq = 14400; // 120px * 120px
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const distSq = ldx * ldx + ldy * ldy;
          if (distSq < maxDistSq) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.75;
      ctx.stroke();

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  // ==========================================================================
  // 3. HERO VIDEO PLAYER CONTROLS
  // ==========================================================================
  const heroVideo = document.getElementById('hero-main-video');
  const playBtn = document.getElementById('video-play-btn');
  const playText = document.getElementById('video-play-text');
  const audioBtn = document.getElementById('video-audio-btn');
  const audioText = document.getElementById('video-audio-text');

  if (heroVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play().then(() => {
            if (playText) playText.textContent = 'Pause Video';
          }).catch(() => {});
        } else {
          heroVideo.pause();
          if (playText) playText.textContent = 'Play Video';
        }
      });
    }, { threshold: 0.25 });

    heroVideo.addEventListener('play', () => {
      if (playText) playText.textContent = 'Pause Video';
    });
    heroVideo.addEventListener('pause', () => {
      if (playText) playText.textContent = 'Play Video';
    });

    videoObserver.observe(heroVideo);

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          if (playText) playText.textContent = 'Pause Video';
        } else {
          heroVideo.pause();
          if (playText) playText.textContent = 'Play Video';
        }
      });
    }

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        if (heroVideo.muted) {
          if (audioText) audioText.textContent = 'Unmute';
        } else {
          if (audioText) audioText.textContent = 'Mute';
        }
      });
    }
  }

  // ==========================================================================
  // 4. TAGGY CARDS CONVEYOR TRAIN EVOLUTION ENGINE
  // ==========================================================================
  const transformationSection = document.getElementById('transformation');
  const trainTrackViewport = document.getElementById('train-track-viewport');
  const trainRailPaper = document.getElementById('train-carriages-paper');
  const trainRailTaggy = document.getElementById('train-carriages-taggy');

  let trainProgress = 0; // 0 to 1
  let targetTrainProgress = 0;
  let isTrainLerpRunning = false;
  let isUserInteracting = false;

  const cardCount = 5;

  function calculateTrainOffset(progress) {
    if (!trainTrackViewport || !trainRailPaper) return 0;
    const viewportWidth = trainTrackViewport.offsetWidth || 1100;
    const portalX = viewportWidth / 2;

    const isMobile = window.innerWidth <= 850;
    const cardWidth = isMobile ? 320 : 410;
    const cardGap = isMobile ? 24 : 36;
    const paddingSide = isMobile ? 80 : 160;
    const unitWidth = cardWidth + cardGap;

    // In .train-carriages-rail (flex-direction: row-reverse):
    // Card 0 (Alexander Vance) is at the RIGHT end of the rail.
    // Card 4 (David Silva) is at the LEFT end of the rail.
    const cardLastCenter = paddingSide + (cardWidth / 2);
    const card0Center = cardLastCenter + ((cardCount - 1) * unitWidth);

    // At progress = 0: Card 0 is in the paper layer on the left side of the portal
    const leftZoneCenter = portalX * 0.5;
    const startTranslateX = leftZoneCenter - card0Center;

    // At progress = 1: Card 4 has crossed through and rests in the Taggy layer on the right side
    const rightZoneCenter = portalX + (portalX * 0.5);
    const endTranslateX = rightZoneCenter - cardLastCenter;

    const totalTravel = endTranslateX - startTranslateX;
    return startTranslateX + (progress * totalTravel);
  }

  function applyTrainTranslate(progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const translateX = calculateTrainOffset(clamped);

    if (trainRailPaper) {
      trainRailPaper.style.transform = `translate3d(${translateX}px, 0, 0)`;
    }
    if (trainRailTaggy) {
      trainRailTaggy.style.transform = `translate3d(${translateX}px, 0, 0)`;
    }
  }

  function tickTrainLerp() {
    const delta = targetTrainProgress - trainProgress;
    if (Math.abs(delta) > 0.0005) {
      trainProgress += delta * 0.10; // Silky fluid liquid damping
      applyTrainTranslate(trainProgress);
      requestAnimationFrame(tickTrainLerp);
      isTrainLerpRunning = true;
    } else {
      trainProgress = targetTrainProgress;
      applyTrainTranslate(trainProgress);
      isTrainLerpRunning = false;
    }
  }

  function setTrainProgress(progress, immediate = false) {
    targetTrainProgress = Math.max(0, Math.min(1, progress));
    if (immediate) {
      trainProgress = targetTrainProgress;
      applyTrainTranslate(trainProgress);
    } else if (!isTrainLerpRunning) {
      isTrainLerpRunning = true;
      requestAnimationFrame(tickTrainLerp);
    }
  }

  // Dragging on the train track
  if (trainTrackViewport) {
    let isDraggingTrack = false;
    let dragStartX = 0;
    let dragStartProgress = 0;

    trainTrackViewport.addEventListener('mousedown', (e) => {
      isDraggingTrack = true;
      isUserInteracting = true;
      dragStartX = e.clientX;
      dragStartProgress = trainProgress;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingTrack) return;
      const dx = e.clientX - dragStartX;
      const isMobile = window.innerWidth <= 850;
      const unitWidth = isMobile ? 344 : 446;
      const totalTravel = 4 * unitWidth;
      const progressDelta = dx / totalTravel;
      setTrainProgress(dragStartProgress + progressDelta, true);
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingTrack) {
        isDraggingTrack = false;
        isUserInteracting = false;
      }
    });

    // Touch events
    trainTrackViewport.addEventListener('touchstart', (e) => {
      if (!e.touches[0]) return;
      isDraggingTrack = true;
      isUserInteracting = true;
      dragStartX = e.touches[0].clientX;
      dragStartProgress = trainProgress;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDraggingTrack || !e.touches[0]) return;
      const dx = e.touches[0].clientX - dragStartX;
      const isMobile = window.innerWidth <= 850;
      const unitWidth = isMobile ? 344 : 446;
      const totalTravel = 4 * unitWidth;
      const progressDelta = dx / totalTravel;
      setTrainProgress(dragStartProgress + progressDelta, true);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDraggingTrack) {
        isDraggingTrack = false;
        isUserInteracting = false;
      }
    });
  }

  // ==========================================================================
  // 5. STACK CARDS DECK
  // ==========================================================================
  const stackSection = document.getElementById('sticky-cards');
  const stackCards = document.querySelectorAll('.stack-card');

  // ==========================================================================
  // 6. CENTRALIZED HIGH-PERFORMANCE UNIFIED SCROLL ENGINE
  // ==========================================================================
  const mainNav = document.getElementById('main-nav');
  let isNavScrolled = false;

  let cachedMetrics = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    transformTop: 0,
    transformHeight: 0,
    stackTop: 0,
    stackHeight: 0,
    isMobile: window.innerWidth <= 850
  };

  function updateMetrics() {
    cachedMetrics.windowHeight = window.innerHeight;
    cachedMetrics.windowWidth = window.innerWidth;
    cachedMetrics.isMobile = cachedMetrics.windowWidth <= 850;

    if (transformationSection) {
      const rect = transformationSection.getBoundingClientRect();
      cachedMetrics.transformTop = rect.top + window.scrollY;
      cachedMetrics.transformHeight = transformationSection.offsetHeight;
    }

    if (stackSection) {
      const sRect = stackSection.getBoundingClientRect();
      cachedMetrics.stackTop = sRect.top + window.scrollY;
      cachedMetrics.stackHeight = stackSection.offsetHeight;
    }

    applyTrainTranslate(trainProgress);
  }

  window.addEventListener('resize', updateMetrics, { passive: true });
  window.addEventListener('orientationchange', updateMetrics, { passive: true });
  updateMetrics();

  let isScrollScheduled = false;

  function renderScrollFrame() {
    const scrollY = window.scrollY;

    // 1. Smooth Navbar sticky state
    if (mainNav) {
      const shouldBeScrolled = scrollY > 30;
      if (shouldBeScrolled !== isNavScrolled) {
        isNavScrolled = shouldBeScrolled;
        if (isNavScrolled) {
          mainNav.classList.add('scrolled');
        } else {
          mainNav.classList.remove('scrolled');
        }
      }
    }

    // 2. Transformation Cards Train scroll progression (Pinned Section)
    if (!isUserInteracting && transformationSection && cachedMetrics.transformHeight > 0) {
      const pinTopOffset = 75;
      const pinStartScroll = cachedMetrics.transformTop - pinTopOffset;
      const pinScrollDistance = cachedMetrics.transformHeight - (cachedMetrics.windowHeight - pinTopOffset);

      if (pinScrollDistance > 50) {
        const scrolledPastPin = scrollY - pinStartScroll;
        const progress = Math.max(0, Math.min(1, scrolledPastPin / pinScrollDistance));
        setTrainProgress(progress, false);
      }
    }



    isScrollScheduled = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrollScheduled) {
      isScrollScheduled = true;
      requestAnimationFrame(renderScrollFrame);
    }
  }, { passive: true });

  renderScrollFrame();

  // ==========================================================================
  // 7. FAQ ACCORDION INTERACTION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }

});
