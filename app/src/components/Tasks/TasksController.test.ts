import { getTasks, UITask, convertMsToTimeObject, convertTimeObjectToString } from './TasksController'
import model from '../../model/model'

let [owningProjectID, owningProject] = Object.keys(model)[0].split('::')
let tasks: UITask[]

describe('Task Controller', ()=>{
  
  test(`Can obtain current tasks for project ${owningProject}`, ()=>{
    tasks = getTasks(parseInt(owningProjectID))
    // console.log(tasks)
    expect(tasks.constructor.name).toBe('Array')
    expect(tasks.length).toBeGreaterThan(1)
  })
  
  test(`Can handle undefined project`, ()=>{
    tasks = getTasks(undefined as unknown as number)
    expect(tasks.constructor.name).toBe('Array')
    expect(tasks).toEqual([])
  })

  test('Can convert Duration in Millisecond to TimeObject', ()=>{
    let ms = 7375000
    let timeObj: any

    timeObj = convertMsToTimeObject(+1*ms)
    expect(timeObj).toHaveProperty('isNeg', false)
    expect(timeObj).toHaveProperty('hours', 2)
    expect(timeObj).toHaveProperty('minutes', 2)
    expect(timeObj).toHaveProperty('seconds', 55)
    
    timeObj = convertMsToTimeObject(-1*ms)
    expect(timeObj).toHaveProperty('isNeg', true)
    expect(timeObj).toHaveProperty('hours', 2)
    expect(timeObj).toHaveProperty('minutes', 2)
    expect(timeObj).toHaveProperty('seconds', 55)

  })
  
  test('Can convert Duration TimeObject to string', ()=>{
    let ms:number

    ms = 7375000
    expect(convertTimeObjectToString(convertMsToTimeObject(+1*ms))).toBe(' 02:02:55')
    expect(convertTimeObjectToString(convertMsToTimeObject(-1*ms))).toBe('-02:02:55')

    ms = 2000
    expect(convertTimeObjectToString(convertMsToTimeObject(+1*ms))).toBe(' 00:00:02')
    expect(convertTimeObjectToString(convertMsToTimeObject(-1*ms))).toBe('-00:00:02')
  })
  
})