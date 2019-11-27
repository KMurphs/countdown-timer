import { getProjects } from './ProjectsController'
let projects: string[]

describe('Project Controller', ()=>{
  test('Can obtain current projects', ()=>{
    projects = getProjects()
    // console.log(projects)
    expect(projects.constructor.name).toBe('Array')
    expect(projects.length).toBeGreaterThan(1)
  })
})