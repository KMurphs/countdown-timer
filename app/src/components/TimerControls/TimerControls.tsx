import React, { useState, useEffect } from 'react';
import './TimerControls.css';




enum PLAYMODE{
	PLAY = 0,
	PAUSE
}

type Props = {
	mustbeVisible: boolean,
	handleStop: ()=>void,
	handleBack: ()=>void,
	handlePlayPause: (mode: string)=>void,
	handleNext: ()=>void,
	handleComplete: ()=>void,
	alternativeModel?: boolean,
}

const TimerControls: React.FC<Props> = (props) => {

	const [isDisplayingPlay, setIsDisplayingPlay] = useState<boolean>(true)
	const handlePlayPause = ()=>{
		isDisplayingPlay && props.handlePlayPause(PLAYMODE[PLAYMODE.PLAY])
		!isDisplayingPlay && props.handlePlayPause(PLAYMODE[PLAYMODE.PAUSE])
		setIsDisplayingPlay(isDisplayingPlay=>!isDisplayingPlay)
	}

	return (
		!(props.alternativeModel)
		?	<div className={`controls-wrapper ${props.mustbeVisible?'controls-wrapper--visible':''}`}>
				<div onClick={(evt)=>props.handleStop()}><i className="fas fa-stop"></i></div>
				<div onClick={(evt)=>props.handleBack()}><i className="fas fa-backward"></i></div>
				<div onClick={(evt)=>handlePlayPause()}><i className={`fas ${isDisplayingPlay?'fa-play':'fa-pause'}`}></i></div>
				<div onClick={(evt)=>props.handleNext()}><i className="fas fa-forward"></i></div>
				<div onClick={(evt)=>props.handleComplete()}><i className="fas fa-check"></i></div>
			</div>
		:	<div className={`controls-wrapper ${props.mustbeVisible?'controls-wrapper--visible':''}`}>
			<div onClick={(evt)=>props.handleBack()}><i className="fas fa-backward"></i></div>
			<div onClick={(evt)=>handlePlayPause()}><i className={`fas ${isDisplayingPlay?'fa-play':'fa-pause'}`}></i></div>
			<div onClick={(evt)=>props.handleNext()}><i className="fas fa-forward"></i></div>
			<div onClick={(evt)=>props.handleStop()}><i className="fas fa-stop"></i></div>
		</div>
	);


}
TimerControls.defaultProps = {
  alternativeModel: false
};
export default TimerControls;
