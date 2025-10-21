class InventoryTracker {
  constructor() {
    this.items = new Map();
  }

  addItem(id, name, quantity = 0, minStock = 5) {
    this.items.set(id, { name, quantity, minStock, lastUpdated: new Date() });
    return this.items.get(id);
  }

  updateQuantity(id, quantity) {
    if (!this.items.has(id)) throw new Error(`Item ${id} not found`);
    const item = this.items.get(id);
    item.quantity = quantity;
    item.lastUpdated = new Date();
    return item;
  }

  removeItem(id) {
    return this.items.delete(id);
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
}

module.exports = InventoryTracker;