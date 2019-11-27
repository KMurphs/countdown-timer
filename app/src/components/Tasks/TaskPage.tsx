import React, { useState, useEffect } from 'react';
import './TaskPage.css';
import { TTimerActions } from '../Main/Main';
import TimerControls from '../TimerElements/TimerControls';
import TimerInput from '../TimerElements/TimerInput';




type TimeObject = {
  hours: number,
  minutes: number,
  seconds: number,
}
type TaskPageProps = {
	taskID: number,
	taskName: string,
	typedTask: string, 
	setTypedTask: (newTypedTask: string)=>void,
	onCreate: (newTask: string)=>void,
	onChangedName: (newTaskName: string)=>void,
	onChangedDuration: (newDuration: number)=>void,
	getElapsedTime: (thisTaskID: number)=>string,
	getDuration: (thisTaskID: number)=>TimeObject,
}

const TaskPage: React.FC<TaskPageProps> = (props) => {

	const [] = useState<string>('')

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
						<div className="box-basic-flex task-add-btn" 
								 onClick={evt => props.onCreate(props.typedTask)}>
									 <i className="fas fa-plus"></i>
						</div>	
					</div>
				</li>




				<li className="task-item">
					<div className="task-name">
						<div className="timer-controls-container">
							<TimerControls  invisibleControls={[]} 
															onTimerAction={(action: TTimerActions)=>console.log(TTimerActions[action])}/>
						</div>
						<input type="text" placeholder="Some task" 
									 value={props.taskName}
									 onChange={evt => props.onChangedName(evt.target.value)}
									 onClick={evt => evt.stopPropagation()}/>
					</div>
					<div className="box-basic-flex task-elapsedtime"> {props.getElapsedTime(props.taskID)} </div>
					<div className="box-basic-flex task-divider">/</div>
					<div className="box-basic-flex task-elapsedtime">
						<TimerInput timeObj={props.getDuration(props.taskID)} onNewInput={props.onChangedDuration}/>
					</div>
					<div className="box-hmax-right task-handle"></div>
				</li>




			</ul>
		</div>
	);
}

export default TaskPage;