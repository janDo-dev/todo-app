export default class Todo {
  id;
  description;
  done;

  constructor(id, desc, done = false) {
    this.id = id;
    this.description = desc;
    this.done = done;

    this.createTodoListElement(this.id, this.description, this.done);
  }

  createTodoListElement(todoID, todoDesc, todoDone) {
    // create all elements of a single todo
    const newTodo = document.createElement("li");
    const todoTextContainer = document.createElement("div");
    const todoTextNode = document.createTextNode(todoDesc.trim());
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
}
