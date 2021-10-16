(function () {
  // get all necessary HTML elements of the app
  let id = 0;

  // load last saved state from db.json and generate todo list items
  initTodos();
  // set all necessary initial EventListeners
  setEventListeners();

  async function initTodos() {
    const todoListEl = document.querySelector("#todo-list");

    await fetch("http://localhost:4730/todos")
      .then((response) => response.json())
      .then((data) => {
        createTodoList(data);
        id += data.length;
      });
  }

  function createTodoList(todos) {
    todos.forEach((todo) => {
      createTodoListElement(todo.id, todo.description, todo.done);
    });
  }

  function setEventListeners() {
    const addTodoBtn = document.querySelector("#todo-add-btn");
    const filterShowAll = document.querySelector("#filter-show-all");
    const filterShowOpen = document.querySelector("#filter-show-open");
    const filterShowDone = document.querySelector("#filter-show-done");

    addTodoBtn.addEventListener("click", addTodo);

    // set EventListeners for filters
    filterShowAll.addEventListener("change", filterTodos);
    filterShowOpen.addEventListener("change", filterTodos);
    filterShowDone.addEventListener("change", filterTodos);

    // set EventListener to list element to determine on click if the target is the done-toggle-checkbox or the delete btn
    document.querySelector("#todo-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("todo-state-toggle")) {
        toggleDone(e);
      }

      if (e.target.classList.contains("btn--delete")) {
        deleteTodo(e);
      }
    });
  }

  function addTodo() {
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
          id++;
          createTodoListElement(id, todoText, false);
        });

      resetInput(todoInputField);
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

  function createTodoListElement(todoID, todoText, todoDone) {
    // create all elements of a single todo
    const newTodo = document.createElement("li");
    const todoTextContainer = document.createElement("div");
    const todoTextNode = document.createTextNode(todoText.trim());
    const todoControlsContainer = document.createElement("div");
    const todoDoneToggle = document.createElement("input");
    const todoDeleteBtn = document.createElement("button");

    // set all content and attributes
    todoDeleteBtn.textContent = "Delete";
    todoTextContainer.classList.add("todo-text");
    todoControlsContainer.classList.add("todo-controls");
    todoDeleteBtn.setAttribute("type", "button");
    todoDeleteBtn.classList.add("btn", "btn--delete");
    newTodo.setAttribute("data-id", todoID);
    todoDoneToggle.setAttribute("type", "checkbox");
    todoDoneToggle.setAttribute("name", "todo-state-toggle");
    todoDoneToggle.setAttribute("id", "todo-state-toggler");
    todoDoneToggle.classList.add("todo-state-toggle");
    newTodo.classList.add("todo");
    if (todoDone) {
      todoDoneToggle.checked = true;
      newTodo.classList.add("todo--done");
    }

    // appending
    todoTextContainer.appendChild(todoTextNode);
    todoControlsContainer.appendChild(todoDoneToggle);
    todoControlsContainer.appendChild(todoDeleteBtn);
    newTodo.appendChild(todoTextContainer);
    newTodo.appendChild(todoControlsContainer);
    document.querySelector("#todo-list").appendChild(newTodo);
  }

  function resetInput(todoInputField) {
    const error = document.querySelector(".error");
    todoInputField.value = "";
    todoInputField.classList.remove("input-error");
    error.classList.remove("error--show");
  }

  function toggleDone(e) {
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

  function deleteTodo(e) {
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

  function filterTodos(e) {
    const todoListEl = document.querySelector("#todo-list");

    fetch(`http://localhost:4730/todos`)
      .then((response) => response.json())
      .then((data) => {
        [...todoListEl.children].forEach((todoListEntry) => {
          todoListEntry.classList.remove("todo--hidden");
        });

        data.forEach((todo) => {
          if (this.id === "filter-show-done" && !todo.done) {
            todoListEl
              .querySelector(`[data-id="${todo.id}"]`)
              .classList.add("todo--hidden");
          }

          if (this.id === "filter-show-open" && todo.done) {
            todoListEl
              .querySelector(`[data-id="${todo.id}"]`)
              .classList.add("todo--hidden");
          }
        });
      });
  }
})();
