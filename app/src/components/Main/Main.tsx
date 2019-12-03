import React, { useState, useEffect } from 'react';
import './Main.css';


import model, { TaskStatus } from '../../model/model';
import { 
	getProjectByIndex, 
	addTask, 
	addProject, 
	updateProject, 
	updateTask, 
	getNextValidTask, 
	getPreviousValidTask, 
	getTaskByIndex
} from '../../controllers.common';
import { convertMsToTimeObject, convertTimeObjectToString, getTasks } from '../Tasks/TasksController';
import TimerController from '../TimerElements/TimerController';


import TimerControls from '../TimerElements/TimerControls';
import ProjectPage from '../Projects/ProjectPage';
import TaskPage from '../Tasks/TaskPage';







export enum TOpenedPane {
	NONE = 0,
	PROJECT,
	TASK
}
export enum TTimerActions {
	PLAY = 0,
	PAUSE,
	NEXT,
	PREVIOUS,
	STOP,
	RESTART_ALL
}
let timerController = new TimerController(model)
console.log(timerController.getVersion())

const Main: React.FC = () => {


	// Monitors which pane is opened (see TOpenedPane)
	const [openedPane, _setOpenedPane] = useState<TOpenedPane>(TOpenedPane.NONE)


	// The following block of code ensures that the pane will close after "paneTimeoutMs" if the 
	// Mouse leaves the pane and do not re-enter within the "paneTimeoutMs"
	const paneTimeoutMs = 10000 // Pane will close after this amount of time in case of prolonged inactivity
	const [, setMouseLeftAppMoment] = useState<number | null>(null)
	// Interval containing a function that monitors and eventually closes the pane in case of prolonged inactivity 
	const [, setClosePaneInterval] = useState<NodeJS.Timeout | null>(null) 

	// It is worth remmebering that since we are dealing with setInterval, we will not have access to the updated variables
	// declared above. A workaround is to remember that the updated value for these variable can be accessed in their
	// respective react hooks "set" functions. This makes the code below a little bit undigestible

	// Highjack setOpenedPane to spawn an interval function when the pane is opened. 
	// The spawned function will eventually close the pane after paneTimeoutMs ms of inactivity
	const setOpenedPane = (paneToOpen: TOpenedPane) => {
		if(paneToOpen !== TOpenedPane.NONE){
			setClosePaneInterval(setInterval(()=>{
				setMouseLeftAppMoment(mouseLeftAppMoment => {


					if(mouseLeftAppMoment !== null && (new Date().getTime() - mouseLeftAppMoment) > paneTimeoutMs) {
						// It's been "paneTimeoutMs" ms since the mouse left, it is safe to assume that the user
						// is not using the pane anymomre and we can close it
						_setOpenedPane(openedPane => openedPane === paneToOpen ? TOpenedPane.NONE : openedPane)
						setClosePaneInterval(closePaneInterval => {
							closePaneInterval !== null && clearInterval(closePaneInterval)
							return null
						})
						mouseLeftAppMoment = null
						return mouseLeftAppMoment 
					}


					return mouseLeftAppMoment
				})
			}, 250)) 
		}

		// Continue normally
		_setOpenedPane(paneToOpen)
	}





	// Current project and task memory
	const [typedTask, setTypedTask] = useState<string>('')
	const [selectedProjectID, setSelectedProjectID] = useState<number|null>(null)
	const [selectedTaskID, setSelectedTaskID] = useState<number|null>(null)



	// isRunning indicator and interval function to update timer display
	const [isRunning, setIsRunning] = useState<boolean>(false)
	const [elapsedTime, setElapsedTime] = useState<number|null>(null)
	useEffect(()=>{

		// If timer is not running anymore, don't setup a new interval funciton
		if(!isRunning){
			return ()=>{}
		}

		// set up a new interval function that will update elapsedTime for ui consumption
		const interval = setInterval(()=>{
			setElapsedTime(timerController.getElapsedTimeInSec(selectedProjectID, selectedTaskID))
		}, 250)

		// cleanup function: clear the interval
		return () => clearInterval(interval)

	// use effect is re-initialized whenever any of these change
	}, [isRunning, selectedProjectID, selectedTaskID])
	







	// Timer Action handlers
	const handleTimerAction = (projectID:number|null, taskID:number|null, action: TTimerActions) => {
		let currentTask = null
		projectID !== null && taskID !== null && (currentTask = getTaskByIndex(projectID, taskID));
		setIsRunning(true)
		console.log(TTimerActions[action], projectID, taskID, currentTask === null ? null : TaskStatus[currentTask.Status])

		switch(action){

			// Play the next available task
			case TTimerActions.NEXT:
					setSelectedTaskID(taskID => {
						let nextTaskID = getNextValidTask(projectID, taskID)
						handleTimerAction(projectID, nextTaskID, TTimerActions.PLAY)
						return nextTaskID
					})
					break
			// Play the previous available task
			case TTimerActions.PREVIOUS:
					setSelectedTaskID(taskID => {
						let prevTaskID = getPreviousValidTask(projectID, taskID)
						handleTimerAction(projectID, prevTaskID, TTimerActions.PLAY)
						return prevTaskID
					})
					break



			// play task
			case TTimerActions.PLAY:
					if(taskID !== null){
						currentTask !== null && currentTask.Status === TaskStatus.SCHEDULED && timerController.start(projectID, taskID)
						currentTask !== null && currentTask.Status === TaskStatus.PAUSED && timerController.resume(projectID, taskID)
					}else{
						handleTimerAction(projectID, taskID, TTimerActions.NEXT)
					}

					break
			// pause task
			case TTimerActions.PAUSE:
					currentTask !== null && currentTask.Status === TaskStatus.EXECUTING && timerController.pause(projectID, taskID)
					break



			// restart project tasks		
			case TTimerActions.RESTART_ALL:
					currentTask !== null && timerController.restartProject(projectID)

					projectID!==null && setSelectedTaskID(() => {
						let nextTask = getTasks(projectID).sort((a,b) => a.No-b.No)[0];
						handleTimerAction(projectID, nextTask.ID, TTimerActions.PLAY)
						return nextTask.ID
					})
					break
			// stop current task
			case TTimerActions.STOP:
					currentTask !== null && timerController.stop(projectID, taskID)
					setIsRunning(false)
					break
			default:
					console.log('Unsupported Timer Action: ', action)
					// setIsRunning(false)
					break
		}
	}





	// UI Jsx
	const handleNewTask = (newTask: string) => {
		selectedProjectID !== null && setSelectedTaskID(addTask(selectedProjectID, typedTask))
	}

	return (
		<div onMouseLeave={evt => setMouseLeftAppMoment(new Date().getTime())} onMouseEnter={evt => setMouseLeftAppMoment(null)}>
			<div className="Main">
				
				<div className="non-draggable box-top-left box-basic-flex current-project">
					Project: &nbsp;
					<span>{selectedProjectID === null ? 'None' : getProjectByIndex(selectedProjectID).name}</span>
					<span className="box-basic-flex current-project-edit"
								onClick={evt => setOpenedPane(TOpenedPane.PROJECT)}>
						<i className="fas fa-pen"></i>
					</span>
				</div>

				<div className="non-draggable current-task">
					<input type="text" placeholder="Your Task here" 
								 value={typedTask}
								 onChange={evt => setTypedTask(evt.target.value)}
								 onKeyDown={evt => evt.keyCode === 13 && handleNewTask(typedTask)}
								 onMouseDown={evt => setOpenedPane(TOpenedPane.TASK)}/>
					<div className="timer-slider-bg"></div>
					<div className="timer-slider"></div>
				</div>

				<div className="timer-display">
					<span>{elapsedTime === null ? '00:00' : convertTimeObjectToString(convertMsToTimeObject(elapsedTime*1000))}</span>
				</div>


				<div className="draggable box-hmax-left drag-handle"></div>

			</div>
		
			{
				(selectedProjectID !== null) && (selectedTaskID !== null) && (
					<TimerControls 	onTimerAction={(action)=>handleTimerAction(selectedProjectID, selectedTaskID, action)} invisibleControls={[]}/>
				)
			}
			
			

			{(openedPane === TOpenedPane.PROJECT) && (
					<ProjectPage onSelection={setSelectedProjectID} 
											 selectedProjectID={selectedProjectID !== null ? selectedProjectID : -1} 
											 onTimerAction={(action)=>handleTimerAction(selectedProjectID, selectedTaskID, action)}
											 onCreate={(newProject)=>addProject(newProject)}
											 onRename={(projectID, newName) => updateProject(projectID, newName)}
											 getTotalTime={project => {console.log('Obtaining total time for project ', project); return '11:52:12'}}
											 getOvertime={project => {console.log('Obtaining total overtime for project ', project); return -51}}/>
			)}

			
			{(openedPane === TOpenedPane.TASK) && (selectedProjectID !== null) && (
					<TaskPage selectedTaskID={selectedTaskID}
										owningProjectID={selectedProjectID}
										typedTask={typedTask}
										setTypedTask={setTypedTask}
										onTimerAction={(action)=>handleTimerAction(selectedProjectID, selectedTaskID, action)}
										onChangedName={(taskID, newName)=>selectedProjectID !== null && updateTask(selectedProjectID, taskID, {'Name': newName})}
										onChangedDuration={(taskID, newDuration)=>selectedProjectID !== null && updateTask(selectedProjectID, taskID, {'DurationMs': newDuration})}
										onCreate={(newTask) => handleNewTask(newTask)}
										getElapsedTime={(taskID)=> timerController.getElapsedTimeInSec(selectedProjectID, taskID)}
										getDuration={(taskID)=>{console.log('Getting Duration of Task with ID ', taskID); return {hours: 11, minutes: 52, seconds: 24}}}/>
			)}

		</div>

	);
}

export default Main;




