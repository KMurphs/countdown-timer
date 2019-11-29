import { Task, TaskStatus, getInvalidSprint } from '../../model/model'
import { getTaskByIndex, getProjectByIndex } from '../../controllers.common'

interface Controller {
  version: string,
  model: {[key: string]: Task[]},
  getVersion: ()=>string,
  start: (projectID: number|null, taskID: number|null)=>Task,
  pause: (projectID: number|null, taskID: number|null)=>Task,
  resume: (projectID: number|null, taskID: number|null)=>Task,
  stop: (projectID: number|null, taskID: number|null)=>Task,
  restart: (projectID: number|null, taskID: number|null)=>Task,
  restartProject: (projectID: number|null)=>number|null,
  getElapsedTimeInSec: (projectID: number|null, taskID: number|null)=> number|null,
}


// Constructor Function
let Controller = function(this: Controller, model: {[key: string]: Task[]}) {
  this.model = model
  this.version = '2.0'
} as any as {new (model: {[key: string]: Task[]}): Controller}


// Get Version
Controller.prototype.getVersion = function(this: Controller){
  return this.version
}



// Start Timer for task with some JID
Controller.prototype.start = function(this: Controller, projectID: number|null, taskID: number|null): Task{
  let task: Task = getInvalidSprint()
  let now = new Date().getTime()

  // Ensure we have valid project and task
  if(projectID !== null && taskID !== null){
    task = getTaskByIndex(projectID, taskID)

    // Only proceed if task is scheduled
    if(task.Status === TaskStatus.SCHEDULED){
      task.StartedAt = now
      task.OpStart = task.StartedAt
      task.Status = TaskStatus.EXECUTING
    }
  }

  return {...task}
}

// Pause Timer
Controller.prototype.pause = function(this: Controller, projectID: number|null, taskID: number|null): Task{
  let task: Task = getInvalidSprint()
  let now = new Date().getTime()

  // Ensure we have valid project and task
  if(projectID !== null && taskID !== null){
    task = getTaskByIndex(projectID, taskID)

    // Only proceed if task is running
    if(task.Status === TaskStatus.EXECUTING){
      task.PausedAt = now
      task.Status = TaskStatus.PAUSED
    }
  }

  return {...task}
}
Controller.prototype.resume = function(this: Controller, projectID: number|null, taskID: number|null): Task{
  let task: Task = getInvalidSprint()
  let now = new Date().getTime()

  // Ensure we have valid project and task
  if(projectID !== null && taskID !== null){
    task = getTaskByIndex(projectID, taskID)

    // Only proceed if task is running
    if(task.Status === TaskStatus.PAUSED){

      // Save this Pause Time span before re-enabling the timer
      task.Pauses.push({
        lapsMoment: task.PausedAt,
        lapsDuration: now - task.PausedAt
      })
      task.PausedAt = -1
      task.OpStart = task.OpStart + now - task.PausedAt
      task.Status = TaskStatus.EXECUTING
    }
  }

  return {...task}
}
Controller.prototype.stop = function(this: Controller, projectID: number|null, taskID: number|null): Task{
  let task: Task = getInvalidSprint()
  let now = new Date().getTime()

  // Ensure we have valid project and task
  if(projectID !== null && taskID !== null){
    task = getTaskByIndex(projectID, taskID)


    if(task.Status !== TaskStatus.COMPLETED){

      switch(task.Status){

        // If Paused, saved pause time span, and reset task
        case TaskStatus.PAUSED:
          task.Pauses.push({
            lapsMoment: task.PausedAt,
            lapsDuration: now - task.PausedAt
          })
          task.PausedAt = -1
          task.OpStart = -1
          task.StartedAt = -1
          task.Status = TaskStatus.COMPLETED
          break

        // If Running, saved run time span, and reset task
        case TaskStatus.EXECUTING:
          task.Runs.push({
            lapsMoment: task.StartedAt,
            lapsDuration: now - task.StartedAt
          })
          task.PausedAt = -1
          task.OpStart = -1
          task.StartedAt = -1
          task.Status = TaskStatus.COMPLETED
          break

        // If was never started, reset task
        case TaskStatus.SCHEDULED:
          task.PausedAt = -1
          task.OpStart = -1
          task.StartedAt = -1
          task.Status = TaskStatus.COMPLETED
          break
      }
    }
  }

  return {...task}
}

Controller.prototype.restart = function(this: Controller, projectID: number|null, taskID: number|null): Task{
  let task: Task = getInvalidSprint()

  // Ensure we have valid project and task
  if(projectID !== null && taskID !== null){
    task = getTaskByIndex(projectID, taskID)
    task.PausedAt = -1
    task.OpStart = -1
    task.StartedAt = -1
    task.Status = TaskStatus.SCHEDULED
  }

  return {...task}
}
Controller.prototype.restartProject = function(this: Controller, projectID: number|null): number|null{

  // Ensure we have valid project
  if(projectID !== null){
    let {key: projectKey} = getProjectByIndex(projectID)

    // Restart all tasks belonging to this project
    this.model[projectKey].forEach(task => this.restart(projectID, task.ID))
  }

  return projectID
}


Controller.prototype.getElapsedTimeInSec = function(this: Controller, projectID: number|null, taskID: number|null): number|null{

  let task: Task = getInvalidSprint()
  let now = new Date().getTime()
  let msValue = null

  if(projectID !== null && taskID !== null){
    task = getTaskByIndex(projectID, taskID)

    // Timer has not started
    msValue = task.DurationMs 
    

    // Timer has started
    if(task.Status === TaskStatus.EXECUTING){
      msValue = task.DurationMs - now + task.OpStart
    }

    // Timer is paused
    if(task.Status === TaskStatus.PAUSED){
      msValue = task.PausedAt - task.OpStart
    }

  }

  return msValue === null ? null : msValue/1000
}

export default Controller