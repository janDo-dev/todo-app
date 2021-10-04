"use strict";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-text-input");
const addTodoBtn = document.querySelector("#todo-add-btn");
const todoList = document.querySelector("#todo-list");
const error = document.querySelector(".error");

let todos = [];
let idCounter = 1;
let errorMsg = "";

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
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

function addTodo() {
  if (todoInput.value) {
    const newTodo = document.createElement("li");
    const todoTextEl = document.createElement("div");
    const todoText = document.createTextNode(todoInput.value.trim());
    const todoControls = document.createElement("div");
    const todoDoneToggle = document.createElement("input");
    const todoDeleteBtn = document.createElement("button");

    todos.push({
      id: idCounter,
      text: todoInput.value,
      isDone: false,
    });

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

    todoInput.value = "";
    todoInput.classList.remove("input-error");
    error.style.display = "none";

    idCounter++;
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

function toggleDone(e) {
  const todoToToggle = e.target.parentElement.parentElement;
  const todoIndex = todos.findIndex(
    (todoInArray) =>
      todoInArray.id === Number(todoToToggle.getAttribute("data-id"))
  );
  todos[todoIndex].isDone = !todos[todoIndex].isDone;
  todoToToggle.classList.toggle("todo--done");
}

function deleteTodo(e) {
  const id = Number(e.target.getAttribute("data-delete-id"));
  const todoToDelete = todoList.querySelector('[data-id="' + id + '"]');

  todos = todos.filter((todoItem) => {
    return todoItem.id !== id;
  });

  todoToDelete.remove();
}
