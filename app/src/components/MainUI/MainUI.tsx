import React, { useState, useEffect } from 'react';
import './MainUI.css';


import { Sprint, SprintStatus } from '../../model/model';
import TimerLong from '../Timer/TimerLong';
import { getLongDisplay } from '../Timer/CountDownFormat';
import CollapsableProject from '../CollapsableContainer/CollapsableProject';
import TimerControls from '../TimerControls/TimerControls';
import AddEntry from '../AddEntry/AddEntry';
import Input_WithAutoComplete from '../Input_WithAutoComplete/Input_WithAutoComplete';
import InputRange from '../InputRange/InputRange';
import { TAppHeightState } from '../../App';

















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

	onResizeAppHeight: (height: TAppHeightState) => void
}

const MainUI: React.FC<Props> = (props) => {

	const [appHeight, setAppHeight] = useState<TAppHeightState>(TAppHeightState.CLOSED)
	const onResizeAppHeight = (newAppHeight: TAppHeightState) => {
		setAppHeight(newAppHeight)
		props.onResizeAppHeight(newAppHeight)
	}
	return (
		<div>
			<MainPage onResizeAppHeight={onResizeAppHeight}/>
			<DetailsPage isDisplayed={appHeight === TAppHeightState.OPENED}/>
		</div>

	);


}

export default MainUI;




















type MainProps = {
	onResizeAppHeight: (height: TAppHeightState) => void
}
const MainPage: React.FC<MainProps> = (props) => {


	// Used to open/close app logic
	const [mustStillCloseAppHeight, setMustStillCloseApp] = useState<boolean>(false)
	const onOpenAppHeight = () => {
		// Register that the app is now opened
		setMustStillCloseApp(false)
		// Propagate message to electron backend to actually resize the window
		props.onResizeAppHeight(TAppHeightState.OPENED)
	}
	const onCloseAppHeight = ()=>{
		// console.log('Preparing to Close App Height')
		// Scheduling closing app action in 500ms
		// if mustStillCloseAppHeight is still true in 500ms, then do the closing
		setMustStillCloseApp(true)
		setTimeout(()=>{
			setMustStillCloseApp(mustStillCloseAppHeight => {
				if(mustStillCloseAppHeight){
					// console.log('Closing App Height')
					// Propagate message to electron backend to actually resize the window
					props.onResizeAppHeight(TAppHeightState.CLOSED)
				}
				// Register that the app is now closed
				return false
			})
		}, 500)
	}



	return (

			<div className="main-page non-draggable">
				<div className="drag-handle draggable"></div>

				<div className="task-input">
					<input type="text" onClick={(evt)=>onOpenAppHeight()} onBlur={evt => onCloseAppHeight()}/>
				</div>

				<div className="project-input">
					<input type="text" onClick={(evt)=>onOpenAppHeight()} onBlur={evt => onCloseAppHeight()}/>
				</div>

				<div className="timer-display draggable"></div>
				
				<div className="timer-slider"></div>
				<div className="timer-controls"></div>
			</div>
			
	);


}


























type DetailsProps = {
	isDisplayed: boolean
}
const DetailsPage: React.FC<DetailsProps> = ({isDisplayed}) => {
	

	return (

		<div className="details-page non-draggable" 
				 style={{height: `${TAppHeightState.OPENED - TAppHeightState.CLOSED - 10}px`, 
				 display: `${isDisplayed ? 'block' : 'none'}`}}>

		</div>
			
	);


}