/* =============================================================================
   PATHWAYS TO PURPOSE — Main JavaScript
   Navigation, scroll reveal, interactivity, utilities
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize only features that exist on current page
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  
  // Conditional initialization based on element presence
  if (document.querySelector('.reveal, .reveal-left, .reveal-right, .reveal-scale')) {
    initScrollReveal();
  }
  
  if (document.querySelector('.back-to-top')) {
    initBackToTop();
  }
  
  if (document.querySelector('.question-section')) {
    initQuestionSection();
  }
  
  if (document.querySelector('.tabs')) {
    initTabs();
  }
  
  if (document.querySelector('.chip-grid')) {
    initChips();
  }
  
  if (document.querySelector('form[data-ajax]')) {
    initForms();
  }
  
  if (document.querySelector('.stat-number[data-count]')) {
    initCountUp();
  }
});

/* =============================================================================
   NAVBAR
   ============================================================================= */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = current;
  }, { passive: true });
}

/* =============================================================================
   MOBILE MENU
   ============================================================================= */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* =============================================================================
   SCROLL REVEAL
   ============================================================================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealElements.length) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('visible'));
    return;
  }

  // Use IntersectionObserver with error handling
  try {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } catch (error) {
    // Fallback: make all elements visible if IntersectionObserver fails
    console.warn('IntersectionObserver not supported, showing all elements');
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

/* =============================================================================
   BACK TO TOP
   ============================================================================= */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================================================
   QUESTION SECTION ("What Are You Becoming?")
   ============================================================================= */
function initQuestionSection() {
  const prompts = document.querySelectorAll('.question-prompt');
  const answerEl = document.querySelector('.question-answer p');
  if (!prompts.length || !answerEl) return;

  const answers = {
    'Who are you?': 'Understanding yourself is the first step toward building a meaningful future.',
    'What matters to you?': 'Your values are your compass. They guide every decision you make.',
    'What are you good at?': 'Your strengths are the foundation on which you build your purpose.',
    'Where are you going?': 'Vision gives direction. Even a rough idea of your destination helps you take the right steps.',
    'What do you need to become?': 'Growth is intentional. The skills you develop today shape the leader you become tomorrow.',
    'What possibilities exist?': 'Opportunities are everywhere — but you have to know where to look and how to prepare.',
    'What impact will you make?': 'Your life is not just about success. It is about significance — the difference you make for others.'
  };

  prompts.forEach(prompt => {
    prompt.addEventListener('click', () => {
      prompts.forEach(p => p.classList.remove('active'));
      prompt.classList.add('active');

      const question = prompt.textContent.trim();
      answerEl.style.opacity = '0';
      answerEl.style.transform = 'translateY(10px)';

      setTimeout(() => {
        answerEl.textContent = answers[question] || '';
        answerEl.style.opacity = '1';
        answerEl.style.transform = 'translateY(0)';
      }, 300);
    });
  });
}

/* =============================================================================
   SMOOTH SCROLL
   ============================================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* =============================================================================
   TABS FILTERING
   ============================================================================= */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const targetId = tabGroup.dataset.target;
    const container = document.getElementById(targetId);
    if (!container) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const items = container.querySelectorAll('[data-category]');

        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            // Re-trigger animation
            item.classList.remove('visible');
            requestAnimationFrame(() => item.classList.add('visible'));
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* =============================================================================
   CHIPS (Interactive selection)
   ============================================================================= */
function initChips() {
  document.querySelectorAll('.chip-grid').forEach(grid => {
    const chips = grid.querySelectorAll('.chip');
    const storageKey = grid.dataset.storageKey;
    const maxSelect = parseInt(grid.dataset.maxSelect) || 999;

    // Load saved selections
    if (storageKey) {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      chips.forEach(chip => {
        if (saved.includes(chip.textContent.trim())) {
          chip.classList.add('selected');
        }
      });
      updateChipResults(grid);
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const selectedCount = grid.querySelectorAll('.chip.selected').length;

        if (chip.classList.contains('selected')) {
          chip.classList.remove('selected');
        } else if (selectedCount < maxSelect) {
          chip.classList.add('selected');
        }

        // Save to localStorage
        if (storageKey) {
          const selected = Array.from(grid.querySelectorAll('.chip.selected'))
            .map(c => c.textContent.trim());
          localStorage.setItem(storageKey, JSON.stringify(selected));
        }

        updateChipResults(grid);
      });
    });
  });
}

function updateChipResults(grid) {
  const resultsEl = grid.closest('.tool-section')?.querySelector('.tool-results');
  if (!resultsEl) return;

  const selected = Array.from(grid.querySelectorAll('.chip.selected'))
    .map(c => c.textContent.trim());

  if (selected.length === 0) {
    resultsEl.innerHTML = '<p style="color: var(--color-text-muted); font-size: var(--text-sm); margin:0;">Select items above to see your choices here.</p>';
  } else {
    resultsEl.innerHTML = `
      <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3);">
        <strong>Your selections (${selected.length}):</strong>
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
        ${selected.map(s => `<span class="card-tag">${s}</span>`).join('')}
      </div>
    `;
  }
}

/* =============================================================================
   FORMS
   ============================================================================= */
function initForms() {
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // DEMO MODE: In production, replace with actual API call
      // For now, show clear messaging that this is demo mode
      setTimeout(() => {
        // Create success message
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
          padding: var(--space-4);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-lg);
          color: var(--color-success);
          margin-top: var(--space-4);
          font-size: var(--text-sm);
          line-height: var(--leading-normal);
        `;
        messageEl.innerHTML = `
          <strong>✓ Form validated successfully</strong><br>
          <em>Note: This is demo mode. In production, your message will be sent to the Pathways to Purpose team.</em>
        `;
        
        // Insert message after form
        form.parentNode.insertBefore(messageEl, form.nextSibling);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        form.reset();
        
        // Remove message after 8 seconds
        setTimeout(() => {
          messageEl.style.transition = 'opacity var(--duration-normal) var(--ease-out)';
          messageEl.style.opacity = '0';
          setTimeout(() => messageEl.remove(), 300);
        }, 8000);
      }, 1000);
    });
  });
}


/* =============================================================================
   COUNT UP ANIMATION
   ============================================================================= */
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (!statNumbers.length) return;

  try {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  } catch (error) {
    // Fallback: show final values immediately
    console.warn('IntersectionObserver not supported for count animation');
    statNumbers.forEach(el => {
      const target = el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      el.textContent = prefix + target + suffix;
    });
  }
}

function animateCount(el) {
  const target = el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
  
  if (isNaN(numericTarget)) {
    el.textContent = prefix + target + suffix;
    return;
  }
  
  const duration = 2000;
  const start = performance.now();

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * numericTarget);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(step);
}

/* =============================================================================
   UTILITY: Get URL path for navigation highlighting
   ============================================================================= */
function highlightActiveNav() {
  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = rawPage === '' ? 'index.html' : rawPage;

  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    
    if (linkFile === currentPage || (currentPage === 'index.html' && (href === './' || href === 'index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Run on load
highlightActiveNav();
