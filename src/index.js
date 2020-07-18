import { renderProjects, renderCurrentTodos } from "./displayControllers";
import { addNewTodo, addNewProject } from "./stateControllers";

let today = new Date();
let defaultProjects = [
  {
    project: "My Project",
    todos: [
      {
        item: "write more todos",
        dueDate: today,
        complete: false,
        priority: "high"
      },
    ]
  },
]

// grab projects in localStorage
let storage = window.localStorage.getItem("projects");
if (!storage) {
  window.localStorage.setItem("projects", JSON.stringify(defaultProjects));
}

// render project list and todos
renderProjects();
renderCurrentTodos();

// add event handlers to interactive elements
let addNewTodoBtn = document.getElementById("addNewTodo");
addNewTodoBtn.onclick=addNewTodo;

let addNewProjectBtn = document.getElementById("addNewProject");
addNewProjectBtn.onclick=addNewProject;

let prioritySort = document.getElementById("priority-sort");
prioritySort.onchange=renderCurrentTodos;