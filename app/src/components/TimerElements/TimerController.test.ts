import Controller from './timerController'
import model, { TaskStatus } from '../../model/model'
import { getProjects } from '../../controllers.common'
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



describe('Main Controller Functions', ()=>{
  test('Can Get Controller Version', ()=>{
    expect(controller.getVersion()).toBe('2.0')
  })
  test('Elapsed Time when not running is DurationMs', ()=>{
    expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBe(task.DurationMs/1000)
    expect(task.Status).toBe(TaskStatus.SCHEDULED)
  })
  test('Task Starts countdown', ()=>{
    let timeoutScheduleMs: number
    
    expect(task.Status).toBe(TaskStatus.SCHEDULED)
    expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBe(task.DurationMs/1000)
    controller.start(projectID, task.ID)

    timeoutScheduleMs = 200
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((task.DurationMs - timeoutScheduleMs + 1)/1000)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((task.DurationMs - timeoutScheduleMs - 1)/1000)
    }, timeoutScheduleMs)
    
    timeoutScheduleMs = 300
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((task.DurationMs - timeoutScheduleMs + 1)/1000)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((task.DurationMs - timeoutScheduleMs - 1)/1000)
    }, timeoutScheduleMs)
  })
  test('Task Pauses countdown', ()=>{
    let timeoutScheduleMs: number
    let elapsedSecs: number|null

    timeoutScheduleMs = 400
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      controller.pause(projectID, task.ID)
      expect(elapsedSecs === null).toBe(false)
    }, timeoutScheduleMs)

    timeoutScheduleMs = 500
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.PAUSED)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBe(elapsedSecs)
      expect(elapsedSecs === null).toBe(false)
    }, timeoutScheduleMs)
    
    timeoutScheduleMs = 600
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.PAUSED)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBe(elapsedSecs)
      expect(elapsedSecs === null).toBe(false)
    }, timeoutScheduleMs)
  })
  test('Task Resumes countdown', ()=>{
    let timeoutScheduleMs: number
    let _elapsedSecs: number|null
    let elapsedSecs: number

    timeoutScheduleMs = 700
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.PAUSED)
      _elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      controller.resume(projectID, task.ID)
      expect(_elapsedSecs === null).toBe(false)
      elapsedSecs = _elapsedSecs === null ? -1 : _elapsedSecs
    }, timeoutScheduleMs)

    timeoutScheduleMs = 800
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((elapsedSecs + 100 + 1)/1000)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((elapsedSecs + 100 - 1)/1000)
    }, timeoutScheduleMs)
    
    timeoutScheduleMs = 900
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeGreaterThan((elapsedSecs + 200 + 1)/1000)
      expect(controller.getElapsedTimeInSec(projectID, task.ID)).toBeLessThan((elapsedSecs + 200 - 1)/1000)
    }, timeoutScheduleMs)
  })
  test('Task Stops countdown', ()=>{
    let timeoutScheduleMs: number
    let elapsedSecs: number|null

    timeoutScheduleMs = 1000
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      controller.stop(projectID, task.ID)
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      expect(task.Status).toBe(TaskStatus.COMPLETED)
      expect(elapsedSecs === null).toBe(false)
      expect(elapsedSecs).toBe(task.DurationMs/1000)
    }, timeoutScheduleMs)

    timeoutScheduleMs = 1050
    setTimeout(()=>{
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      expect(task.Status).toBe(TaskStatus.COMPLETED)
      expect(elapsedSecs === null).toBe(false)
      expect(elapsedSecs).toBe(task.DurationMs/1000)
    }, timeoutScheduleMs)
    
    timeoutScheduleMs = 1100
    setTimeout(()=>{
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      expect(task.Status).toBe(TaskStatus.COMPLETED)
      expect(elapsedSecs === null).toBe(false)
      expect(elapsedSecs).toBe(task.DurationMs/1000)
    }, timeoutScheduleMs)
  })
  test('Task Restarts countdown', ()=>{
    let timeoutScheduleMs: number
    let elapsedSecs: number|null

    timeoutScheduleMs = 1200
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.COMPLETED)
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      expect(elapsedSecs === null).toBe(false)
      expect(elapsedSecs).toBe(task.DurationMs/1000)

      controller.restart(projectID, task.ID)
      
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      expect(elapsedSecs === null).toBe(false)
      expect(elapsedSecs).toBeGreaterThan(task.DurationMs - 1/1000)
      expect(elapsedSecs).toBeLessThan(task.DurationMs + 1/1000)
    }, timeoutScheduleMs)

    timeoutScheduleMs = 1300
    setTimeout(()=>{
      expect(task.Status).toBe(TaskStatus.EXECUTING)
      elapsedSecs = controller.getElapsedTimeInSec(projectID, task.ID)
      expect(elapsedSecs === null).toBe(false)
      expect(elapsedSecs).toBeGreaterThan(task.DurationMs - 100 - 1/1000)
      expect(elapsedSecs).toBeLessThan(task.DurationMs -100 + 1/1000)
    }, timeoutScheduleMs)

  })
})