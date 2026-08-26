/**
 * Portfolio Admin Panel - Application & CRUD Controller with Supabase Auth
 */

let currentView = 'dashboard';
let cachedPortfolioData = {};
let cachedMessages = [];
let currentAdminUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupTheme();
  setupNavigation();
  setupProjectsController();
  setupServicesController();
  setupTestimonialsController();
  setupInquiriesController();
  setupProfileController();
  setupApiController();
  setupModalDismissers();
  setupAuthHandlers();
  
  await checkAuthSession();
});

/**
 * 0. Supabase Authentication Handlers
 */
const DEFAULT_SUPABASE_URL = "https://mwkeupvqjfblnmcjncdc.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_qaGZUN5VWvoQ7R3Mtht0IA_z4YyKmZj";

function getSupabaseAuthClient() {
  if (typeof portfolioAPI !== 'undefined') {
    if (portfolioAPI.supabase && portfolioAPI.supabase.auth) {
      return portfolioAPI.supabase;
    }
    if (typeof portfolioAPI.initSupabase === 'function') {
      const client = portfolioAPI.initSupabase();
      if (client && client.auth) return client;
    }
    if (typeof portfolioAPI.getSupabase === 'function') {
      const client = portfolioAPI.getSupabase();
      if (client && client.auth) return client;
    }
  }

  // Get credentials from config or storage or default
  let url = (typeof portfolioConfig !== 'undefined' && portfolioConfig.supabase ? portfolioConfig.supabase.url : '') || localStorage.getItem('portfolio_supabase_url') || DEFAULT_SUPABASE_URL;
  let key = (typeof portfolioConfig !== 'undefined' && portfolioConfig.supabase ? portfolioConfig.supabase.anonKey : '') || localStorage.getItem('portfolio_supabase_key') || DEFAULT_SUPABASE_KEY;

  if (url.includes('mwkeupwqjfblnmcjncdc')) {
    url = DEFAULT_SUPABASE_URL;
  }

  const createClientFn = (typeof window.supabase !== 'undefined' && window.supabase.createClient) 
    ? window.supabase.createClient 
    : (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function')
      ? supabase.createClient
      : (typeof window.supabaseJs !== 'undefined' && window.supabaseJs.createClient)
        ? window.supabaseJs.createClient
        : null;

  if (createClientFn && url && key) {
    try {
      const client = createClientFn(url, key);
      if (typeof portfolioAPI !== 'undefined') {
        portfolioAPI.supabase = client;
      }
      return client;
    } catch (e) {
      console.warn('Error creating Supabase client:', e);
    }
  }
  return null;
}

async function checkAuthSession() {
  const loginOverlay = document.getElementById('admin-login-screen');
  const userEmailElem = document.getElementById('admin-user-email');
  const logoutBtn = document.getElementById('btn-admin-logout');

  const supabase = getSupabaseAuthClient();
  if (supabase && supabase.auth) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentAdminUser = session.user;
        if (loginOverlay) loginOverlay.classList.remove('active');
        if (userEmailElem) {
          userEmailElem.textContent = session.user.email;
          userEmailElem.style.display = 'inline-block';
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';

        await loadAdminData();
        return;
      }
    } catch (err) {
      console.warn('Session check warning:', err);
    }
  }

  // If no active Supabase session, show login screen
  if (loginOverlay) loginOverlay.classList.add('active');
  if (userEmailElem) userEmailElem.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';
}

