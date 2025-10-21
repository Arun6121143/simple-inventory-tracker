# Simple Inventory Tracker

A minimal, lightweight inventory management utility for tracking items, quantities, and stock levels.

## Installation

```bash
npm install simple-inventory-tracker
```

## Usage

```javascript
const InventoryTracker = require('simple-inventory-tracker');

// Create new inventory
const inventory = new InventoryTracker();

// Add items
inventory.addItem('ITEM001', 'Product 1', 100, 10);
inventory.addItem('ITEM002', 'Product 2', 50, 5);

// Update quantity
inventory.updateQuantity('ITEM001', 95);

// Get items
const item = inventory.getItem('ITEM001');
const allItems = inventory.getAllItems();

// Search items
const results = inventory.searchItems('Product');

// Get low stock items
const lowStock = inventory.getLowStockItems();

// Export data
const exportData = inventory.exportData();

// Delete item
inventory.deleteItem('ITEM001');
```

## API Reference

### Constructor
- `new InventoryTracker()` - Creates a new inventory tracker instance

### Methods

#### Item Management
- `addItem(id, name, quantity, minStock)` - Add a new item
- `deleteItem(id)` - Delete an item by ID
- `updateQuantity(id, quantity)` - Update item quantity
- `getItem(id)` - Get item by ID
- `getAllItems()` - Get all items as array

#### Search & Filter
- `searchItems(query)` - Search items by name
- `getLowStockItems()` - Get items with quantity <= minStock

#### Data Operations
- `exportData()` - Export all data as JSON object
- `importData(data)` - Import data from JSON object
- `clear()` - Clear all items
- `getItemCount()` - Get total number of items

## License

MIT