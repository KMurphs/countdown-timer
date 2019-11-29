import React, { useState } from 'react';
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
	selectedTaskID: number|null,
	typedTask: string, 
	owningProjectID: number|null,
	setTypedTask: (newTypedTask: string)=>void,
	onCreate: (newTask: string)=>void,
	onChangedName: (taskID: number, newTaskName: string)=>void,
	onChangedDuration: (newDuration: number)=>void,
	getElapsedTime: (thisTaskID: number)=>string,
	getDuration: (thisTaskID: number)=>TimeObject,
	onTimerAction: (action: TTimerActions)=>void,
}

const TaskPage: React.FC<TaskPageProps> = (props) => {

	const registeredTasks = props.owningProjectID === null ? [] : getTasks(props.owningProjectID)
	const matchingTasks = registeredTasks.filter(task => task.Name.toLowerCase().indexOf(props.typedTask.toLowerCase())!==-1)
	const [, setTmpRender] = useState<boolean>(false)
	const onCreate = (newTask: string):void => {
		props.onCreate(newTask)
		setTmpRender(tmpRender => !tmpRender)
	}
	const onChangedName = (taskID: number, newTaskName: string):void => {
		props.onChangedName(taskID, newTaskName)
		setTmpRender(tmpRender => !tmpRender)
	}
	return (
		<div className="TaskPage non-draggable">
			<ul>


				<li className="task-add-container">
					<div className="task-add">
						<div className="task-text">
							<input type="text" placeholder="Some Task" 
											onClick={evt => evt.stopPropagation()}
											onKeyDown={evt => evt.keyCode === 13 && onCreate(props.typedTask)}
											value={props.typedTask}
											onChange={evt => props.setTypedTask(evt.target.value)}/>
						</div>				
						<div className={`box-basic-flex task-add-btn ${matchingTasks.length===0 ? '' : 'invisible'}`}
								 onClick={evt => onCreate(props.typedTask)}>
									 <i className="fas fa-plus"></i>
						</div>	
					</div>
				</li>


				
				{
					matchingTasks.map((task, index) => {
						let taskElapsedTime = props.owningProjectID === null ? NaN : getElapsedTime(props.owningProjectID, task.ID)
						return (
							<li className="task-item" key={index} >
								<div className="task-name">
									<div className="timer-controls-container">
										{/* <TimerControls  invisibleControls={[]} 
																		onTimerAction={props.onTimerAction}/> */}
									</div>
									<input type="text" placeholder="Some task" 
												value={task.Name}
												onChange={evt => onChangedName(task.ID, evt.target.value)}
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