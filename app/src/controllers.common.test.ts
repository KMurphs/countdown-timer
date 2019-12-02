import {  
  getProjects,
  addProject,
  getProjectByIndex,
  getProjectByName,
  updateProject,
  addTask,
  updateTask,
  getNextValidTask,
  getPreviousValidTask
} from './controllers.common'

import model, { TaskStatus } from './model/model'
import { getTasks } from './components/Tasks/TasksController'
import Controller from './components/TimerElements/timerController'

let projects = getProjects()
let {index: projectID} = projects[0]
let tasks = projectID === null ? [] : getTasks(projectID) 
let task = tasks[0]



describe('Common Controller Functions', ()=>{
  test('Can obtain current projects', ()=>{
    let projects = getProjects()
    // console.log(projects)
    expect(projects.constructor.name).toBe('Array')
    expect(projects.length).toBeGreaterThan(1)
  })
  test('Can Add a New Project and New Task', ()=>{
    let newTask = 'My Awesome Task'
    let {index: projectIndex, key: projectKey} = addProject(new Date().getTime() + '')
    expect(Object.keys(model)).toContain(projectKey)
    let newTaskID = projectIndex !== null ? addTask(projectIndex, newTask) : -1


    let lastTask = model[projectKey][model[projectKey].length - 1]
    expect(lastTask).toHaveProperty('Name', newTask)
    expect(lastTask).toHaveProperty('No', 1)
    expect(lastTask).toHaveProperty('DurationMs', 1200000)

    expect(lastTask.ID).toBeGreaterThan(new Date().getTime() - 100)
    expect(lastTask.CreatedAt).toBe(lastTask.ID)
    expect(lastTask.CreatedAt).toBe(newTaskID)
    expect(lastTask.Status).toBe(TaskStatus.SCHEDULED)

    expect(lastTask.OpStart).toBe(0)
    expect(lastTask.PausedAt).toBe(0)
    expect(lastTask.StartedAt).toBe(0)

    expect(lastTask.Runs).toEqual([])
    expect(lastTask.Pauses).toEqual([])
  })
  test('Can Update a Project Name', ()=>{

    let name = new Date().getTime() + '-old'
    let {index: _tmpIndex, key: _tmp} = addProject(name)
    expect(Object.keys(model)).toContain(_tmp)
    let newTaskID = _tmpIndex !== null ? addTask(_tmpIndex, 'Some Awesome Task') : -1

    let _newtmp = _tmpIndex !== null ? updateProject(_tmpIndex, name.replace('-old','-new')) : ''
    expect(model[_tmp]).toBeUndefined()
    expect(Object.keys(model)).toContain(_newtmp)
    expect(model[_newtmp][model[_newtmp].length - 1]).toHaveProperty('ID', newTaskID)

  })
  test('Can Update a Task Name', ()=>{

    let oldName = task.Name
    let newName = '123456789'
    projectID !== null && updateTask(projectID, task.ID, {'Name': newName})
    
    let updatedName = projectID !== null && getTasks(projectID).filter(tmpTask => tmpTask.ID === task.ID)[0].Name
    expect(updatedName).toBe(newName)
    expect(updatedName === oldName).toBe(false)
  })
  test('Can Update a Task Duration', ()=>{

    let oldDurationMs = task.DurationMs
    let newDurationMs = 123456789
    projectID !== null && updateTask(projectID, task.ID, {'DurationMs': newDurationMs})
    
    let updatedDuration = projectID !== null && getTasks(projectID).filter(tmpTask => tmpTask.ID === task.ID)[0].DurationMs
    expect(updatedDuration).toBe(newDurationMs)
    expect(updatedDuration === oldDurationMs).toBe(false)
  })
  test('Can Update a Task No', ()=>{

    let oldNo = task.No
    let newNo = oldNo + 1
    projectID !== null && updateTask(projectID, task.ID, {'No': newNo})
    
    let updatedNo = projectID !== null && getTasks(projectID).filter(tmpTask => tmpTask.ID === task.ID)[0].No
    expect(updatedNo).toBe(newNo)
    expect(updatedNo === oldNo).toBe(false)
  })
  test('Can Get Next Valid Task', ()=>{
    let taskIDs = tasks.sort((a,b)=>a.No-b.No).map(task => task.ID)
    let controller = new Controller({...model})
    controller.stop(projectID, taskIDs[taskIDs.length - 1])

    taskIDs.forEach((taskID, index) => {
      projectID !== null && expect(getNextValidTask(projectID, taskID)).toBe(taskIDs[index + 1 >= taskIDs.length - 1 ? 0 : index + 1])
    })
  })
  test('Can Get Previous Valid Task', ()=>{
    let taskIDs = tasks.sort((a,b)=>a.No-b.No).map(task => task.ID)
    let controller = new Controller({...model})
    controller.stop(projectID, taskIDs[taskIDs.length - 1])

    taskIDs.forEach((taskID, index) => {
      projectID !== null && expect(getPreviousValidTask(projectID, taskID)).toBe(taskIDs[index - 1 < 0 ? taskIDs.length - 2 : index - 1])
    })
  })
})