function setupAuthHandlers() {
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error-alert');
  const loginBtn = document.getElementById('btn-login-submit');
  const loginBtnText = document.getElementById('login-btn-text');
  const logoutBtn = document.getElementById('btn-admin-logout');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        if (loginError) {
          loginError.textContent = 'Please enter both email and password.';
          loginError.style.display = 'block';
        }
        return;
      }

      if (loginBtn) loginBtn.disabled = true;
      if (loginBtnText) loginBtnText.textContent = 'Authenticating...';
      if (loginError) loginError.style.display = 'none';

      try {
        const supabase = getSupabaseAuthClient();
        if (!supabase || !supabase.auth) {
          throw new Error('Supabase client is not available. Please verify your Supabase configuration in js/config.js.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          throw error;
        }

        if (data && data.user) {
          currentAdminUser = data.user;
          const loginOverlay = document.getElementById('admin-login-screen');
          if (loginOverlay) loginOverlay.classList.remove('active');

          const userEmailElem = document.getElementById('admin-user-email');
          if (userEmailElem) {
            userEmailElem.textContent = data.user.email;
            userEmailElem.style.display = 'inline-block';
          }
          if (logoutBtn) logoutBtn.style.display = 'inline-flex';

          showAdminToast(`Authenticated as ${data.user.email}`);
          await loadAdminData();
        }
      } catch (err) {
        console.error('Login error:', err);
        if (loginError) {
          loginError.textContent = err.message || 'Invalid login credentials. Please try again.';
          loginError.style.display = 'block';
        }
      } finally {
        if (loginBtn) loginBtn.disabled = false;
        if (loginBtnText) loginBtnText.textContent = 'Authenticate & Sign In';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to sign out from Admin Studio?')) {
        try {
          const supabase = getSupabaseAuthClient();
          if (supabase && supabase.auth) {
            await supabase.auth.signOut();
          }
        } catch (e) {
          console.warn('Sign out error:', e);
        }
        currentAdminUser = null;
        const loginOverlay = document.getElementById('admin-login-screen');
        const userEmailElem = document.getElementById('admin-user-email');
        if (loginOverlay) loginOverlay.classList.add('active');
        if (userEmailElem) userEmailElem.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        showAdminToast('Signed out successfully');
      }
    });
  }
}

/**
 * 1. Data Loader & Dashboard Stats
 */
async function loadAdminData() {
  try {
    cachedPortfolioData = await portfolioAPI.getPortfolioData();
    cachedMessages = await portfolioAPI.getMessages();
    renderDashboardStats();
    updateUnreadBadge();
    updateApiStatusBadge();
  } catch (err) {
    console.error('Error loading admin data:', err);
    showAdminToast('Failed to load portfolio data', 'error');
  }
}

function renderDashboardStats() {
  const projectsCount = (cachedPortfolioData.projects || []).length;
  const servicesCount = (cachedPortfolioData.services || []).length;
  const testimonialsCount = (cachedPortfolioData.testimonials || []).length;
  const inquiriesCount = cachedMessages.length;

  const statProj = document.getElementById('stat-total-projects');
  const statServ = document.getElementById('stat-total-services');
  const statTest = document.getElementById('stat-total-testimonials');
  const statInq = document.getElementById('stat-total-inquiries');

  if (statProj) statProj.textContent = projectsCount;
  if (statServ) statServ.textContent = servicesCount;
  if (statTest) statTest.textContent = testimonialsCount;
  if (statInq) statInq.textContent = inquiriesCount;

  // Render recent inquiries in dashboard
  const recentTable = document.getElementById('dashboard-recent-inquiries');
  if (recentTable) {
    const recent = cachedMessages.slice(0, 5);
    if (recent.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No inquiries received yet.</td></tr>`;
      return;
    }
    recentTable.innerHTML = recent.map(msg => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-heading);">${escapeHtml(msg.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(msg.email)}</div>
        </td>
        <td>${escapeHtml(msg.subject)}</td>
        <td><span class="font-mono text-xs">${formatDate(msg.date)}</span></td>
        <td>
          <span class="badge ${msg.read ? '' : 'badge-unread'}">${msg.read ? 'Read' : 'New'}</span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm view-inquiry-btn" data-id="${msg.id}">View</button>
        </td>
      </tr>
    `).join('');

    recentTable.querySelectorAll('.view-inquiry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openInquiryViewer(id);
      });
    });
  }
}

