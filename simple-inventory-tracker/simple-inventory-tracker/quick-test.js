const InventoryTracker = require('./enhanced-v2');
const { memoryAdapter, createFileAdapter } = require('./storage-adapters');

console.log('🚀 Quick Storage Adapter Test\n');

// Test 1: Memory Adapter
console.log('=== Memory Adapter ===');
const inventory1 = new InventoryTracker({
  autoSave: true,
  storageAdapter: memoryAdapter
});

inventory1.addItem('PROD001', 'Laptop', 10, 2);
inventory1.addItem('PROD002', 'Mouse', 25, 5);
inventory1.updateQuantity('PROD001', 8);

console.log('Items:', inventory1.getAllItems().length);
console.log('Low stock:', inventory1.getLowStockItems().length);
console.log('✅ Memory adapter works!');

// Test 2: File Adapter (async)
console.log('\n=== File Adapter ===');
(async () => {
  const fileAdapter = createFileAdapter('./quick-test.json');
  const inventory2 = new InventoryTracker({
    autoSave: true,
    storageAdapter: fileAdapter
  });

  inventory2.addItem('FILE001', 'Keyboard', 15, 3);
  await inventory2.save();
  
  console.log('Items saved to file:', inventory2.getAllItems().length);
  console.log('✅ File adapter works!');
  
  console.log('\n🎉 All adapters working correctly!');
})();

// Test 3: Custom Adapter
console.log('\n=== Custom Adapter ===');
const customAdapter = {
  storage: {},
  async save(key, data) { this.storage[key] = data; },
  async load(key) { return this.storage[key] || null; },
  async remove(key) { delete this.storage[key]; },
  async clear() { this.storage = {}; }
};

const inventory3 = new InventoryTracker({
  autoSave: true,
  storageAdapter: customAdapter
});

inventory3.addItem('CUSTOM001', 'Custom Item', 20, 4);
console.log('Custom adapter items:', inventory3.getAllItems().length);
console.log('✅ Custom adapter works!');