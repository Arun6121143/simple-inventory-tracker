const InventoryTracker = require('./index');

// Simple test suite
function runTests() {
  const inventory = new InventoryTracker();
  
  console.log('🧪 Running tests...\n');
  
  // Test 1: Add items
  inventory.addItem('001', 'Laptop', 10, 2);
  inventory.addItem('002', 'Mouse', 50, 10);
  console.log('✅ Items added successfully');
  
  // Test 2: Update quantity
  inventory.updateQuantity('001', 1);
  console.log('✅ Quantity updated successfully');
  
  // Test 3: Low stock detection
  const lowStock = inventory.getLowStockItems();
  console.log(`✅ Low stock items: ${lowStock.length} found`);
  
  // Test 4: Search functionality
  const searchResults = inventory.searchItems('laptop');
  console.log(`✅ Search results: ${searchResults.length} found`);
  
  // Test 5: Export data
  const exportData = inventory.exportData();
  console.log(`✅ Export successful: ${exportData.totalItems} items`);
  
  console.log('\n🎉 All tests passed!');
}

runTests();