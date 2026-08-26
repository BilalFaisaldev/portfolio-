/**
 * Minimalist Developer Portfolio - Universal Cloud Database & API Service
 * Supports Supabase (Cloud PostgreSQL), Node.js Express REST API, and Offline LocalStorage Fallback.
 */

const API_CONFIG = {
  USE_LIVE_API: true,
  BASE_URL: 'http://localhost:5000/api',
  STORAGE_KEYS: {
    PORTFOLIO: 'portfolio_data_v1',
    MESSAGES: 'portfolio_messages_v1',
    SUPABASE_URL: 'portfolio_supabase_url',
    SUPABASE_KEY: 'portfolio_supabase_key'
  }
};

class PortfolioAPI {
  constructor() {
    this.config = this.loadConfig();
    this.supabase = null;
    this.initSupabase();
    this.initLocalStorage();
  }

  loadConfig() {
    const saved = localStorage.getItem('portfolio_api_config');
    if (saved) {
      try {
        return { ...API_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        return API_CONFIG;
      }
    }
    return API_CONFIG;
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('portfolio_api_config', JSON.stringify(this.config));
  }

  // Initialize Supabase Cloud Client
  initSupabase() {
    const FALLBACK_URL = "https://mwkeupvqjfblnmcjncdc.supabase.co";
    const FALLBACK_KEY = "sb_publishable_qaGZUN5VWvoQ7R3Mtht0IA_z4YyKmZj";

    try {
      let savedUrl = localStorage.getItem(this.config.STORAGE_KEYS.SUPABASE_URL);
      let savedKey = localStorage.getItem(this.config.STORAGE_KEYS.SUPABASE_KEY);

      // Clean up old typo if cached in browser
      if (savedUrl && savedUrl.includes('mwkeupwqjfblnmcjncdc')) {
        savedUrl = FALLBACK_URL;
        localStorage.setItem(this.config.STORAGE_KEYS.SUPABASE_URL, savedUrl);
      }

      const configUrl = typeof portfolioConfig !== 'undefined' && portfolioConfig.supabase ? portfolioConfig.supabase.url : '';
      const configKey = typeof portfolioConfig !== 'undefined' && portfolioConfig.supabase ? portfolioConfig.supabase.anonKey : '';

      const url = configUrl || savedUrl || FALLBACK_URL;
      const key = configKey || savedKey || FALLBACK_KEY;

      const createClientFn = (typeof window.supabase !== 'undefined' && window.supabase.createClient) 
        ? window.supabase.createClient 
        : (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function')
          ? supabase.createClient
          : (typeof window.supabaseJs !== 'undefined' && window.supabaseJs.createClient)
            ? window.supabaseJs.createClient
            : null;

      if (url && key && createClientFn) {
        this.supabase = createClientFn(url, key);
        console.log('✔ Connected to Supabase Cloud Database:', url);
      }
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
    }
    return this.supabase;
  }

  getSupabase() {
    if (!this.supabase) {
      this.initSupabase();
    }
    return this.supabase;
  }

  setSupabaseCredentials(url, key) {
    localStorage.setItem(this.config.STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(this.config.STORAGE_KEYS.SUPABASE_KEY, key.trim());
    this.initSupabase();
  }

  getSupabaseCredentials() {
    const savedUrl = localStorage.getItem(this.config.STORAGE_KEYS.SUPABASE_URL);
    const savedKey = localStorage.getItem(this.config.STORAGE_KEYS.SUPABASE_KEY);
    return {
      url: savedUrl || (portfolioConfig && portfolioConfig.supabase && portfolioConfig.supabase.url) || '',
      key: savedKey || (portfolioConfig && portfolioConfig.supabase && portfolioConfig.supabase.anonKey) || ''
    };
  }

  isCloudConnected() {
    return Boolean(this.supabase);
  }

  initLocalStorage() {
    if (!localStorage.getItem(this.config.STORAGE_KEYS.PORTFOLIO)) {
      if (typeof portfolioConfig !== 'undefined') {
        localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolioConfig));
      }
    }
    if (!localStorage.getItem(this.config.STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
  }

  // ==========================================
  // 1. Portfolio Aggregated Data
  // ==========================================
  async getPortfolioData() {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }
    // 1. Try Supabase Cloud first
    if (this.supabase) {
      try {
        const [personalRes, projectsRes, servicesRes, processRes, testimonialsRes] = await Promise.all([
          this.supabase.from('personal_info').select('*').eq('id', 1).single(),
          this.supabase.from('projects').select('*').order('created_at', { ascending: false }),
          this.supabase.from('services').select('*'),
          this.supabase.from('process_steps').select('*'),
          this.supabase.from('testimonials').select('*')
        ]);

        if (!personalRes.error && personalRes.data) {
          const row = personalRes.data;
          const personal = {
            name: row.name || "Bilal Faisal",
            roleBadge: row.role_badge || "Senior Full Stack & Cloud Engineer",
            headlineStart: row.headline_start || "Engineering",
            headlineGradient: row.headline_gradient || "Scalable Web Platforms",
            headlineEnd: row.headline_end || "& High-Performance Cloud Architectures.",
            subheadline: row.subheadline || "",
            avatarText: row.avatar_text || "BF",
            statusBadge: row.status_badge || "Available for Q2/Q3 Projects & Contracts",
            githubUrl: row.github_url || "",
            linkedinUrl: row.linkedin_url || "",
            email: row.email || "contact@bilalfaisal.dev",
            phone: row.phone || "+92 300 1234567",
            calendlyUrl: row.calendly_url || "https://calendly.com/",
            location: row.location || "Islamabad, PK (Remote Worldwide)",
            heroStats: Array.isArray(row.hero_stats) ? row.hero_stats : [],
            about: typeof row.about_data === 'object' ? row.about_data : {}
          };

          const projects = (projectsRes.data || []).map(p => ({
            id: p.id,
            type: p.type,
            title: p.title,
            subtitle: p.subtitle,
            shortDescription: p.short_description,
            fullDescription: p.full_description,
            tags: Array.isArray(p.tags) ? p.tags : [],
            liveUrl: p.live_url,
            githubUrl: p.github_url,
            featured: Boolean(p.featured)
          }));

          const services = (servicesRes.data || []).map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            bullets: Array.isArray(s.bullets) ? s.bullets : [],
            icon: s.icon
          }));

          const process = processRes.data || [];
          const testimonials = testimonialsRes.data || [];

          const cloudData = { personal, projects, services, process, testimonials };
          localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(cloudData));
          return cloudData;
        }
      } catch (err) {
        console.warn('Failed to fetch from Supabase Cloud:', err.message);
      }
    }

    // 2. Try Local REST API (Port 5000)
    if (this.config.USE_LIVE_API) {
      try {
        const res = await fetch(`${this.config.BASE_URL}/portfolio`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(json.data));
            return json.data;
          }
        }
      } catch (err) {
        // Continue to fallback
      }
    }

    // 3. Fallback to LocalStorage / Config
    const raw = localStorage.getItem(this.config.STORAGE_KEYS.PORTFOLIO);
    return raw ? JSON.parse(raw) : (typeof portfolioConfig !== 'undefined' ? portfolioConfig : {});
  }

  // ==========================================
  // 2. Update Personal Profile
  // ==========================================
  async updatePersonal(personalData) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    // 1. Supabase Cloud
    if (this.supabase) {
      const { error } = await this.supabase.from('personal_info').upsert({
        id: 1,
        name: personalData.name,
        role_badge: personalData.roleBadge,
        headline_start: personalData.headlineStart,
        headline_gradient: personalData.headlineGradient,
        headline_end: personalData.headlineEnd,
        subheadline: personalData.subheadline,
        avatar_text: personalData.avatarText,
        status_badge: personalData.statusBadge,
        github_url: personalData.githubUrl,
        linkedin_url: personalData.linkedinUrl,
        email: personalData.email,
        phone: personalData.phone,
        calendly_url: personalData.calendlyUrl,
        location: personalData.location,
        hero_stats: personalData.heroStats,
        about_data: personalData.about
      });

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return { success: true };
    }

    // 2. Local REST API
    try {
      const res = await fetch(`${this.config.BASE_URL}/portfolio/personal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // 3. LocalStorage
    const current = await this.getPortfolioData();
    current.personal = { ...current.personal, ...personalData };
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(current));
    return { success: true };
  }

  // ==========================================
  // 3. Projects CRUD
  // ==========================================
  async getProjects() {
    const data = await this.getPortfolioData();
    return data.projects || [];
  }

  async addProject(project) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }
    const id = project.id || project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    const newProj = { id, ...project };

    // 1. Supabase Cloud
    if (this.supabase) {
      const { data, error } = await this.supabase.from('projects').insert([{
        id,
        type: project.type || 'client',
        title: project.title,
        subtitle: project.subtitle || '',
        short_description: project.shortDescription || '',
        full_description: project.fullDescription || '',
        tags: project.tags || [],
        live_url: project.liveUrl || '',
        github_url: project.githubUrl || '',
        featured: project.featured !== undefined ? project.featured : true
      }]).select();

      if (error) {
        console.error('Supabase add project error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return newProj;
    }

    // 2. Local REST API
    try {
      const res = await fetch(`${this.config.BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || newProj;
      }
    } catch (e) {}

    // 3. LocalStorage
    const data = await this.getPortfolioData();
    data.projects = data.projects || [];
    data.projects.unshift(newProj);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return newProj;
  }

  async updateProject(id, updated) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    // 1. Supabase Cloud
    if (this.supabase) {
      const { error } = await this.supabase.from('projects').update({
        type: updated.type,
        title: updated.title,
        subtitle: updated.subtitle,
        short_description: updated.shortDescription,
        full_description: updated.fullDescription,
        tags: updated.tags,
        live_url: updated.liveUrl,
        github_url: updated.githubUrl,
        featured: updated.featured
      }).eq('id', id);

      if (error) {
        console.error('Supabase update project error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return { success: true };
    }

    // 2. Local REST API
    try {
      const res = await fetch(`${this.config.BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // 3. LocalStorage
    const data = await this.getPortfolioData();
    const idx = (data.projects || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      data.projects[idx] = { ...data.projects[idx], ...updated };
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  async deleteProject(id) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    // 1. Supabase Cloud
    if (this.supabase) {
      const { error } = await this.supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete project error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return { success: true };
    }

    // 2. Local REST API
    try {
      const res = await fetch(`${this.config.BASE_URL}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    // 3. LocalStorage
    const data = await this.getPortfolioData();
    data.projects = (data.projects || []).filter(p => p.id !== id);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return { success: true };
  }

  // ==========================================
  // 4. Services CRUD
  // ==========================================
  async getServices() {
    const data = await this.getPortfolioData();
    return data.services || [];
  }

  async addService(service) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    if (this.supabase) {
      const { data, error } = await this.supabase.from('services').insert([{
        title: service.title,
        description: service.description,
        bullets: service.bullets || [],
        icon: service.icon || ''
      }]).select();

      if (error) {
        console.error('Supabase add service error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return data && data[0] ? data[0] : service;
    }

    try {
      const res = await fetch(`${this.config.BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
      if (res.ok) return (await res.json()).data;
    } catch (e) {}

    const data = await this.getPortfolioData();
    data.services = data.services || [];
    data.services.push(service);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return service;
  }

  async updateService(id, updated) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    if (this.supabase) {
      const { error } = await this.supabase.from('services').update({
        title: updated.title,
        description: updated.description,
        bullets: updated.bullets,
        icon: updated.icon
      }).eq('id', id);

      if (error) {
        console.error('Supabase update service error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return { success: true };
    }

    try {
      const res = await fetch(`${this.config.BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const data = await this.getPortfolioData();
    if (data.services && data.services[id]) {
      data.services[id] = { ...data.services[id], ...updated };
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  async deleteService(id) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    if (this.supabase) {
      const { error } = await this.supabase.from('services').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete service error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return { success: true };
    }

    try {
      const res = await fetch(`${this.config.BASE_URL}/services/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const data = await this.getPortfolioData();
    if (data.services) {
      data.services.splice(id, 1);
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  // ==========================================
  // 5. Testimonials CRUD
  // ==========================================
  async getTestimonials() {
    const data = await this.getPortfolioData();
    return data.testimonials || [];
  }

  async addTestimonial(testi) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    if (this.supabase) {
      const { data, error } = await this.supabase.from('testimonials').insert([{
        name: testi.name,
        role: testi.role,
        quote: testi.quote,
        full_quote: testi.fullQuote || testi.quote,
        rating: testi.rating || 5
      }]).select();

      if (error) {
        console.error('Supabase add testimonial error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return data && data[0] ? data[0] : testi;
    }

    try {
      const res = await fetch(`${this.config.BASE_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testi)
      });
      if (res.ok) return (await res.json()).data;
    } catch (e) {}

    const data = await this.getPortfolioData();
    data.testimonials = data.testimonials || [];
    data.testimonials.push(testi);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return testi;
  }

  async updateTestimonial(id, updated) {
    if (!this.supabase && typeof window.supabase !== 'undefined') {
      this.initSupabase();
    }

    if (this.supabase) {
      const { error } = await this.supabase.from('testimonials').update({
        name: updated.name,
        role: updated.role,
        quote: updated.quote,
        full_quote: updated.fullQuote,
        rating: updated.rating
      }).eq('id', id);

      if (error) {
        console.error('Supabase update testimonial error:', error);
        throw new Error('Supabase Cloud Error: ' + error.message);
      }
      return { success: true };
    }

    try {
      const res = await fetch(`${this.config.BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const data = await this.getPortfolioData();
    if (data.testimonials && data.testimonials[id]) {
      data.testimonials[id] = { ...data.testimonials[id], ...updated };
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  async deleteTestimonial(id) {
    if (this.supabase) {
      try {
        await this.supabase.from('testimonials').delete().eq('id', id);
        return { success: true };
      } catch (e) {}
    }

    try {
      const res = await fetch(`${this.config.BASE_URL}/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const data = await this.getPortfolioData();
    if (data.testimonials) {
      data.testimonials.splice(id, 1);
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  // ==========================================
  // 6. Messages & Inquiries
  // ==========================================
  async getMessages() {
    // 1. Supabase Cloud
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          const list = data.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            read: Boolean(m.read),
            date: m.created_at
          }));
          localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(list));
          return list;
        }
      } catch (err) {
        console.warn('Supabase get messages error:', err);
      }
    }

    // 2. Local REST API
    try {
      const res = await fetch(`${this.config.BASE_URL}/messages`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {}

    // 3. LocalStorage
    const raw = localStorage.getItem(this.config.STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [];
  }

  async sendMessage(messageData) {
    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newMsg = {
      id,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject || 'Portfolio Inquiry',
      message: messageData.message,
      read: false,
      date: new Date().toISOString()
    };

    // 1. Supabase Cloud
    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('messages').insert([{
          id,
          name: newMsg.name,
          email: newMsg.email,
          subject: newMsg.subject,
          message: newMsg.message,
          read: false
        }]);
        if (!error) return newMsg;
      } catch (err) {
        console.warn('Supabase send message error:', err);
      }
    }

    // 2. Local REST API
    try {
      const res = await fetch(`${this.config.BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (res.ok) return (await res.json()).data || newMsg;
    } catch (e) {}

    // 3. LocalStorage
    const messages = await this.getMessages();
    messages.unshift(newMsg);
    localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return newMsg;
  }

  async markMessageRead(id) {
    if (this.supabase) {
      try {
        await this.supabase.from('messages').update({ read: true }).eq('id', id);
        return { success: true };
      } catch (e) {}
    }

    try {
      await fetch(`${this.config.BASE_URL}/messages/${id}/read`, { method: 'PUT' });
    } catch (e) {}

    const messages = await this.getMessages();
    const target = messages.find(m => m.id === id);
    if (target) target.read = true;
    localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return { success: true };
  }

  async deleteMessage(id) {
    if (this.supabase) {
      try {
        await this.supabase.from('messages').delete().eq('id', id);
        return { success: true };
      } catch (e) {}
    }

    try {
      await fetch(`${this.config.BASE_URL}/messages/${id}`, { method: 'DELETE' });
    } catch (e) {}

    let messages = await this.getMessages();
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return { success: true };
  }
}

const portfolioAPI = new PortfolioAPI();
window.portfolioAPI = portfolioAPI;
