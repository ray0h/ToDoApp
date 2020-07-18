const newTodo = (item, dueDate, priority, complete=false) => {
  return {item, dueDate, priority, complete}
}

const newProject = (project) => {
  return {project, todos: []}
}

export {
  newTodo,
  newProject
}