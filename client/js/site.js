// Base URL of the API. When the page is served from localhost we talk to the
// local API; otherwise we use the deployed Azure App Service.
const apiBaseUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'https://localhost:7001'
  : 'https://todo-app-api-d04ohl.azurewebsites.net';

const uri = `${apiBaseUrl}/api/todoitems`;
let todos = [];

function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
  const addNameTextbox = document.getElementById('add-name');

  const item = {
    isComplete: false,
    name: addNameTextbox.value.trim()
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
  const item = todos.find(item => item.id === id);

  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-isComplete').checked = item.isComplete;

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editForm'));
  modal.show();
}

function updateItem() {
  const itemId = document.getElementById('edit-id').value;
  const item = {
    id: parseInt(itemId, 10),
    isComplete: document.getElementById('edit-isComplete').checked,
    name: document.getElementById('edit-name').value.trim()
  };

  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));

  closeInput();

  return false;
}

function closeInput() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editForm'));
  modal.hide();
}

function _displayCount(itemCount) {
  const name = (itemCount === 1) ? 'to-do' : 'to-dos';

  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';

  _displayCount(data.length);

  if (data.length === 0) {
    const tr = tBody.insertRow();
    const td = tr.insertCell(0);
    td.colSpan = 3;
    td.className = 'text-center text-muted py-4';
    td.innerHTML = '<i class="bi bi-inbox fs-4 d-block mb-1"></i>No to-dos yet. Add one above!';
    todos = data;
    return;
  }

  data.forEach(item => {
    let isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.className = 'form-check-input fs-5';
    isCompleteCheckbox.disabled = true;
    isCompleteCheckbox.checked = item.isComplete;

    let editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-outline-secondary me-1';
    editButton.innerHTML = '<i class="bi bi-pencil"></i> Edit';
    editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

    let deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-outline-danger';
    deleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    td1.className = 'text-center';
    td1.appendChild(isCompleteCheckbox);

    let td2 = tr.insertCell(1);
    let nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;
    if (item.isComplete) {
      nameSpan.className = 'text-muted text-decoration-line-through';
    }
    td2.appendChild(nameSpan);

    let td3 = tr.insertCell(2);
    td3.className = 'text-end text-nowrap';
    td3.appendChild(editButton);
    td3.appendChild(deleteButton);
  });

  todos = data;
}