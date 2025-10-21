# Simple Inventory Tracker

A lightweight, easy-to-use inventory management utility for Node.js applications.

## Installation

```bash
npm install simple-inventory-tracker
```

## Quick Start

```javascript
const InventoryTracker = require('simple-inventory-tracker');

const inventory = new InventoryTracker();

// Add items
inventory.addItem('001', 'Laptop', 10, 2);
inventory.addItem('002', 'Mouse', 50, 10);

// Update quantities
inventory.updateQuantity('001', 8);

// Check low stock
console.log(inventory.getLowStockItems());

// Search items
console.log(inventory.searchItems('laptop'));
```

## API Reference

### `addItem(id, name, quantity, minStock)`
Add a new item to inventory.

### `updateQuantity(id, quantity)`
Update item quantity.

### `removeItem(id)`
Remove item from inventory.

### `getItem(id)`
Get single item details.

### `getAllItems()`
Get all items as array.

### `getLowStockItems()`
Get items below minimum stock level.

### `searchItems(query)`
Search items by name.

### `getTotalValue(priceMap)`
Calculate total inventory value.

### `exportData()`
Export inventory data with metadata.

## License

MIT