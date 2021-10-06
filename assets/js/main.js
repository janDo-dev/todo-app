"use strict";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-text-input");
const addTodoBtn = document.querySelector("#todo-add-btn");
const todoList = document.querySelector("#todo-list");
const error = document.querySelector(".error");
const filterShowAll = document.querySelector("#filter-show-all");
const filterShowOpen = document.querySelector("#filter-show-open");
const filterShowDone = document.querySelector("#filter-show-done");
const clearStorageBtn = document.querySelector(".btn--clear-storage");

let state = {};
let todos = [];
let idCounter = 1;
let errorMsg = "";

if (localStorage.todoSettings) {
  loadStorage();
}

clearStorageBtn.addEventListener("click", () => {
  clearStorage();
});

addTodoBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("todo-state-toggle")) {
    toggleDone(e);
  }

  if (e.target.classList.contains("btn--delete")) {
    deleteTodo(e);
  }
});
filterShowAll.addEventListener("change", filterTodos);
filterShowDone.addEventListener("change", filterTodos);
filterShowOpen.addEventListener("change", filterTodos);

function loadStorage() {
  state = JSON.parse(localStorage.todoSettings);

  todos = state.todos;
  idCounter = state.idCounter;
  errorMsg = "";

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  todoList.innerHTML = state.todoList || null;
  [...todoList.children].forEach((todoListEntry) => {
    todoListEntry.classList.contains("todo--done")
      ? (todoListEntry.querySelector(".todo-state-toggle").checked = true)
      : null;
  });
}

function addTodo() {
  if (todoInput.value) {
    todos.push({
      id: idCounter,
      text: todoInput.value,
      isDone: false,
    });

    createTodoEl();

    todoInput.value = "";
    todoInput.classList.remove("input-error");
    error.style.display = "none";
    idCounter++;

    saveState();
  } else {
    todoInput.classList.add("input-error");

    if (errorMsg === "") {
      errorMsg += "First add a text for your todo!";
      error.innerText = errorMsg;
    }

    if (error.style.display !== "block") {
      error.style.display = "block";
    }
  }
}

function createTodoEl() {
  const newTodo = document.createElement("li");
  const todoTextEl = document.createElement("div");
  const todoText = document.createTextNode(todoInput.value.trim());
  const todoControls = document.createElement("div");
  const todoDoneToggle = document.createElement("input");
  const todoDeleteBtn = document.createElement("button");

  todoDeleteBtn.textContent = "Delete";
  todoTextEl.classList.add("todo-text");
  todoControls.classList.add("todo-controls");
  todoDeleteBtn.setAttribute("type", "button");
  todoDeleteBtn.setAttribute("data-delete-id", idCounter);
  todoDeleteBtn.classList.add("btn", "btn--delete");
  newTodo.setAttribute("data-id", idCounter);
  todoDoneToggle.setAttribute("type", "checkbox");
  todoDoneToggle.setAttribute("name", "todo-state-toggle");
  todoDoneToggle.setAttribute("id", "todo-state-toggler");
  todoDoneToggle.classList.add("todo-state-toggle");
  newTodo.classList.add("todo");

  todoTextEl.appendChild(todoText);
  todoControls.appendChild(todoDoneToggle);
  todoControls.appendChild(todoDeleteBtn);
  newTodo.appendChild(todoTextEl);
  newTodo.appendChild(todoControls);
  todoList.appendChild(newTodo);
}

function toggleDone(e) {
  const todoToToggle = e.target.parentElement.parentElement;
  const todoIndex = todos.findIndex(
    (todoInArray) =>
      todoInArray.id === Number(todoToToggle.getAttribute("data-id"))
  );

  todos[todoIndex].isDone = !todos[todoIndex].isDone;
  todoToToggle.classList.toggle("todo--done");

  saveState();
}

function deleteTodo(e) {
  const id = Number(e.target.getAttribute("data-delete-id"));
  const todoToDelete = todoList.querySelector('[data-id="' + id + '"]');

  todos = todos.filter((todoItem) => {
    return todoItem.id !== id;
  });

  todoToDelete.remove();
  saveState();
}

function filterTodos(e) {
  [...todoList.children].forEach((todoListEntry) => {
    todoListEntry.classList.remove("todo--hidden");
  });

  if (todos.length && this.id === "filter-show-done") {
    const openTodos = todos.filter((todoItem) => {
      return !todoItem.isDone;
    });

    openTodos.forEach((openTodo) => {
      todoList
        .querySelector(`[data-id="${openTodo.id}"]`)
        .classList.add("todo--hidden");
    });
  }

  if (todos.length && this.id === "filter-show-open") {
    const doneTodos = todos.filter((todoItem) => {
      return todoItem.isDone;
    });

    doneTodos.forEach((doneTodo) => {
      todoList
        .querySelector(`[data-id="${doneTodo.id}"]`)
        .classList.add("todo--hidden");
    });
  }
}

function saveState() {
  localStorage.setItem(
    "todoSettings",
    JSON.stringify({
      todos: todos,
      idCounter: idCounter,
      todoList: todoList.innerHTML,
    })
  );
}

function clearStorage() {
  localStorage.clear();
  window.location.reload();
}
