import React, { useState, useEffect } from 'react';
import './TimerElements.css';




type TimeObject = {
  hours: number,
  minutes: number,
  seconds: number,
}
enum TTimeField {
  HOURS = 0,
  MINUTES,
  SECONDS
}
type TimerInputProps = {
  timeObj: TimeObject,
  onNewInput: (newInput: number) => void
}

const TimerInput: React.FC<TimerInputProps> = ({timeObj, onNewInput}) => {


  const handleNewInput = (timeField: TTimeField, value: number)=>{
    let newInput: number = 0
    newInput = newInput + (timeField === TTimeField.HOURS ? timeField : timeObj.hours)*3600
    newInput = newInput + (timeField === TTimeField.MINUTES ? timeField : timeObj.minutes)*60
    newInput = newInput + (timeField === TTimeField.SECONDS ? timeField : timeObj.seconds)
    onNewInput(newInput) 
  }


	return (
		<div className="TimerInput non-draggable">
			<input type="number" value={timeObj.hours} onChange={evt => handleNewInput(TTimeField.HOURS, parseInt(evt.target.value))}/>
			<span>:</span>
			<input type="number" value={timeObj.minutes} onChange={evt => handleNewInput(TTimeField.MINUTES, parseInt(evt.target.value))}/>
			<span>:</span>
			<input type="number" value={timeObj.seconds} onChange={evt => handleNewInput(TTimeField.SECONDS, parseInt(evt.target.value))}/>
		</div>
  );
  
  
}

export default TimerInput;