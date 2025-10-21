const InventoryTracker = require('../enhanced-v2');
const { localStorageAdapter, memoryAdapter, createFileAdapter, createApiAdapter } = require('../storage-adapters');

// Example 1: Using built-in localStorage adapter
console.log('=== Example 1: LocalStorage Adapter ===');
const inventory1 = new InventoryTracker({
  autoSave: true,
  storageAdapter: localStorageAdapter
});

inventory1.addItem('PROD001', 'Laptop', 10, 2);
console.log('Added item with localStorage adapter');

// Example 2: Using memory adapter (for testing)
console.log('\n=== Example 2: Memory Adapter ===');
const inventory2 = new InventoryTracker({
  autoSave: true,
  storageAdapter: memoryAdapter
});

inventory2.addItem('TEST001', 'Test Item', 5, 1);
console.log('Added item with memory adapter');
console.log('Items:', inventory2.getAllItems());

// Example 3: Using file adapter (Node.js)
console.log('\n=== Example 3: File Adapter ===');
const fileAdapter = createFileAdapter('./my-inventory.json');
const inventory3 = new InventoryTracker({
  autoSave: true,
  storageAdapter: fileAdapter
});

(async () => {
  inventory3.addItem('FILE001', 'File Item', 15, 3);
  await inventory3.save(); // Ensure it's saved
  console.log('Added item with file adapter');
})();

// Example 4: Custom Redis-like adapter
console.log('\n=== Example 4: Custom Redis-like Adapter ===');
const customRedisAdapter = {
  data: new Map(), // Simulating Redis
  
  async save(key, data) {
    console.log(`[REDIS] Saving to key: ${key}`);
    this.data.set(key, JSON.stringify(data));
    // In real Redis: await redis.set(key, JSON.stringify(data));
  },
  
  async load(key) {
    console.log(`[REDIS] Loading from key: ${key}`);
    const data = this.data.get(key);
    return data ? JSON.parse(data) : null;
    // In real Redis: return JSON.parse(await redis.get(key) || 'null');
  },
  
  async remove(key) {
    console.log(`[REDIS] Removing key: ${key}`);
    this.data.delete(key);
    // In real Redis: await redis.del(key);
  },
  
  async clear() {
    console.log(`[REDIS] Clearing all data`);
    this.data.clear();
    // In real Redis: await redis.flushall();
  }
};

const inventory4 = new InventoryTracker({
  autoSave: true,
  storageAdapter: customRedisAdapter
});

inventory4.addItem('REDIS001', 'Redis Item', 20, 5);
console.log('Added item with custom Redis adapter');

// Example 5: API adapter
console.log('\n=== Example 5: API Adapter ===');
// const apiAdapter = createApiAdapter('https://api.myapp.com');
// const inventory5 = new InventoryTracker({
//   autoSave: true,
//   storageAdapter: apiAdapter
// });
// inventory5.addItem('API001', 'API Item', 25, 8);

console.log('API adapter example (commented out - requires real API)');

// Example 6: Switching adapters at runtime
console.log('\n=== Example 6: Runtime Adapter Switching ===');
const inventory6 = new InventoryTracker({
  autoSave: true,
  storageAdapter: memoryAdapter
});

inventory6.addItem('SWITCH001', 'Switch Item', 12, 3);
console.log('Added with memory adapter');

// Switch to file adapter
inventory6.setStorageAdapter(fileAdapter);
inventory6.addItem('SWITCH002', 'Another Item', 8, 2);
console.log('Added with file adapter after switching');

console.log('\n=== All Examples Complete ===');