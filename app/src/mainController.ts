import { Task, getDefaultSprint } from './model/model'

interface Controller {
  version: string,
  model: {[key: string]: Task[]},
  // defaultDurationMs: number,
  getVersion: ()=>string,
  getProjectByIndex: (projectIndex: number)=>{index: number, name: string, key: string},
  getProjectByName: (projectName: string)=>{index: number, name: string, key: string},
  addProject: (newProject: string)=>{index: number, name: string, key: string},
  updateProject: (projectID: number, newName: string)=>string,
  addTask: (owningProjectID: number, newTask: string)=>number|null,
  updateTask: (owningProjectID: number, taskID: number, data:{[key:string]:any}) => number,
}

let Controller = function(this: Controller, model: {[key: string]: Task[]}) {
  // const defaultDurationMin = 20

  // this.defaultDurationMs = defaultDurationMin * 60
  this.model = model
  this.version = '2.0'



} as any as {new (model: {[key: string]: Task[]}): Controller}

Controller.prototype.getVersion = function(this: Controller){
  return this.version
}







Controller.prototype.addProject = function(this: Controller, newProject: string): {index: number, name: string, key: string}{

  let nProjects = Object.keys(this.model)
  let projectKey = `${nProjects.length}::${newProject}`

  !this.model[projectKey] && (this.model[projectKey] = []) && (this.model[projectKey].push(getDefaultSprint()))

  return {index: nProjects.length, name: newProject, key: projectKey}
}
Controller.prototype.getProjectByIndex = function(this: Controller, projectIndex: number):{index: number, name: string, key: string} {
  // Look for actual project key that has the form  <Some Index>::<projectName>
  // Extract index when found
  let project = {index: projectIndex, name: '', key: ''}
  Object.keys(this.model).forEach(projectKey => {
    const [_index, name] = projectKey.split('::');
    const index = parseInt(_index);
    (index === projectIndex) && (project.name = name);
    (index === projectIndex) && (project.key = `${index}::${name}`);
  })
  return project
}
Controller.prototype.getProjectByName = function(this: Controller, projectName: string):{index: number, name: string, key: string} {
  // Look for actual project key that has the form  <Some Index>::<projectName>
  // Extract name when found
  let project = {index: -1, name: projectName, key: ''}
  Object.keys(this.model).forEach(projectKey => {
    const [_index, name] = projectKey.split('::');
    const index = parseInt(_index);
    (name === projectName) && (project.index = index);
    (name === projectName) && (project.key = `${index}::${name}`);
  })
  return project
}
Controller.prototype.updateProject = function(this: Controller, projectID: number, newName: string): string{

  // Each project is appended with the length of the array at the moment it was inserted as its index (i.e. <Some Index>::<Awesome Project Name>)
  const {index, name} = this.getProjectByIndex(projectID)
  let _oldName = `${projectID}::${name}`
  let _newName = `${projectID}::${newName}`


  // Since the key <index>::<oldName> was found,
  // Create newkey as <index>::<newName>
  // Transfer Data from old key to new key
  // Delete old key <index>::<oldName>
  if(name !== ''){
    let tmpTasks = this.model[_oldName]
    delete this.model[_oldName]
    this.model[_newName] = tmpTasks
  }

  return _newName
}




















Controller.prototype.addTask = function(this: Controller, owningProjectID: number, newTaskName: string): number|null{
  let newTaskID: number|null = null
  let owningProject = this.getProjectByIndex(owningProjectID)

  // Only proceed if owningProject is already registered
  if(this.model[owningProject.key]){

    // Ensure that a task with the same name does not already exists
    let isTaskAlreadyPresent = false
    this.model[owningProject.key].forEach(task => (isTaskAlreadyPresent = isTaskAlreadyPresent || task.Name === newTaskName))

    // If task with this name does not exist, create task and push it to "owningProject"
    // Then reorder task, so that the new task is first in line
    if(!isTaskAlreadyPresent){
      let newTask = getDefaultSprint()
      newTask.Name = newTaskName
      newTaskID = newTask.ID
      this.model[owningProject.key].push(newTask)
      this.model[owningProject.key].forEach(task => task.No = (task.Name === newTaskName ? 1 : (task.No + 1)))
    }
  }

  return newTaskID
}
Controller.prototype.updateTask = function(this: Controller, owningProjectID: number, taskID: number, data:{[key:string]:any}): number{

  // Each project is appended with the length of the array at the moment it was inserted as its index (i.e. <Some Index>::<Awesome Project Name>)
  const {key: projectKey} = this.getProjectByIndex(owningProjectID)

  // Only 3 fields can be updated by the user: No, Name, DurationMs
  this.model[projectKey].forEach(task => {
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



export default Controller