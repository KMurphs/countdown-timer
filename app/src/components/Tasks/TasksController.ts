import {getProjectByIndex} from '../../controllers.common'
import model, { TaskStatus } from '../../model/model'

export type UITask = {
  ID: number,
  Name: string,
  DurationMs: number,
  Status: TaskStatus,
  No: number,
}

type TimeObject = {
  isNeg: boolean,
  hours: number,
  minutes: number,
  seconds: number,
}

const getTasks = (owningProjectID: number): UITask[] => {

  const {index, key: projectKey} = getProjectByIndex(owningProjectID)

  return index !== null 
  ? model[projectKey].map(task => {
    return {
      DurationMs: task.DurationMs, 
      ID: task.ID, 
      Name: task.Name, 
      Status: task.Status,
      No: task.No,
    }
  }) 
  : []
}


const formatElapsedTime = (elapsedTimeSec: number|null): string => {
  return elapsedTimeSec === null ? '00:00' : convertTimeObjectToString(convertMsToTimeObject(elapsedTimeSec*1000))
}


const convertMsToTimeObject = (durationMs: number): TimeObject => {
  
  let ms = Math.abs(durationMs)
  let res: TimeObject = {
    isNeg: durationMs < 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  
  
  res.hours = Math.floor(ms/3600000)
  res.minutes = Math.floor((ms - res.hours*3600000)/60000)
  res.seconds = Math.floor((ms - res.hours*3600000 - res.minutes*60000)/1000)


  return res
}


// Recursive function to prepend 0s to time fields when fields have less than 2 chars
const padTimeField = (timeField: string, width: number = 2):string => timeField.length < width ? padTimeField('0'+timeField, width) : timeField


const convertTimeObjectToString = ({isNeg, hours, minutes, seconds}: TimeObject) => {
  return `${isNeg?'-':' '}${padTimeField(Math.abs(hours)+'')}:${padTimeField(Math.floor(minutes)+'')}:${padTimeField(Math.floor(seconds)+'')}`
}
export { getTasks, formatElapsedTime, convertMsToTimeObject, convertTimeObjectToString }
