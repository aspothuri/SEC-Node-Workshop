const fs = require('fs').promises;
const path = require('path');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.dir = path.dirname(filePath);
  }

  async init() {
    await fs.mkdir(this.dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch (err) {
      await fs.writeFile(this.filePath, JSON.stringify({ nextId: 1, items: [] }, null, 2), 'utf8');
    }
  }

  async _read() {
    const raw = await fs.readFile(this.filePath, 'utf8');
    return JSON.parse(raw);
  }

  async _write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    const data = await this._read();
    return data.items;
  }

  async getById(id) {
    const data = await this._read();
    return data.items.find(it => it.id === id) || null;
  }

  async create(item) {
    const data = await this._read();
    const id = data.nextId++;
    const now = new Date().toISOString();
    const newItem = Object.assign({ id, createdAt: now, updatedAt: now }, item);
    data.items.push(newItem);
    await this._write(data);
    return newItem;
  }

  async update(id, patch) {
    const data = await this._read();
    const idx = data.items.findIndex(it => it.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    data.items[idx] = Object.assign({}, data.items[idx], patch, { updatedAt: now });
    await this._write(data);
    return data.items[idx];
  }

  async remove(id) {
    const data = await this._read();
    const idx = data.items.findIndex(it => it.id === id);
    if (idx === -1) return false;
    data.items.splice(idx, 1);
    await this._write(data);
    return true;
  }
}

module.exports = DataStore;
