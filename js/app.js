/**
 * Minimalist Developer Portfolio - Multi-Page Application Logic & Router
 */

let activePortfolioData = typeof portfolioConfig !== 'undefined' ? portfolioConfig : {};

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof portfolioAPI !== 'undefined') {
    try {
      activePortfolioData = await portfolioAPI.getPortfolioData();
    } catch (e) {
      console.warn('Using local fallback data', e);
    }
  }
  initMultiPageApp();
});

function initMultiPageApp() {
  const currentPage = document.body.getAttribute('data-page') || 'home';
  
  // Universal initialization
  renderPersonalData();
  setupThemeToggle();
  setupMobileMenu();
  highlightActiveNavLink(currentPage);

  // Page-specific initialization
  switch (currentPage) {
    case 'home':
      setupIdeTabs();
      renderBentoGrid();
      renderServices();
      renderFeaturedProjects();
      renderTestimonials();
      setupModal();
      break;

    case 'about':
      renderBentoGrid();
      renderAboutSpecializations();
      break;

    case 'services':
      renderServices();
      renderWorkflow();
      break;

    case 'projects':
      renderProjects('all');
      setupProjectFilters();
      setupModal();
      break;

    case 'contact':
      setupContactForm();
      break;

    default:
      break;
  }
}

/**
 * Universal Navigation Link Highlighter
 */
function highlightActiveNavLink(page) {
  const links = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-drawer .nav-link');
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (
      (page === 'home' && (href === 'index.html' || href === '/' || href === './')) ||
      (page === 'about' && href.includes('about.html')) ||
      (page === 'services' && href.includes('services.html')) ||
      (page === 'projects' && href.includes('projects.html')) ||
      (page === 'contact' && href.includes('contact.html'))
    ) {
      link.classList.add('active');
    }
  });
}

/**
 * 1. Render Personal & Global Information
 */
function renderPersonalData() {
  if (!activePortfolioData || !activePortfolioData.personal) return;
  const p = activePortfolioData.personal;

  // Header & Brand
  const navAvatarText = document.getElementById('nav-avatar-text');
  const navName = document.getElementById('nav-name');
  if (navAvatarText) navAvatarText.textContent = p.avatarText || 'BF';
  if (navName) navName.textContent = p.name;

  // Hero Section (Home)
  const heroStatus = document.getElementById('hero-status-badge');
  const heroSubheadline = document.getElementById('hero-subheadline');
  const heroGithub = document.getElementById('hero-github-btn');
  const heroStatsStrip = document.getElementById('hero-stats-strip');

  if (heroStatus) heroStatus.textContent = p.statusBadge || p.roleBadge;
  if (heroSubheadline) heroSubheadline.textContent = p.subheadline;
  if (heroGithub && p.githubUrl) heroGithub.href = p.githubUrl;

  if (heroStatsStrip && p.heroStats) {
    heroStatsStrip.innerHTML = p.heroStats.map(st => `
      <div class="hero-stat-item">
        <h4>${st.value}</h4>
        <p>${st.label}</p>
      </div>
    `).join('');
  }

  // Contact Info (Contact Page & Footer)
  const contactEmail = document.getElementById('contact-email');
  const contactPhone = document.getElementById('contact-phone');
  const contactCalendly = document.getElementById('contact-calendly');
  const contactGithub = document.getElementById('contact-github');
  const contactLinkedin = document.getElementById('contact-linkedin');

  if (contactEmail) {
    contactEmail.href = `mailto:${p.email}`;
    contactEmail.textContent = p.email;
  }
  if (contactPhone) {
    contactPhone.href = `tel:${p.phone.replace(/\s+/g, '')}`;
    contactPhone.textContent = p.phone;
  }
  if (contactCalendly && p.calendlyUrl) contactCalendly.href = p.calendlyUrl;
  if (contactGithub && p.githubUrl) contactGithub.href = p.githubUrl;
  if (contactLinkedin && p.linkedinUrl) contactLinkedin.href = p.linkedinUrl;

  // Footer
  const footerYear = document.getElementById('footer-year');
  const footerName = document.getElementById('footer-name');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  if (footerName) footerName.textContent = p.name;
}

/**
 * 2. Floating macOS IDE Tab Switcher
 */
