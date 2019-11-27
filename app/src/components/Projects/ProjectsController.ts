import model from '../../model/model'


const getProjects = () => {
  return Object.keys(model)
}
const getTotalTime = (projectName: string): string => {
  return `${Math.floor(Math.random()*10)}:${Math.floor(Math.random()*60)}:${Math.floor(Math.random()*60)}`
}
const getOvertime = (projectName: string): number => {
  return Math.floor(Math.random()*10)-5
}
export { getProjects, getTotalTime, getOvertime }
