import React, { useState, useEffect } from 'react';
import './TaskPage.css';
import { TTimerActions } from '../Main/Main';
import TimerControls from '../TimerElements/TimerControls';
import TimerInput from '../TimerElements/TimerInput';
import { getTasks, getElapsedTime, convertMsToTimeObject } from './TasksController';




type TimeObject = {
  hours: number,
  minutes: number,
  seconds: number,
}
type TaskPageProps = {
	taskID: number,
	taskName: string,
	typedTask: string, 
	owningProject: string,
	setTypedTask: (newTypedTask: string)=>void,
	onCreate: (newTask: string)=>void,
	onChangedName: (newTaskName: string)=>void,
	onChangedDuration: (newDuration: number)=>void,
	getElapsedTime: (thisTaskID: number)=>string,
	getDuration: (thisTaskID: number)=>TimeObject,
	onTimerAction: (action: TTimerActions)=>void,
}

const TaskPage: React.FC<TaskPageProps> = (props) => {

	const registeredTasks = getTasks(props.owningProject)
	const matchingTasks = registeredTasks.filter(task => task.Name.toLowerCase().indexOf(props.typedTask.toLowerCase())!==-1)

	return (
		<div className="TaskPage non-draggable">
			<ul>


				<li className="task-add-container">
					<div className="task-add">
						<div className="task-text">
							<input type="text" placeholder="Some Task" 
											onClick={evt => evt.stopPropagation()}
											value={props.typedTask}
											onChange={evt => props.setTypedTask(evt.target.value)}/>
						</div>				
						<div className={`box-basic-flex task-add-btn ${matchingTasks.length===0 ? '' : 'invisible'}`}
								 onClick={evt => props.onCreate(props.typedTask)}>
									 <i className="fas fa-plus"></i>
						</div>	
					</div>
				</li>


				
				{
					matchingTasks.map((task, index) => {
						let taskElapsedTime = getElapsedTime(props.owningProject, task.ID)
						return (
							<li className="task-item" key={index}>
								<div className="task-name">
									<div className="timer-controls-container">
										<TimerControls  invisibleControls={[]} 
																		onTimerAction={props.onTimerAction}/>
									</div>
									<input type="text" placeholder="Some task" 
												// value={props.taskName}
												value={task.Name}
												onChange={evt => props.onChangedName(evt.target.value)}
												// onKeyDown={evt => evt.keyCode === 13 && props.setTypedTask(task.Name)}
												onClick={evt => evt.stopPropagation()}/>
								</div>
								<div className="box-basic-flex task-elapsedtime"> {taskElapsedTime} </div>
								<div className="box-basic-flex task-divider">/</div>
								<div className="box-basic-flex task-elapsedtime">
									<TimerInput timeObj={convertMsToTimeObject(task.DurationMs)} onNewInput={props.onChangedDuration}/>
								</div>
								<div className="box-hmax-right task-handle"></div>
							</li>
						)
					})
				}
				






			</ul>
		</div>
	);
}

export default TaskPage;