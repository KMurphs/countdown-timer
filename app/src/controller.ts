import model, { Task } from './model/model'

interface Controller {
  version: 'v1.0.1',
  model: {[key: string]: Task[]},
  defaultDurationMs: number,
}

let Controller = function(this: Controller, model: {[key: string]: Task[]}) {
  const defaultDurationMin = 20

  this.defaultDurationMs = defaultDurationMin * 60
  this.model = model



} as any as {new (): Controller}

Controller.prototype.getVersion = function(this: Controller){
  return this.version
}




export default Controller