function updateUnreadBadge() {
  const unreadCount = cachedMessages.filter(m => !m.read).length;
  const badge = document.getElementById('sidebar-unread-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function updateApiStatusBadge() {
  const badge = document.getElementById('api-status-badge');
  if (!badge) return;

  if (portfolioAPI.isCloudConnected()) {
    badge.textContent = '🟢 Supabase Cloud Live';
    badge.style.color = '#10b981';
    badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    badge.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
  } else if (portfolioAPI.config.USE_LIVE_API) {
    badge.textContent = 'REST API Connected';
    badge.style.color = '#60a5fa';
    badge.style.borderColor = 'rgba(96, 165, 250, 0.4)';
    badge.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
  } else {
    badge.textContent = 'LocalStorage Mode';
    badge.style.color = 'var(--primary)';
    badge.style.borderColor = 'var(--primary-border)';
    badge.style.backgroundColor = 'var(--primary-light)';
  }
}

/**
 * 2. Navigation & View Switching
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const pageTitle = document.getElementById('page-title');
  const sidebar = document.getElementById('admin-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const viewAllInquiriesBtn = document.getElementById('btn-view-all-inquiries');

  const titles = {
    'dashboard': 'Dashboard Overview',
    'projects': 'Manage Projects',
    'services': 'Manage Services',
    'testimonials': 'Manage Testimonials',
    'inquiries': 'Contact Inquiries',
    'profile': 'Profile & Bio Settings',
    'api-settings': 'API & Backend Integration'
  };

  function switchView(viewName) {
    currentView = viewName;
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.admin-view').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${viewName}`);
    if (activeView) activeView.classList.add('active');

    if (pageTitle && titles[viewName]) {
      pageTitle.textContent = titles[viewName];
    }

    if (sidebar) sidebar.classList.remove('open');

    // Trigger view-specific renderers
    if (viewName === 'dashboard') renderDashboardStats();
    if (viewName === 'projects') renderProjectsTable();
    if (viewName === 'services') renderServicesTable();
    if (viewName === 'testimonials') renderTestimonialsTable();
    if (viewName === 'inquiries') renderInquiriesTable();
    if (viewName === 'profile') populateProfileForm();
    if (viewName === 'api-settings') populateApiSettingsForm();
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      switchView(view);
    });
  });

  if (viewAllInquiriesBtn) {
    viewAllInquiriesBtn.addEventListener('click', () => switchView('inquiries'));
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/**
 * 3. Projects Controller (CRUD)
 */
function setupProjectsController() {
  const addBtn = document.getElementById('btn-add-project');
  const searchInput = document.getElementById('project-search-input');
  const filterBtns = document.querySelectorAll('.filter-proj-btn');
  const projectForm = document.getElementById('project-editor-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openProjectEditor();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderProjectsTable();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjectsTable();
    });
  });

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('proj-id').value;
      const title = document.getElementById('proj-title').value.trim();
      const type = document.getElementById('proj-type').value;
      const subtitle = document.getElementById('proj-subtitle').value.trim();
      const shortDescription = document.getElementById('proj-short-desc').value.trim();
      const fullDescription = document.getElementById('proj-full-desc').value.trim();
      const tagsInput = document.getElementById('proj-tags').value.trim();
      const liveUrl = document.getElementById('proj-live-url').value.trim();
      const githubUrl = document.getElementById('proj-github-url').value.trim();

      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      const projectData = {
        title,
        type,
        subtitle,
        shortDescription,
        fullDescription,
        tags,
        liveUrl,
        githubUrl
      };

      if (id) {
        await portfolioAPI.updateProject(id, projectData);
        showAdminToast('Project updated successfully!');
      } else {
        await portfolioAPI.addProject(projectData);
        showAdminToast('New project added successfully!');
      }

      closeAllModals();
      await loadAdminData();
      renderProjectsTable();
    });
  }
}

