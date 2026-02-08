class StorageManager {
    static STORAGE_KEY = 'qrpro_data';
    
    static getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { items: [], nextId: 1 };
    }
    
    static saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    
    static addURL(originalUrl, shortUrl, slug) {
        const data = this.getData();
        const item = {
            id: 'url_' + Date.now() + '_' + data.nextId++,
            type: 'url',
            data: originalUrl,
            shortUrl: shortUrl,
            slug: slug,
            created: new Date().toISOString(),
            views: 0,
            lastAccessed: null
        };
        
        data.items.unshift(item);
        this.saveData(data);
        return item;
    }
    
    static addQR(qrData, type = 'qr', color = '#000000', bgColor = '#FFFFFF') {
        const data = this.getData();
        const item = {
            id: 'qr_' + Date.now() + '_' + data.nextId++,
            type: type,
            data: qrData,
            color: color,
            bgColor: bgColor,
            created: new Date().toISOString(),
            views: 0,
            lastAccessed: null
        };
        
        data.items.unshift(item);
        this.saveData(data);
        return item;
    }
    
    static getAllItems() {
        return this.getData().items;
    }
    
    static getItem(id) {
        const items = this.getAllItems();
        return items.find(item => item.id === id);
    }
    
    static incrementViews(id) {
        const data = this.getData();
        const item = data.items.find(item => item.id === id);
        if (item) {
            item.views = (item.views || 0) + 1;
            item.lastAccessed = new Date().toISOString();
            this.saveData(data);
        }
    }
    
    static deleteItem(id) {
        const data = this.getData();
        data.items = data.items.filter(item => item.id !== id);
        this.saveData(data);
        return true;
    }
    
    static getStats() {
        const items = this.getAllItems();
        return {
            total: items.length,
            urls: items.filter(item => item.type === 'url').length,
            qrs: items.filter(item => item.type === 'qr').length,
            texts: items.filter(item => item.type === 'text').length,
            totalViews: items.reduce((sum, item) => sum + (item.views || 0), 0)
        };
    }
    
    static clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
    
    static exportData() {
        return this.getData();
    }
    
    static importData(jsonData) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(jsonData));
        return true;
    }
}
