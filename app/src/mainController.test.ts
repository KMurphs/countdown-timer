import Controller from './mainController'
import model, { TaskStatus } from './model/model'

let controller = new Controller(model)


describe('Main Controller Functions', ()=>{
  test('Can Get Controller Version', ()=>{
    expect(controller.getVersion()).toBe('2.0')
  })
  test('Can Add a New Project and New Task', ()=>{
    let newTask = 'My Awesome Task'
    let {index: projectIndex, key: projectKey} = controller.addProject(new Date().getTime() + '')
    expect(Object.keys(model)).toContain(projectKey)
    let newTaskID = controller.addTask(projectIndex, newTask)


    let lastTask = model[projectKey][model[projectKey].length - 1]
    expect(lastTask).toHaveProperty('Name', newTask)
    expect(lastTask).toHaveProperty('No', 1)
    expect(lastTask).toHaveProperty('DurationMs', 1200000)

    expect(lastTask.ID).toBeGreaterThan(new Date().getTime() - 100)
    expect(lastTask.CreatedAt).toBe(lastTask.ID)
    expect(lastTask.CreatedAt).toBe(newTaskID)
    expect(lastTask.Status).toBe(TaskStatus.SCHEDULED)

    expect(lastTask.OpStart).toBe(0)
    expect(lastTask.PausedAt).toBe(0)
    expect(lastTask.StartedAt).toBe(0)

    expect(lastTask.Runs).toEqual([])
    expect(lastTask.Pauses).toEqual([])
  })
  test('Can Update a Project Name', ()=>{

    let name = new Date().getTime() + '-old'
    let {index: _tmpIndex, key: _tmp} = controller.addProject(name)
    expect(Object.keys(model)).toContain(_tmp)
    let newTaskID = controller.addTask(_tmpIndex, 'Some Awesome Task')

    let _newtmp = controller.updateProject(_tmpIndex, name.replace('-old','-new'))
    expect(model[_tmp]).toBeUndefined()
    expect(Object.keys(model)).toContain(_newtmp)
    expect(model[_newtmp][model[_newtmp].length - 1]).toHaveProperty('ID', newTaskID)

  })
})