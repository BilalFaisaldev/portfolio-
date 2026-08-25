/**
 * Minimalist Developer Portfolio - Client-Side API & SQLite Backend Adapter
 * Handles data fetching, live synchronization with Node.js/SQLite backend, and offline LocalStorage fallback.
 */

const API_CONFIG = {
  USE_LIVE_API: true, // Connect to live Node.js + SQLite REST API
  BASE_URL: 'http://localhost:5000/api',
  STORAGE_KEYS: {
    PORTFOLIO: 'portfolio_data_v1',
    MESSAGES: 'portfolio_messages_v1'
  }
};

class PortfolioAPI {
  constructor() {
    this.config = this.loadConfig();
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

  /**
   * Helper for REST API calls with fallback
   */
  async request(endpoint, options = {}) {
    if (this.config.USE_LIVE_API) {
      try {
        const url = `${this.config.BASE_URL}${endpoint}`;
        const res = await fetch(url, {
          headers: { 'Content-Type': 'application/json', ...options.headers },
          ...options
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} on ${endpoint}`);
        const data = await res.json();
        return data.data !== undefined ? data.data : data;
      } catch (err) {
        console.warn(`[Live API Offline] Falling back to LocalStorage for ${endpoint}:`, err.message);
      }
    }
    return null;
  }

  // --- Portfolio Data ---
  async getPortfolioData() {
    const liveData = await this.request('/portfolio');
    if (liveData) {
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(liveData));
      return liveData;
    }
    const raw = localStorage.getItem(this.config.STORAGE_KEYS.PORTFOLIO);
    return raw ? JSON.parse(raw) : (typeof portfolioConfig !== 'undefined' ? portfolioConfig : {});
  }

  async updatePersonal(personalData) {
    const res = await this.request('/portfolio/personal', {
      method: 'PUT',
      body: JSON.stringify(personalData)
    });
    if (res) return res;

    const current = await this.getPortfolioData();
    current.personal = { ...current.personal, ...personalData };
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(current));
    return { success: true };
  }

  // --- Projects ---
  async getProjects() {
    const live = await this.request('/projects');
    if (live) return live;
    const data = await this.getPortfolioData();
    return data.projects || [];
  }

  async addProject(project) {
    const live = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
    if (live) return live;

    const data = await this.getPortfolioData();
    const newProj = {
      id: project.id || project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
      ...project
    };
    data.projects = data.projects || [];
    data.projects.unshift(newProj);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return newProj;
  }

  async updateProject(id, updatedProject) {
    const live = await this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProject)
    });
    if (live) return live;

    const data = await this.getPortfolioData();
    const idx = (data.projects || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      data.projects[idx] = { ...data.projects[idx], ...updatedProject };
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  async deleteProject(id) {
    const live = await this.request(`/projects/${id}`, { method: 'DELETE' });
    if (live) return live;

    const data = await this.getPortfolioData();
    data.projects = (data.projects || []).filter(p => p.id !== id);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return { success: true };
  }

  // --- Services ---
  async getServices() {
    const live = await this.request('/services');
    if (live) return live;
    const data = await this.getPortfolioData();
    return data.services || [];
  }

  async addService(service) {
    const live = await this.request('/services', {
      method: 'POST',
      body: JSON.stringify(service)
    });
    if (live) return live;

    const data = await this.getPortfolioData();
    data.services = data.services || [];
    data.services.push(service);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return service;
  }

  async updateService(id, updated) {
    const live = await this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updated)
    });
    if (live) return live;

    const data = await this.getPortfolioData();
    if (data.services && data.services[id]) {
      data.services[id] = { ...data.services[id], ...updated };
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  async deleteService(id) {
    const live = await this.request(`/services/${id}`, { method: 'DELETE' });
    if (live) return live;

    const data = await this.getPortfolioData();
    if (data.services) {
      data.services.splice(id, 1);
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  // --- Testimonials ---
  async getTestimonials() {
    const live = await this.request('/testimonials');
    if (live) return live;
    const data = await this.getPortfolioData();
    return data.testimonials || [];
  }

  async addTestimonial(testi) {
    const live = await this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testi)
    });
    if (live) return live;

    const data = await this.getPortfolioData();
    data.testimonials = data.testimonials || [];
    data.testimonials.push(testi);
    localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    return testi;
  }

  async updateTestimonial(id, updated) {
    const live = await this.request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updated)
    });
    if (live) return live;

    const data = await this.getPortfolioData();
    if (data.testimonials && data.testimonials[id]) {
      data.testimonials[id] = { ...data.testimonials[id], ...updated };
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  async deleteTestimonial(id) {
    const live = await this.request(`/testimonials/${id}`, { method: 'DELETE' });
    if (live) return live;

    const data = await this.getPortfolioData();
    if (data.testimonials) {
      data.testimonials.splice(id, 1);
      localStorage.setItem(this.config.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
    }
    return { success: true };
  }

  // --- Messages & Inquiries ---
  async getMessages() {
    const live = await this.request('/messages');
    if (live) return live;
    const raw = localStorage.getItem(this.config.STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [];
  }

  async sendMessage(messageData) {
    const live = await this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
    if (live) return live;

    const messages = await this.getMessages();
    const newMsg = {
      id: 'msg_' + Date.now(),
      date: new Date().toISOString(),
      read: false,
      ...messageData
    };
    messages.unshift(newMsg);
    localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return newMsg;
  }

  async markMessageRead(id) {
    const live = await this.request(`/messages/${id}/read`, { method: 'PUT' });
    if (live) return live;

    const messages = await this.getMessages();
    const target = messages.find(m => m.id === id);
    if (target) target.read = true;
    localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return { success: true };
  }

  async deleteMessage(id) {
    const live = await this.request(`/messages/${id}`, { method: 'DELETE' });
    if (live) return live;

    let messages = await this.getMessages();
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem(this.config.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return { success: true };
  }
}

const portfolioAPI = new PortfolioAPI();
window.portfolioAPI = portfolioAPI;
