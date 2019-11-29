import React, { useState } from 'react';
import './Main.css';

import model from '../../model/model';
import { getProjectByIndex, addTask, addProject, updateProject, updateTask } from '../../controllers.common';
import Controller from '../TimerElements/TimerController';

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
const controller = new Controller(model)
console.log(controller)
console.log(controller.getVersion())
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




	const [typedTask, setTypedTask] = useState<string>('')
	const [selectedProjectID, setSelectedProjectID] = useState<number|null>(null)
	const [selectedTaskID, setSelectedTaskID] = useState<number|null>(null)

	
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
					<span>12:52:23</span>
				</div>


				<div className="draggable box-hmax-left drag-handle"></div>

			</div>
		
			{/* {
				(selectedProjectID !== null) && (selectedTaskID !== null) && (
					<TimerControls 	onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])} invisibleControls={[]}/>
				)
			} */}
			
			

			{(openedPane === TOpenedPane.PROJECT) && (
					<ProjectPage onSelection={setSelectedProjectID} 
											 selectedProjectID={selectedProjectID !== null ? selectedProjectID : -1} 
											 onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])}
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
										onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])}
										onChangedName={(taskID, newName)=>selectedProjectID !== null && updateTask(selectedProjectID, taskID, {'Name': newName})}
										onChangedDuration={(newName)=>console.log('Duration of Task with ID ', 1, ' was changed into ', newName)}
										onCreate={(newTask) => handleNewTask(newTask)}
										getElapsedTime={(taskID)=>{console.log('Getting Elapsed Time on Task with ID ', taskID); return '11:02:62'}}
										getDuration={(taskID)=>{console.log('Getting Duration of Task with ID ', taskID); return {hours: 11, minutes: 52, seconds: 24}}}/>
			)}

		</div>

	);
}

export default Main;




