// State variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTasks();
  });
});

// Add Task Function
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveAndRender();
  taskInput.value = '';
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveAndRender();
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const updatedText = prompt('Edit your task:', task.text);
  if (updatedText !== null && updatedText.trim() !== '') {
    task.text = updatedText.trim();
    saveAndRender();
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

// Save to LocalStorage and Render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Render Tasks based on Filter
function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'done') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <span class="task-text">${escapeHtml(task.text)}</span>
      <div class="task-actions">
        <button class="action-btn complete-btn" onclick="toggleComplete(${task.id})">✓</button>
        <button class="action-btn edit-btn" onclick="editTask(${task.id})">✎</button>
        <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">✕</button>
      </div>
    `;
    
    taskList.appendChild(li);
  });
}

// Utility function to prevent XSS
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}