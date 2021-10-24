import Todo from "./Todo.js";

export default class TodoApp {
  idCounter = 0;

  constructor() {
    this.initTodos();
    this.setEventListeners();
  }

  async initTodos() {
    const todoListEl = document.querySelector("#todo-list");

    await fetch("http://localhost:4730/todos")
      .then((response) => response.json())
      .then((data) => {
        this.createTodoList(data);
        this.idCounter += data.length;
      });
  }

  setEventListeners() {
    const addTodoBtn = document.querySelector("#todo-add-btn");
    const filterShowAll = document.querySelector("#filter-show-all");
    const filterShowOpen = document.querySelector("#filter-show-open");
    const filterShowDone = document.querySelector("#filter-show-done");

    addTodoBtn.addEventListener("click", this.addTodo.bind(this));

    // set EventListeners for filters
    filterShowAll.addEventListener("change", this.filterTodos.bind(this));
    filterShowOpen.addEventListener("change", this.filterTodos.bind(this));
    filterShowDone.addEventListener("change", this.filterTodos.bind(this));

    // set EventListener to list element to determine on click if the target is the done-toggle-checkbox or the delete btn
    document.querySelector("#todo-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("todo-state-toggle")) {
        this.toggleDone(e);
      }

      if (e.target.classList.contains("btn--delete")) {
        this.deleteTodo(e);
      }
    });
  }

  createTodoList(todos) {
    todos.forEach((todo) => {
      new Todo(todo.id, todo.description, todo.done);
    });
  }

  resetInput(todoInputField) {
    const error = document.querySelector(".error");
    todoInputField.value = "";
    todoInputField.classList.remove("input-error");
    error.classList.remove("error--show");
  }

  addTodo() {
    const todoInputField = document.querySelector("#todo-text-input");
    const todoText = todoInputField.value.trim();

    if (todoText) {
      fetch("http://localhost:4730/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: todoText,
          done: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.idCounter++;
          new Todo(this.idCounter, todoText, false);
        });

      this.resetInput(todoInputField);
    } else {
      const error = document.querySelector(".error");
      let errorMsg = "";

      todoInputField.classList.add("input-error");

      if (errorMsg === "") {
        errorMsg += "First add a text for your todo!";
        error.textContent = errorMsg;
        error.classList.add("error--show");
      }
    }
  }

  toggleDone(e) {
    const todoToToggle = e.target.parentElement.parentElement;
    const todoIsDone = e.target.checked;
    const todoID = Number(todoToToggle.getAttribute("data-id"));

    fetch(`http://localhost:4730/todos/${todoID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        done: todoIsDone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.done === true
          ? todoToToggle.classList.add("todo--done")
          : todoToToggle.classList.remove("todo--done");
      });
  }

  deleteTodo(e) {
    const todoListEl = document.querySelector("#todo-list");
    const todoID = Number(
      e.target.parentElement.parentElement.getAttribute("data-id")
    );

    fetch(`http://localhost:4730/todos/${todoID}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        todoListEl.querySelector(`[data-id="${todoID}"]`).remove();
      });
  }

  filterTodos(e) {
    const todoListEl = document.querySelector("#todo-list");

    fetch(`http://localhost:4730/todos`)
      .then((response) => response.json())
      .then((data) => {
        [...todoListEl.children].forEach((todoListEntry) => {
          todoListEntry.classList.remove("todo--hidden");
        });

        data.forEach((todo) => {
          if (e.target.id === "filter-show-done" && !todo.done) {
            todoListEl
              .querySelector(`[data-id="${todo.id}"]`)
              .classList.add("todo--hidden");
          }

          if (e.target.id === "filter-show-open" && todo.done) {
            todoListEl
              .querySelector(`[data-id="${todo.id}"]`)
              .classList.add("todo--hidden");
          }
        });
      });
  }
}
