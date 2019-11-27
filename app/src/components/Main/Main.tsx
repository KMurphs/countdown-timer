import React, { useState, useEffect } from 'react';
import './Main.css';
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
const Main: React.FC = () => {

	// Monitors which pane is opened (see TOpenedPane)
	const [openedPane, _setOpenedPane] = useState<TOpenedPane>(TOpenedPane.NONE)


	// The following block of code ensures that the task pane will close after "taskPaneTimeoutMs" if the 
	// Mouse leaves the Task pane and do not re-enter within the "taskPaneTimeoutMs"
	const taskPaneTimeoutMs = 1000 // Task Pane will close after this amount of time in case of prolonged inactivity
	const [, setMouseLeftAppMoment] = useState<number | null>(null)
	// Interval containing a function that monitors and eventually closes the task pane in case of prolonged inactivity 
	const [, setCloseTaskPaneInterval] = useState<NodeJS.Timeout | null>(null) 

	// It is worth remmebering that since we are dealing with setInterval, we will not have access to the updated variables
	// declared above. A workaround is to remember that the updated value for these variable can be accessed in their
	// respective react hooks "set" functions. This makes the code below a little bit undigestible

	// Highjack setOpenedPane to spawn an interval function when the task pane is opened. 
	// The spawned function will eventually close the pane after taskPaneTimeoutMs ms of inactivity
	const setOpenedPane = (paneToOpen: TOpenedPane) => {
		if(paneToOpen === TOpenedPane.TASK){
			setCloseTaskPaneInterval(setInterval(()=>{
				setMouseLeftAppMoment(mouseLeftAppMoment => {


					if(mouseLeftAppMoment !== null && (new Date().getTime() - mouseLeftAppMoment) > taskPaneTimeoutMs) {
						// It's been "taskPaneTimeoutMs" ms since the mouse left, it is safe to assume that the user
						// is not using the pane anymomre and we can close it
						_setOpenedPane(openedPane => openedPane === TOpenedPane.TASK ? TOpenedPane.NONE : openedPane)
						setCloseTaskPaneInterval(closeTaskPaneInterval => {
							closeTaskPaneInterval !== null && clearInterval(closeTaskPaneInterval)
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

	const handleProjectChange = (newProject: string) => {
		setOpenedPane(TOpenedPane.NONE)
	}
	
		 
	return (
		<div onMouseLeave={evt => setMouseLeftAppMoment(new Date().getTime())} onMouseEnter={evt => setMouseLeftAppMoment(null)}>
			<div className="Main">
				
				<div className="non-draggable box-top-left box-basic-flex current-project">
					Project: &nbsp;
					<span>None</span>
					<span className="box-basic-flex current-project-edit"
								onClick={evt => setOpenedPane(TOpenedPane.PROJECT)}>
						<i className="fas fa-pen"></i>
					</span>
				</div>

				<div className="non-draggable current-task">
					<input type="text" placeholder="Your Task here" 
								 value={typedTask}
								 onChange={evt => setTypedTask(evt.target.value)}
								 onMouseDown={evt => setOpenedPane(TOpenedPane.TASK)}/>
					<div className="timer-slider-bg"></div>
					<div className="timer-slider"></div>
				</div>

				<div className="timer-display">
					<span>12:52:23</span>
				</div>


				<div className="draggable box-hmax-left drag-handle"></div>

			</div>
		
			<TimerControls 	onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])} invisibleControls={[]}/>
			

			{(openedPane === TOpenedPane.PROJECT) && (
					<ProjectPage onSelection={handleProjectChange} 
											 projectName='Test Project' 
											 onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])}
											 onCreate={newProject => console.log('New Project ', newProject, ' is being created')}
											 onRename={newName => console.log('Project was renamed into ', newName)}
											 getTotalTime={project => {console.log('Obtaining total time for project ', project); return '11:52:12'}}
											 getOvertime={project => {console.log('Obtaining total overtime for project ', project); return -51}}/>
			)}

			
			{(openedPane === TOpenedPane.TASK) && (
					<TaskPage taskID={1}
										taskName={'Some Name'}
										typedTask={typedTask}
										setTypedTask={setTypedTask}
										onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])}
										onChangedName={(newName)=>console.log('Task with ID ', 1, ' was renamed into ', newName)}
										onChangedDuration={(newName)=>console.log('Duration of Task with ID ', 1, ' was changed into ', newName)}
										onCreate={(newTaskName)=>console.log('Creating new Task ', newTaskName)}
										getElapsedTime={(taskID)=>{console.log('Getting Elapsed Time on Task with ID ', taskID); return '11:02:62'}}
										getDuration={(taskID)=>{console.log('Getting Duration of Task with ID ', taskID); return {hours: 11, minutes: 52, seconds: 24}}}/>
			)}

		</div>

	);
}

export default Main;




