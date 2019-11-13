import model, { Sprint, SprintStatus } from './model/model'



let controller = {

  defaultDurationMin: 20,

  getVersion: ()=>'v1.0.0',
  getProjectsName: ()=>Object.keys(model),
  setSprintOnProjectWithName: (projectName: string, sprintID: number, sprintDetails: {[key: string]: any} = {}): Sprint | null => {
    
    let _sprintID = sprintID
    let updatedSprint: Sprint | null = null
    const possibleSprintDetails = [
      'DurationSec',
      'DurationMs',
      'Duration',
      'DurationMin',
      'Name',
      'No',
    ]


    let sprintDurationMs = controller.defaultDurationMin * 60 * 1000

    if(sprintDetails.DurationMin && typeof sprintDetails.DurationMin === 'number'){
      sprintDurationMs = (sprintDetails.DurationMin) * 60 * 1000

    }else if(sprintDetails.Duration && typeof sprintDetails.Duration === 'number'){
      sprintDurationMs = (sprintDetails.Duration) * 60 * 1000

    }else if(sprintDetails.DurationSec && typeof sprintDetails.DurationSec === 'number'){
      sprintDurationMs = sprintDetails.DurationSec * 1000

    }else if(sprintDetails.DurationMs && typeof sprintDetails.DurationMs === 'number'){
      sprintDurationMs = sprintDetails.DurationMs

    }

    let tmpPosition = model[projectName] ? model[projectName].length + 1 : 1

    let sprintWithGivenIDArray = model[projectName] && model[projectName].filter(item => item.ID === _sprintID)
    if(sprintWithGivenIDArray){

      let [sprintWithGivenID] = sprintWithGivenIDArray
      Object.keys(sprintDetails).forEach(key => {

        if(possibleSprintDetails.indexOf(key) !== -1){
          switch(key){
            case 'DurationSec':
            case 'DurationMs':
            case 'Duration':
            case 'DurationMin':
                sprintWithGivenID.DurationMs = sprintDurationMs
              break
            case 'Name':
                  sprintWithGivenID.Name = sprintDetails.Name && typeof sprintDetails.Name === 'string' ? sprintDetails.Name : `Sprint ${tmpPosition}`
                break
            case 'No':
                sprintWithGivenID.No = sprintDetails.No && typeof sprintDetails.No === 'number' ? sprintDetails.No :  tmpPosition
              break
            default:
                console.log('Invalid Key was provided on Sprint Update: ', key, 'must be one of', possibleSprintDetails)
              break
          }

        }
      })

      updatedSprint = sprintWithGivenID
      
    }else{
      // _sprintID = new Date().getTime()
      // let tmpSprint = {
      //   sprintID: _sprintID,
      //   sprintCreatedAt: _sprintID,
      //   sprintStatus: SprintStatus.SCHEDULED,
  
      //   sprintName: sprintDetails.sprintName && typeof sprintDetails.sprintName === 'string' ? sprintDetails.sprintName : `Sprint ${tmpPosition}`,
      //   sprintNo: sprintDetails.sprintNo && typeof sprintDetails.sprintNo === 'number' ? sprintDetails.sprintNo :  tmpPosition,
      //   sprintDurationMs: sprintDurationMs,
  
      //   sprintStart: 0,
      //   sprintStartBck: 0,
      //   sprintPause: 0,
      //   sprintElpased: 0,
      //   sprintPauses: [],
      //   sprintRuns: [],
      // }
      // model[projectName] ? model[projectName].push(tmpSprint) : model[projectName] = [tmpSprint]
    }
    
    
    return  updatedSprint === null ? null : {...updatedSprint}
  },
  getSprintOnProjectWithName: (projectName: string, sprintID: number, sprintDetails: {[key: string]: any} = {}): Sprint | null => {
    return controller.setSprintOnProjectWithName(projectName, sprintID, sprintDetails)
  },

  getSprintDefault: (tmpNo: number): Sprint=>{
    return {
      ID: new Date().getTime(),
      CreatedAt: new Date().getTime(),
      Status: SprintStatus.SCHEDULED,
  
      Name: `Sprint ${tmpNo}`,
      No: tmpNo,
      DurationMs: controller.defaultDurationMin * 60 * 1000,
  
      StartedAt: 0,
      OpStart: 0,
      PausedAt: 0,
      Pauses: [],
      Runs: [],
    }
  },
  createSprintOnProjectWithName: (projectName: string, sprintDetails: {[key: string]: any} = {}): Sprint => {
    let sprint = controller.getSprintDefault(model[projectName] ? model[projectName].length + 1 : 1)
    model[projectName].push(sprint)
    let updatedSprint = controller.setSprintOnProjectWithName(projectName, sprint.ID, sprintDetails)
    return updatedSprint === null ? {...sprint} : {...updatedSprint}
  },
  getProjectWithName: (projectName: string)=> {

    if(!model[projectName]){
      model[projectName]=[controller.getSprintDefault(model[projectName] ? model[projectName].length + 1 : 1)]
    } 

    return [...model[projectName]]
  },
  startSprintOnPrjectWithName: (projectName: string, sprintID: number): Sprint =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)
    if(sprintWithGivenID.StartedAt <= 0){
      sprintWithGivenID.StartedAt = new Date().getTime()
      sprintWithGivenID.OpStart = sprintWithGivenID.StartedAt
      sprintWithGivenID.Status = SprintStatus.EXECUTING
    }

    return {...sprintWithGivenID}
  },
  pauseSprintOnPrjectWithName: (projectName: string, sprintID: number): Sprint =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)
    if(sprintWithGivenID.PausedAt <= 0){
      sprintWithGivenID.PausedAt = new Date().getTime()
      sprintWithGivenID.Status = SprintStatus.PAUSED
    }

    return {...sprintWithGivenID}
  },
  resumeSprintOnPrjectWithName: (projectName: string, sprintID: number): Sprint =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)
    let pauseDuration = new Date().getTime() - sprintWithGivenID.PausedAt
    sprintWithGivenID.Status = SprintStatus.EXECUTING
    if(sprintWithGivenID.PausedAt > 0){
      sprintWithGivenID.Pauses.push({
        lapsMoment: sprintWithGivenID.PausedAt,
        lapsDuration: pauseDuration
      })
      sprintWithGivenID.OpStart = sprintWithGivenID.OpStart + pauseDuration
      sprintWithGivenID.PausedAt = 0
    }

    return {...sprintWithGivenID}
  },
  stopSprintOnPrjectWithName: (projectName: string, sprintID: number): Sprint =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)

    sprintWithGivenID.Runs.push({
      lapsMoment: sprintWithGivenID.StartedAt,
      lapsDuration: new Date().getTime() - sprintWithGivenID.StartedAt
    })

    sprintWithGivenID.OpStart = 0
    sprintWithGivenID.StartedAt = 0
    sprintWithGivenID.PausedAt = 0
    sprintWithGivenID.Status = SprintStatus.COMPLETED

    return {...sprintWithGivenID}
  },
  getSprintElapsedTimeOnPrjectWithName: (projectName: string, sprintID: number): number =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)

    let now = new Date().getTime()


    // Timer has not started
    let msValue = sprintWithGivenID.DurationMs
    
  
    //Timer has started
    if(sprintWithGivenID.OpStart > 0){
      msValue = sprintWithGivenID.DurationMs - now + sprintWithGivenID.OpStart
  
      
      // Timer is paused
      if(sprintWithGivenID.PausedAt > 0){
        msValue = sprintWithGivenID.PausedAt - sprintWithGivenID.OpStart
      }
    }
  
    return msValue/1000
  }
}




export default controller