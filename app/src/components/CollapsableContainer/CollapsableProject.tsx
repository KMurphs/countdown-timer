import React, { useState, useEffect } from 'react';
import './CollapsableContainer.css';
import './CollapsableProject.css';
import TimerDisplay from '../Timer/TimerDisplay';
import TimerControls from '../TimerControls/TimerControls';
import AddEntry from '../AddEntry/AddEntry';
import { Sprint, SprintStatus } from '../../model/model';
import TaskStatus from '../TaskPage/TaskStatus'
import { parseTimeValue } from '../Timer/CountDownFormat';



type TaskProps = {
	data: Sprint,
	updateTask: (updatedTaskDetails?: {[key: string]: any}) => Sprint | null,
	getElapsedTime: () => number,

	startTask: () => Sprint,
	pauseTask: () => Sprint,
	resumeTask: () => Sprint,
	stopTask: () => Sprint,
	resetTask: () => Sprint,

	playPreviousTask: ()=>void,
	playNextTask: ()=>void,
	resetProjectTasks: ()=>void,
}
type Props = {
	project: string,

	isProjectSelected: boolean,
	onProjectSelected: (projectName: string)=>void

	typedTask: string,
	onTypedTask: (typedTask: string)=>void

	getProjectTasks: (projectName: string)=>Sprint[],
	setSprintOnProjectWithName: (projectName: string, sprintID: number, sprintDetails?: {[key: string]: any}) => Sprint | null,
	createSprintOnProjectWithName: (projectName: string, sprintDetails?: {[key: string]: any}) => Sprint | null,

	getSprintElapsedTimeOnPrjectWithName: (projectName: string, sprintID: number) => number,
	startSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	pauseSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	resumeSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	stopSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	resetSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,


	onPlayPreviousTask: () => void,
	onPlayNextTask: () => void,
	onResetProjectTasks: () => void,
}



const CollapsableProject: React.FC<Props> = (props) => {

	const [isPaneOpened, setIsPaneOpened] = useState<boolean>(false)

	let project: string = props.project
	let tasks: Array<Sprint> = props.getProjectTasks(project)
	let tasksNames = tasks.map(task => task.Name)

	// console.log(tasks)
	// console.log(tasksNames)

	// const [typedTask, setTypedTask] = useState<string>('')
	const [forceReRender, setForceReRender] = useState<boolean>(false)
	const doesStringContainToken = (string: string, token: string) => string.toLowerCase().indexOf(token.toLowerCase()) !== -1
	const createNewTask = (newTask: string): Sprint | null => {
		let createdTask = props.createSprintOnProjectWithName(project, {Name: newTask, No: 1})
		setForceReRender(forceReRender=>!forceReRender)
		console.log(createdTask)
		return createdTask
	}
	const reorderTask = (sprintID: number, sprintOrder: number): Sprint | null => {
		let updatedTask = props.setSprintOnProjectWithName(project, sprintID, {No: sprintOrder}) 
		setForceReRender(forceReRender=>!forceReRender)
		console.log(updatedTask, sprintOrder)
		return updatedTask
	}
	const handleTaskCreation = (newTask: string) => {
		tasks.forEach((task, index) => reorderTask(task.ID, index+2))
		return createNewTask(newTask)
	}
	const handleProjectSelection = ()=> { 
		setIsPaneOpened(!props.isProjectSelected); 
		props.onProjectSelected(project)
	}

	return (
		<div className="CollapsableContainer">

			<div className="collapse-header" onClick={(evt)=>handleProjectSelection()}>
				
				<div className={`collapse-indicator ${isPaneOpened?'collapse-indicator--opened':''}`} 
						 onClick={(evt)=> {setIsPaneOpened(isPaneOpened=>!isPaneOpened); evt.stopPropagation()}}>
							 <i className="fas fa-caret-right"></i>
				</div>
				<div className='collapse-header-text'>{project}</div>
				<div><input type="checkbox" checked={props.isProjectSelected} onChange={(evt) => handleProjectSelection()} onClick={evt => evt.stopPropagation()}/></div>

			</div>

			<div className={`collapse-body ${isPaneOpened?'collapse-body--opened':''}`}>
				<AddEntry onChange={typedTask => props.onTypedTask(typedTask)} 
									onAdd={typedTask=> (typedTask !== '') && (tasksNames.indexOf(typedTask) === -1) && handleTaskCreation(typedTask)} 
									placeholder='Enter a Task or Add a New One'/>
				{
					tasks.length > 0 && tasks.sort((a, b)=> a.No-b.No).map((task, index) => {
						return (
							<div key={task.CreatedAt}>
								{
									doesStringContainToken(task.Name, props.typedTask) 
									? <Task data={task} 
													updateTask={(updatedTaskDetails)=>{
														setForceReRender(forceReRender=>!forceReRender)
														return props.setSprintOnProjectWithName(project, task.ID, updatedTaskDetails)
													}}
													playPreviousTask={props.onPlayPreviousTask}
													playNextTask={props.onPlayNextTask}
													resetProjectTasks={props.onResetProjectTasks}
													startTask={()=>{setForceReRender(forceReRender=>!forceReRender); return props.startSprintOnPrjectWithName(project, task.ID)}}
													pauseTask={()=>{setForceReRender(forceReRender=>!forceReRender); return props.pauseSprintOnPrjectWithName(project, task.ID)}}
													resumeTask={()=>{setForceReRender(forceReRender=>!forceReRender); return props.resumeSprintOnPrjectWithName(project, task.ID)}}
													stopTask={()=>{setForceReRender(forceReRender=>!forceReRender); return props.stopSprintOnPrjectWithName(project, task.ID)}}
													resetTask={()=>{setForceReRender(forceReRender=>!forceReRender); return props.resetSprintOnPrjectWithName(project, task.ID)}}
													getElapsedTime={()=>props.getSprintElapsedTimeOnPrjectWithName(project, task.ID)}/> 
									: ''
								}
							</div>
						)
					})
				} 
			</div>


		</div>
	);


}
export default CollapsableProject;









