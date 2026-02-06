const express = require('express');
const path = require('path');
const DataStore = require('./src/datastore');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

const store = new DataStore(path.join(__dirname, 'data', 'recipes.json'));

// API routes
app.get('/api/recipes', async (req, res, next) => {
  try {
    const recipes = await store.getAll();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

app.get('/api/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await store.getById(Number(req.params.id));
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

app.post('/api/recipes', async (req, res, next) => {
  try {
    const created = await store.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put('/api/recipes/:id', async (req, res, next) => {
  try {
    const updated = await store.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/recipes/:id', async (req, res, next) => {
  try {
    const removed = await store.remove(Number(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, async () => {
  // Ensure datastore file exists or is initialized
  await store.init();
  console.log(`Server listening on http://localhost:${PORT}`);
});
