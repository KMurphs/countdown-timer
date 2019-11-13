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

let model: { [key: string]: Sprint[]; } = {};

export default model