import React, { useState, useEffect } from 'react';
import './Main.css';
import './TimerElements.css';
import './ProjectPage.css';
import './TaskPage.css';



const Main: React.FC = () => {


		 
	return (
		<React.Fragment>
			<div className="Main">
				
				<div className="non-draggable box-top-left box-basic-flex current-project">
					Project: &nbsp;
					<span>None</span>
					<span className="box-basic-flex current-project-edit"><i className="fas fa-pen"></i></span>
				</div>

				<div className="non-draggable current-task">
					<input type="text" placeholder="Your Task here"/>
					<div className="timer-slider-bg"></div>
					<div className="timer-slider"></div>
				</div>

				<div className="timer-display">
					<span>12:52:23</span>
				</div>


				<div className="draggable box-hmax-left drag-handle"></div>

			</div>
		
			<TimerControls/>

			<ProjectPage/>
			{/* <TaskPage/> */}

		</React.Fragment>

	);
}

export default Main;



const TimerControls: React.FC = () => {
	return (
		<div className="TimerControls non-draggable">
			<div className="box-basic-flex timer-control"><i className="fas fa-redo"></i></div>
			<div className="box-basic-flex timer-control"><i className="fas fa-backward"></i></div>
			<div className="box-basic-flex timer-control"><i className="fas fa-play"></i></div>
			<div className="box-basic-flex timer-control"><i className="fas fa-pause"></i></div>
			<div className="box-basic-flex timer-control"><i className="fas fa-forward"></i></div>
			<div className="box-basic-flex timer-control"><i className="fas fa-stop"></i></div>
		</div>
	);
}

const TaskPage: React.FC = () => {
	return (
		<div className="TaskPage non-draggable">
			<ul>
				<li className="task-add-container">
					<div className="task-add">
						<div className="task-text">
							<input type="text" placeholder="Some task" value="First task"/>
						</div>				
						<div className="box-basic-flex task-add-btn"><i className="fas fa-plus"></i></div>	
					</div>

				</li>

				<li className="task-item">
					<div className="task-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some task" value="First task"/>
					</div>
					<div className="box-basic-flex task-elapsedtime">01:50:63</div>
					<div className="box-basic-flex task-divider">/</div>
					<div className="box-basic-flex task-elapsedtime">
						<TimerInput/>
					</div>
					<div className="box-hmax-right task-handle"></div>
				</li>
				<li className="task-item">
					<div className="task-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some task" value="First task"/>
					</div>
					<div className="box-basic-flex task-elapsedtime">01:50:63</div>
					<div className="box-basic-flex task-divider">/</div>
					<div className="box-basic-flex task-elapsedtime">
						<TimerInput/>
					</div>
					<div className="box-hmax-right task-handle"></div>
				</li>
				<li className="task-item">
					<div className="task-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some task" value="First task"/>
					</div>
					<div className="box-basic-flex task-elapsedtime">01:50:63</div>
					<div className="box-basic-flex task-divider">/</div>
					<div className="box-basic-flex task-elapsedtime">
						<TimerInput/>
					</div>
					<div className="box-hmax-right task-handle"></div>
				</li>



			</ul>
		</div>
	);
}
const TimerInput: React.FC = () => {
	return (
		<div className="TimerInput non-draggable">
			<input type="number" value="00"/>
			<span>:</span>
			<input type="number" value="00"/>
			<span>:</span>
			<input type="number" value="00"/>
		</div>
	);
}
const ProjectPage: React.FC = () => {
	return (
		<div className="ProjectPage non-draggable">
			<ul>
				<li className="project-add-container">
					<div className="project-add">
						<div className="project-text">
							<input type="text" placeholder="Some Project" value="First Project"/>
						</div>				
						<div className="box-basic-flex project-add-btn"><i className="fas fa-plus"></i></div>	
					</div>

				</li>

				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>
				<li className="project-item">
					<div className="project-name">
						<div className="timer-controls-container"><TimerControls/></div>
						<input type="text" placeholder="Some Project" value="First Project"/>
					</div>
					<div className="box-basic-flex project-elapsedtime">01:50:63</div>
					<div className="box-basic-flex project-overtime">-25%</div>
				</li>


			</ul>
		</div>
	);
}