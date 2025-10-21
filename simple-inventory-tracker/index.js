class InventoryTracker {
  constructor() {
    this.items = new Map();
  }

  addItem(id, name, quantity = 0, minStock = 5) {
    this.items.set(id, { 
      name, 
      quantity, 
      minStock, 
      lastUpdated: new Date() 
    });
    return this.items.get(id);
  }

  deleteItem(id) {
    return this.items.delete(id);
  }

  updateQuantity(id, quantity) {
    if (!this.items.has(id)) {
      throw new Error(`Item ${id} not found`);
    }
    const item = this.items.get(id);
    item.quantity = quantity;
    item.lastUpdated = new Date();
    return item;
  }

  getItem(id) {
    return this.items.get(id);
  }

  getAllItems() {
    return Array.from(this.items.entries()).map(([id, item]) => ({ 
      id, 
      ...item 
    }));
  }

  getLowStockItems() {
    return this.getAllItems().filter(item => item.quantity <= item.minStock);
  }

  searchItems(query) {
    return this.getAllItems().filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  exportData() {
    return {
      items: this.getAllItems(),
      exportDate: new Date(),
      totalItems: this.items.size
    };
  }

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
    }
  }

  clear() {
    this.items.clear();
  }

  getItemCount() {
    return this.items.size;
  }
}

module.exports = InventoryTracker;