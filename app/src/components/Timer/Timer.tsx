import React, { useState, useEffect } from 'react';
// import './Timer.css';
import CountDownTimer from './CountDownTimer'
import {getSignificantDisplay} from './CountDownFormat'


const Timer: React.FC = () => {

	const [countDownTimer, setCountDownTimer] = useState<CountDownTimer>(new CountDownTimer(90))
	const [tmp, setTmp] = useState<boolean>(false)

	console.log('Preparing Timer for Rerender')
	countDownTimer.start()
	useEffect(()=>{
		const interval = setInterval(()=>{
			setTmp(tmp => !tmp)
		}, 100)
		return () => clearInterval(interval)
	})
		 
	return (
		<div className="Timer">
			<span>{getSignificantDisplay(countDownTimer.getSecValue())}</span>
		</div>
	);

}

export default Timer;
