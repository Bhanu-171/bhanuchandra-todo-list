# Project 02 - Interactive To-Do List with LocalStorage

A responsive task manager built with HTML, CSS and JavaScript.

## Features
- Add tasks using the Add task button or Enter key.
- Mark tasks complete and undo completion.
- Delete individual tasks.
- Filter tasks by All, Active and Done.
- Clear all completed tasks.
- Show the number of remaining tasks.
- Save and restore tasks with browser LocalStorage.
- Handle invalid stored data safely.
- Responsive layout for desktop and mobile.

## Files
- `index.html` - page structure
- `style.css` - responsive styling
- `app.js` - task state, DOM events and LocalStorage

## Run locally
1. Open this folder in Visual Studio Code.
2. Open `index.html` with the Live Server extension, or open the file in a modern browser.
3. Add a few tasks and refresh the page to verify that they persist.

## How LocalStorage works
The app keeps all tasks in one JavaScript array. `saveTasks()` converts the array to a JSON string using `JSON.stringify()` and stores it in LocalStorage. `loadTasks()` reads the stored string and converts it back to an array with `JSON.parse()` inside a `try/catch` block. The list is rebuilt from the array whenever the state changes.

## Before submission
Test adding, completing, deleting, filtering, clearing completed tasks, and refreshing the page. LocalStorage is specific to the browser and device where the app is used.
