import React, { useState, useEffect } from 'react';
import TimerLong from '../Timer/TimerLong';
import Task from './Task';

import { Sprint } from '../../model/model';

import './TaskPage.css';
import TimerShort from '../Timer/TimerShort';
import { getLongDisplay } from '../Timer/CountDownFormat';
import TaskStatus from './TaskStatus';

export enum TaskTimerStatus {
	WAS_NEVER_STARTED = 0,
	STARTED,
	PAUSED
}

type TaskStatus = {
	ID: number, 
	Status: TaskTimerStatus
}
type Props = {
  projectName: string;
	projectSprints: Sprint[];
	handleDetailChanges: (projectName: string, sprintID: number, sprintDetails: {[key: string]: any}) => Sprint | null
	handleSprintStart: (projectName: string, sprintID: number) => Sprint
	handleSprintPause: (projectName: string, sprintID: number) => void
	handleSprintResume: (projectName: string, sprintID: number) => void
	handleSprintStop: (projectName: string, sprintID: number) => void
	getCurrentSprintElapsedTime: () => number
	getSprintElapsedTimeByID: (projectName: string, sprintID: number) => number
	getCurrentSprint: () => Sprint
	handleNewSprint: (projectName: string, sprintDetails: {[key: string]: any}) => Sprint
}

const TaskPage: React.FC<Props> = (props) => {





	const currentSprint = props.getCurrentSprint()
	const [currentSprintElapsedTime, setCurrentSprintElapsedTime] = useState<number>(0)
	const [tasks, setTasks] = useState<TaskStatus[]>(props.projectSprints.map(item => {
		return {	
			ID: item.ID, 
			Status: TaskTimerStatus.WAS_NEVER_STARTED
		}
	}))
	useEffect(()=>{
		const interval = setInterval(()=>{
			const currentSprint = props.getCurrentSprint()
			if(currentSprint.ID > 0){
				setCurrentSprintElapsedTime(props.getCurrentSprintElapsedTime())
			}
		}, 100)

		return ()=>{clearInterval(interval); console.log('in Closing: ')}
	}, [currentSprint.ID])










	const handleSprintTimerAction = (sprintID: number, action: string): void => {

		const handleUIStart = (sprintID: number)=> setTasks(tasks => tasks.map((task, index) => {
			if(task.Status === TaskTimerStatus.STARTED){
				task.Status = TaskTimerStatus.PAUSED
			}
			if(task.ID === sprintID){
				task.Status = TaskTimerStatus.STARTED
			}
			return task
		}))

		switch(action.toLowerCase()){
			case 'start':
				currentSprint.ID > 0 && props.handleSprintPause(props.projectName, currentSprint.ID)

				let [task] = tasks.filter(task => task.ID === sprintID)
				task.Status === TaskTimerStatus.WAS_NEVER_STARTED && props.handleSprintStart(props.projectName, sprintID)
				task.Status === TaskTimerStatus.PAUSED && props.handleSprintResume(props.projectName, sprintID)

				handleUIStart(sprintID)
				break;
			case 'pause':
				props.handleSprintPause(props.projectName, sprintID)
				setTasks(tasks => tasks.map(task => {
					return {	
						ID: task.ID, 
						Status: task.ID === sprintID ? TaskTimerStatus.PAUSED : task.Status
					}
				}))
				break;
			default:
				console.log(`Unsupported Timer Action: '${action}' for Task with Sprint ID: '${sprintID}'`)
				break;
		}
	}
	
	






	return (
		<div className="Page TaskPage">
			<div className="Project-Name UnderlinedInput">
				<input type="text" value={props.projectName} onChange={(evt)=>{}}/>
			</div>
      
			<div className="Project-Timer">
				<TimerLong content={currentSprint.ID > 0 ? getLongDisplay(currentSprintElapsedTime) : ''} 
									 percentage={currentSprint.ID > 0 ? 100*(1-1000*currentSprintElapsedTime/currentSprint.DurationMs) : 0}/>
			</div>
			
			<div className="Project-Tasks">
				{
					props.projectSprints.length >= 0 && props.projectSprints.map((sprint, index) => {
							return <Task key={sprint.ID}
													sprint={(index + 1 === sprint.No ? true : props.handleDetailChanges(props.projectName, sprint.ID, {No: index}) || true) && sprint} 
													active={sprint.ID === currentSprint.ID}
													taskStatus={tasks[index].Status}
													sprintElapsedTime={sprint.ID === currentSprint.ID ? currentSprintElapsedTime : props.getSprintElapsedTimeByID(props.projectName, sprint.ID) }
													handleDetailsChange={(sprintID, changedDetails)=>{
														//  if(changedDetails.DurationSec){
														// 	 console.log('hello', sprint.DurationMs/1000, changedDetails.DurationSec, props.getSprintElapsedTimeByID(props.projectName, sprint.ID))
														// 	changedDetails.DurationSec =  (sprint.DurationMs/1000)
														// 																+ changedDetails.DurationSec 
														// 																- props.getSprintElapsedTimeByID(props.projectName, sprint.ID)
														//  }
														props.handleDetailChanges(props.projectName, sprintID, changedDetails)
													}}
													handleSprintTimerAction={handleSprintTimerAction}
													handleNewSprint={()=>{ 
														let newSprint = props.handleNewSprint(props.projectName, {No: sprint.No + 1}); 
														props.projectSprints.forEach(item => {
															if(item.No > sprint.No){
																props.handleDetailChanges(props.projectName, item.ID, {No: item.No + 1})
															}
														})
														setTasks(tasks => [...tasks, {	
															ID: newSprint.ID, 
															Status: TaskTimerStatus.WAS_NEVER_STARTED
														}])
													}}/>
						})
						
				}
				{
					props.projectSprints.length === 0 && (
					<div className="Empty-Tasks">
						<span onClick={(evt)=>{
								let newSprint = props.handleNewSprint(props.projectName, {No: 1}); 
								setTasks(tasks => [...tasks, {	
										ID: newSprint.ID, 
										Status: TaskTimerStatus.WAS_NEVER_STARTED
								}])
						}}>
							Click To Add a new Task
						</span>
					</div>)
				}
			</div>

			<div className="Project-Controls">
				<div><div className="control-wrapper"><i className="fas fa-undo"></i></div></div>
				<div><div className="control-wrapper"><i className="fas fa-stop"></i></div></div>
			</div>


			

		</div>
	);
}

export default TaskPage;