function renderProjectsTable() {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  const searchQuery = (document.getElementById('project-search-input')?.value || '').toLowerCase();
  const activeFilterBtn = document.querySelector('.filter-proj-btn.active');
  const filterType = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

  let projects = cachedPortfolioData.projects || [];

  if (filterType !== 'all') {
    projects = projects.filter(p => p.type === filterType);
  }

  if (searchQuery) {
    projects = projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery) ||
      (p.subtitle || '').toLowerCase().includes(searchQuery) ||
      (p.tags || []).some(t => t.toLowerCase().includes(searchQuery))
    );
  }

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No projects found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>
        <div style="font-weight: 600; color: var(--text-heading); font-size: 0.9375rem;">${escapeHtml(p.title)}</div>
        <div style="font-size: 0.8125rem; color: var(--text-muted);">${escapeHtml(p.subtitle || '')}</div>
      </td>
      <td>
        <span class="badge ${p.type === 'client' ? 'badge-client' : 'badge-personal'}">${p.type === 'client' ? 'Client' : 'Personal'}</span>
      </td>
      <td>
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; max-width: 260px;">
          ${(p.tags || []).map(t => `<span class="badge font-mono text-xs">${escapeHtml(t)}</span>`).join('')}
        </div>
      </td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="btn btn-outline btn-icon" title="Live Preview"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></a>` : ''}
          ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="btn btn-outline btn-icon" title="GitHub Code"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg></a>` : ''}
        </div>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-outline btn-sm edit-proj-btn" data-id="${p.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-proj-btn" data-id="${p.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-proj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const project = (cachedPortfolioData.projects || []).find(p => p.id === id);
      if (project) openProjectEditor(project);
    });
  });

  tbody.querySelectorAll('.delete-proj-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this project?')) {
        await portfolioAPI.deleteProject(id);
        showAdminToast('Project deleted', 'success');
        await loadAdminData();
        renderProjectsTable();
      }
    });
  });
}

function openProjectEditor(project = null) {
  const modal = document.getElementById('project-form-modal');
  const heading = document.getElementById('project-modal-heading');
  const idInput = document.getElementById('proj-id');
  const titleInput = document.getElementById('proj-title');
  const typeInput = document.getElementById('proj-type');
  const subtitleInput = document.getElementById('proj-subtitle');
  const shortDescInput = document.getElementById('proj-short-desc');
  const fullDescInput = document.getElementById('proj-full-desc');
  const tagsInput = document.getElementById('proj-tags');
  const liveUrlInput = document.getElementById('proj-live-url');
  const githubUrlInput = document.getElementById('proj-github-url');

  if (project) {
    heading.textContent = 'Edit Project';
    idInput.value = project.id;
    titleInput.value = project.title || '';
    typeInput.value = project.type || 'client';
    subtitleInput.value = project.subtitle || '';
    shortDescInput.value = project.shortDescription || '';
    fullDescInput.value = project.fullDescription || '';
    tagsInput.value = (project.tags || []).join(', ');
    liveUrlInput.value = project.liveUrl || '';
    githubUrlInput.value = project.githubUrl || '';
  } else {
    heading.textContent = 'Add New Project';
    idInput.value = '';
    titleInput.value = '';
    typeInput.value = 'client';
    subtitleInput.value = '';
    shortDescInput.value = '';
    fullDescInput.value = '';
    tagsInput.value = '';
    liveUrlInput.value = '';
    githubUrlInput.value = '';
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 4. Services Controller (CRUD)
 */
function setupServicesController() {
  const addBtn = document.getElementById('btn-add-service');
  const serviceForm = document.getElementById('service-editor-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openServiceEditor();
    });
  }

  if (serviceForm) {
    serviceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const indexStr = document.getElementById('service-index').value;
      const title = document.getElementById('service-title').value.trim();
      const description = document.getElementById('service-desc').value.trim();
      const bulletsText = document.getElementById('service-bullets').value.trim();

      const bullets = bulletsText.split('\n').map(b => b.trim()).filter(Boolean);

      const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>`;

      const serviceData = {
        title,
        description,
        bullets,
        icon: defaultIcon
      };

      if (indexStr !== '') {
        await portfolioAPI.updateService(parseInt(indexStr, 10), serviceData);
        showAdminToast('Service updated successfully!');
      } else {
        await portfolioAPI.addService(serviceData);
        showAdminToast('Service added successfully!');
      }

      closeAllModals();
      await loadAdminData();
      renderServicesTable();
    });
  }
}

function renderServicesTable() {
  const tbody = document.getElementById('services-table-body');
  if (!tbody) return;

  const services = cachedPortfolioData.services || [];

  if (services.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No services created yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = services.map((s, idx) => `
    <tr>
      <td style="font-weight: 600; color: var(--text-heading);">${escapeHtml(s.title)}</td>
      <td style="max-width: 300px; font-size: 0.875rem; color: var(--text-muted);">${escapeHtml(s.description)}</td>
      <td>
        <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.8125rem; color: var(--text-muted);">
          ${(s.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-outline btn-sm edit-service-btn" data-index="${idx}">Edit</button>
          <button class="btn btn-danger btn-sm delete-service-btn" data-index="${idx}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const service = cachedPortfolioData.services[idx];
      if (service) openServiceEditor(service, idx);
    });
  });

  tbody.querySelectorAll('.delete-service-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (confirm('Are you sure you want to delete this service?')) {
        await portfolioAPI.deleteService(idx);
        showAdminToast('Service deleted');
        await loadAdminData();
        renderServicesTable();
      }
    });
  });
}

