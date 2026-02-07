// Simple frontend logic using Fetch API
async function api(path, options = {}) {
  const res = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options));
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'on') Object.entries(v).forEach(([ev, fn]) => node.addEventListener(ev, fn));
    else node.setAttribute(k, v);
  });
  children.flat().forEach(c => node.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return node;
}

async function loadRecipes() {
  const list = document.getElementById('recipes');
  list.innerHTML = '';
  try {
    const recipes = await api('/api/recipes');
    recipes.forEach(r => {
      const li = el('li', {},
        el('strong', {}, r.title),
        ' — ',
        el('em', {}, r.author || 'unknown'),
        el('div', {}, el('small', {}, r.ingredients.join(', '))),
        el('p', {}, r.instructions || ''),
        el('div', { class: 'actions' },
          el('button', { on: { click: () => editRecipe(r) } }, 'Edit'),
          el('button', { on: { click: () => deleteRecipe(r.id) } }, 'Delete')
        )
      );
      list.appendChild(li);
    });
  } catch (err) {
    alert('Failed to load recipes: ' + err.message);
  }
}

function toFormData(form) {
  const fd = new FormData(form);
  return {
    title: fd.get('title') || '',
    author: fd.get('author') || '',
    ingredients: (fd.get('ingredients') || '').split(',').map(s => s.trim()).filter(Boolean),
    instructions: fd.get('instructions') || ''
  };
}

async function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = toFormData(form);
  try {
    await api('/api/recipes', { method: 'POST', body: JSON.stringify(data) });
    form.reset();
    loadRecipes();
  } catch (err) {
    alert('Failed to add recipe: ' + err.message);
  }
}

function editRecipe(recipe) {
  const title = prompt('Title', recipe.title);
  if (title === null) return;
  const author = prompt('Author', recipe.author || '');
  if (author === null) return;
  const ingredients = prompt('Ingredients (comma separated)', recipe.ingredients.join(', '));
  if (ingredients === null) return;
  const instructions = prompt('Instructions', recipe.instructions || '');
  if (instructions === null) return;

  api(`/api/recipes/${recipe.id}`, { method: 'PUT', body: JSON.stringify({ title, author, ingredients: ingredients.split(',').map(s=>s.trim()).filter(Boolean), instructions }) })
    .then(loadRecipes)
    .catch(err => alert('Update failed: ' + err.message));
}

function deleteRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  api(`/api/recipes/${id}`, { method: 'DELETE' })
    .then(loadRecipes)
    .catch(err => alert('Delete failed: ' + err.message));
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('recipeForm').addEventListener('submit', submitForm);
  document.getElementById('clear').addEventListener('click', () => document.getElementById('recipeForm').reset());
  loadRecipes();
});
