import { editTodo, deleteTodo, updateComplete, deleteProject } from "./stateControllers";
import { format, parseISO } from "date-fns";

const renderProjects = () => {
  // get projects from localStorage and id the current active project
  let projects = JSON.parse(window.localStorage.getItem("projects"));
  let currentProject = document.querySelector(".active-project");
  // clearout current project lists
  let projectList = document.getElementById("project-list");
  projectList.innerHTML = "";
  
  // generate list of projects 
  projects.forEach(function (project, index) {
    let span = document.createElement("span");
    span.classList.add("form-header");
    let link = document.createElement("div");
    link.id = project.project;
    link.textContent = project.project;
    link.classList.add("project-link");
  
    if ((currentProject && currentProject.id === link.id)){
      link.classList.add("active-project");
    }
    link.onclick = displayCurrentProj;
    
    let delBtn = document.createElement("div");
    delBtn.id = project.project + index;
    delBtn.innerHTML="&#9746";
    delBtn.classList.add("x-btn");
    delBtn.onclick=deleteProject;
    span.appendChild(link);
    span.appendChild(delBtn);
    projectList.appendChild(span);
  })
  // requery project list DOM
  currentProject = document.querySelector(".active-project");
  if (!currentProject) {
    let newActive = document.querySelector(".project-link");
    newActive.classList.add("active-project");
    renderCurrentTodos();
  }

  // rerender add new project btn if hidden
  let addBtn = document.getElementById("addProjCont");
  if (addBtn.classList.contains("hidden")) {
    addBtn.classList.remove("hidden");
  }
}

const renderCurrentTodos = () => {
  // get projects from localStorage
  let projects = JSON.parse(window.localStorage.getItem("projects"));

  // get current project from flagged className
  let current = document.querySelector(".active-project");
  if (current) {
    let project = projects.filter(item => item.project === current.id);
    let todos = project[0].todos;
    // filter by priority
    let prioritySort = document.getElementById("priority-sort");
    if (prioritySort.value !== "all" && prioritySort.value !== "priority") {
      todos = todos.filter(todo => todo.priority === prioritySort.value);
    }
    let todoList = document.getElementById("todos");
    todoList.innerHTML = "";
    
    todos.forEach(function(todo, index) {
      let bullet = document.createElement("div");
      bullet.classList.add("todo-item");
      bullet.id="todo-item" + index;
      
      let item = document.createElement("div");
      item.textContent = todo.item;
      item.id = "item" + index;
      
      let due = document.createElement("div");
      due.textContent = format(parseISO(todo.dueDate), "MM/dd/yyyy");
      due.id = "dueDate" + index;
      
      let priority = document.createElement("div");
      priority.textContent = todo.priority;
      priority.id = "priority" + index;

      let complete = document.createElement("input");
      complete.type = "checkbox";
      complete.id = "check" + index;
      complete.checked = todo.complete;
      complete.onchange = updateComplete;
      if (complete.checked) {
        item.classList.add("complete");
        due.classList.add("complete");
        priority.classList.add("complete");
      }
      
      let editBtn = document.createElement("div");
      editBtn.innerHTML="&#x270D";
      editBtn.id="edit"+index;
      editBtn.classList.add("edit-btn");
      editBtn.onclick = editTodo;

      let delBtn = document.createElement("div");
      delBtn.innerHTML="&#9746";
      delBtn.id="delete"+index;
      delBtn.classList.add("x-btn");
      delBtn.onclick = deleteTodo;

      bullet.appendChild(item);
      bullet.appendChild(due);
      bullet.appendChild(priority);
      bullet.appendChild(complete);
      bullet.appendChild(editBtn);
      bullet.appendChild(delBtn);
      
      todoList.appendChild(bullet);

      let addBtn = document.getElementById("addTodoCont");
      if (addBtn.classList.contains("hidden")) {
        addBtn.classList.remove("hidden");
      }
    })
  }
}

const displayCurrentProj = (event) => {
  let clickedProject = event.target.id;

  // remove active-project class from other ids
  let pastProject = document.querySelector(".active-project");
  if(pastProject) {
    pastProject.classList.remove("active-project");
  }
  
  // add active-project to current element
  let currentProject = document.getElementById(clickedProject);
  currentProject.classList.add("active-project");
  
  // rerender new project todos
  renderCurrentTodos();
}

const toggleMarking = (num) => {
  // toggle item strikethrough as its checked off
  let item = document.getElementById("item"+num);
  let dueDate = document.getElementById("dueDate"+ num);
  let priority = document.getElementById("priority"+num);
  item.classList.toggle("complete");
  dueDate.classList.toggle("complete");
  priority.classList.toggle("complete");
}

