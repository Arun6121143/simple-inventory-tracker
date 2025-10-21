const InventoryTracker = require('./enhanced-v2');
const { memoryAdapter, createFileAdapter } = require('./storage-adapters');

async function testAdapters() {
  console.log('🧪 Testing Storage Adapters...\n');

  // Test 1: Memory Adapter
  console.log('=== Test 1: Memory Adapter ===');
  try {
    const inventory1 = new InventoryTracker({
      autoSave: true,
      storageAdapter: memoryAdapter
    });

    inventory1.addItem('MEM001', 'Memory Item', 10, 2);
    inventory1.addItem('MEM002', 'Another Item', 5, 3);
    
    const items = inventory1.getAllItems();
    console.log('✅ Items added:', items.length);
    console.log('✅ Memory adapter working');
    
    // Test persistence
    const inventory2 = new InventoryTracker({
      autoSave: true,
      storageAdapter: memoryAdapter
    });
    
    await inventory2.load();
    const loadedItems = inventory2.getAllItems();
    console.log('✅ Items loaded:', loadedItems.length);
    
  } catch (error) {
    console.log('❌ Memory adapter failed:', error.message);
  }

  // Test 2: File Adapter
  console.log('\n=== Test 2: File Adapter ===');
  try {
    const fileAdapter = createFileAdapter('./test-inventory.json');
    const inventory3 = new InventoryTracker({
      autoSave: true,
      storageAdapter: fileAdapter
    });

    inventory3.addItem('FILE001', 'File Item', 15, 5);
    inventory3.addItem('FILE002', 'Another File Item', 8, 2);
    
    await inventory3.save(); // Ensure save completes
    console.log('✅ Items saved to file');
    
    // Test loading from file
    const inventory4 = new InventoryTracker({
      autoSave: true,
      storageAdapter: fileAdapter
    });
    
    await inventory4.load();
    const fileItems = inventory4.getAllItems();
    console.log('✅ Items loaded from file:', fileItems.length);
    console.log('✅ File adapter working');
    
  } catch (error) {
    console.log('❌ File adapter failed:', error.message);
  }

  // Test 3: Custom Adapter
  console.log('\n=== Test 3: Custom Adapter ===');
  try {
    const customAdapter = {
      data: new Map(),
      
      async save(key, data) {
        console.log(`[CUSTOM] Saving ${key}`);
        this.data.set(key, JSON.stringify(data));
      },
      
      async load(key) {
        console.log(`[CUSTOM] Loading ${key}`);
        const data = this.data.get(key);
        return data ? JSON.parse(data) : null;
      },
      
      async remove(key) {
        console.log(`[CUSTOM] Removing ${key}`);
        this.data.delete(key);
      },
      
      async clear() {
        console.log(`[CUSTOM] Clearing all`);
        this.data.clear();
      }
    };

    const inventory5 = new InventoryTracker({
      autoSave: true,
      storageAdapter: customAdapter
    });

    inventory5.addItem('CUSTOM001', 'Custom Item', 20, 4);
    const customItems = inventory5.getAllItems();
    console.log('✅ Custom adapter working:', customItems.length, 'items');
    
  } catch (error) {
    console.log('❌ Custom adapter failed:', error.message);
  }

  // Test 4: Adapter Switching
  console.log('\n=== Test 4: Adapter Switching ===');
  try {
    const inventory6 = new InventoryTracker({
      autoSave: true,
      storageAdapter: memoryAdapter
    });

    inventory6.addItem('SWITCH001', 'Switch Item', 12, 3);
    console.log('✅ Added with memory adapter');

    // Switch to file adapter
    const fileAdapter2 = createFileAdapter('./switch-test.json');
    inventory6.setStorageAdapter(fileAdapter2);
    await inventory6.save();
    console.log('✅ Switched to file adapter and saved');
    
  } catch (error) {
    console.log('❌ Adapter switching failed:', error.message);
  }

  // Test 5: Error Handling
  console.log('\n=== Test 5: Error Handling ===');
  try {
    const badAdapter = {
      async save() { throw new Error('Save failed'); },
      async load() { throw new Error('Load failed'); },
      async remove() { throw new Error('Remove failed'); },
      async clear() { throw new Error('Clear failed'); }
    };

    const inventory7 = new InventoryTracker({
      autoSave: true,
      storageAdapter: badAdapter
    });

    inventory7.addItem('ERROR001', 'Error Item', 5, 1);
    console.log('✅ Error handling working (no crash)');
    
  } catch (error) {
    console.log('❌ Error handling failed:', error.message);
  }

  console.log('\n🎉 All tests completed!');
}

// Run tests
testAdapters().catch(console.error);