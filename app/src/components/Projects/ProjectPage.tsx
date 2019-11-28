import React, { useState, useEffect } from 'react';
import './ProjectPage.css';
import TimerControls from '../TimerElements/TimerControls';
import { TTimerActions } from '../Main/Main';
import { getProjects, getTotalTime, getOvertime } from './ProjectsController'






type ProjectPageProps = {
	selectedProjectID: number,
	onRename: (projectID: number, newName: string)=>void,
	onSelection: (selectedProjectID: number)=>void,
	onCreate: (newProject: string)=>void,
	getTotalTime: (thisProject: string)=>string,
	getOvertime: (thisProject: string)=>number,
	onTimerAction: (action: TTimerActions)=>void,
}



const ProjectPage: React.FC<ProjectPageProps> = (props) => {

	const [typedProject, setTypedProject] = useState<string>('')
	const [, setTmpRender] = useState<boolean>(false)
	const registeredProjects = getProjects()
	const matchingProjects = registeredProjects.filter(project => project.name.toLowerCase().indexOf(typedProject.toLowerCase())!==-1).sort((a,b) => a.index - b.index)
	const onCreate = (newProject: string):void => {
		props.onCreate(newProject)
		setTmpRender(tmpRender => !tmpRender)
	}
	const onRename = (projectID: number, newName: string):void => {
		props.onRename(projectID, newName)
		setTmpRender(tmpRender => !tmpRender)
	}
	console.log(registeredProjects)
	return (
		<div className="ProjectPage non-draggable">
			<ul>



				<li className="project-add-container">
					<div className="project-add">
						<div className="project-text">
							<input type="text" placeholder="Some Project" 
										 value={typedProject}
										 onKeyDown={evt => evt.keyCode === 13 && onCreate(typedProject)}
									   onChange={evt => setTypedProject(evt.target.value)}/>
						</div>				
						<div className={`box-basic-flex project-add-btn ${matchingProjects.length===0 ? '' : 'invisible'}`}
								 onClick={evt => onCreate(typedProject)}>
							<i className="fas fa-plus"></i>
						</div>	
					</div>
				</li>


				{
					matchingProjects.map((project, index) => {
						let projectOverTime = getOvertime(project.name)
						let projectTotalTime = getTotalTime(project.name)
						return (
							<li className="project-item" key={project.index} onClick={evt => props.onSelection(project.index)}>
								<div className="project-name">
									<div className="timer-controls-container">
										<TimerControls onTimerAction={props.onTimerAction} invisibleControls={[]}/>
									</div>
									<input type="text" placeholder="Your Awesome Project" 
													onClick={evt => evt.stopPropagation()}
													value={project.name} 
													onKeyDown={evt => evt.keyCode === 13 && props.onSelection(project.index)}
													onChange={evt => onRename(project.index, evt.target.value)}/>
								</div>
								<div className="box-basic-flex project-elapsedtime">{projectTotalTime}</div>
								<div className="box-basic-flex project-overtime">{`${projectOverTime>0?'+':''}${projectOverTime}%`}</div>
								<label className="box-basic-flex item-selector">
									<input type="checkbox" checked={props.selectedProjectID===project.index} onChange={evt => props.onSelection(project.index)}/>
									<span className="item-checkmark"></span>
								</label>
							</li>
						)
					})
				}





			</ul>
		</div>
	);
}



export default ProjectPage;