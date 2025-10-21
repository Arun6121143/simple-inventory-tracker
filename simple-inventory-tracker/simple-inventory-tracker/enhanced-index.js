class InventoryTracker {
  constructor(options = {}) {
    this.items = new Map();
    this.options = {
      autoSave: options.autoSave || false,
      storageKey: options.storageKey || 'inventory-tracker-data',
      storageType: options.storageType || 'localStorage', // 'localStorage', 'sessionStorage', 'memory'
      onSave: options.onSave || null,
      onLoad: options.onLoad || null
    };
    
    if (this.options.autoSave && typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  // Storage methods
  saveToStorage() {
    if (!this.options.autoSave || typeof window === 'undefined') return;
    
    const data = this.exportData();
    const storage = this.options.storageType === 'sessionStorage' ? sessionStorage : localStorage;
    
    try {
      storage.setItem(this.options.storageKey, JSON.stringify(data));
      if (this.options.onSave) this.options.onSave(data);
    } catch (error) {
      console.error('Failed to save inventory data:', error);
    }
  }

  loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    const storage = this.options.storageType === 'sessionStorage' ? sessionStorage : localStorage;
    
    try {
      const savedData = storage.getItem(this.options.storageKey);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.items) {
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
      }
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    }
  }

  clearStorage() {
    if (typeof window === 'undefined') return;
    
    const storage = this.options.storageType === 'sessionStorage' ? sessionStorage : localStorage;
    storage.removeItem(this.options.storageKey);
  }

  // Original methods with auto-save
  addItem(id, name, quantity = 0, minStock = 5) {
    const result = this.items.set(id, { name, quantity, minStock, lastUpdated: new Date() });
    this.saveToStorage();
    return this.items.get(id);
  }

  updateQuantity(id, quantity) {
    if (!this.items.has(id)) throw new Error(`Item ${id} not found`);
    const item = this.items.get(id);
    item.quantity = quantity;
    item.lastUpdated = new Date();
    this.saveToStorage();
    return item;
  }

  removeItem(id) {
    const result = this.items.delete(id);
    this.saveToStorage();
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

  // Batch operations
  importData(data) {
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
      this.saveToStorage();
    }
  }

  // Event system for real-time updates
  subscribe(callback) {
    if (typeof window !== 'undefined') {
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