function setupIdeTabs() {
  const tabs = document.querySelectorAll('#ide-tabs .ide-tab');
  const codeElem = document.getElementById('ide-code-content');
  if (!codeElem) return;

  const defaultSnippets = (portfolioConfig && portfolioConfig.ideTabs) || {
    developer: `// developer.ts\nexport const engineer = { name: "Bilal Faisal", role: "Full Stack Engineer" };`,
    stack: `{\n  "frontend": ["Next.js", "TypeScript", "Tailwind CSS"],\n  "backend": ["Node.js", "Express", "PostgreSQL"]\n}`,
    terminal: `➜  ready for deployment.`
  };

  function displaySnippet(tabKey) {
    const snippet = defaultSnippets[tabKey] || '';
    codeElem.textContent = snippet;
  }

  displaySnippet('developer');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      displaySnippet(tabKey);
    });
  });
}

/**
 * 3. Render Bento Grid (About Section)
 */
function renderBentoGrid() {
  const p = activePortfolioData.personal;
  if (!p || !p.about) return;
  const about = p.about;

  const bioElem = document.getElementById('about-bio-text');
  const expElem = document.getElementById('bento-metric-exp');
  const epElem = document.getElementById('bento-metric-endpoints');
  const clientElem = document.getElementById('bento-metric-clients');
  const radarElem = document.getElementById('bento-radar-chips');
  const pillarsElem = document.getElementById('bento-pillars-list');
  const stackChipsElem = document.getElementById('bento-tech-stack-chips');

  if (bioElem) bioElem.textContent = about.bioText || '';
  if (expElem) expElem.textContent = about.experienceYears || '5+';
  if (epElem) epElem.textContent = about.endpointsDeployed || '150+';
  if (clientElem) clientElem.textContent = about.happyClients || '18+';

  if (radarElem && about.techRadarNow) {
    radarElem.innerHTML = about.techRadarNow.map(item => `
      <span class="tech-chip font-mono" style="border-color: rgba(6, 182, 212, 0.3); color: var(--cyan-light);">
        ⚡ ${item}
      </span>
    `).join('');
  }

  if (pillarsElem && about.corePillars) {
    pillarsElem.innerHTML = about.corePillars.map(pillar => `
      <div class="pillar-item">
        <div class="pillar-bullet"></div>
        <div>
          <h5>${pillar.title}</h5>
          <p>${pillar.desc}</p>
        </div>
      </div>
    `).join('');
  }

  if (stackChipsElem) {
    const allTools = [
      'Next.js 15', 'React', 'TypeScript', 'Node.js', 'Express', 'NestJS',
      'PostgreSQL', 'Prisma ORM', 'MongoDB', 'Redis', 'Docker', 'AWS',
      'Playwright', 'GraphQL', 'Tailwind CSS', 'WebSockets', 'CI/CD'
    ];
    stackChipsElem.innerHTML = allTools.map(tool => `
      <span class="tech-chip font-mono">
        ${tool}
      </span>
    `).join('');
  }
}

/**
 * 4. Render About Specializations
 */
function renderAboutSpecializations() {
  const container = document.getElementById('about-specializations-container');
  if (!container || !activePortfolioData.techStack) return;

  container.innerHTML = activePortfolioData.techStack.map(stack => `
    <div class="service-card">
      <div class="service-icon-box">
        ${stack.icon}
      </div>
      <h3 class="service-title">${stack.category}</h3>
      <p class="service-desc">${stack.description}</p>
    </div>
  `).join('');
}

/**
 * 5. Render Services
 */
function renderServices() {
  const container = document.getElementById('services-container');
  if (!container || !activePortfolioData.services) return;

  container.innerHTML = activePortfolioData.services.map(s => `
    <div class="service-card">
      <div class="service-icon-box">
        ${s.icon}
      </div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.description}</p>
      <ul class="service-bullets">
        ${(s.bullets || []).map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/**
 * 6. Render Workflow Roadmap
 */
function renderWorkflow() {
  const container = document.getElementById('process-container');
  if (!container || !activePortfolioData.process) return;

  container.innerHTML = activePortfolioData.process.map(step => `
    <div class="timeline-step">
      <div class="timeline-step-badge">${step.step}</div>
      <h3 class="timeline-title">${step.title}</h3>
      <p class="timeline-desc">${step.description}</p>
    </div>
  `).join('');
}

/**
 * 7. Render Projects (Full / Featured)
 */
function renderFeaturedProjects() {
  const container = document.getElementById('projects-container');
  if (!container || !activePortfolioData.projects) return;
  renderProjectCards(activePortfolioData.projects.slice(0, 2), container);
}

function renderProjects(filter = 'all') {
  const container = document.getElementById('projects-container');
  if (!container || !activePortfolioData.projects) return;

  const filtered = activePortfolioData.projects.filter(p => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">No projects found in this category.</p>`;
    return;
  }

  renderProjectCards(filtered, container);
}

