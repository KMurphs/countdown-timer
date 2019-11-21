import React, { useState, useEffect } from 'react';
import './MainUI.css';

import { Sprint } from '../../model/model';
import TimerLong from '../Timer/TimerLong';
import { getLongDisplay } from '../Timer/CountDownFormat';
import CollapsableProject from '../CollapsableContainer/CollapsableProject';
import TimerControls from '../TimerControls/TimerControls';
import AddEntry from '../AddEntry/AddEntry';
import Input_WithAutoComplete from '../Input_WithAutoComplete/Input_WithAutoComplete';




// let data:{[key: string]:Array<any>} = {
// 	'aprjct 1': [{name: 'Task1', duration: 0, elapsed: 2},{name: 'Task2', duration: 0, elapsed: 2},{name: 'Task3', duration: 0, elapsed: 2}],
// 	'bprjct 2': [{name: 'Task1', duration: 0, elapsed: 2},{name: 'Task2', duration: 0, elapsed: 2},{name: 'Task3', duration: 0, elapsed: 2}],
// 	'cprjct 3': [{name: 'Task1', duration: 0, elapsed: 2},{name: 'Task2', duration: 0, elapsed: 2},{name: 'Task3', duration: 0, elapsed: 2}]
// }

type Props = {
	getProjects: ()=>string[],	
	getProjectWithName: (projectName: string) => Sprint[],
	setSprintOnProjectWithName: (projectName: string, sprintID: number, sprintDetails?: {[key: string]: any}) => Sprint | null,
	createSprintOnProjectWithName: (projectName: string, sprintDetails?: {[key: string]: any}) => Sprint | null,

	getSprintElapsedTimeOnPrjectWithName: (projectName: string, sprintID: number) => number,
	startSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	pauseSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	resumeSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	stopSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,
	resetSprintOnPrjectWithName: (projectName: string, sprintID: number) => Sprint,

	getCurrentSprint: ()=>{currentProject: string, currentSprint: Sprint},
	setCurrentSprint: (currentProject: string, currentSprint?: Sprint) => {currentProject: string, currentSprint: Sprint},

	pauseCurrentSprint: () => Sprint,
	resumeCurrentSprint: () => Sprint,
	stopCurrentSprint: () => Sprint,
	getCurrentSprintElapsedTime: () => number,
}

