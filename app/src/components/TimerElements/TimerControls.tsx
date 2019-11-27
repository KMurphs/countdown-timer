import React, { useState, useEffect } from 'react';
import './TimerElements.css';
import { TTimerActions } from '../Main/Main';







type TimerControlsProps = {
	onTimerAction: (action: TTimerActions) => void,
	invisibleControls?: TTimerActions[]
}



const TimerControls: React.FC<TimerControlsProps> = ({onTimerAction, invisibleControls = []}) => {

	const [isPlaying, setIsPlaying] = useState<boolean>(false)



	
	return (
		<div className="TimerControls non-draggable">

			{
				(invisibleControls.indexOf(TTimerActions.RESTART_ALL) === -1) && (
					<div className="box-basic-flex timer-control" onClick={evt=>onTimerAction(TTimerActions.RESTART_ALL)}><i className="fas fa-redo"></i></div>
				)
			}
			{
				(invisibleControls.indexOf(TTimerActions.PREVIOUS) === -1) && (
					<div className="box-basic-flex timer-control" onClick={evt=>onTimerAction(TTimerActions.PREVIOUS)}><i className="fas fa-backward"></i></div>
				)
			}
			



			{
				!isPlaying && (
					<div className="box-basic-flex timer-control" 
							 onClick={(evt => {
									setIsPlaying(isPlaying=>!isPlaying); 
									onTimerAction(TTimerActions.PLAY)
							 })}>
						<i className="fas fa-play"></i>
					</div>
				)
			}
			{
				isPlaying && (
					<div className="box-basic-flex timer-control" 
							 onClick={(evt => {
									setIsPlaying(isPlaying=>!isPlaying); 
									onTimerAction(TTimerActions.PAUSE)
							 })}>
						<i className="fas fa-pause"></i>
					</div>
				)
			}





			{
				(invisibleControls.indexOf(TTimerActions.NEXT) === -1) && (
					<div className="box-basic-flex timer-control" onClick={evt=>onTimerAction(TTimerActions.NEXT)}><i className="fas fa-forward"></i></div>
				)
			}
			{
				(invisibleControls.indexOf(TTimerActions.STOP) === -1) && (
					<div className="box-basic-flex timer-control" onClick={evt=>onTimerAction(TTimerActions.STOP)}><i className="fas fa-stop"></i></div>
				)
			}	
			
			
		</div>
	);
}



export default TimerControls;