function openServiceEditor(service = null, index = '') {
  const modal = document.getElementById('service-form-modal');
  const heading = document.getElementById('service-modal-heading');
  const indexInput = document.getElementById('service-index');
  const titleInput = document.getElementById('service-title');
  const descInput = document.getElementById('service-desc');
  const bulletsInput = document.getElementById('service-bullets');

  if (service) {
    heading.textContent = 'Edit Service';
    indexInput.value = index;
    titleInput.value = service.title || '';
    descInput.value = service.description || '';
    bulletsInput.value = (service.bullets || []).join('\n');
  } else {
    heading.textContent = 'Add New Service';
    indexInput.value = '';
    titleInput.value = '';
    descInput.value = '';
    bulletsInput.value = '';
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 5. Testimonials Controller (CRUD)
 */
function setupTestimonialsController() {
  const addBtn = document.getElementById('btn-add-testimonial');
  const form = document.getElementById('testimonial-editor-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openTestimonialEditor();
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const indexStr = document.getElementById('testi-index').value;
      const name = document.getElementById('testi-name').value.trim();
      const role = document.getElementById('testi-role').value.trim();
      const quote = document.getElementById('testi-quote').value.trim();
      const fullQuote = document.getElementById('testi-full-quote').value.trim() || quote;

      const testiData = {
        name,
        role,
        quote,
        fullQuote,
        rating: 5
      };

      if (indexStr !== '') {
        await portfolioAPI.updateTestimonial(parseInt(indexStr, 10), testiData);
        showAdminToast('Testimonial updated successfully!');
      } else {
        await portfolioAPI.addTestimonial(testiData);
        showAdminToast('Testimonial added successfully!');
      }

      closeAllModals();
      await loadAdminData();
      renderTestimonialsTable();
    });
  }
}

