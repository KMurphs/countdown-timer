import { getDefaultSettings } from "http2";

export interface Sprint{
  ID: number,
  No: number,
  Name: string,
  DurationMs: number,
  
  OpStart: number,
  PausedAt: number,
  CreatedAt: number,
  StartedAt: number,
  
  Status: SprintStatus,
  Pauses: Laps[],
  Runs: Laps[],
}
export interface Laps{
  lapsMoment: number,
  lapsDuration: number,
}
export enum SprintStatus{
  SCHEDULED = 0,
  EXECUTING,
  PAUSED,
  COMPLETED,
}

export interface Project{
  sprints: Sprint[]
}


interface CurrentSprint {
  owningProject: string,
  sprint: Sprint,
  get: () => CurrentSprint,
  set: (owningProject: string, sprint: Sprint) => CurrentSprint
}



const getDefaultSprint = (tmpNo: number = 1, durationMin: number = 60): Sprint => {
  return {
    ID: new Date().getTime(),
    CreatedAt: new Date().getTime(),
    Status: SprintStatus.SCHEDULED,

    Name: `Sprint ${tmpNo}`,
    No: tmpNo,
    DurationMs: durationMin * 60 * 1000,

    StartedAt: 0,
    OpStart: 0,
    PausedAt: 0,
    Pauses: [],
    Runs: [],
  }
}
const getInvalidSprint = (tmpNo: number = 1, durationMin: number = 60): Sprint => {
  return {
    ID: -1*new Date().getTime(),
    CreatedAt: -1*new Date().getTime(),
    Status: SprintStatus.SCHEDULED,

    Name: `Sprint ${tmpNo}`,
    No: tmpNo,
    DurationMs: durationMin * 60 * 1000,

    StartedAt: 0,
    OpStart: 0,
    PausedAt: 0,
    Pauses: [],
    Runs: [],
  }
}


const CurrentSprint = function(this: CurrentSprint){
  this.owningProject = ''
  this.sprint = getInvalidSprint()
} as any as { new (): CurrentSprint; };
CurrentSprint.prototype.get = function(this: CurrentSprint){
  return {...this}
}
CurrentSprint.prototype.set = function(this: CurrentSprint, owningProject: string, sprint: Sprint){
  this.owningProject = owningProject
  this.sprint = sprint
  return {...this}
}
let currentSprint: CurrentSprint = new CurrentSprint()


let model: { [key: string]: Sprint[]; } = {
  'TestProject': [
    // {
    //   ID: new Date().getTime()+1,
    //   CreatedAt: new Date().getTime()+1,
    //   Status: SprintStatus.SCHEDULED,
  
    //   Name: `Sprint ${1}`,
    //   No: 1,
    //   DurationMs: 5000,
  
    //   StartedAt: 0,
    //   OpStart: 0,
    //   PausedAt: 0,
    //   Pauses: [],
    //   Runs: [],
    // },{
    //   ID: new Date().getTime()+2,
    //   CreatedAt: new Date().getTime()+2,
    //   Status: SprintStatus.SCHEDULED,
  
    //   Name: `Sprint ${2}`,
    //   No: 2,
    //   DurationMs: 10000,
  
    //   StartedAt: 0,
    //   OpStart: 0,
    //   PausedAt: 0,
    //   Pauses: [],
    //   Runs: [],
    // },{
    //   ID: new Date().getTime()+3,
    //   CreatedAt: new Date().getTime()+3,
    //   Status: SprintStatus.SCHEDULED,
  
    //   Name: `Sprint ${3}`,
    //   No: 3,
    //   DurationMs: 125000,
  
    //   StartedAt: 0,
    //   OpStart: 0,
    //   PausedAt: 0,
    //   Pauses: [],
    //   Runs: [],
    // },
  ]
};

export default model
export { getDefaultSprint, currentSprint, getInvalidSprint };