import model, { Sprint, SprintStatus, currentSprint as _currentSprint, getDefaultSprint, getInvalidSprint } from './model/model'

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
                  sprintDetails.Name === '' && (sprintWithGivenID.Name = '')
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

  getDefaultSprint: (tmpNo: number) => getDefaultSprint(tmpNo, controller.defaultDurationMin),
  getInvalidSprint: (tmpNo: number) => getInvalidSprint(tmpNo, controller.defaultDurationMin),
  createSprintOnProjectWithName: (projectName: string, sprintDetails: {[key: string]: any} = {}): Sprint => {
    let sprint = controller.getDefaultSprint(model[projectName] ? model[projectName].length + 1 : 1)
    model[projectName].push(sprint)
    let updatedSprint = controller.setSprintOnProjectWithName(projectName, sprint.ID, sprintDetails)
    return updatedSprint === null ? {...sprint} : {...updatedSprint}
  },
  getProjectWithName: (projectName: string)=> {

    if(!model[projectName] && projectName!==''){
      model[projectName]=[controller.getDefaultSprint(model[projectName] ? model[projectName].length + 1 : 1)]
    } 

    return projectName!=='' ? [...model[projectName]] : []
  },
  startSprintOnPrjectWithName: (projectName: string, sprintID: number): Sprint =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)
    if(sprintWithGivenID.StartedAt <= 0){
      sprintWithGivenID.StartedAt = new Date().getTime()
      sprintWithGivenID.OpStart = sprintWithGivenID.StartedAt
      sprintWithGivenID.Status = SprintStatus.EXECUTING

      _currentSprint.set(projectName, sprintWithGivenID)
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

    _currentSprint.set(projectName, getInvalidSprint())

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

    _currentSprint.set(projectName, sprintWithGivenID)

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

    _currentSprint.set(projectName, getInvalidSprint())

    return {...sprintWithGivenID}
  },
  resetSprintOnPrjectWithName: (projectName: string, sprintID: number): Sprint =>{
    controller.stopSprintOnPrjectWithName(projectName, sprintID)

    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)
    sprintWithGivenID.Status = SprintStatus.SCHEDULED

    return {...sprintWithGivenID}
  },
  getSprintElapsedTimeOnPrjectWithName: (projectName: string, sprintID: number): number =>{
    let project = controller.getProjectWithName(projectName)
    let [sprintWithGivenID] = project.filter(item => item.ID === sprintID)

    // if(!sprintWithGivenID){
    //   return -1
    // }

    let now = new Date().getTime()


    // Timer has not started
    let msValue = sprintWithGivenID.DurationMs
    
  
    //Timer has started
    if(sprintWithGivenID.OpStart > 0){
      msValue = sprintWithGivenID.DurationMs - now + sprintWithGivenID.OpStart
  
      
      // Timer is paused
      if(sprintWithGivenID.PausedAt > 0){
        msValue = sprintWithGivenID.DurationMs - sprintWithGivenID.PausedAt + sprintWithGivenID.OpStart
      }
    }
  
    return msValue/1000
  },
  getCurrentSprint: (): {currentProject: string, currentSprint: Sprint} =>{
    let __currentSprint = _currentSprint.get()
    return {currentProject: __currentSprint.owningProject, currentSprint: __currentSprint.sprint}
  },
  setCurrentSprint: (currentProject: string, currentSprint: Sprint = getInvalidSprint()): {currentProject: string, currentSprint: Sprint} =>{
    let __currentSprint = _currentSprint.set(currentProject, currentSprint)
    return {currentProject: __currentSprint.owningProject, currentSprint: __currentSprint.sprint}
  },
  getCurrentSprintElapsedTime: (): number =>{
    let __currentSprint = _currentSprint.get()
    return controller.getSprintElapsedTimeOnPrjectWithName(__currentSprint.owningProject, __currentSprint.sprint.ID)
  },
  stopCurrentSprint: (): Sprint =>{
    let __currentSprint = _currentSprint.get()
    return controller.stopSprintOnPrjectWithName(__currentSprint.owningProject, __currentSprint.sprint.ID)
  },
  resumeCurrentSprint: (): Sprint =>{
    let __currentSprint = _currentSprint.get()
    return controller.resumeSprintOnPrjectWithName(__currentSprint.owningProject, __currentSprint.sprint.ID)
  },
  pauseCurrentSprint: (): Sprint =>{
    let __currentSprint = _currentSprint.get()
    return controller.pauseSprintOnPrjectWithName(__currentSprint.owningProject, __currentSprint.sprint.ID)
  }
}




export default controller