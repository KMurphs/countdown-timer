import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Sprint } from '../../model/model';
import './TaskPage.css';

import TimerLong from '../Timer/TimerLong';
import { getLongDisplay } from '../Timer/CountDownFormat';

import TaskStatus from './TaskStatus';
import Task from './Task';





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
  getProjects: ()=>string[];
	getProjectSprints: (currentProject: string) => Sprint[];
	handleDetailChanges: (currentProject: string, sprintID: number, sprintDetails: {[key: string]: any}) => Sprint | null
	handleSprintStart: (currentProject: string, sprintID: number) => Sprint
	handleSprintPause: (currentProject: string, sprintID: number) => void
	handleSprintResume: (currentProject: string, sprintID: number) => void
	handleSprintReset: (currentProject: string, sprintID: number) => void
	handleSprintStop: (currentProject: string, sprintID: number) => void
	getCurrentSprintElapsedTime: () => number
	getSprintElapsedTimeByID: (currentProject: string, sprintID: number) => number
	getCurrentSprint: () => {currentProject: string, currentSprint: Sprint}
	setCurrentSprint: (currentProject: string, currentSprint?: Sprint) => {currentProject: string, currentSprint: Sprint}
	handleNewSprint: (currentProject: string, sprintDetails: {[key: string]: any}) => Sprint
}

const TaskPage: React.FC<Props> = (props) => {





	const {currentProject, currentSprint} = props.getCurrentSprint()
	const [_currentProject, set_currentProject] = useState<string|null>(null) //Used for local state while user is wrting in input field
	let projectSprints = props.getProjectSprints(currentProject)
	const [currentSprintElapsedTime, setCurrentSprintElapsedTime] = useState<number>(0)
	const [lastUserAction, setLastUserAction] = useState<number>(new Date().getTime())
	let history = useHistory();



	const [tasks, setTasks] = useState<TaskStatus[]>(projectSprints.map(item => {
		return {	
			ID: item.ID, 
			Status: TaskTimerStatus.WAS_NEVER_STARTED
		}
	}))




	// Ensure that each sprint that goes on the display always as a corresponding task 
	if(projectSprints.length !== tasks.length){
		console.log(projectSprints, tasks)
		let missingSprintIDs: number[] = []
		let presentSprints: Sprint[] = []

		// Search for sprints with no corresponding tasks
		projectSprints.forEach(sprint => {
			let isMissing = true
			tasks.forEach(task => sprint.ID === task.ID && (isMissing = false) && presentSprints.push(sprint))
			isMissing && (missingSprintIDs.push(sprint.ID))
		})

		// Add missing tasks for new sprints
		setTasks(tasks => [...tasks, ...missingSprintIDs.map(id => {
			return {
				ID: id, 
				Status: TaskTimerStatus.WAS_NEVER_STARTED
			}
		})])

		// Prevent react errors while trying to access the new tasks 
		// (these new tasks added above will only appear during the next re render)
		projectSprints = [...presentSprints]
	}





	useEffect(()=>{
		const interval = setInterval(()=>{
			// Get current sprint and if valid get its elpased time for later consumption
			const {currentSprint} = props.getCurrentSprint()
			if(currentSprint.ID > 0){
				setCurrentSprintElapsedTime(props.getCurrentSprintElapsedTime())

				if(new Date().getTime() - lastUserAction > 15*1000){
					history.push('/summary')
				}
			}
		}, 100)

		// When current sprint has changed, clean up effect and relaunch
		return ()=>{clearInterval(interval)}
	}, [currentSprint.ID, lastUserAction])






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
				currentSprint.ID > 0 && props.handleSprintPause(currentProject, currentSprint.ID)

				let [task] = tasks.filter(task => task.ID === sprintID)
				task.Status === TaskTimerStatus.WAS_NEVER_STARTED && props.handleSprintStart(currentProject, sprintID)
				task.Status === TaskTimerStatus.PAUSED && props.handleSprintResume(currentProject, sprintID)

				handleUIStart(sprintID)
				break;
			case 'pause':
				props.handleSprintPause(currentProject, sprintID)
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
		<div className="Page TaskPage" onClick={(evt) => setLastUserAction(new Date().getTime())}>
			<div className={`Project-Name UnderlinedInput ${currentProject===''?'Project-Name--Empty':''}`}>
				<input type="text" value={_currentProject===null ? currentProject : _currentProject} 
							 onChange={(evt)=>{set_currentProject(evt.target.value)}} 
							 onKeyDown={(evt)=>{
								 evt.keyCode===13 && props.setCurrentSprint(_currentProject !== null ? _currentProject : '') && set_currentProject(null)
							 }} 
							 placeholder="What are you working on?"/>
			</div>
      
			<div className="Project-Timer">
				<TimerLong content={currentSprint.ID > 0 ? getLongDisplay(currentSprintElapsedTime) : ''} 
									 percentage={currentSprint.ID > 0 ? 100*(1-1000*currentSprintElapsedTime/currentSprint.DurationMs) : 0}/>
			</div>
			
			<div className="Project-Tasks">
				{
					projectSprints.length >= 0 && projectSprints.map((sprint, index) => {
							return sprint.ID>0 
										&& <Task  key={sprint.ID}
															sprint={(index + 1 === sprint.No ? true : props.handleDetailChanges(currentProject, sprint.ID, {No: index}) || true) && sprint} 
															active={sprint.ID === currentSprint.ID}
															taskStatus={tasks[index].Status}
															sprintElapsedTime={sprint.ID === currentSprint.ID ? currentSprintElapsedTime : props.getSprintElapsedTimeByID(currentProject, sprint.ID) }
															handleDetailsChange={(sprintID, changedDetails)=>{
																//  if(changedDetails.DurationSec){
																// 	 console.log('hello', sprint.DurationMs/1000, changedDetails.DurationSec, props.getSprintElapsedTimeByID(props.currentProject, sprint.ID))
																// 	changedDetails.DurationSec =  (sprint.DurationMs/1000)
																// 																+ changedDetails.DurationSec 
																// 																- props.getSprintElapsedTimeByID(props.currentProject, sprint.ID)
																//  }
																props.handleDetailChanges(currentProject, sprintID, changedDetails)
															}}
															handleSprintTimerAction={handleSprintTimerAction}
															handleNewSprint={()=>{ 
																let newSprint = props.handleNewSprint(currentProject, {No: sprint.No + 1}); 
																projectSprints.forEach(item => {
																	if(item.No > sprint.No){
																		props.handleDetailChanges(currentProject, item.ID, {No: item.No + 1})
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
					projectSprints.length === 0 && (
					<div className="Empty-Tasks">
						<span onClick={(evt)=>{
								let newSprint = props.handleNewSprint(currentProject, {No: 1}); 
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

				<div>
					<div className="control-wrapper"
							 onClick={(evt)=>{
								projectSprints.length >= 0 && projectSprints.forEach(item => props.handleSprintReset(currentProject, item.ID))
								setTasks(tasks => tasks.map(task => {
									task.Status = TaskTimerStatus.WAS_NEVER_STARTED
									return task
								}))
							 }}>
						<i className="fas fa-undo"></i>
					</div>
				</div>

				<div>
					<div className="control-wrapper"
							 onClick={(evt)=>{
								projectSprints.length >= 0 && projectSprints.forEach(item => props.handleSprintStop(currentProject, item.ID))
								setTasks(tasks => tasks.map(task => {
									task.Status = TaskTimerStatus.WAS_NEVER_STARTED
									return task
								}))
							 }}>
						<i className="fas fa-stop"></i>
					</div>
				</div>

			</div>


			

		</div>
	);
}

export default TaskPage;
