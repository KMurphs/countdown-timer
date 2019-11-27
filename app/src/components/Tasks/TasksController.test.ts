import { getTasks, UITask, convertMsToTimeObject } from './TasksController'
import model from '../../model/model'

let owningProject = Object.keys(model)[0]
let tasks: UITask[]

describe('Project Controller', ()=>{
  
  test(`Can obtain current tasks for project ${owningProject}`, ()=>{
    tasks = getTasks(owningProject)
    // console.log(tasks)
    expect(tasks.constructor.name).toBe('Array')
    expect(tasks.length).toBeGreaterThan(1)
  })

  test('Can convert Duration in Millisecond to TimeObject', ()=>{
    let ms = 7375000
    let timeObj: any

    timeObj = convertMsToTimeObject(ms)
    expect(timeObj).toHaveProperty('hours', 2)
    expect(timeObj).toHaveProperty('minutes', 2)
    expect(timeObj).toHaveProperty('seconds', 55)
    
    timeObj = convertMsToTimeObject(-1*ms)
    expect(timeObj).toHaveProperty('hours', -2)
    expect(timeObj).toHaveProperty('minutes', 2)
    expect(timeObj).toHaveProperty('seconds', 55)

  })
})