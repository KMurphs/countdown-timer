import { getTasks, convertMsToTimeObject, convertTimeObjectToString } from "../Tasks/TasksController"
import { getProjectByName, getTaskByIndex } from "../../controllers.common"
import Controller from "../TimerElements/TimerController"
import { TaskStatus } from "../../model/model"

// import model from '../../model/model'
// import { TProject } from '../../controllers.common'



const getTotalTime = (projectName: string): string => {
  let owningProject = getProjectByName(projectName)
  let totalMs:number = 0

  console.log(owningProject)
  owningProject.index !== null && getTasks(owningProject.index).forEach((task) => {

    let elapsedTime = new Controller({}).getElapsedTimeInSec(owningProject.index, task.ID);
    let currentTask = owningProject.index === null ? null : getTaskByIndex(owningProject.index, task.ID)

    elapsedTime !== null  && currentTask !== null 
                          && task.Status !== TaskStatus.COMPLETED 
                          && task.Status !== TaskStatus.SCHEDULED
                          && (totalMs = totalMs + currentTask.DurationMs - elapsedTime*1000);

    owningProject.index !== null && currentTask !== null 
                                 && currentTask.Runs.forEach(run => totalMs = totalMs + run.runDuration)

    owningProject.index !== null && currentTask !== null 
                                 && currentTask.Pauses.forEach(pause => totalMs = totalMs - pause.pauseDuration)

  })
  console.log(totalMs)

  return convertTimeObjectToString(convertMsToTimeObject(totalMs)) 
}

const getOvertime = (projectName: string): string => {
  let owningProject = getProjectByName(projectName)
  let totalMs:number = 0

  
  owningProject.index !== null && getTasks(owningProject.index).forEach((task) => {

    let elapsedTime = new Controller({}).getElapsedTimeInSec(owningProject.index, task.ID);
    let currentTask = owningProject.index === null ? null : getTaskByIndex(owningProject.index, task.ID)

    elapsedTime !== null && elapsedTime < 0 && currentTask !== null && (totalMs = totalMs + -1*elapsedTime*1000/currentTask.DurationMs);
    currentTask !== null && currentTask.Runs.forEach(run => totalMs = totalMs + run.runOverTime)

  })

  return `${totalMs>0?'+':''}${(totalMs*100).toFixed(2)}`
}
export {  getTotalTime, getOvertime }
