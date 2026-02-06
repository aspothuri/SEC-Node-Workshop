# Recipe Box — Node.js + Express Workshop

This workshop demonstrates building a simple backend with Node.js and Express and a minimal frontend that consumes the API.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run the server

```bash
npm start
# or for development (requires nodemon)
npm run dev
```

3. Open http://localhost:3000 in your browser.

What you'll learn

- Project scaffold and `package.json`
- Express middleware and routing
- Simple JSON file persistence
- CRUD API endpoints (GET/POST/PUT/DELETE)
- Serving a static frontend and using `fetch()` from the browser

Files

- `server.js` — the Express app and route definitions
- `src/datastore.js` — simple file-based datastore with CRUD helpers
- `data/recipes.json` — sample data persisted to disk
- `public/` — static frontend (HTML/CSS/JS)

Teaching notes

- Keep explanations focused on middleware (parsing, logging), route handlers, and asynchronous file I/O.
- Show how the frontend calls each API endpoint and how the server responds.
