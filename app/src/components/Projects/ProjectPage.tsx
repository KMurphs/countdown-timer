import React, { useState, useEffect } from 'react';
import './ProjectPage.css';
import TimerControls from '../TimerElements/TimerControls';
import { TTimerActions } from '../Main/Main';






type ProjectPageProps = {
	projectName: string,
	onRename: (selectedProject: string)=>void,
	onSelection: (selectedProject: string)=>void,
	onCreate: (newProject: string)=>void,
	getTotalTime: (thisProject: string)=>string,
	getOvertime: (thisProject: string)=>number,
	onTimerAction: (action: TTimerActions)=>void,
}



const ProjectPage: React.FC<ProjectPageProps> = (props) => {

	const [typedProject, setTypedProject] = useState<string>('')
	
	return (
		<div className="ProjectPage non-draggable">
			<ul>



				<li className="project-add-container">
					<div className="project-add">
						<div className="project-text">
							<input type="text" placeholder="Some Project" 
									   value={typedProject}
									   onChange={evt => setTypedProject(evt.target.value)}/>
						</div>				
						<div className="box-basic-flex project-add-btn"
								 onClick={evt => props.onCreate(typedProject)}>
							<i className="fas fa-plus"></i>
						</div>	
					</div>
				</li>



				<li className="project-item" onClick={evt => props.onSelection(props.projectName)}>
					<div className="project-name">
						<div className="timer-controls-container">
							<TimerControls onTimerAction={props.onTimerAction} invisibleControls={[]}/>
						</div>
						<input type="text" placeholder="Your Awesome Project" 
						 			 onClick={evt => evt.stopPropagation()}
									 value={props.projectName} 
									 onChange={evt => props.onRename(evt.target.value)}/>
					</div>
					<div className="box-basic-flex project-elapsedtime">{props.getTotalTime(props.projectName)}</div>
					<div className="box-basic-flex project-overtime">{`${props.getOvertime(props.projectName)}%`}</div>
				</li>




			</ul>
		</div>
	);
}



export default ProjectPage;