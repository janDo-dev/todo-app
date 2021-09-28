"use strict";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-text");
const addTodoBtn = document.querySelector("#add-todo");
const todoList = document.querySelector("#todo-list");
const error = document.querySelector(".error");

let todos = [];
let idCounter = 1;
let errorMsg = "";

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

addTodoBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", removeTodo);

function addTodo() {
  if (todoInput.value) {
    const newTodo = document.createElement("li");
    const todoText = document.createTextNode(todoInput.value.trim());

    todos.push({
      id: idCounter,
      text: todoInput.value,
    });

    newTodo.classList.add("todo");
    newTodo.appendChild(todoText);
    newTodo.setAttribute("data-id", idCounter);

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

function removeTodo(e) {
  if (e.target.classList.contains("todo")) {
    const id = Number(e.target.getAttribute("data-id"));

    todos = todos.filter((todoItem) => {
      return todoItem.id !== id;
    });

    e.target.remove();

    if (todos.length <= 0) {
      todoList.innerHTML = "<li>No Todo added, yet.</li>";
    }

    console.log(todos);
  }
}
