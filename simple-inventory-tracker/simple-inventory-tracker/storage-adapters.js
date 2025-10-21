// Built-in Storage Adapters

// LocalStorage Adapter
const localStorageAdapter = {
  async save(key, data) {
    if (typeof window === 'undefined') throw new Error('localStorage not available');
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  async load(key) {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  async remove(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  
  async clear() {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
};

// SessionStorage Adapter
const sessionStorageAdapter = {
  async save(key, data) {
    if (typeof window === 'undefined') throw new Error('sessionStorage not available');
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  
  async load(key) {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  async remove(key) {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
  
  async clear() {
    if (typeof window === 'undefined') return;
    sessionStorage.clear();
  }
};

// Memory Adapter (for testing/temporary storage)
const memoryAdapter = {
  data: new Map(),
  
  async save(key, data) {
    this.data.set(key, JSON.parse(JSON.stringify(data))); // Deep clone
  },
  
  async load(key) {
    const data = this.data.get(key);
    return data ? JSON.parse(JSON.stringify(data)) : null; // Deep clone
  },
  
  async remove(key) {
    this.data.delete(key);
  },
  
  async clear() {
    this.data.clear();
  }
};

// File System Adapter (Node.js)
const createFileAdapter = (filePath = './inventory-data.json') => ({
  async save(key, data) {
    const fs = require('fs').promises;
    const path = require('path');
    
    let fileData = {};
    try {
      const content = await fs.readFile(filePath, 'utf8');
      fileData = JSON.parse(content);
    } catch (error) {
      // File doesn't exist, create new
    }
    
    fileData[key] = data;
    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));
  },
  
  async load(key) {
    try {
      const fs = require('fs').promises;
      const content = await fs.readFile(filePath, 'utf8');
      const fileData = JSON.parse(content);
      return fileData[key] || null;
    } catch (error) {
      return null;
    }
  },
  
  async remove(key) {
    try {
      const fs = require('fs').promises;
      const content = await fs.readFile(filePath, 'utf8');
      const fileData = JSON.parse(content);
      delete fileData[key];
      await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));
    } catch (error) {
      // File doesn't exist, nothing to remove
    }
  },
  
  async clear() {
    const fs = require('fs').promises;
    await fs.writeFile(filePath, '{}');
  }
});

// API Adapter Factory
const createApiAdapter = (baseUrl) => ({
  async save(key, data) {
    const response = await fetch(`${baseUrl}/inventory/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API save failed: ${response.statusText}`);
  },
  
  async load(key) {
    try {
      const response = await fetch(`${baseUrl}/inventory/${key}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`API load failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      return null;
    }
  },
  
  async remove(key) {
    const response = await fetch(`${baseUrl}/inventory/${key}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 404) {
      throw new Error(`API remove failed: ${response.statusText}`);
    }
  },
  
  async clear() {
    const response = await fetch(`${baseUrl}/inventory`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`API clear failed: ${response.statusText}`);
  }
});

module.exports = {
  localStorageAdapter,
  sessionStorageAdapter,
  memoryAdapter,
  createFileAdapter,
  createApiAdapter
};