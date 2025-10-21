const { localStorageAdapter, sessionStorageAdapter, memoryAdapter } = require('./storage-adapters');

class InventoryTracker {
  constructor(options = {}) {
    this.items = new Map();
    this.options = {
      autoSave: options.autoSave || false,
      storageKey: options.storageKey || 'inventory-tracker-data',
      storageAdapter: options.storageAdapter || this.getDefaultAdapter(options.storageType),
      onSave: options.onSave || null,
      onLoad: options.onLoad || null
    };
    
    if (this.options.autoSave) {
      this.loadFromStorage();
    }
  }

  // Get default adapter based on environment
  getDefaultAdapter(storageType = 'localStorage') {
    switch (storageType) {
      case 'sessionStorage':
        return sessionStorageAdapter;
      case 'memory':
        return memoryAdapter;
      case 'localStorage':
      default:
        return localStorageAdapter;
    }
  }

  // Storage methods using adapters
  async saveToStorage() {
    if (!this.options.autoSave || !this.options.storageAdapter) return;
    
    try {
      const data = this.exportData();
      await this.options.storageAdapter.save(this.options.storageKey, data);
      if (this.options.onSave) this.options.onSave(data);
    } catch (error) {
      console.error('Failed to save inventory data:', error);
    }
  }

  async loadFromStorage() {
    if (!this.options.storageAdapter) return;
    
    try {
      const data = await this.options.storageAdapter.load(this.options.storageKey);
      if (data && data.items) {
        this.items.clear();
        data.items.forEach(item => {
          this.items.set(item.id, {
            name: item.name,
            quantity: item.quantity,
            minStock: item.minStock,
            lastUpdated: new Date(item.lastUpdated)
          });
        });
        if (this.options.onLoad) this.options.onLoad(data);
      }
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    }
  }

  async clearStorage() {
    if (!this.options.storageAdapter) return;
    
    try {
      await this.options.storageAdapter.remove(this.options.storageKey);
    } catch (error) {
      console.error('Failed to clear inventory data:', error);
    }
  }

  // Original methods with async auto-save
  addItem(id, name, quantity = 0, minStock = 5) {
    this.items.set(id, { name, quantity, minStock, lastUpdated: new Date() });
    this.saveToStorage(); // Fire and forget
    return this.items.get(id);
  }

  updateQuantity(id, quantity) {
    if (!this.items.has(id)) throw new Error(`Item ${id} not found`);
    const item = this.items.get(id);
    item.quantity = quantity;
    item.lastUpdated = new Date();
    this.saveToStorage(); // Fire and forget
    return item;
  }

  removeItem(id) {
    const result = this.items.delete(id);
    this.saveToStorage(); // Fire and forget
    return result;
  }

  getItem(id) {
    return this.items.get(id);
  }

  getAllItems() {
    return Array.from(this.items.entries()).map(([id, item]) => ({ id, ...item }));
  }

  getLowStockItems() {
    return this.getAllItems().filter(item => item.quantity <= item.minStock);
  }

  searchItems(query) {
    return this.getAllItems().filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getTotalValue(priceMap = {}) {
    return this.getAllItems().reduce((total, item) => {
      const price = priceMap[item.id] || 0;
      return total + (item.quantity * price);
    }, 0);
  }

  exportData() {
    return {
      items: this.getAllItems(),
      exportDate: new Date(),
      totalItems: this.items.size
    };
  }

  async importData(data) {
    if (data.items) {
      this.items.clear();
      data.items.forEach(item => {
        this.items.set(item.id, {
          name: item.name,
          quantity: item.quantity,
          minStock: item.minStock,
          lastUpdated: new Date(item.lastUpdated || new Date())
        });
      });
      await this.saveToStorage();
    }
  }

  // Manual save/load methods
  async save() {
    await this.saveToStorage();
  }

  async load() {
    await this.loadFromStorage();
  }

  // Change storage adapter at runtime
  setStorageAdapter(adapter) {
    this.options.storageAdapter = adapter;
  }

  // Event system for real-time updates (browser only)
  subscribe(callback) {
    if (typeof window !== 'undefined' && this.options.storageAdapter === localStorageAdapter) {
      const handler = (e) => {
        if (e.key === this.options.storageKey) {
          callback(JSON.parse(e.newValue || '{}'));
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
    return () => {};
  }
}

module.exports = InventoryTracker;