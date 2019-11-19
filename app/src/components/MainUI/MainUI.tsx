import React, { useState, useEffect } from 'react';
import './MainUI.css';

import TimerLong from '../Timer/TimerLong';
import { getLongDisplay } from '../Timer/CountDownFormat';





type Props = {
	onMouseLeave: ()=>void,
	onMouseEnter: ()=>void,
	onOpenPaneTrigger: ()=>void,
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


	return (
		<div className="MainUI" 
				 onClick={()=>{}} 
				 onMouseLeave={(evt)=>{
					 setPaneWillCloseInNSecs(.5)
					 setControlsWillCloseInNSecs(.5)
				 }} 
				 onMouseEnter={(evt)=>{
						isPaneOpened && setPaneWillCloseInNSecs(null)
						setIsControlsOpened(true)
				 }}>



				<div className="content-wrapper">
					<div className='drag-handle'></div>
					<div className="non-draggable content">

							<div className="input-wrapper">
								<input type="text" placeholder={`Your Task from project ${'currentProject'}`} onMouseDown={(evt)=>setIsPaneOpened(true)} value={'Test Task'}/>
							</div>

							<div className="timer-wrapper">
								<span>21:34:23</span>
							</div>
							
							<span className="current-details">(<span>Project dfgdfg</span>)</span>

					</div>
				</div>
				<div className={`non-draggable controls-wrapper ${isPaneOpened?'controls-wrapper--visible':''}`}>
					<div><i className="fas fa-stop"></i></div>
					<div><i className="fas fa-backward"></i></div>
				 	<div><i className="fas fa-play"></i></div>
				 	<div><i className="fas fa-forward"></i></div>
				 	<div><i className="fas fa-check"></i></div>
				</div>
				<div className={`non-draggable content-detailed ${isPaneOpened?'content-detailed--visible':''}`}></div>


		</div>
	);


}

export default MainUI;
