import React, { useState, useEffect } from 'react';
// import './Timer.css';
import CountDownTimer from './CountDownTimer'
import TimerLong from './TimerLong'
import TimerShort from './TimerShort'
import {getSignificantDisplay, getLongDisplay} from './CountDownFormat'


const Timer: React.FC = () => {
	let target = 30
	const [countDownTimer, setCountDownTimer] = useState<CountDownTimer>(new CountDownTimer(target))
	const [tmp, setTmp] = useState<boolean>(false)



	countDownTimer.start()
	useEffect(()=>{
		const interval = setInterval(()=>{
			setTmp(tmp => !tmp)
		}, 100)
		return () => clearInterval(interval)
	})
		 
	let timerValue = countDownTimer.getSecValue()
	let percentage = 100-100*timerValue/target

	return (
		<div className="Timer">
			<TimerShort content={getSignificantDisplay(timerValue)} percentage={percentage}/>
			<input type="text" value="Countdown Timer"/>
			<input type="text" value="Countdown Timer"/>
			<TimerLong content={getLongDisplay(timerValue)} percentage={percentage}/>
		</div>
	);

}

export default Timer;



