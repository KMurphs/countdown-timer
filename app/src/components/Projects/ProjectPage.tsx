import React, { useState, useEffect } from 'react';
import './ProjectPage.css';
import TimerControls from '../TimerElements/TimerControls';
import { TTimerActions } from '../Main/Main';
import { getProjects, getTotalTime, getOvertime } from './ProjectsController'






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
	const registeredProjects = getProjects()
	const matchingProjects = registeredProjects.filter(project => project.toLowerCase().indexOf(typedProject.toLowerCase())!==-1)
	
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
						<div className={`box-basic-flex project-add-btn ${matchingProjects.length===0 ? '' : 'invisible'}`}
								 onClick={evt => props.onCreate(typedProject)}>
							<i className="fas fa-plus"></i>
						</div>	
					</div>
				</li>


				{
					matchingProjects.map((project, index) => {
						let projectOverTime = getOvertime(project)
						let projectTotalTime = getTotalTime(project)
						return (
							<li className="project-item" key={index} onClick={evt => props.onSelection(project)}>
								<div className="project-name">
									<div className="timer-controls-container">
										<TimerControls onTimerAction={props.onTimerAction} invisibleControls={[]}/>
									</div>
									<input type="text" placeholder="Your Awesome Project" 
													onClick={evt => evt.stopPropagation()}
													// value={props.projectName} 
													value={project} 
													onKeyDown={evt => evt.keyCode === 13 && props.onSelection(project)}
													onChange={evt => props.onRename(evt.target.value)}/>
								</div>
								<div className="box-basic-flex project-elapsedtime">{projectTotalTime}</div>
								<div className="box-basic-flex project-overtime">{`${projectOverTime>0?'+':''}${projectOverTime}%`}</div>
							</li>
						)
					})
				}





			</ul>
		</div>
	);
}



export default ProjectPage;