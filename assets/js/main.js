(function () {
  "use strict";

  // const addTodoBtn = document.querySelector("#todo-add-btn");
  // const todoListEl = document.querySelector("#todo-list");
  // const error = document.querySelector(".error");
  // const filterShowAll = document.querySelector("#filter-show-all");
  // const filterShowOpen = document.querySelector("#filter-show-open");
  // const filterShowDone = document.querySelector("#filter-show-done");
  // const clearStorageBtn = document.querySelector(".btn--clear-storage");

  let state = {
    todos: [],
    idCounter: 1,
  };

  // get all necessary HTML elements of the app
  const elements = baseElements();
  // load last saved state from localStorage generate todo list items
  loadStorage();
  // set all necessary initial EventListeners
  setEventListeners();

  function baseElements() {
    const elements = {
      addTodoBtn: document.querySelector("#todo-add-btn"),
      todoListEl: document.querySelector("#todo-list"),
      error: document.querySelector(".error"),
      filterShowAll: document.querySelector("#filter-show-all"),
      filterShowOpen: document.querySelector("#filter-show-open"),
      filterShowDone: document.querySelector("#filter-show-done"),
      clearStorageBtn: document.querySelector(".btn--clear-storage"),
    };

    function getElement(elementName) {
      return elements[elementName];
    }

    return {
      getElement: getElement,
    };
  }

  function loadStorage() {
    if (localStorage.todoAppStorage) {
      let storage = JSON.parse(localStorage.todoAppStorage);
      createTodoList(storage);
    }
  }

  function createTodoList(storage) {
    const todoListEl = elements.getElement("todoListEl");
    state.todos = storage.todos;
    state.idCounter = storage.idCounter;

    todoListEl.innerHTML = storage.todoList;

    [...todoListEl.children].forEach((todoListEntryEl) => {
      if (todoListEntryEl.classList.contains("todo--done")) {
        todoListEntryEl.querySelector(".todo-state-toggle").checked = true;
      }
    });
  }

  function setEventListeners() {
    elements.getElement("clearStorageBtn").addEventListener("click", () => {
      clearStorage();
    });
    elements.getElement("addTodoBtn").addEventListener("click", addTodo);

    // set EventListeners for filters
    elements
      .getElement("filterShowAll")
      .addEventListener("change", filterTodos);
    elements
      .getElement("filterShowOpen")
      .addEventListener("change", filterTodos);
    elements
      .getElement("filterShowDone")
      .addEventListener("change", filterTodos);

    // set EventListener to list element to determine on click if the target is the done-toggle-checkbox or the delete btn
    elements.getElement("todoListEl").addEventListener("click", (e) => {
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
    const todoText = document.querySelector("#todo-text-input").value.trim();

    if (todoText) {
      state.todos.push({
        id: idCounter,
        text: todoText,
        isDone: false,
      });

      createTodoListElement(todoText);
      resetInput(todoInputField);

      idCounter++;

      updateStorage();
    } else {
      let errorMsg = "";

      todoInputField.classList.add("input-error");

      if (errorMsg === "") {
        errorMsg += "First add a text for your todo!";
        error.textContent = errorMsg;
        error.classList.add("error--show");
      }
    }
  }

  function createTodoListElement(todoText) {
    const newTodo = document.createElement("li");
    const todoTextContainer = document.createElement("div");
    const todoTextNode = document.createTextNode(todoText.trim());
    const todoControlsContainer = document.createElement("div");
    const todoDoneToggle = document.createElement("input");
    const todoDeleteBtn = document.createElement("button");

    todoDeleteBtn.textContent = "Delete";
    todoTextContainer.classList.add("todo-text");
    todoControlsContainer.classList.add("todo-controls");
    todoDeleteBtn.setAttribute("type", "button");
    todoDeleteBtn.setAttribute("data-delete-id", idCounter);
    todoDeleteBtn.classList.add("btn", "btn--delete");
    newTodo.setAttribute("data-id", idCounter);
    todoDoneToggle.setAttribute("type", "checkbox");
    todoDoneToggle.setAttribute("name", "todo-state-toggle");
    todoDoneToggle.setAttribute("id", "todo-state-toggler");
    todoDoneToggle.classList.add("todo-state-toggle");
    newTodo.classList.add("todo");

    todoTextContainer.appendChild(todoTextNode);
    todoControlsContainer.appendChild(todoDoneToggle);
    todoControlsContainer.appendChild(todoDeleteBtn);
    newTodo.appendChild(todoTextContainer);
    newTodo.appendChild(todoControlsContainer);
    todoListEl.appendChild(newTodo);
  }

  function resetInput(todoInputField) {
    todoInputField.value = "";
    todoInputField.classList.remove("input-error");
    error.classList.remove("error--show");
  }

  function toggleDone(e) {
    const todoToToggle = e.target.parentElement.parentElement;
    const todoIndex = todos.findIndex(
      (todoInArray) =>
        todoInArray.id === Number(todoToToggle.getAttribute("data-id"))
    );

    todos[todoIndex].isDone = !todos[todoIndex].isDone;
    todoToToggle.classList.toggle("todo--done");

    updateStorage();
  }

  function deleteTodo(e) {
    const id = Number(e.target.getAttribute("data-delete-id"));
    const todoToDelete = todoListEl.querySelector('[data-id="' + id + '"]');

    todos = todos.filter((todoItem) => {
      return todoItem.id !== id;
    });

    todoToDelete.remove();
    updateStorage();
  }

  function filterTodos(e) {
    [...todoListEl.children].forEach((todoListEntry) => {
      todoListEntry.classList.remove("todo--hidden");
    });

    if (todos.length && this.id === "filter-show-done") {
      const openTodos = todos.filter((todoItem) => {
        return !todoItem.isDone;
      });

      openTodos.forEach((openTodo) => {
        todoListEl
          .querySelector(`[data-id="${openTodo.id}"]`)
          .classList.add("todo--hidden");
      });
    }

    if (todos.length && this.id === "filter-show-open") {
      const doneTodos = todos.filter((todoItem) => {
        return todoItem.isDone;
      });

      doneTodos.forEach((doneTodo) => {
        todoListEl
          .querySelector(`[data-id="${doneTodo.id}"]`)
          .classList.add("todo--hidden");
      });
    }
  }

  function updateStorage() {
    localStorage.setItem(
      "todoAppStorage",
      JSON.stringify({
        todos: todos,
        idCounter: idCounter,
        todoList: todoListEl.innerHTML,
      })
    );
  }

  function clearStorage() {
    localStorage.clear();
    window.location.reload();
  }
})();
