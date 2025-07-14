const app = document.getElementById('app');
const buttons = document.querySelectorAll('.sidebar button');
const API_URL = 'http://localhost:3000/users';

// Detectar cambio de hash en la URL (ej: #add, #edit, etc.)
window.addEventListener('hashchange', () => {
  loadRoute(location.hash.slice(1));
});

// Botones del menú
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const route = button.dataset.route;
    location.hash = route; // Esto cambia la URL a #add, #edit, etc.
  });
});

// Al cargar por primera vez
window.addEventListener('DOMContentLoaded', () => {
  loadRoute(location.hash.slice(1));
});

function loadRoute(route) {
  switch (route) {
    case 'add': renderAddForm(); break;
    case 'edit': renderEditForm(); break;
    case 'remove': renderRemoveForm(); break;
    case 'show': renderUsers(); break;
    default: app.innerHTML = '<h2>Bienvenido</h2>'; break;
  }
}

// ----- FUNCIONES PARA CADA VISTA -----
//add
function renderAddForm() {
  app.innerHTML = `
    <h2>Add User</h2>
    <form id="addForm">
      <input type="text" name="name" placeholder="Name" required><br><br>
      <input type="email" name="email" placeholder="Email" required><br><br>
      <button type="submit">Add</button>
    </form>
  `;

  document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = {
      name: e.target.name.value,
      email: e.target.email.value
    };
    await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    });
    alert('User added!');
    e.target.reset();
  });
}
//edit
function renderEditForm() {
  app.innerHTML = `
    <h2>Edit User</h2>
    <form id="editForm">
      <input type="number" name="id" placeholder="User ID" required><br><br>
      <input type="text" name="name" placeholder="New Name"><br><br>
      <input type="email" name="email" placeholder="New Email"><br><br>
      <button type="submit">Update</button>
    </form>
  `;

  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const updatedUser = {};
    if (e.target.name.value) updatedUser.name = e.target.name.value;
    if (e.target.email.value) updatedUser.email = e.target.email.value;

    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updatedUser)
    });

    alert('User updated!');
    e.target.reset();
  });
}
//remove
function renderRemoveForm() {
  app.innerHTML = `
    <h2>Remove User</h2>
    <form id="removeForm">
      <input type="number" name="id" placeholder="User ID" required><br><br>
      <button type="submit">Delete</button>
    </form>
  `;

  document.getElementById('removeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.id.value;

    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('User deleted!');
    e.target.reset();
  });
}
//show
async function renderUsers() {
  const res = await fetch(API_URL);
  const users = await res.json();

  app.innerHTML = `<h2>All Users</h2>`;
  if (users.length === 0) {
    app.innerHTML += '<p>No users found.</p>';
    return;
  }

  const list = document.createElement('ul');
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `#${user.id} - ${user.name} (${user.email})`;
    list.appendChild(li);
  });
  app.appendChild(list);
}
