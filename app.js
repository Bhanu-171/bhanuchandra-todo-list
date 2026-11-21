// TaskFlow - Interactive To-Do List with LocalStorage

const STORAGE_KEY = "taskflow-tasks";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const emptyState = document.getElementById("empty-state");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

// Load saved tasks safely. If stored data is invalid, start with an empty list.
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter(task =>
      task && typeof task.id === "number" &&
      typeof task.text === "string" &&
      typeof task.done === "boolean"
    ) : [];
  } catch (error) {
    console.warn("Could not read saved tasks:", error);
    return [];
  }
}

// Save the current task array as a JSON string in localStorage.
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

// Build the visible list from the tasks array.
function renderTasks() {
  list.replaceChildren();

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;
    item.dataset.id = String(task.id);

    const toggle = document.createElement("button");
    toggle.className = "task-check";
    toggle.type = "button";
    toggle.dataset.action = "toggle";
    toggle.setAttribute("aria-label", task.done ? "Mark task active" : "Mark task complete");
    toggle.setAttribute("aria-pressed", String(task.done));
    toggle.textContent = task.done ? "✓" : "";

    const label = document.createElement("span");
    label.className = "task-text";
    // textContent safely displays user-entered text without interpreting HTML.
    label.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    item.append(toggle, label, deleteButton);
    list.append(item);
  });

  const remaining = tasks.filter(task => !task.done).length;
  count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  emptyState.classList.toggle("hidden", visibleTasks.length > 0);
  clearCompletedButton.disabled = !tasks.some(task => task.done);
  clearCompletedButton.style.opacity = clearCompletedButton.disabled ? "0.45" : "1";
}

// Add a task when the form is submitted (click or Enter key).
form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  saveTasks();
  renderTasks();
  input.focus();
});

// One click listener handles both completion and deletion (event delegation).
list.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = button.closest("li[data-id]");
  if (!item) return;

  const id = Number(item.dataset.id);
  const action = button.dataset.action;

  if (action === "toggle") {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
  } else if (action === "delete") {
    tasks = tasks.filter(task => task.id !== id);
  }

  saveTasks();
  renderTasks();
});

// Switch between All, Active and Done filters.
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(filterButton => {
      const selected = filterButton === button;
      filterButton.classList.toggle("active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    renderTasks();
  });
});

// Remove every completed task.
clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
});

// Display today's date in the card heading.
document.getElementById("today-date").textContent =
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date());

// Initial render after loading saved data.
renderTasks();
