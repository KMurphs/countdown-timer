import React, { useState } from 'react';
import './Timer.css';

export enum TimeValueType {
  HOURS = 1,
  MINUTES,
  SECONDS,
}


export interface ITimeObject { 
  hours: number,
  minutes: number,
  seconds: number,
} 

function Timer( {timeObject, handleChange}:
                {timeObject: ITimeObject; handleChange: (type: TimeValueType, newValue: number)=>void}) {
    
    const _timeObject = timeObject || {
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
    const min = 0
    const max = 999
    const padTimeEntity = (time: number) => (time+'').length === 1 ? '0'+time : parseInt(time+'')+''
    const handleChangeAndCoerce = (type: TimeValueType, newValue: number) => {
      let coercedValue = newValue 
      coercedValue = coercedValue > max ? max : coercedValue
      coercedValue = coercedValue < min ? min : coercedValue
      handleChange(type, coercedValue)
    }


    return ( 
      <div id="time" className="Timer">

        <input type="number" name="hours" placeholder="00" min={min} max={max} 
               value={_timeObject.hours === 0 ? '' : padTimeEntity(_timeObject.hours)} 
               onChange={(evt)=>handleChangeAndCoerce(TimeValueType.HOURS, parseInt(evt.target.value))}/>


        <span className="time-divider">:</span>


        <input type="number" name="minutes" placeholder="00" min={min} max={max}  
               value={_timeObject.minutes === 0 ? '' :padTimeEntity(_timeObject.minutes)} 
               onChange={(evt)=>handleChangeAndCoerce(TimeValueType.MINUTES, parseInt(evt.target.value))}/>


        <span className="time-divider">:</span>


        <input type="number" name="seconds" placeholder="00" min={min} max={max}  
               value={_timeObject.seconds === 0 ? '' :padTimeEntity(_timeObject.seconds)} 
               onChange={(evt)=>handleChangeAndCoerce(TimeValueType.SECONDS, parseInt(evt.target.value))}/>

      </div>
    );
}

export default Timer;
