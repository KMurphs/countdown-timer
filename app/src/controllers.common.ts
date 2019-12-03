import model, { getDefaultSprint, Task, TaskStatus, getInvalidSprint } from './model/model'


export type TProject = {
  index: number|null, 
  name: string, 
  key: string
}






const addProject = (newProject: string): TProject => {

  let nProjects = Object.keys(model)
  let projectKey = `${nProjects.length}::${newProject}`

  !model[projectKey] && (model[projectKey] = []) && (model[projectKey].push(getDefaultSprint()))

  return {index: nProjects.length, name: newProject, key: projectKey}
}
const getProjectByIndex = function(projectIndex: number):TProject {
  // Look for actual project key that has the form  <Some Index>::<projectName>
  // Extract index when found
  let project: TProject = {index: null, name: '', key: ''}
  Object.keys(model).forEach(projectKey => {
    const [_index, name] = projectKey.split('::');
    const index = parseInt(_index);
    (index === projectIndex) && (project.index = index);
    (index === projectIndex) && (project.name = name);
    (index === projectIndex) && (project.key = projectKey);
  })
  return project
}
const getProjectByName = (projectName: string):TProject => {
  // Look for actual project key that has the form  <Some Index>::<projectName>
  // Extract name when found
  let project: TProject = {index: null, name: '', key: ''}
  Object.keys(model).forEach(projectKey => {
    const [_index, name] = projectKey.split('::');
    const index = parseInt(_index);
    (name === projectName) && (project.index = index);
    (name === projectName) && (project.name = name);
    (name === projectName) && (project.key = projectKey);
  })
  return project
}
const updateProject = (projectID: number, newName: string): string  => {

  // Each project is appended with the length of the array at the moment it was inserted as its index (i.e. <Some Index>::<Awesome Project Name>)
  const {name} = getProjectByIndex(projectID)
  let _oldName = `${projectID}::${name}`
  let _newName = `${projectID}::${newName}`


  // Since the key <index>::<oldName> was found,
  // Create newkey as <index>::<newName>
  // Transfer Data from old key to new key
  // Delete old key <index>::<oldName>
  if(name !== ''){
    let tmpTasks = model[_oldName]
    delete model[_oldName]
    model[_newName] = tmpTasks
  }

  return _newName
}
const getProjects = ():TProject[] => {
  return Object.keys(model).map(key => {
    const [_index, name] = key.split('::')
    const index = parseInt(_index)
    return {index, name, key}
  })
}








const getTaskByIndex = (owningProjectID: number, taskID: number): Task  => {

  let owningProject = getProjectByIndex(owningProjectID)
  if(owningProject.index === null){
    return getInvalidSprint()
  }

  let [task] = model[owningProject.key].filter(tmpTask => tmpTask.ID === taskID)

  return task
}
const addTask = (owningProjectID: number, newTaskName: string): number|null  => {
  let newTaskID: number|null = null
  let owningProject = getProjectByIndex(owningProjectID)

  // Only proceed if owningProject is already registered
  if(model[owningProject.key]){

    // Ensure that a task with the same name does not already exists
    let isTaskAlreadyPresent = false
    model[owningProject.key].forEach(task => (isTaskAlreadyPresent = isTaskAlreadyPresent || task.Name === newTaskName))

    // If task with this name does not exist, create task and push it to "owningProject"
    // Then reorder task, so that the new task is first in line
    if(!isTaskAlreadyPresent){
      let newTask = getDefaultSprint()
      newTask.Name = newTaskName
      newTaskID = newTask.ID
      model[owningProject.key].push(newTask)
      model[owningProject.key].forEach(task => task.No = (task.Name === newTaskName ? 1 : (task.No + 1)))
    }
  }

  return newTaskID
}
const updateTask = (owningProjectID: number, taskID: number, data:{[key:string]:any}): number  => {

  // Each project is appended with the length of the array at the moment it was inserted as its index (i.e. <Some Index>::<Awesome Project Name>)
  const {key: projectKey} = getProjectByIndex(owningProjectID)

  // Only 3 fields can be updated by the user: No, Name, DurationMs
  model[projectKey].forEach(task => {
    if(task.ID === taskID){
      Object.keys(data).forEach(field => { 
        switch(field){
          case 'No':
            typeof data.No === 'number' && (task.No = data.No)
            break
          case 'Name':
            typeof data.Name === 'string' && (task.Name = data.Name)
            break
          case 'DurationMs':
            typeof data.DurationMs === 'number' && (task.DurationMs = data.DurationMs)
            break
          default:
            break
        }
      })
    } 
  })

  return taskID
}
const getNextValidTask = (owningProjectID: number|null, currentTaskID: number|null): number|null => {
  let owningProject
  let nextTasks
  let nextTask = null

  // Ensure we have valid project and task
  if(owningProjectID !== null && currentTaskID !== null){

    // Get owning project
    owningProject = getProjectByIndex(owningProjectID);
    if(owningProject.index === null){
      return nextTask
    }

    // Sort task by ascending task Nos, and take task which can be run (i.e are not completed yet)
    nextTasks = model[owningProject.key].sort((a,b) => a.No - b.No)
                                        .filter(task => (task.Status !== TaskStatus.COMPLETED)||(task.ID===currentTaskID));

    // Search for current task index in the filtered results, 
    // and take next index as the index of the task that must be returned
    let nextTaskIdx = null;
    nextTasks.forEach((task, index) => (task.ID===currentTaskID) && (nextTaskIdx = index + 1));
    if(nextTaskIdx !== null){
      (nextTaskIdx >= nextTasks.length) && (nextTaskIdx = 0);
      nextTask = nextTasks[nextTaskIdx].ID
    }
  }

  return nextTask
}
const getPreviousValidTask = (owningProjectID: number|null, currentTaskID: number|null): number|null => {
  let owningProject
  let prevTasks
  let prevTask = null

  // Ensure we have valid project and task
  if(owningProjectID !== null && currentTaskID !== null){

    // Get owning project
    owningProject = getProjectByIndex(owningProjectID);
    if(owningProject.index === null){
      return prevTask
    }

    // Sort task by ascending task ids, and take task which can be run (i.e are not completed yet)
    prevTasks = model[owningProject.key].sort((a,b) => a.No - b.No)
                                        .filter(task => (task.Status !== TaskStatus.COMPLETED)||(task.ID===currentTaskID));
                                        
    // Search for current task index in the filtered results, 
    // and take prev index as the index of the task that must be returned
    let prevTaskIdx = null;
    prevTasks.forEach((task, index) => (task.ID===currentTaskID) && (prevTaskIdx = index - 1));
    if(prevTaskIdx !== null){
      (prevTaskIdx < 0) && (prevTaskIdx = prevTasks.length - 1);
      prevTask = prevTasks[prevTaskIdx].ID
    }
  }

  return prevTask
}



export {
  getProjects,
  addProject,
  getProjectByIndex,
  getProjectByName,
  updateProject,
  
  getTaskByIndex,
  addTask,
  updateTask,
  getNextValidTask,
  getPreviousValidTask
}