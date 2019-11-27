import model, { TaskStatus } from '../../model/model'

export type UITask = {
  ID: number,
  Name: string,
  DurationMs: number,
  Status: TaskStatus,
}

type TimeObject = {
  hours: number,
  minutes: number,
  seconds: number,
}

const getTasks = (owningProject: string): UITask[] => {
  return model[owningProject].map(task => {
    return {
      DurationMs: task.DurationMs, 
      ID: task.ID, 
      Name: task.Name, 
      Status: task.Status
    }
  })
}


const getElapsedTime = (owningProject: string, taskID: number): string => {
  return `${Math.floor(Math.random()*10)}:${Math.floor(Math.random()*60)}:${Math.floor(Math.random()*60)}`
}


const convertMsToTimeObject = (durationMs: number): TimeObject => {
  
  let ms = Math.abs(durationMs)
  let res: TimeObject = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  
  
  res.hours = Math.floor(ms/3600000)
  res.minutes = Math.floor((ms - res.hours*3600000)/60000)
  res.seconds = Math.floor((ms - res.hours*3600000 - res.minutes*60000)/1000)

  durationMs < 0 && (res.hours = res.hours * -1)

  return res
}
export { getTasks, getElapsedTime, convertMsToTimeObject }