function renderProjectCards(projectsList, container) {
  container.innerHTML = projectsList.map(p => `
    <div class="project-card" data-id="${p.id}">
      <div class="project-browser-bar">
        <div style="display: flex; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
        </div>
        <span class="badge ${p.type === 'client' ? 'badge-cyan' : ''}" style="text-transform: uppercase;">
          ${p.type === 'client' ? 'Client Platform' : 'Personal Project'}
        </span>
      </div>

      <div class="project-body">
        <div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-subtitle">${p.subtitle || ''}</p>
        </div>

        <p class="project-desc">${p.shortDescription || ''}</p>

        <button class="btn-link open-modal-btn" data-project-id="${p.id}">
          Read Case Study
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>

        <div class="project-tags">
          ${(p.tags || []).map(tag => `<span class="badge">${tag}</span>`).join('')}
        </div>
      </div>

      <div class="project-footer">
        <div style="display: flex; gap: 0.75rem;">
          ${p.liveUrl ? `
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              Live Demo
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
            </a>
          ` : ''}
          ${p.githubUrl ? `
            <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              Code
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project-id');
      openProjectModal(projId);
    });
  });
}

/**
 * 8. Setup Project Filter Tabs
 */
function setupProjectFilters() {
  const filterTabs = document.querySelectorAll('#project-filters .filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      renderProjects(filter);
    });
  });
}

/**
 * 9. Render Testimonials
 */
function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container || !activePortfolioData.testimonials) return;

  container.innerHTML = activePortfolioData.testimonials.map((t, idx) => `
    <div class="testimonial-card">
      <div class="stars">
        ${Array.from({ length: t.rating || 5 }).map(() => `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        `).join('')}
      </div>

      <p class="testimonial-quote" id="testi-text-${idx}">
        "${t.quote}"
      </p>

      ${t.fullQuote && t.fullQuote !== t.quote ? `
        <button class="btn-link toggle-testi-btn" data-index="${idx}" style="font-size: 0.8125rem;">Read full review</button>
      ` : ''}

      <div class="testimonial-author">
        <div class="author-name">${t.name}</div>
        <div class="author-role">${t.role}</div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.toggle-testi-btn').forEach(btn => {
    let expanded = false;
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const textElem = document.getElementById(`testi-text-${idx}`);
      const testi = activePortfolioData.testimonials[idx];
      expanded = !expanded;
      if (expanded) {
        textElem.textContent = `"${testi.fullQuote}"`;
        btn.textContent = 'Show less';
      } else {
        textElem.textContent = `"${testi.quote}"`;
        btn.textContent = 'Read full review';
      }
    });
  });
}

/**
 * 10. Project Details Modal
 */
function setupModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openProjectModal(projectId) {
  const project = (activePortfolioData.projects || []).find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');
  const modalTags = document.getElementById('modal-tags');
  const modalActions = document.getElementById('modal-actions');

  modalBadge.textContent = project.type === 'client' ? 'CLIENT CASE STUDY' : 'PERSONAL PROJECT';
  modalTitle.textContent = project.title;
  modalSubtitle.textContent = project.subtitle || '';
  modalDesc.textContent = project.fullDescription || project.shortDescription || '';

  modalTags.innerHTML = (project.tags || []).map(tag => `<span class="badge">${tag}</span>`).join('');

  modalActions.innerHTML = `
    ${project.liveUrl ? `
      <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Live Product
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
      </a>
    ` : ''}
    ${project.githubUrl ? `
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
        Source Code
      </a>
    ` : ''}
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * 11. Theme Toggle
 */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (theme === 'light') {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
    } else {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    }
  }
}

/**
 * 12. Mobile Menu Navigation
 */
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    drawer.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
}

/**
 * 13. Contact Form Handling
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `Sending...`;
    submitBtn.disabled = true;

    try {
      if (typeof portfolioAPI !== 'undefined') {
        await portfolioAPI.sendMessage({ name, email, subject, message });
      }
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      showToast('Thank you! Your message has been sent successfully.', 'success');
    } catch (err) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showToast('Failed to send message. Please try again.', 'error');
    }
  });
}

/**
 * 14. Toast Notification Helper
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success' ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      `}
    </div>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
