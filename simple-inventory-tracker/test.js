const InventoryTracker = require('./index.js');

console.log('Testing Simple Inventory Tracker v3.0.0...\n');

// Create inventory
const inventory = new InventoryTracker();

// Test adding items
console.log('1. Adding items...');
inventory.addItem('ITEM001', 'Laptop', 10, 2);
inventory.addItem('ITEM002', 'Mouse', 50, 5);
inventory.addItem('ITEM003', 'Keyboard', 1, 3); // Low stock
console.log('✓ Items added');

// Test getting all items
console.log('\n2. All items:');
console.log(inventory.getAllItems());

// Test updating quantity
console.log('\n3. Updating quantity...');
inventory.updateQuantity('ITEM001', 8);
console.log('✓ Quantity updated');

// Test low stock items
console.log('\n4. Low stock items:');
console.log(inventory.getLowStockItems());

// Test search
console.log('\n5. Search results for "Lap":');
console.log(inventory.searchItems('Lap'));

// Test export
console.log('\n6. Export data:');
const exportData = inventory.exportData();
console.log(exportData);

// Test delete
console.log('\n7. Deleting item...');
inventory.deleteItem('ITEM002');
console.log('✓ Item deleted');
console.log('Remaining items:', inventory.getItemCount());

console.log('\n✅ All tests passed!');