const Task: React.FC<TaskProps> = (props) => {


	const getTaskClassFromStatus = (taskStatus: SprintStatus, isNegative: boolean) => {
		switch(taskStatus){
			case SprintStatus.PAUSED:
				return 'task-wrapper--paused'
			case SprintStatus.COMPLETED:
				return 'task-wrapper--completed'
			case SprintStatus.EXECUTING:
				return isNegative ? 'task-wrapper--running-neg' : 'task-wrapper--running-pos'
			default:
				return ''
		}
	}


	return (
		<div className={`task-wrapper ${getTaskClassFromStatus(props.data.Status, props.getElapsedTime()<0)}`}>

			<div className="task-header-wrapper">
				<div>
					<TaskStatus status={props.data.Status as any} percentage={100000*props.getElapsedTime()/props.data.DurationMs}/>
				</div>
				<div>
						<div className="input-wrapper">
									<input type="text" placeholder={`Your Task from this project`} 
												 value={props.data.Name}
												 onChange={(evt) => props.updateTask({Name: evt.target.value})}/>
						</div>
						<div className="task-controls-wrapper">
							<TimerControls mustbeVisible={true} 
														 handleReset={props.resetProjectTasks}
														 handlePrevious={props.playPreviousTask}
														 handlePlayPause={(mode:string)=> {
															 mode.toLowerCase() === 'play' 
															 ? props.data.Status === SprintStatus.PAUSED ? props.resumeTask() : props.startTask()
															 : props.pauseTask()
														 }}
														 handleNext={props.playNextTask}
														 handleComplete={props.stopTask}
														 alternativeModel={true}/>
						</div>
				</div>
				<div className="task-timer-wrapper">
					<div><span>Elapsed</span><TimerDisplay timeObj={parseTimeValue(props.getElapsedTime())} editable={false} handleTimeChange={()=>{}} useTextSeparator={false}/></div>
					<div>
						<span>Duration</span>
						<TimerDisplay timeObj={parseTimeValue(props.data.DurationMs/1000)} 
													editable={true} 
													handleTimeChange={(newDuration)=>props.updateTask({DurationSec: newDuration})} 
													useTextSeparator={false}/>
					</div>
				</div>
			</div>

		</div>
	)
}

