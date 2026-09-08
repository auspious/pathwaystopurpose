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

  if (document.getElementById('profile-summary-container')) {
    initProfileSummary();
  }

  if (document.querySelector('[data-course-id]')) {
    initCourseModals();
  }

  if (document.querySelector('.btn-join-community')) {
    initCommunityModal();
  }
});

/* =============================================================================
   NAVBAR
   ============================================================================= */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Dropdown toggle behavior for touch/click & keyboard
  document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = dropdown.classList.contains('active');
      document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.remove('active'));
      if (!isActive) {
        dropdown.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdowns on outside click or Escape
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-item-dropdown').forEach(d => {
      d.classList.remove('active');
      d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-item-dropdown').forEach(d => {
        d.classList.remove('active');
        d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
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
      const parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
        parentDropdown.querySelector('.dropdown-toggle')?.classList.add('active');
      }
    } else {
      link.classList.remove('active');
    }
  });
}

// Run on load
highlightActiveNav();

/* =============================================================================
   PROFILE SUMMARY & EXPORT SYSTEM (journey.html)
   ============================================================================= */
function initProfileSummary() {
  const container = document.getElementById('profile-summary-container');
  if (!container) return;

  function renderSummary() {
    const strengths = JSON.parse(localStorage.getItem('ptp-strengths') || '[]');
    const values = JSON.parse(localStorage.getItem('ptp-values') || '[]');
    const interests = JSON.parse(localStorage.getItem('ptp-interests') || '[]');
    const vision = localStorage.getItem('ptp-vision') || '';
    const goals = JSON.parse(localStorage.getItem('ptp-goals') || '[]');
    const purpose = JSON.parse(localStorage.getItem('ptp-purpose') || 'null');

    let html = `
      <div class="profile-summary-card" id="printable-profile">
        <div class="profile-summary-header">
          <div>
            <span class="text-overline" style="color: var(--color-gold);">Pathways to Purpose</span>
            <h3 style="font-size: var(--text-2xl); color: var(--color-navy); margin: var(--space-1) 0 0;">My Self-Discovery Profile</h3>
            <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin: 0;">Created on Pathways to Purpose · Saved locally in browser</p>
          </div>
          <div style="display: flex; gap: var(--space-3);" class="no-print">
            <button type="button" class="btn btn-outline btn-sm" id="btn-copy-profile">📋 Copy Text</button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-print-profile">🖨️ Print / Save PDF</button>
          </div>
        </div>

        <div class="profile-summary-grid">
          <div class="profile-section-box">
            <div class="profile-section-title">🔍 My Strengths (${strengths.length})</div>
            ${strengths.length > 0 
              ? `<div class="profile-tags-list">${strengths.map(s => `<span class="card-tag">${s}</span>`).join('')}</div>`
              : `<p class="profile-text-content" style="font-style: italic; color: var(--color-text-muted);">No strengths selected yet.</p>`}
          </div>

          <div class="profile-section-box">
            <div class="profile-section-title">💎 My Values (${values.length})</div>
            ${values.length > 0 
              ? `<div class="profile-tags-list">${values.map(v => `<span class="card-tag">${v}</span>`).join('')}</div>`
              : `<p class="profile-text-content" style="font-style: italic; color: var(--color-text-muted);">No values selected yet.</p>`}
          </div>

          <div class="profile-section-box">
            <div class="profile-section-title">✨ My Interests (${interests.length})</div>
            ${interests.length > 0 
              ? `<div class="profile-tags-list">${interests.map(i => `<span class="card-tag">${i}</span>`).join('')}</div>`
              : `<p class="profile-text-content" style="font-style: italic; color: var(--color-text-muted);">No interests selected yet.</p>`}
          </div>

          <div class="profile-section-box">
            <div class="profile-section-title">🔭 My 10-Year Vision</div>
            ${vision 
              ? `<p class="profile-text-content">${vision}</p>`
              : `<p class="profile-text-content" style="font-style: italic; color: var(--color-text-muted);">No vision statement written yet.</p>`}
          </div>
        </div>

        <div class="profile-section-box" style="margin-bottom: var(--space-6);">
          <div class="profile-section-title">🎯 My Active Goals (${goals.length})</div>
          ${goals.length > 0 
            ? `<div style="display: grid; gap: var(--space-3);">${goals.map((g, idx) => `
                <div style="background: var(--color-surface); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
                  <strong style="color: var(--color-navy); font-size: var(--text-sm); display: block;">${idx + 1}. [${(g.category || 'General').toUpperCase()}] ${g.text}</strong>
                  <span style="font-size: var(--text-xs); color: var(--color-text-secondary); display: block; margin-top: 4px;"><strong>Why:</strong> ${g.why || 'Not specified'}</span>
                  <span style="font-size: var(--text-xs); color: var(--color-blue); display: block; margin-top: 2px;"><strong>First Step:</strong> ${g.firstStep || 'Not specified'}</span>
                </div>
              `).join('')}</div>`
            : `<p class="profile-text-content" style="font-style: italic; color: var(--color-text-muted);">No goals saved yet.</p>`}
        </div>

        <div class="profile-section-box" style="background: linear-gradient(135deg, rgba(27, 117, 187, 0.05), rgba(244, 166, 42, 0.08)); border-color: var(--color-gold-light);">
          <div class="profile-section-title" style="color: var(--color-navy);">🧭 My Purpose Direction</div>
          ${purpose && purpose.output
            ? `<p class="profile-text-content" style="font-size: var(--text-base); font-family: var(--font-display); font-weight: 600; color: var(--color-navy);">${purpose.output}</p>`
            : `<p class="profile-text-content" style="font-style: italic; color: var(--color-text-muted);">Build your purpose direction in Step 6 to see your statement here.</p>`}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach print and copy listeners
    document.getElementById('btn-print-profile')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-copy-profile')?.addEventListener('click', function() {
      const summaryText = `PATHWAYS TO PURPOSE — MY DISCOVERY PROFILE\n\n` +
        `STRENGTHS: ${strengths.join(', ') || 'None'}\n` +
        `VALUES: ${values.join(', ') || 'None'}\n` +
        `INTERESTS: ${interests.join(', ') || 'None'}\n\n` +
        `VISION:\n${vision || 'None'}\n\n` +
        `GOALS:\n${goals.map(g => `- [${g.category}] ${g.text} (First Step: ${g.firstStep})`).join('\n') || 'None'}\n\n` +
        `PURPOSE DIRECTION:\n${purpose?.output || 'None'}`;
      
      navigator.clipboard.writeText(summaryText).then(() => {
        this.textContent = 'Copied ✓';
        setTimeout(() => this.textContent = '📋 Copy Text', 2000);
      });
    });
  }

  renderSummary();
  window.addEventListener('storage', renderSummary);
  document.addEventListener('ptp-profile-updated', renderSummary);
}

/* =============================================================================
   COURSE MODAL & SYLLABUS SYSTEM (learn.html)
   ============================================================================= */
function initCourseModals() {
  const courseData = {
    'c1': {
      title: 'Who Am I?',
      phase: 'Phase 1: Personal Discovery',
      duration: '5 Lessons · 2 Hours',
      description: 'Explore your identity, personality, strengths and unique qualities. Self-awareness is the bedrock of intentional career and life choices.',
      lessons: [
        { title: 'Lesson 1: The Foundation of Identity', desc: 'Understanding how your upbringing, environment, and choices shape who you are.' },
        { title: 'Lesson 2: Uncovering Your Core Strengths', desc: 'Practical tools to identify what you naturally do well and how to build on it.' },
        { title: 'Lesson 3: Personality & Learning Styles', desc: 'Discover how you process information, interact with others, and solve problems.' },
        { title: 'Lesson 4: Overcoming Imposter Syndrome', desc: 'Recognising self-doubt and building quiet, enduring self-belief.' },
        { title: 'Lesson 5: Crafting Your Personal Inventory', desc: 'Synthesising your strengths, interests, and qualities into a personal growth profile.' }
      ]
    },
    'c2': {
      title: 'Building Confidence & Personal Mastery',
      phase: 'Phase 1: Personal Discovery',
      duration: '6 Lessons · 3 Hours',
      description: 'Overcome self-doubt, build resilience and develop the discipline and growth mindset that every successful leader needs.',
      lessons: [
        { title: 'Lesson 1: The Science of Confidence', desc: 'Why confidence is a skill you practice, not an inherent trait.' },
        { title: 'Lesson 2: The Growth Mindset', desc: 'Reframing failure as feedback and challenges as learning opportunities.' },
        { title: 'Lesson 3: Daily Habits of High Performers', desc: 'Designing routines that foster focus, discipline, and emotional well-being.' },
        { title: 'Lesson 4: Managing Pressure & Stress', desc: 'Techniques for staying grounded during exams, interviews, and major decisions.' },
        { title: 'Lesson 5: Emotional Intelligence in Action', desc: 'Understanding your emotions and navigating interpersonal dynamics with grace.' },
        { title: 'Lesson 6: Your Personal Mastery Plan', desc: 'Setting up accountability systems to sustain momentum.' }
      ]
    },
    'c3': {
      title: 'Purpose vs Career',
      phase: 'Phase 2: Purpose & Direction',
      duration: '4 Lessons · 2 Hours',
      description: 'Understand the difference between purpose, passion and career. Learn why purpose is about direction, not just a job title.',
      lessons: [
        { title: 'Lesson 1: What is Purpose?', desc: 'Deconstructing common myths about finding your one true calling.' },
        { title: 'Lesson 2: Purpose vs Career Title', desc: 'How multiple career paths can serve the exact same underlying purpose.' },
        { title: 'Lesson 3: The Intersection of Needs & Abilities', desc: 'Connecting what the world needs with what you enjoy doing.' },
        { title: 'Lesson 4: Defining Your Compass', desc: 'Writing an evolving purpose statement to guide your academic and career choices.' }
      ]
    },
    'c4': {
      title: 'Vision & Goal Setting',
      phase: 'Phase 2: Purpose & Direction',
      duration: '5 Lessons · 2.5 Hours',
      description: 'Create a compelling vision for your future and break it down into actionable goals with clear timelines and milestones.',
      lessons: [
        { title: 'Lesson 1: The Power of Long-Term Vision', desc: 'Why thinking 10 years ahead changes decisions you make today.' },
        { title: 'Lesson 2: The SMART Goal Framework', desc: 'Structuring goals so they are specific, measurable, achievable, relevant, and time-bound.' },
        { title: 'Lesson 3: Reverse Engineering Success', desc: 'Working backwards from your big goal to weekly actionable steps.' },
        { title: 'Lesson 4: Overcoming Obstacles & Friction', desc: 'Planning ahead for inevitable setbacks and distraction.' },
        { title: 'Lesson 5: Quarterly Review System', desc: 'How to audit your progress and recalibrate without losing motivation.' }
      ]
    },
    'c5': {
      title: 'Critical Thinking & Decision Making',
      phase: 'Phase 2: Purpose & Direction',
      duration: '4 Lessons · 2 Hours',
      description: 'Learn to analyse information, evaluate options and make decisions that align with your values and long-term goals.',
      lessons: [
        { title: 'Lesson 1: Mental Models for Decision Making', desc: 'First-principles thinking, second-order consequences, and decision trees.' },
        { title: 'Lesson 2: Identifying Biases & Blindspots', desc: 'Recognising cognitive biases that cloud judgment in career and personal choices.' },
        { title: 'Lesson 3: Evaluating Opportunities', desc: 'How to compare scholarships, career paths, and educational options objectively.' },
        { title: 'Lesson 4: Making Decisions Under Uncertainty', desc: 'Taking calculated risks when you do not have 100% of the information.' }
      ]
    },
    'c6': {
      title: 'Communication & Influence',
      phase: 'Phase 3: Future Readiness',
      duration: '6 Lessons · 3 Hours',
      description: 'Master the art of clear communication, public speaking, active listening and building meaningful professional relationships.',
      lessons: [
        { title: 'Lesson 1: The Structure of Clear Communication', desc: 'How to articulate complex thoughts simply and persuasively.' },
        { title: 'Lesson 2: Mastering Public Speaking', desc: 'Overcoming stage fright, structuring presentations, and engaging your audience.' },
        { title: 'Lesson 3: Active Listening & Empathy', desc: 'Listening to understand rather than simply waiting for your turn to speak.' },
        { title: 'Lesson 4: Professional Email & Written Ethics', desc: 'Crafting polite, concise, and compelling written messages.' },
        { title: 'Lesson 5: Storytelling for Impact', desc: 'Using narrative to share your personal journey, ideas, and projects.' },
        { title: 'Lesson 6: Group Dynamics & Collaboration', desc: 'Leading discussions and contributing constructively in team environments.' }
      ]
    },
    'c7': {
      title: 'Employability & Professional Skills',
      phase: 'Phase 3: Future Readiness',
      duration: '7 Lessons · 3.5 Hours',
      description: 'Build your CV, prepare for interviews, develop your digital presence and understand what modern employers look for.',
      lessons: [
        { title: 'Lesson 1: Modern CV & Resume Building', desc: 'Crafting a high-impact CV tailored to student experience and achievements.' },
        { title: 'Lesson 2: Interview Mastery', desc: 'Answering behavioral questions using the STAR framework (Situation, Task, Action, Result).' },
        { title: 'Lesson 3: LinkedIn & Digital Professional Footprint', desc: 'Optimising your online profile to attract opportunities and network safely.' },
        { title: 'Lesson 4: Workplace Etiquette & Professionalism', desc: 'Punctuality, accountability, initiative, and workplace culture.' },
        { title: 'Lesson 5: Financial Literacy for Young Professionals', desc: 'Budgeting, saving, and understanding basic income & money management.' },
        { title: 'Lesson 6: Job Search Strategies', desc: 'Where to find hidden job markets, internships, and entry-level positions.' },
        { title: 'Lesson 7: Mock Interview Practice', desc: 'Interactive self-guided practice scenarios to sharpen your responses.' }
      ]
    },
    'c8': {
      title: 'Technology & AI for the Future',
      phase: 'Phase 3: Future Readiness',
      duration: '5 Lessons · 2.5 Hours',
      description: 'Understand AI, digital tools, online safety and the changing nature of work. Learn to use technology critically and responsibly.',
      lessons: [
        { title: 'Lesson 1: The AI Revolution & Future of Work', desc: 'How artificial intelligence is transforming industries and creating new careers.' },
        { title: 'Lesson 2: Prompt Engineering & AI Study Assistants', desc: 'Using tools like ChatGPT, Claude, and Gemini safely for research and learning.' },
        { title: 'Lesson 3: Digital Productivity Tools', desc: 'Mastering cloud collaboration, project management, and note-taking apps.' },
        { title: 'Lesson 4: Cybersecurity & Cyber Safety', desc: 'Protecting your personal data, identity, and security online.' },
        { title: 'Lesson 5: Critical AI Literacy', desc: 'Understanding hallucination, bias, ethics, and why human critical thinking matters most.' }
      ]
    },
    'c9': {
      title: 'Career Exploration',
      phase: 'Phase 4: Exposure & Mentorship',
      duration: '5 Lessons · 2.5 Hours',
      description: 'Discover different career paths, understand what they involve daily, and learn how to research careers aligned with your purpose.',
      lessons: [
        { title: 'Lesson 1: Mapping the Modern Career Landscape', desc: 'Traditional paths vs emerging 21st-century multidisciplinary careers.' },
        { title: 'Lesson 2: Conducting Informational Interviews', desc: 'How to reach out to professionals and ask insightful career questions.' },
        { title: 'Lesson 3: Analyzing Subject Requirements', desc: 'Aligning high school subject choices with university and vocational prerequisites.' },
        { title: 'Lesson 4: Day-in-the-Life Case Studies', desc: 'Real breakdowns of daily routines in tech, healthcare, engineering, business, and law.' },
        { title: 'Lesson 5: Building a Flexible Career Roadmap', desc: 'Planning for multiple career scenarios in a rapidly changing world.' }
      ]
    },
    'c10': {
      title: 'Finding Opportunities',
      phase: 'Phase 4: Exposure & Mentorship',
      duration: '4 Lessons · 2 Hours',
      description: 'Learn where and how to find scholarships, internships, competitions, fellowships and other life-changing opportunities.',
      lessons: [
        { title: 'Lesson 1: Opportunity Scouting Strategies', desc: 'Where top scholarships, fellowships, and grants post open applications.' },
        { title: 'Lesson 2: Winning Scholarship Applications', desc: 'Writing compelling personal statements and essays that stand out.' },
        { title: 'Lesson 3: Securing Strong Recommendation Letters', desc: 'How to request letters of recommendation from teachers and mentors.' },
        { title: 'Lesson 4: Tracking Applications & Deadlines', desc: 'Organising application requirements, essays, and submission calendars.' }
      ]
    },
    'c11': {
      title: 'Mentorship & Networking',
      phase: 'Phase 4: Exposure & Mentorship',
      duration: '4 Lessons · 2 Hours',
      description: 'Understand how to find, approach and learn from mentors. Build a professional network even while you are still a student.',
      lessons: [
        { title: 'Lesson 1: What Mentorship Really Means', desc: 'The role of mentors, sponsors, and peer advisors in your development.' },
        { title: 'Lesson 2: How to Approach a Mentor Respectfully', desc: 'Crafting thoughtful outreach messages that show initiative and respect for time.' },
        { title: 'Lesson 3: Getting the Most from Mentor Sessions', desc: 'Preparing questions, setting agendas, and following up on advice.' },
        { title: 'Lesson 4: Building Long-Term Relationships', desc: 'Maintaining authentic connections over months and years.' }
      ]
    },
    'c12': {
      title: 'Leadership & Community Impact',
      phase: 'Phase 5: Leadership & Impact',
      duration: '5 Lessons · 2.5 Hours',
      description: 'Step into leadership. Learn to create community initiatives, mobilise others, serve your community and build a legacy of impact.',
      lessons: [
        { title: 'Lesson 1: Servant Leadership Principles', desc: 'Why true leadership starts with empathy, listening, and serving others.' },
        { title: 'Lesson 2: Identifying Community Needs', desc: 'Conducting basic community needs assessments to solve real local challenges.' },
        { title: 'Lesson 3: Project Design & Resource Mobilisation', desc: 'Turning an idea into a structured community project with zero or low budget.' },
        { title: 'Lesson 4: Mobilising Peers & Building Teams', desc: 'Inspiring classmates and community members to join your cause.' },
        { title: 'Lesson 5: Measuring & Storytelling Impact', desc: 'Documenting the results of your initiative and sharing your story with the world.' }
      ]
    }
  };

  // Create modal markup container if not present
  let modalOverlay = document.getElementById('course-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'course-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-course-title">
        <div class="modal-header">
          <div>
            <span class="modal-subtitle" id="modal-course-phase">Phase</span>
            <h3 class="modal-title" id="modal-course-title">Course Title</h3>
          </div>
          <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body" id="modal-course-body">
          <!-- Syllabus content dynamically injected here -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm modal-close-btn">Close</button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-start-lesson">Start Lesson 1 →</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const closeBtns = modalOverlay.querySelectorAll('.modal-close, .modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Attach click listener to course cards
  document.querySelectorAll('[data-course-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.dataset.courseId;
      const data = courseData[courseId] || {
        title: btn.closest('.course-card')?.querySelector('h3')?.textContent || 'Pathways Course',
        phase: 'Pathways Academy',
        duration: 'Self-paced',
        description: 'Comprehensive learning module designed to help you grow intentionally.',
        lessons: [
          { title: 'Lesson 1: Core Concepts', desc: 'Understanding the key principles and foundation of this subject.' },
          { title: 'Lesson 2: Practical Application', desc: 'Applying knowledge to real-world challenges.' },
          { title: 'Lesson 3: Reflection & Growth', desc: 'Evaluating progress and integrating learnings into your daily life.' }
        ]
      };

      document.getElementById('modal-course-phase').textContent = data.phase + ' • ' + data.duration;
      document.getElementById('modal-course-title').textContent = data.title;

      const bodyEl = document.getElementById('modal-course-body');
      bodyEl.innerHTML = `
        <p style="font-size: var(--text-base); color: var(--color-text-secondary); margin-bottom: var(--space-6); line-height: var(--leading-relaxed);">${data.description}</p>
        <h4 style="font-family: var(--font-display); color: var(--color-navy); font-size: var(--text-lg); margin-bottom: var(--space-4);">Course Syllabus (${data.lessons.length} Lessons)</h4>
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          ${data.lessons.map((l, i) => `
            <div style="background: var(--color-surface-alt); padding: var(--space-4); border-radius: var(--radius-lg); border-left: 4px solid var(--color-blue);">
              <h5 style="font-size: var(--text-base); color: var(--color-navy); margin-bottom: 4px;">${l.title}</h5>
              <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0;">${l.desc}</p>
            </div>
          `).join('')}
        </div>
      `;

      document.getElementById('btn-start-lesson').onclick = function() {
        alert(`Starting "${data.title}" - Lesson 1!\n\nTake out your notebook or open your journey profile to write your reflections as you proceed.`);
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* =============================================================================
   COMMUNITY JOIN ORIENTATION MODAL (community.html)
   ============================================================================= */
function initCommunityModal() {
  let communityModal = document.getElementById('community-modal-overlay');
  if (!communityModal) {
    communityModal = document.createElement('div');
    communityModal.id = 'community-modal-overlay';
    communityModal.className = 'modal-overlay';
    communityModal.innerHTML = `
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-comm-title">
        <div class="modal-header">
          <div>
            <span class="modal-subtitle">Pathways to Purpose</span>
            <h3 class="modal-title" id="modal-comm-title">Join The Pathfinders Community</h3>
          </div>
          <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: var(--text-base); color: var(--color-text-secondary); margin-bottom: var(--space-4);">
            The Pathfinders is a moderated WhatsApp & online learning community for high school and university students across Zimbabwe committed to personal growth, peer mentorship, and future readiness.
          </p>
          <div style="background: var(--color-surface-alt); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-4);">
            <strong style="color: var(--color-navy); display: block; margin-bottom: var(--space-2);">🛡️ Community Guidelines & Safeguarding:</strong>
            <ul style="padding-left: var(--space-4); font-size: var(--text-sm); color: var(--color-text-secondary);">
              <li>Respectful, supportive interaction only — zero tolerance for bullying or harassment.</li>
              <li>Group conversations are moderated by the Pathways to Purpose team.</li>
              <li>Never share private personal information or password credentials.</li>
              <li>Mentors participate only in official, scheduled group sessions.</li>
            </ul>
          </div>
          <p style="font-size: var(--text-sm); color: var(--color-text-muted);">
            By clicking below, you agree to uphold the Pathfinders community guidelines.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm comm-close-btn">Cancel</button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-confirm-join">I Agree — Access Community</button>
        </div>
      </div>
    `;
    document.body.appendChild(communityModal);
  }

  const closeBtns = communityModal.querySelectorAll('.modal-close, .comm-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      communityModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.btn-join-community, a[href="community.html#join"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('btn-join-community') || btn.getAttribute('href') === '#') {
        e.preventDefault();
        communityModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.getElementById('btn-confirm-join')?.addEventListener('click', () => {
    alert('Welcome to The Pathfinders!\n\nIn production, you will be redirected to the moderated WhatsApp Community onboarding link. Keep learning and growing!');
    communityModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