const createTodoForm = () => {
  let newTodoForm = document.createElement("form");
  newTodoForm.id = "newTodoForm";
  newTodoForm.classList.add("new-todo-item");

  let newItem = document.createElement("input");
  newItem.id = "newItem";

  let newDuedate = document.createElement("input");
  newDuedate.type = "date";
  newDuedate.id = "newDuedate";
  newDuedate.value = format(new Date(), "yyyy-MM-dd");

  let newPriority = document.createElement("select");
  newPriority.id = "newPriority";
  let choices = ["none", "high", "med", "low"];
  choices.forEach(function(opt) {
    let option = document.createElement("option");
    option.textContent=opt;
    option.value=opt;
    if (opt === "none") {
      option.setAttribute("selected", "selected");
    }
    newPriority.appendChild(option);
  })
  let saveBtn = document.createElement("button");
  saveBtn.textContent="save";
  saveBtn.type = "submit";
  saveBtn.classList.add("save-btn")
  let cancelBtn = document.createElement("div");
  cancelBtn.id = "newTodoFormCancelBtn";
  cancelBtn.classList.add("x-btn");
  cancelBtn.innerHTML="&#9746";

  newTodoForm.appendChild(newItem);
  newTodoForm.appendChild(newDuedate);
  newTodoForm.appendChild(newPriority);
  newTodoForm.appendChild(saveBtn);
  newTodoForm.appendChild(cancelBtn);

  return newTodoForm;
}

const displayTodoForm = () => {
  // generate new todo form
  let newTodoForm = createTodoForm();

  // insert form
  let todoList = document.getElementById("todos");
  todoList.appendChild(newTodoForm);
  
  // hide add todo button
  let addBtn = document.getElementById("addTodoCont")
  addBtn.classList.add("hidden");

  // implement self destruct button (cancel)
  let cancelBtn = document.getElementById(`newTodoFormCancelBtn`);
  cancelBtn.onclick = () => {
    addBtn.classList.remove("hidden");
    todoList.removeChild(newTodoForm);
  }
}

const createEditForm = (index, todo) => {
  let editForm = document.createElement("form");
  editForm.setAttribute("class", "new-todo-item");
  editForm.id="editForm"+index;

  let itemEdit = document.createElement("input");
  itemEdit.type = "text";
  itemEdit.id = "itemEdit"+index;
  itemEdit.value = todo.item;

  let dueDateEdit = document.createElement("input");
  dueDateEdit.type = "date";
  dueDateEdit.id = "dueDateEdit"+index;
  dueDateEdit.value = format(parseISO(todo.dueDate), "yyyy-MM-dd");

  let priorityEdit = document.createElement("select");
  let choices = ["none", "high", "med", "low"];
  choices.forEach(function(opt) {
    let option = document.createElement("option");
    option.textContent=opt;
    option.value=opt;
    if (opt === todo.priority) {
      option.setAttribute("selected", "selected");
    }
    priorityEdit.appendChild(option);
  })
  priorityEdit.id="priorityEdit"+index;

  let saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.textContent="save";
  saveBtn.classList.add("save-btn");
  let cancelBtn = document.createElement("div");
  cancelBtn.id = "editFormCancelBtn"+index;
  cancelBtn.classList.add("x-btn");
  cancelBtn.innerHTML="&#9746";

  editForm.appendChild(itemEdit);
  editForm.appendChild(dueDateEdit);
  editForm.appendChild(priorityEdit);
  editForm.appendChild(saveBtn);
  editForm.appendChild(cancelBtn);

  return editForm;
}
 
const displayEditForm = (index, todo) => {
  // generate the edit form
  let newEditForm = createEditForm(index, todo);

  // insert form and hide original todo
  let currentNode = document.querySelector(`#todo-item${index}`)
  let parent = currentNode.parentNode;
  parent.insertBefore(newEditForm, currentNode);
  currentNode.classList.add("hidden");

  // implement self destruct button (cancel)
  let cancelBtn = document.getElementById(`editFormCancelBtn${index}`);
  cancelBtn.onclick = () => {
    currentNode.classList.remove("hidden");
    // let editForm = document.getElementById(`editForm${index}`);
    parent.removeChild(newEditForm);
  }
}

const createProjectForm = () => {
  let newProjectForm = document.createElement("form");
  newProjectForm.classList.add("form-header");
  newProjectForm.id = "newProjectForm";
  let inputDiv = document.createElement("span");
  let newProject = document.createElement("input");
  newProject.id = "newProject";
  newProject.style = "width:9em";

  let saveBtn = document.createElement("button");
  saveBtn.type="submit";
  saveBtn.textContent="save";
  saveBtn.classList.add("save-btn");
  let cancelBtn = document.createElement("div");
  cancelBtn.id = "newProjectFormCancelBtn";
  cancelBtn.classList.add("x-btn");
  cancelBtn.innerHTML="&#9746";

  inputDiv.appendChild(newProject);
  inputDiv.appendChild(saveBtn);
  newProjectForm.appendChild(inputDiv);
  newProjectForm.appendChild(cancelBtn);

  return newProjectForm;
}

const displayProjectForm = () => {
  let newProjectForm = createProjectForm();

  // insert form
  let projectList = document.getElementById("project-list");
  projectList.appendChild(newProjectForm);

  // hide add todo button
  let addBtn = document.getElementById("addProjCont");
  addBtn.classList.add("hidden");

  // implement self destruct button (cancel)
  let cancelBtn = document.getElementById(`newProjectFormCancelBtn`);
  cancelBtn.onclick = () => {
    addBtn.classList.remove("hidden");
    projectList.removeChild(newProjectForm);
  }
}

export {
  displayCurrentProj,
  displayTodoForm,
  displayEditForm,
  displayProjectForm,
  toggleMarking,
  renderProjects,
  renderCurrentTodos
}
