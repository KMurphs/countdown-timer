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

  // Convert Time Object into seconds taking into consideration the updated field
  const handleNewInput = (timeField: TTimeField, value: number)=>{
    let newInput: number = 0
    newInput = newInput + (timeField === TTimeField.HOURS ? timeField : timeObj.hours)*3600
    newInput = newInput + (timeField === TTimeField.MINUTES ? timeField : timeObj.minutes)*60
    newInput = newInput + (timeField === TTimeField.SECONDS ? timeField : timeObj.seconds)
    onNewInput(newInput) 
  }

  // Recursive function to prepend 0s to time fields when fields have less than 2 chars
  const padTimeField = (timeField: string, width: number = 2):string => timeField.length < width ? padTimeField('0'+timeField, width) : timeField

  

	return (
		<div className="TimerInput non-draggable">
			<input type="number" value={padTimeField(timeObj.hours + '')} onChange={evt => handleNewInput(TTimeField.HOURS, parseInt(evt.target.value))}/>
			<span>:</span>
			<input type="number" value={padTimeField(timeObj.minutes + '')} onChange={evt => handleNewInput(TTimeField.MINUTES, parseInt(evt.target.value))}/>
			<span>:</span>
			<input type="number" value={padTimeField(timeObj.seconds + '')} onChange={evt => handleNewInput(TTimeField.SECONDS, parseInt(evt.target.value))}/>
		</div>
  );
  
  
}

export default TimerInput;