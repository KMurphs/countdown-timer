import model, { Task, getDefaultSprint } from './model/model'

interface Controller {
  version: string,
  model: {[key: string]: Task[]},
  defaultDurationMs: number,
  getVersion: ()=>string
  addProject: (newProject: string)=>void
}

let Controller = function(this: Controller, model: {[key: string]: Task[]}) {
  const defaultDurationMin = 20

  this.defaultDurationMs = defaultDurationMin * 60
  this.model = model
  this.version = '2.0'



} as any as {new (): Controller}

Controller.prototype.getVersion = function(this: Controller){
  return this.version
}
Controller.prototype.addProject = function(this: Controller, newProject: string){
  !model[newProject] && (model[newProject] = []) && (model[newProject].push(getDefaultSprint()))
}




export default Controller