# Simple Inventory Tracker v2.0 - With Custom Storage Adapters

A lightweight, flexible inventory management utility with pluggable storage adapters.

## 🚀 New Features

- **Custom Storage Adapters** - Use any storage backend
- **Built-in Adapters** - localStorage, sessionStorage, memory, file, API
- **Async Support** - Works with databases and APIs
- **Runtime Switching** - Change storage adapters on the fly

## 📦 Installation

```bash
npm install simple-inventory-tracker@2.0.0
```

## 🔧 Basic Usage

```javascript
const InventoryTracker = require('simple-inventory-tracker');

// Default localStorage adapter
const inventory = new InventoryTracker({
  autoSave: true
});

inventory.addItem('PROD001', 'Laptop', 10, 2);
```

## 🔌 Storage Adapters

### Built-in Adapters

```javascript
const { 
  localStorageAdapter, 
  sessionStorageAdapter, 
  memoryAdapter,
  createFileAdapter,
  createApiAdapter 
} = require('simple-inventory-tracker/storage-adapters');

// Memory storage (testing)
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: memoryAdapter
});

// File storage (Node.js)
const fileAdapter = createFileAdapter('./inventory.json');
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: fileAdapter
});

// API storage
const apiAdapter = createApiAdapter('https://api.myapp.com');
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: apiAdapter
});
```

### Custom Adapters

```javascript
// Redis adapter example
const redisAdapter = {
  async save(key, data) {
    await redis.set(key, JSON.stringify(data));
  },
  
  async load(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  
  async remove(key) {
    await redis.del(key);
  },
  
  async clear() {
    await redis.flushall();
  }
};

const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: redisAdapter
});
```

### MongoDB Adapter

```javascript
const mongoAdapter = {
  async save(key, data) {
    await db.inventory.replaceOne(
      { key }, 
      { key, data }, 
      { upsert: true }
    );
  },
  
  async load(key) {
    const doc = await db.inventory.findOne({ key });
    return doc ? doc.data : null;
  },
  
  async remove(key) {
    await db.inventory.deleteOne({ key });
  },
  
  async clear() {
    await db.inventory.deleteMany({});
  }
};
```

## 🎯 Usage Examples

### E-commerce Store
```javascript
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: createApiAdapter('https://api.store.com')
});

inventory.addItem('SKU001', 'Gaming Laptop', 5, 2);
inventory.updateQuantity('SKU001', 4); // Customer bought one
```

### Restaurant Kitchen
```javascript
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: createFileAdapter('./kitchen-inventory.json')
});

inventory.addItem('TOMATO', 'Fresh Tomatoes', 20, 5);
const lowStock = inventory.getLowStockItems();
```

### Testing Environment
```javascript
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: memoryAdapter // No persistence, perfect for tests
});
```

## 🔄 Runtime Adapter Switching

```javascript
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: memoryAdapter
});

// Later, switch to persistent storage
inventory.setStorageAdapter(localStorageAdapter);
await inventory.save(); // Save current data to new adapter
```

## 📊 API Reference

### Constructor Options
- `autoSave`: Boolean - Auto-save on changes
- `storageKey`: String - Storage key name
- `storageAdapter`: Object - Custom storage adapter
- `onSave`: Function - Callback on save
- `onLoad`: Function - Callback on load

### Methods
- `addItem(id, name, quantity, minStock)` - Add item
- `updateQuantity(id, quantity)` - Update quantity
- `removeItem(id)` - Remove item
- `getAllItems()` - Get all items
- `getLowStockItems()` - Get low stock items
- `searchItems(query)` - Search items
- `exportData()` - Export data
- `importData(data)` - Import data
- `save()` - Manual save
- `load()` - Manual load
- `setStorageAdapter(adapter)` - Change adapter

## 🔧 Storage Adapter Interface

```javascript
const customAdapter = {
  async save(key, data) { /* Save data */ },
  async load(key) { /* Load and return data */ },
  async remove(key) { /* Remove data */ },
  async clear() { /* Clear all data */ }
};
```

## 🎯 Benefits

✅ **Flexible Storage** - Use any backend  
✅ **Easy Testing** - Memory adapter for tests  
✅ **Scalable** - Database adapters for production  
✅ **Framework Agnostic** - Works everywhere  
✅ **Async Ready** - Supports modern APIs  

## 📝 Migration from v1.x

```javascript
// v1.x
const inventory = new InventoryTracker();

// v2.x (backward compatible)
const inventory = new InventoryTracker({
  autoSave: true,
  storageAdapter: localStorageAdapter
});
```

## 📄 License

MIT