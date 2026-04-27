const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');

document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'bg-light' : ''}`;
        
        li.innerHTML = `
            <div role="button" onclick="toggleTask(${task.id})" class="flex-grow-1">
                <span class="${task.completed ? 'text-decoration-line-through text-muted' : 'fw-bold'}">
                    ${task.title}
                </span>
                ${task.completed ? '<span class="badge bg-success ms-2">Completada</span>' : ''}
            </div>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteTask(${task.id})">
                &times; Eliminar
            </button>
        `;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    taskInput.value = '';
    fetchTasks();
}

async function toggleTask(id) {
    await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
    fetchTasks();
}

async function deleteTask(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
}