# How Users Will Use Your Package

## Step 1: Installation
```bash
npm install simple-inventory-tracker
```

## Step 2: Import in Their Project
```javascript
const InventoryTracker = require('simple-inventory-tracker');
const inventory = new InventoryTracker();
```

## Real-World Usage Scenarios

### 🛒 E-commerce Store
```javascript
// Setup products
inventory.addItem('PROD001', 'Gaming Laptop', 15, 3);
inventory.addItem('PROD002', 'Wireless Mouse', 50, 10);

// When customer orders
inventory.updateQuantity('PROD001', 14); // Sold 1 laptop

// Check what to restock
const lowStock = inventory.getLowStockItems();
if (lowStock.length > 0) {
  console.log('Reorder needed:', lowStock);
}
```

### 🍕 Restaurant Kitchen
```javascript
// Track ingredients
inventory.addItem('TOMATO', 'Fresh Tomatoes', 25, 5);
inventory.addItem('CHEESE', 'Mozzarella', 10, 2);

// After making pizzas
inventory.updateQuantity('TOMATO', 20); // Used 5kg
inventory.updateQuantity('CHEESE', 8);  // Used 2kg

// Alert chef about low ingredients
const needToOrder = inventory.getLowStockItems();
```

### 📦 Small Business Warehouse
```javascript
// Track supplies
inventory.addItem('BOX_S', 'Small Boxes', 200, 50);
inventory.addItem('TAPE', 'Packing Tape', 100, 25);

// Search for items
const boxes = inventory.searchItems('box');
console.log('All box types:', boxes);

// Calculate inventory value
const prices = { 'BOX_S': 0.75, 'TAPE': 3.50 };
const totalValue = inventory.getTotalValue(prices);
console.log(`Inventory worth: $${totalValue}`);
```

### 📱 Mobile App Integration
```javascript
// In a React/Vue/Angular app
class StoreManager {
  constructor() {
    this.inventory = new InventoryTracker();
  }
  
  addProduct(id, name, qty, minStock) {
    return this.inventory.addItem(id, name, qty, minStock);
  }
  
  sellProduct(id, soldQty) {
    const item = this.inventory.getItem(id);
    const newQty = item.quantity - soldQty;
    return this.inventory.updateQuantity(id, newQty);
  }
  
  getAlerts() {
    return this.inventory.getLowStockItems();
  }
}
```

## Integration Examples

### Express.js API
```javascript
const express = require('express');
const InventoryTracker = require('simple-inventory-tracker');

const app = express();
const inventory = new InventoryTracker();

app.get('/inventory', (req, res) => {
  res.json(inventory.getAllItems());
});

app.post('/inventory/:id/update', (req, res) => {
  const { quantity } = req.body;
  const updated = inventory.updateQuantity(req.params.id, quantity);
  res.json(updated);
});
```

### Database Integration
```javascript
const InventoryTracker = require('simple-inventory-tracker');
const inventory = new InventoryTracker();

// Load from database
async function loadInventory() {
  const items = await db.query('SELECT * FROM inventory');
  items.forEach(item => {
    inventory.addItem(item.id, item.name, item.quantity, item.min_stock);
  });
}

// Save to database
async function saveInventory() {
  const data = inventory.exportData();
  await db.query('UPDATE inventory SET ...', data.items);
}
```

## Why Users Love It

✅ **No setup complexity** - Works immediately  
✅ **No dependencies** - Won't break their project  
✅ **Simple API** - Easy to learn in 5 minutes  
✅ **Flexible** - Works with any database/framework  
✅ **Lightweight** - Won't slow down their app