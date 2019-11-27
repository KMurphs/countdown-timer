import Controller from './mainController'
import model from './model/model'

let controller = new Controller()


describe('Main Controller Functions', ()=>{
  test('Can Get Controller Version', ()=>{
    expect(controller.getVersion()).toBe('2.0')
  })
  test('Can Add a New Project', ()=>{
    let newProject = new Date().getTime() + ''
    controller.addProject(newProject)
    expect(Object.keys(model)).toContain(newProject)
  })
})