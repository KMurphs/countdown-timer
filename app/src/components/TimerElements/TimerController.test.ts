import Controller from './timerController'
import model, { TaskStatus } from '../../model/model'
import { getProjects, getTaskByIndex } from '../../controllers.common'
import { getTasks } from '../Tasks/TasksController'

let controller = new Controller(model)
let projects = getProjects()
let {index: projectID} = projects[0]
let tasks = projectID === null ? [] : getTasks(projectID) 
let task = tasks[0]

// UITask:
//   - ID: number,
//   - Name: string,
//   - DurationMs: number,
//   - Status: TaskStatus,


jest.setTimeout(10000)

describe('Main Controller Functions', ()=>{
  const getTaskStatus = (projectID: number|null, taskID: number) => getTaskByIndex(projectID === null ? -1 : projectID, taskID).Status
  test('Can Get Controller Version', ()=>{
    expect(controller.getVersion()).toBe('2.0')
  })
  test('Elapsed Time when not running is DurationMs', ()=>{
    expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBe(task.DurationMs/1000)
    expect(task.Status).toBe(TaskStatus.SCHEDULED)
  })
  test('Task Starts countdown', async ()=>{
    let timeoutScheduleMs: number
    
    expect(task.Status).toBe(TaskStatus.SCHEDULED)
    expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBe(task.DurationMs/1000)
    controller.start(projectID, task.ID)

    
    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        let elapsedTime = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        expect(elapsedTime).toBeGreaterThan((task.DurationMs - timeoutScheduleMs - 100)/1000)
        expect(elapsedTime).toBeLessThan((task.DurationMs - timeoutScheduleMs + 100)/1000)
        resolve()
      }, timeoutScheduleMs)
    })

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        let elapsedTime = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        expect(elapsedTime).toBeGreaterThan((task.DurationMs - 2*timeoutScheduleMs - 100)/1000)
        expect(elapsedTime).toBeLessThan((task.DurationMs - 2*timeoutScheduleMs + 100)/1000)
        resolve()
      }, timeoutScheduleMs)
    })
  })
  test('Task Pauses countdown', async()=>{
    let timeoutScheduleMs: number
    let elapsedTime: number|null = null

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        elapsedTime = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        expect(elapsedTime).toBeGreaterThan((task.DurationMs - 3*timeoutScheduleMs - 100)/1000)
        expect(elapsedTime).toBeLessThan((task.DurationMs - 3*timeoutScheduleMs + 100)/1000)
        resolve()
      }, timeoutScheduleMs)
    })

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        elapsedTime = controller.getElapsedTimeInSec(projectID, task.ID)
        controller.pause(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.PAUSED)
        expect(controller.getElapsedTimeInSec(projectID, task.ID) === null).toBe(false)
        elapsedTime !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((elapsedTime - 0.002))
        elapsedTime !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((elapsedTime + 0.002))
        resolve()
      }, timeoutScheduleMs)
    })

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        expect(controller.getElapsedTimeInSec(projectID, task.ID) === null).toBe(false)
        elapsedTime !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((elapsedTime - 0.002))
        elapsedTime !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((elapsedTime + 0.002))
        resolve()
      }, timeoutScheduleMs)
    })
  })
  test('Task Resumes countdown', async()=>{
    let timeoutScheduleMs: number
    let elapsedSecs: number|null

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(elapsedSecs === null).toBe(false)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.PAUSED)
        controller.resume(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        resolve()
      }, timeoutScheduleMs)
    })


    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        expect(elapsedSecs === null).toBe(false)
        elapsedSecs !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((elapsedSecs - 0.300))
        elapsedSecs !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((elapsedSecs + 0.300))
        resolve()
      }, timeoutScheduleMs)
    })

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        expect(elapsedSecs === null).toBe(false)
        elapsedSecs !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((elapsedSecs - 0.500))
        elapsedSecs !== null && expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((elapsedSecs + 0.500))
        resolve()
      }, timeoutScheduleMs)
    })
  })

  test('Task Stops countdown', async()=>{
    let timeoutScheduleMs: number
    let elapsedSecs: number|null

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        controller.stop(projectID, task.ID)
        elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.COMPLETED)
        expect(elapsedSecs === null).toBe(false)
        elapsedSecs !== null && expect(elapsedSecs).toBe(task.DurationMs/1000)
        resolve()
      }, timeoutScheduleMs)
    })

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.COMPLETED)
        expect(elapsedSecs === null).toBe(false)
        elapsedSecs !== null && expect(elapsedSecs).toBe(task.DurationMs/1000)
        resolve()
      }, timeoutScheduleMs)
    })
    
    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.COMPLETED)
        expect(elapsedSecs === null).toBe(false)
        elapsedSecs !== null && expect(elapsedSecs).toBe(task.DurationMs/1000)
        resolve()
      }, timeoutScheduleMs)
    })
  })

  test('Task Restarts countdown', async()=>{
    let timeoutScheduleMs: number
    let elapsedSecs: number|null


    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.COMPLETED)
        elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(elapsedSecs === null).toBe(false)
        elapsedSecs !== null && expect(elapsedSecs).toBe(task.DurationMs/1000)

        controller.reset(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.SCHEDULED)
        elapsedSecs !== null && expect(elapsedSecs).toBe(task.DurationMs/1000)

        controller.start(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        resolve()
      }, timeoutScheduleMs)
    })

    await new Promise(resolve => {
      timeoutScheduleMs = 200
      setTimeout(()=>{
        let elapsedTime = controller.getElapsedTimeInSec(projectID, task.ID)
        expect(getTaskStatus(projectID, task.ID)).toBe(TaskStatus.EXECUTING)
        expect(elapsedTime).toBeGreaterThan((task.DurationMs - 1*timeoutScheduleMs - 100)/1000)
        expect(elapsedTime).toBeLessThan((task.DurationMs - 1*timeoutScheduleMs + 100)/1000)
        resolve()
      }, timeoutScheduleMs)
    })

  })
})