const MainUI: React.FC<Props> = (props) => {

	const [isPaneOpened, setIsPaneOpened] = useState<boolean>(false)
	const [paneWillCloseInNSecs, setPaneWillCloseInNSecs] = useState<number|null>(0)
	const [isControlsOpened, setIsControlsOpened] = useState<boolean>(false)
	const [controlsWillCloseInNSecs, setControlsWillCloseInNSecs] = useState<number|null>(0)
	useEffect(()=>{
		if(!isPaneOpened || paneWillCloseInNSecs === null){
			setPaneWillCloseInNSecs(null)
			return
		}

		const rateMs = 100
		const interval = setInterval(()=>{
			if(paneWillCloseInNSecs <= 0){
				setIsPaneOpened(false)
			}else{
				setPaneWillCloseInNSecs(paneWillCloseInNSecs => paneWillCloseInNSecs === null ? null : paneWillCloseInNSecs - (rateMs/1000))
			}
		}, rateMs)

		return ()=>clearTimeout(interval)

	}, [isPaneOpened, paneWillCloseInNSecs])


	useEffect(()=>{
		if(!isControlsOpened || controlsWillCloseInNSecs === null){
			setControlsWillCloseInNSecs(null)
			return
		}

		const rateMs = 100
		const interval = setInterval(()=>{
			if(controlsWillCloseInNSecs <= 0){
				setIsControlsOpened(false)
			}else{
				setControlsWillCloseInNSecs(controlsWillCloseInNSecs => controlsWillCloseInNSecs === null ? null : controlsWillCloseInNSecs - (rateMs/1000))
			}
		}, rateMs)

		return ()=>clearTimeout(interval)

	}, [isControlsOpened, controlsWillCloseInNSecs])






	const [forceReRender, setForceReRender] = useState<boolean>(false)
	const [typedProject, setTypedProject] = useState<string>('')
	const [typedTask, setTypedTask] = useState<string>('')
	const doesStringContainToken = (string: string, token: string) => string.toLowerCase().indexOf(token.toLowerCase()) !== -1
	let {currentSprint, currentProject} = props.getCurrentSprint()

	let projects = props.getProjects()
	// console.log(projects)
	// projects.forEach(project => console.log(props.getProjectWithName(project)))


	const [currentSprintElapsedTime, setCurrentSprintElapsedTime] = useState<number>(0)
	useEffect(()=>{
		const interval = setInterval(()=>{
			// Get current sprint and if valid get its elpased time for later consumption
			const {currentSprint} = props.getCurrentSprint()
			if(currentSprint.ID > 0){
				console.log('Running')
				setCurrentSprintElapsedTime(props.getCurrentSprintElapsedTime())
			}
		}, 100)

		// When current sprint has changed, clean up effect and relaunch
		return ()=>{clearInterval(interval)}
	}, [currentSprint.ID])









	// const [openedProjectPane, setOpenProjectPane] = useState<string>('')

	return (
		<div className="MainUI non-draggable" 
				 onClick={()=>{}} 
				 onMouseLeave={(evt)=>{
					 setPaneWillCloseInNSecs(2)
					 setControlsWillCloseInNSecs(.5)
				 }} 
				 onMouseEnter={(evt)=>{
						isPaneOpened && setPaneWillCloseInNSecs(null)
						setIsControlsOpened(true)
				 }}>



				<div className="content-wrapper draggable">
					<div className="content-wrapper-inner">
						<div className='drag-handle'></div>
						<div className="content">

								<div className="input-wrapper non-draggable">
									{/* <input type="text" placeholder={`Your Task from ${currentProject===''?'some':''} project ${currentProject}`} 
												value={ typedTask }
												onChange={(evt)=>setTypedTask(evt.target.value)}/> */}
									<Input_WithAutoComplete initialContent={typedTask} 
																					onFieldHandleChange={(newValue)=>setTypedTask(newValue)} 
																					getAutoCompleteItemsLike={(like)=>{
																						let tasks = props.getProjectWithName(currentProject).map(task => task.Name)
																						console.log(like, tasks)
																						return tasks
																					}}/>
								</div>

								<div className="timer-wrapper">
									<span>{getLongDisplay(currentSprintElapsedTime, false, '.', false)}</span>
								</div>
								
								<div className="current-details non-draggable">
										<span>(Project: </span>
										<span>
													{ 
															currentProject===''
															? typedProject===''
																? 'None Selected'
																: typedProject
															:currentProject
													}
										</span>
										<span>)</span>
										<span className={'current-details_edit'} onClick={(evt)=>setIsPaneOpened(true)}><i className="fas fa-pen"></i></span>	
								</div>

						</div>
					</div>
				</div>
				
				

				<div className={`non-draggable`}>
					<TimerControls mustbeVisible={isControlsOpened}
												 handleStop={()=>{}}
												 handleBack={()=>{}}
											   handlePlayPause={()=>{}}
												 handleNext={()=>{}}
												 handleComplete={()=>{}}/>
				</div>
				
				
				
				<div className={`non-draggable content-detailed ${isPaneOpened?'content-detailed--visible':''}`}>
					<AddEntry onChange={(typedProject)=>setTypedProject(typedProject)} 
										onAdd={typedProject => (typedProject !== '') && (projects.indexOf(typedProject) === -1) && props.getProjectWithName(typedProject) && setForceReRender(forceReRender=>!forceReRender)} 
										placeholder='Enter a Project or Add a New One' background={'rgba(0, 0, 0, 0.1)'}/>
					{
						projects.length > 0 && projects.map((project,index) => {
							return (
								doesStringContainToken(project, typedProject)
								? <CollapsableProject project={project}
																			isPaneOpened={project===typedProject} 
																			typedTask={typedTask}
																			onTypedTask={(typedTask)=>setTypedTask(typedTask)}
																			onOpeningPane={project => {
																				setTypedProject(typedProject===project ? '' : project)
																				props.setCurrentSprint(typedProject===project ? '' : project)
																			}} 
																			getProjectTasks={props.getProjectWithName} 
																			setSprintOnProjectWithName={props.setSprintOnProjectWithName} 
																			createSprintOnProjectWithName={props.createSprintOnProjectWithName} 
																			startSprintOnPrjectWithName={props.startSprintOnPrjectWithName}
																			pauseSprintOnPrjectWithName={props.pauseSprintOnPrjectWithName}
																			resumeSprintOnPrjectWithName={props.resumeSprintOnPrjectWithName}
																			stopSprintOnPrjectWithName={props.stopSprintOnPrjectWithName}
																			resetSprintOnPrjectWithName={props.resetSprintOnPrjectWithName}
																			getSprintElapsedTimeOnPrjectWithName={props.getSprintElapsedTimeOnPrjectWithName} 
																			key={index} />
								: <div key={index}></div> 
							)
						}) 
					}
				</div>


		</div>
	);


}

export default MainUI;


