import React, { useState } from 'react';
import './TimerDisplay.css';
import {padWithZeros} from './CountDownFormat'

type TimeObject = {
  isNeg: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}
type Props = {
  timeObj: TimeObject;
  editable: boolean;
  useTextSeparator: boolean;
  handleTimeChange: (newDurationSec: number)=>void
}


const TimerDisplay: React.FC<Props> = (props) => {

  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false)

  const onTimeChange = (fieldName: string, fieldValue: number): void=>{
    let newDurationSec = (fieldName==='seconds' ? fieldValue : props.timeObj.seconds) + 
                         (fieldName==='minutes' ? fieldValue : props.timeObj.minutes) * 60 + 
                         (fieldName==='hours' ? fieldValue : props.timeObj.hours) * 60 * 60                      
    props.handleTimeChange(newDurationSec)
  }


	return (
		<div className={`Timer-Display ${props.useTextSeparator? 'Timer-Display--align-right' : 'Timer-Display--normal'}`} id="Timer-Display">
      <span>{props.timeObj.isNeg?'-':' '}</span>
      <span>
        <input  type="number" placeholder="00" id="hours" name="hours"
                value={padWithZeros(props.timeObj.hours+'', 2)} 
                disabled={!props.editable}
                onChange={(evt)=>onTimeChange('hours', parseFloat(evt.target.value))} 
                className={`timer-component ${props.timeObj.hours===0?'timer-component--hidden':''}`}/>
      </span>
      <span className={`timer-component timer-separator ${props.timeObj.hours===0?'timer-component--hidden':''}`}>{(props.useTextSeparator?'h':':')}</span>
      <span>
        <input  type="number" placeholder="00" id="minutes" name="minutes"
                value={padWithZeros(props.timeObj.minutes+'', 2)}
                disabled={!props.editable}
                onChange={(evt)=>onTimeChange('minutes', parseFloat(evt.target.value))} 
                className={`timer-component`}/>
      </span>
      <span className={`timer-component timer-separator`}>{(props.useTextSeparator?'m':':')}</span>
      <span>
        <input  type="number" placeholder="00" id="seconds" name="seconds"
                value={padWithZeros(props.timeObj.seconds % 1 === 0 ? props.timeObj.seconds+'' :props.timeObj.seconds.toFixed(2), 2)} 
                disabled={!props.editable}
                onChange={(evt)=>onTimeChange('seconds', parseFloat(evt.target.value))} 
                className={`timer-component ${props.timeObj.seconds % 1 === 0 ? '' : 'timer-component-seconds' }`}/>
      </span>
      <span className="timer-component timer-separator">{(props.useTextSeparator?'s':' ')}</span>
		</div>
	);

}

export default TimerDisplay;
