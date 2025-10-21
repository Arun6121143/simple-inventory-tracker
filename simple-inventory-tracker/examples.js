const InventoryTracker = require('./index');

console.log('=== HOW USERS WILL USE YOUR PACKAGE ===\n');

// 1. E-commerce Store Example
console.log('📱 E-commerce Store Usage:');
const storeInventory = new InventoryTracker();

// Add products
storeInventory.addItem('PHONE001', 'iPhone 15', 25, 5);
storeInventory.addItem('CASE001', 'Phone Case', 100, 20);
storeInventory.addItem('CHARGER001', 'USB-C Charger', 50, 10);

// When customer buys something
storeInventory.updateQuantity('PHONE001', 24); // Sold 1 phone
console.log('Phone sold, stock updated');

// Check what needs restocking
const lowStock = storeInventory.getLowStockItems();
console.log('Items to restock:', lowStock.map(item => item.name));
console.log('');

// 2. Restaurant Inventory Example
console.log('🍕 Restaurant Usage:');
const restaurant = new InventoryTracker();

restaurant.addItem('TOMATO', 'Tomatoes (kg)', 20, 5);
restaurant.addItem('CHEESE', 'Mozzarella (kg)', 15, 3);
restaurant.addItem('FLOUR', 'Pizza Flour (kg)', 50, 10);

// After cooking pizzas
restaurant.updateQuantity('TOMATO', 18);
restaurant.updateQuantity('CHEESE', 12);

// Find ingredients running low
const needToOrder = restaurant.getLowStockItems();
console.log('Need to order:', needToOrder.map(item => item.name));
console.log('');

// 3. Warehouse Management Example
console.log('📦 Warehouse Usage:');
const warehouse = new InventoryTracker();

warehouse.addItem('BOX001', 'Cardboard Boxes', 500, 100);
warehouse.addItem('TAPE001', 'Packing Tape', 200, 50);
warehouse.addItem('BUBBLE', 'Bubble Wrap', 300, 75);

// Search for specific items
const searchResults = warehouse.searchItems('box');
console.log('Found items:', searchResults.map(item => item.name));

// Calculate total value
const prices = { 'BOX001': 0.5, 'TAPE001': 2.0, 'BUBBLE': 1.5 };
const totalValue = warehouse.getTotalValue(prices);
console.log(`Total inventory value: $${totalValue}`);
console.log('');

// 4. Export for reports
console.log('📊 Export Data Example:');
const exportData = storeInventory.exportData();
console.log('Export contains:', exportData.totalItems, 'items');
console.log('Export date:', exportData.exportDate.toDateString());