function renderTestimonialsTable() {
  const tbody = document.getElementById('testimonials-table-body');
  if (!tbody) return;

  const testimonials = cachedPortfolioData.testimonials || [];

  if (testimonials.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No testimonials added yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = testimonials.map((t, idx) => `
    <tr>
      <td>
        <div style="font-weight: 600; color: var(--text-heading);">${escapeHtml(t.name)}</div>
        <div style="font-size: 0.8125rem; color: var(--text-muted);">${escapeHtml(t.role)}</div>
      </td>
      <td>
        <div style="color: var(--primary); display: flex; gap: 2px;">★★★★★</div>
      </td>
      <td style="max-width: 320px; font-size: 0.875rem; color: var(--text-muted);">
        "${escapeHtml(t.quote)}"
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-outline btn-sm edit-testi-btn" data-index="${idx}">Edit</button>
          <button class="btn btn-danger btn-sm delete-testi-btn" data-index="${idx}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-testi-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const t = cachedPortfolioData.testimonials[idx];
      if (t) openTestimonialEditor(t, idx);
    });
  });

  tbody.querySelectorAll('.delete-testi-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (confirm('Delete this testimonial?')) {
        await portfolioAPI.deleteTestimonial(idx);
        showAdminToast('Testimonial deleted');
        await loadAdminData();
        renderTestimonialsTable();
      }
    });
  });
}

function openTestimonialEditor(testimonial = null, index = '') {
  const modal = document.getElementById('testimonial-form-modal');
  const heading = document.getElementById('testimonial-modal-heading');
  const indexInput = document.getElementById('testi-index');
  const nameInput = document.getElementById('testi-name');
  const roleInput = document.getElementById('testi-role');
  const quoteInput = document.getElementById('testi-quote');
  const fullQuoteInput = document.getElementById('testi-full-quote');

  if (testimonial) {
    heading.textContent = 'Edit Testimonial';
    indexInput.value = index;
    nameInput.value = testimonial.name || '';
    roleInput.value = testimonial.role || '';
    quoteInput.value = testimonial.quote || '';
    fullQuoteInput.value = testimonial.fullQuote || testimonial.quote || '';
  } else {
    heading.textContent = 'Add Testimonial';
    indexInput.value = '';
    nameInput.value = '';
    roleInput.value = '';
    quoteInput.value = '';
    fullQuoteInput.value = '';
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 6. Inquiries / Inbox Controller
 */
function setupInquiriesController() {
  const refreshBtn = document.getElementById('btn-refresh-inquiries');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await loadAdminData();
      renderInquiriesTable();
      showAdminToast('Inbox refreshed');
    });
  }
}

function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-table-body');
  if (!tbody) return;

  if (cachedMessages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No messages in your inbox.</td></tr>`;
    return;
  }

  tbody.innerHTML = cachedMessages.map(msg => `
    <tr>
      <td style="font-weight: 600; color: var(--text-heading);">${escapeHtml(msg.name)}</td>
      <td><a href="mailto:${escapeHtml(msg.email)}" style="color: var(--primary);">${escapeHtml(msg.email)}</a></td>
      <td style="font-weight: 500;">${escapeHtml(msg.subject)}</td>
      <td><span class="font-mono text-xs">${formatDate(msg.date)}</span></td>
      <td>
        <span class="badge ${msg.read ? '' : 'badge-unread'}">${msg.read ? 'Read' : 'New'}</span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-outline btn-sm view-inquiry-btn" data-id="${msg.id}">View</button>
          <button class="btn btn-danger btn-sm delete-inquiry-btn" data-id="${msg.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.view-inquiry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openInquiryViewer(id);
    });
  });

  tbody.querySelectorAll('.delete-inquiry-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this inquiry?')) {
        await portfolioAPI.deleteMessage(id);
        showAdminToast('Message deleted');
        await loadAdminData();
        renderInquiriesTable();
      }
    });
  });
}

async function openInquiryViewer(messageId) {
  const msg = cachedMessages.find(m => m.id === messageId);
  if (!msg) return;

  // Mark as read
  if (!msg.read) {
    await portfolioAPI.markMessageRead(messageId);
    msg.read = true;
    updateUnreadBadge();
  }

  const modal = document.getElementById('inquiry-viewer-modal');
  const subjectElem = document.getElementById('view-inquiry-subject');
  const senderElem = document.getElementById('view-inquiry-sender');
  const emailElem = document.getElementById('view-inquiry-email');
  const dateElem = document.getElementById('view-inquiry-date');
  const bodyElem = document.getElementById('view-inquiry-body');
  const replyBtn = document.getElementById('view-inquiry-reply-btn');

  if (subjectElem) subjectElem.textContent = msg.subject;
  if (senderElem) senderElem.textContent = msg.name;
  if (emailElem) {
    emailElem.textContent = msg.email;
    emailElem.href = `mailto:${msg.email}`;
  }
  if (dateElem) dateElem.textContent = formatDate(msg.date);
  if (bodyElem) bodyElem.textContent = msg.message;
  if (replyBtn) {
    replyBtn.href = `mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + msg.subject)}`;
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 7. Profile & Bio Settings Controller
 */
function setupProfileController() {
  const form = document.getElementById('profile-settings-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('setting-name').value.trim();
    const roleBadge = document.getElementById('setting-role').value.trim();
    const subheadline = document.getElementById('setting-subheadline').value.trim();
    const email = document.getElementById('setting-email').value.trim();
    const phone = document.getElementById('setting-phone').value.trim();
    const githubUrl = document.getElementById('setting-github').value.trim();
    const linkedinUrl = document.getElementById('setting-linkedin').value.trim();
    const calendlyUrl = document.getElementById('setting-calendly').value.trim();
    const aboutParasText = document.getElementById('setting-about-paragraphs').value.trim();

    const paragraphs = aboutParasText.split('\n\n').map(p => p.trim()).filter(Boolean);

    const updatedPersonal = {
      name,
      headlineName: name,
      roleBadge,
      subheadline,
      email,
      phone,
      githubUrl,
      linkedinUrl,
      calendlyUrl,
      about: {
        tag: 'ABOUT ME',
        title: 'Building Scalable Solutions From Concept to Deployment',
        paragraphs
      }
    };

    await portfolioAPI.updatePersonal(updatedPersonal);
    showAdminToast('Profile settings saved successfully!');
    await loadAdminData();
  });
}

function populateProfileForm() {
  const p = cachedPortfolioData.personal || {};

  const nameInput = document.getElementById('setting-name');
  const roleInput = document.getElementById('setting-role');
  const subheadlineInput = document.getElementById('setting-subheadline');
  const emailInput = document.getElementById('setting-email');
  const phoneInput = document.getElementById('setting-phone');
  const githubInput = document.getElementById('setting-github');
  const linkedinInput = document.getElementById('setting-linkedin');
  const calendlyInput = document.getElementById('setting-calendly');
  const aboutParasInput = document.getElementById('setting-about-paragraphs');

  if (nameInput) nameInput.value = p.name || '';
  if (roleInput) roleInput.value = p.roleBadge || '';
  if (subheadlineInput) subheadlineInput.value = p.subheadline || '';
  if (emailInput) emailInput.value = p.email || '';
  if (phoneInput) phoneInput.value = p.phone || '';
  if (githubInput) githubInput.value = p.githubUrl || '';
  if (linkedinInput) linkedinInput.value = p.linkedinUrl || '';
  if (calendlyInput) calendlyInput.value = p.calendlyUrl || '';

  if (aboutParasInput && p.about && p.about.paragraphs) {
    aboutParasInput.value = p.about.paragraphs.join('\n\n');
  }
}

/**
 * 8. API & Cloud Database Controller
 */
function setupApiController() {
  // Supabase Cloud Form
  const supaForm = document.getElementById('supabase-config-form');
  const supaTestBtn = document.getElementById('btn-test-supabase');

  if (supaForm) {
    supaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = document.getElementById('supabase-project-url').value.trim();
      const key = document.getElementById('supabase-anon-key').value.trim();

      portfolioAPI.setSupabaseCredentials(url, key);
      updateSupabaseStatusBadge();
      showAdminToast('Supabase Cloud credentials saved! Reloading cloud data...');
      await loadAdminData();
      renderDashboard();
    });
  }

  if (supaTestBtn) {
    supaTestBtn.addEventListener('click', async () => {
      const url = document.getElementById('supabase-project-url').value.trim();
      const key = document.getElementById('supabase-anon-key').value.trim();

      if (!url || !key) {
        showAdminToast('Please enter both Supabase URL and Anon Key first', 'error');
        return;
      }

      supaTestBtn.disabled = true;
      supaTestBtn.textContent = 'Testing Cloud...';

      try {
        if (typeof window.supabase === 'undefined') {
          throw new Error('Supabase client library is loading...');
        }
        const testClient = window.supabase.createClient(url, key);
        const { data, error } = await testClient.from('personal_info').select('*').limit(1);

        supaTestBtn.disabled = false;
        supaTestBtn.textContent = 'Test Cloud Connection';

        if (!error) {
          showAdminToast('🎉 Cloud Database Connected Successfully! PostgreSQL is Live.');
          portfolioAPI.setSupabaseCredentials(url, key);
          updateSupabaseStatusBadge();
          await loadAdminData();
        } else {
          showAdminToast(`Supabase error: ${error.message}. Did you run supabase-schema.sql?`, 'error');
        }
      } catch (err) {
        supaTestBtn.disabled = false;
        supaTestBtn.textContent = 'Test Cloud Connection';
        showAdminToast(`Connection failed: ${err.message}`, 'error');
      }
    });
  }

  // REST API Form
  const form = document.getElementById('api-config-form');
  const testBtn = document.getElementById('btn-test-api');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modeSelect = document.getElementById('api-mode-select').value;
      const baseUrl = document.getElementById('api-base-url').value.trim();

      const config = {
        USE_LIVE_API: modeSelect === 'true',
        BASE_URL: baseUrl || 'http://localhost:5000/api'
      };

      portfolioAPI.saveConfig(config);
      showAdminToast('REST API configuration updated successfully!');
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      const baseUrl = document.getElementById('api-base-url').value.trim() || 'http://localhost:5000/api';
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';

      try {
        const res = await fetch(`${baseUrl}/portfolio`, { method: 'GET' });
        testBtn.disabled = false;
        testBtn.textContent = 'Test REST Connection';
        if (res.ok) {
          showAdminToast('REST API connection successful! (HTTP 200)');
        } else {
          showAdminToast(`API responded with status ${res.status}`, 'error');
        }
      } catch (err) {
        testBtn.disabled = false;
        testBtn.textContent = 'Test REST Connection';
        showAdminToast(`Could not reach API server at ${baseUrl}. Ensure your backend is running.`, 'error');
      }
    });
  }
}

function updateSupabaseStatusBadge() {
  const badge = document.getElementById('supabase-status-badge');
  if (!badge) return;

  if (portfolioAPI.isCloudConnected()) {
    badge.textContent = '🟢 Cloud PostgreSQL Live';
    badge.className = 'badge badge-client';
  } else {
    badge.textContent = '🟡 Offline / LocalStorage Mode';
    badge.className = 'badge';
  }
}

function populateApiSettingsForm() {
  // Populate Supabase
  const supaCreds = portfolioAPI.getSupabaseCredentials();
  const urlInput = document.getElementById('supabase-project-url');
  const keyInput = document.getElementById('supabase-anon-key');

  if (urlInput) urlInput.value = supaCreds.url || '';
  if (keyInput) keyInput.value = supaCreds.key || '';
  updateSupabaseStatusBadge();

  // Populate REST
  const modeSelect = document.getElementById('api-mode-select');
  const baseUrlInput = document.getElementById('api-base-url');

  if (modeSelect) modeSelect.value = portfolioAPI.config.USE_LIVE_API ? 'true' : 'false';
  if (baseUrlInput) baseUrlInput.value = portfolioAPI.config.BASE_URL || '';
}

/**
 * 9. Theme Controller
 */
function setupTheme() {
  const toggleBtn = document.getElementById('admin-theme-toggle');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showAdminToast(`Switched to ${nextTheme} mode`);
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
 * 10. Modal Dismissal Logic
 */
function setupModalDismissers() {
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/**
 * 11. Toast Helper
 */
function showAdminToast(message, type = 'success') {
  const container = document.getElementById('admin-toast-container');
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
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Helper Utilities
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return isoStr;
  }
}
