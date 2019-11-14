import React, { useState, Fragment } from 'react';
import TimerDisplay from '../Timer/TimerDisplay';
import TaskStatus from './TaskStatus';

import './Task.css';
import { Sprint } from '../../model/model';
import { parseTimeValue } from '../Timer/CountDownFormat';
import { TaskTimerStatus } from './TaskPage';

enum TaskAction {
	START = 0,
	PAUSE,
	RESUME
}

type Props = {
	active: boolean,
	sprint: Sprint,
	sprintElapsedTime: number,
	taskStatus: TaskTimerStatus,
	handleDetailsChange: (sprintID: number, details: {[key: string]: any}) => void
	handleNewSprint: () => void
	handleSprintTimerAction: (sprintID: number, action: string) => void
}


const Task: React.FC<Props> = (props) => {

	let timeObj = parseTimeValue(props.sprintElapsedTime)
	const percentage = 1000*100*props.sprintElapsedTime/props.sprint.DurationMs

	const handleTaskActions = (taskAction: TaskAction = TaskAction.START)=>{
		props.handleSprintTimerAction(props.sprint.ID, TaskAction[taskAction])
	}

		 
	return (
		<Fragment>
			<div className={`Task UnderlinedInput ${props.active ? 'Task--active': ''}`}>
				
				<div className="Task-Control" >
					{props.taskStatus !== TaskTimerStatus.STARTED && (<div onClick={(evt)=>{handleTaskActions(TaskAction.START)}}><div className="control-wrapper"><i className="fas fa-play"></i></div></div>) }
					{props.taskStatus === TaskTimerStatus.STARTED && (<div onClick={(evt)=>{handleTaskActions(TaskAction.PAUSE)}}><div className="control-wrapper"><i className="fas fa-pause"></i></div></div>) }
				</div>

				<div className="Task-Name">
					<input type="text" value={props.sprint.Name} 
								onChange={(evt)=>props.handleDetailsChange(props.sprint.ID, {'Name': evt.target.value})}/>
				</div>


				<div className="Task-Duration">
					<TimerDisplay timeObj={{isNeg: timeObj.isNegative, hours: timeObj.hours, minutes: timeObj.minutes, seconds: timeObj.seconds}} 
												useTextSeparator={false} 
												handleTimeChange={(newDurationSec)=>props.handleDetailsChange(props.sprint.ID, {'DurationSec': newDurationSec})}/>
				</div>


				<div className="Task-Status">
					<TaskStatus status={props.sprint.Status as number} percentage={percentage}/>
				</div>

			</div>

			<div className="Task-Add" onClick={(evt => props.handleNewSprint() )}>
				<span><i className="fas fa-plus"></i></span>
			</div>
		</Fragment>

	);
}

export default Task;
