import { getProjects } from './ProjectsController'
type TProject = {
  index: number;
  name: string;
}
let projects: TProject[]

describe('Project Controller', ()=>{
  test('Can obtain current projects', ()=>{
    projects = getProjects()
    // console.log(projects)
    expect(projects.constructor.name).toBe('Array')
    expect(projects.length).toBeGreaterThan(1)
  })
})