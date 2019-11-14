import controller from './controller'
import { SprintStatus } from './model/model'



describe('Controller Module', ()=>{
  test('Has version', ()=>{
    expect(controller.getVersion()).toContain('v')
  })

  test('Queries Projects Name', ()=>{
    expect(controller.getProjectsName().constructor.name).toBe('Array')
  })

  test('Adds Projects Only By Name', ()=>{
    let addedProject = controller.getProjectWithName('Project')

    expect(addedProject.constructor.name).toBe('Array')

    expect(addedProject[0]).toHaveProperty('ID')
    expect(addedProject[0]).toHaveProperty('Name')
    expect(addedProject[0]).toHaveProperty('DurationMs')
    expect(addedProject[0]).toHaveProperty('CreatedAt')
    expect(addedProject[0]).toHaveProperty('No')

    expect(addedProject[0]).toHaveProperty('OpStart', 0)
    expect(addedProject[0]).toHaveProperty('StartedAt', 0)
    expect(addedProject[0]).toHaveProperty('PausedAt', 0)
    
    expect(addedProject[0]).toHaveProperty('Status', 0)
    expect(addedProject[0]).toHaveProperty('Pauses', [])
    expect(addedProject[0]).toHaveProperty('Runs', [])
    expect(controller.getProjectsName()).toContain('Project')
  }) 

  test('Creates New Project When getting one that does not exist', ()=>{
    let addedProject = controller.getProjectWithName('Project+')

    expect(addedProject.constructor.name).toBe('Array')

    expect(addedProject[0]).toHaveProperty('ID')
    expect(addedProject[0]).toHaveProperty('Name')
    expect(addedProject[0]).toHaveProperty('DurationMs')
    expect(addedProject[0]).toHaveProperty('CreatedAt')
    expect(addedProject[0]).toHaveProperty('No')

    expect(addedProject[0]).toHaveProperty('OpStart', 0)
    expect(addedProject[0]).toHaveProperty('StartedAt', 0)
    expect(addedProject[0]).toHaveProperty('PausedAt', 0)
    
    expect(addedProject[0]).toHaveProperty('Status', 0)
    expect(addedProject[0]).toHaveProperty('Pauses', [])
    expect(addedProject[0]).toHaveProperty('Runs', [])
    expect(controller.getProjectsName()).toContain('Project+')
  }) 

  test('Updates Sprint Details on specific project and sprint', ()=>{
    let project = controller.getProjectWithName('Project-')
    let possibleSprintDetails:{[key: string]: any} = {
      'DurationSec': 111,
      'DurationMs': 222,
      'Duration': 333,
      'DurationMin': 335,
    }

    Object.keys(possibleSprintDetails).forEach((sprintDetailKey: string, index: number) => {

      

      let sprintDetailValue = possibleSprintDetails[sprintDetailKey]
      let sprintDetails: {[key: string]: number} = {}
      sprintDetails[sprintDetailKey] = sprintDetailValue
      let addedSprint = controller.setSprintOnProjectWithName(`Project-`, project[0].ID, sprintDetails)

      expect(typeof addedSprint).toBe('object')
      if(sprintDetailKey === 'DurationSec'){
        expect(addedSprint).toHaveProperty('DurationMs', sprintDetailValue * 1000)
      }else if(sprintDetailKey === 'Duration' || sprintDetailKey === 'DurationMin'){
        expect(addedSprint).toHaveProperty('DurationMs', sprintDetailValue * 60 * 1000)
        
      }else{
        expect(addedSprint).toHaveProperty('DurationMs', sprintDetailValue)
      }
      
      expect(addedSprint !== null && typeof addedSprint['DurationMs']).toBe('number')
    })


    let addedSprint = controller.setSprintOnProjectWithName(`Project-`, project[0].ID, {'Name': '444'})
    expect(typeof addedSprint).toBe('object')
    expect(addedSprint).toHaveProperty('Name', '444')
    expect(addedSprint !== null && typeof addedSprint['Name']).toBe('string')

    addedSprint = controller.setSprintOnProjectWithName(`Project-`, project[0].ID, {'No': 555})
    expect(typeof addedSprint).toBe('object')
    expect(addedSprint).toHaveProperty('No', 555)
    expect(addedSprint !== null && typeof addedSprint['No']).toBe('number')

  }) 


  test('Has functional timing operations', ()=>{
    
    let sprint = controller.createSprintOnProjectWithName('Project-')
    let sprintID = sprint.ID
    expect(sprint.OpStart).toBe(0)
    expect(sprint.StartedAt).toBe(0)
    expect(sprint.PausedAt).toBe(0)
    expect(sprint.Status).toBe(SprintStatus.SCHEDULED)
    expect(sprint.Pauses).toEqual([])
    expect(sprint.Runs).toEqual([])

    sprint = controller.startSprintOnPrjectWithName('Project-', sprintID)
    expect(sprint.OpStart).toBeGreaterThan(new Date().getTime() - 1000)
    expect(sprint.StartedAt).toBeGreaterThan(new Date().getTime() - 1000)
    expect(sprint.PausedAt).toBe(0)
    expect(sprint.Status).toBe(SprintStatus.EXECUTING)
    expect(sprint.Pauses).toEqual([])
    expect(sprint.Runs).toEqual([])

    sprint = controller.pauseSprintOnPrjectWithName('Project-', sprintID)
    expect(sprint.PausedAt).toBeGreaterThan(new Date().getTime() - 1000)
    expect(sprint.Status).toBe(SprintStatus.PAUSED)
    expect(sprint.Pauses).toEqual([])
    expect(sprint.Runs).toEqual([])
    
    sprint = controller.resumeSprintOnPrjectWithName('Project-', sprintID)
    expect(sprint.PausedAt).toBe(0)
    expect(sprint.Status).toBe(SprintStatus.EXECUTING)
    expect(sprint.Pauses.length).toEqual(1)
    expect(sprint.Runs).toEqual([])
    
    sprint = controller.stopSprintOnPrjectWithName('Project-', sprintID)
    expect(sprint.OpStart).toBe(0)
    expect(sprint.StartedAt).toBe(0)
    expect(sprint.PausedAt).toBe(0)
    expect(sprint.Status).toBe(SprintStatus.COMPLETED)
    expect(sprint.Pauses.length).toEqual(1)
    expect(sprint.Runs.length).toEqual(1)

  })

  test('Has accurate timing operations', ()=>{
    let durationSec = 1
    let sprint = controller.createSprintOnProjectWithName('Project-', {'DurationSec' : durationSec})
    let sprintID = sprint.ID
    let tmp: number

    expect(sprint.DurationMs).toBe(durationSec * 1000)
    expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBe(durationSec)

    sprint = controller.startSprintOnPrjectWithName('Project-', sprintID)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeLessThan(durationSec - 0.1)
    }, 100)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeLessThan(durationSec - 0.2)
    }, 200)
    setTimeout(()=>{
      sprint = controller.pauseSprintOnPrjectWithName('Project-', sprintID)
      tmp = controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)
    }, 300)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBe(tmp)
    }, 400)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBe(tmp)
    }, 500)
    setTimeout(()=>{
      sprint = controller.resumeSprintOnPrjectWithName('Project-', sprintID)
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBe(tmp)
    }, 600)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeLessThan(durationSec - 0.3)
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeGreaterThan(durationSec - 0.4)
    }, 700)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeLessThan(durationSec - 0.4)
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeGreaterThan(durationSec - 0.5)
    }, 800)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeLessThan(0)
    }, 1500)
    setTimeout(()=>{
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBeLessThan(0)
      sprint = controller.stopSprintOnPrjectWithName('Project-', sprintID)
      expect(controller.getSprintElapsedTimeOnPrjectWithName('Project-', sprintID)).toBe(durationSec)
    }, 1600)
  })

})
