let tasks = [];
let currentFilter = 'all';

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

function addTask(text) {
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    const taskList = document.querySelector('.task-list');
    const taskItems = taskList.querySelectorAll('.task');

    taskItems.forEach(taskItem => {
        const taskText = taskItem.querySelector('.task-text');
        if (taskText.textContent === task.text) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.className = 'task-edit-input';

            taskText.replaceWith(input);
            input.focus();

            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    task.text = newText;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks(currentFilter);
                } else {
                    input.focus();
                }
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
        }
    });
}

function renderTasks(filter = 'all') {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'incomplete') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-buttons">
                <button class="btn btn-edit-task">Редактировать</button>
                <button class="btn btn-completed-task">${task.completed ? 'Не выполнена' : 'Выполнена'}</button>
                <button class="btn btn-delete-task">Удалить</button>
            </div>
        `;

        const editBtn = li.querySelector('.btn-edit-task');
        const completedBtn = li.querySelector('.btn-completed-task');
        const deleteBtn = li.querySelector('.btn-delete-task');

        editBtn.addEventListener('click', () => {
            editTask(task.id);
        });

        completedBtn.addEventListener('click', () => {
            toggleTask(task.id);
            renderTasks(filter);
        });

        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
            renderTasks(filter);
        });

        taskList.appendChild(li);
    });
}

const taskForm = document.querySelector('#task-form');

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const taskInput = document.querySelector('#new-task');
    const text = taskInput.value.trim();

    if (text !== '') {
        addTask(text);
        taskInput.value = '';
        renderTasks(currentFilter);
    }
});

const filterButtons = document.querySelectorAll('.btn-filter');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.getAttribute('data-filter');
        renderTasks(currentFilter);

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

async function loadSampleTasks() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        const data = await response.json();

        data.forEach(item => {
            const task = {
                id: item.id,
                text: item.title,
                completed: item.completed
            };
            tasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(currentFilter);
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
    }
}

if (tasks.length === 0) {
    loadSampleTasks();
} else {
    renderTasks(currentFilter);
}
