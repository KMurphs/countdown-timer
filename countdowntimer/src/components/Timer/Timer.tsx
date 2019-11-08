import React from 'react';
import './Timer.css';

export enum TimeValueType {
  HOURS = 1,
  MINUTES,
  SECONDS,
}


export interface ITimeObject { 
  isTimeNegative: boolean,
  hours: number,
  minutes: number,
  seconds: number,
} 

function Timer( {timeObject, isReadOnly, handleChange}:
                {timeObject: ITimeObject; isReadOnly: boolean; handleChange: (type: TimeValueType, newValue: number)=>void}) {
    
    const _timeObject = timeObject || {
      isTimeNegative: false,
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

        <span className={`time-sign ${timeObject.isTimeNegative ? 'time-sign--visible' : ''}`}>
          -
        </span>

        <input type="number" name="hours" placeholder="00" min={min} max={max} 
               disabled={isReadOnly}
               className={`timer-element--visible ${isReadOnly && _timeObject.hours === 0 ? 'timer-element--invisible' : ''}`}
               value={_timeObject.hours === 0 ? '' : padTimeEntity(_timeObject.hours)} 
               onChange={(evt)=>handleChangeAndCoerce(TimeValueType.HOURS, parseInt(evt.target.value))}/>


        <span className={`time-divider timer-element--visible ${isReadOnly && _timeObject.hours === 0 ? 'timer-element--invisible' : ''}`}>
          :
        </span>


        <input type="number" name="minutes" placeholder="00" min={min} max={max}  
               disabled={isReadOnly}
               className={`timer-element--visible ${isReadOnly && _timeObject.hours === 0 && _timeObject.minutes === 0 ? 'timer-element--invisible' : ''}`}
               value={_timeObject.minutes === 0 ? '' :padTimeEntity(_timeObject.minutes)} 
               onChange={(evt)=>handleChangeAndCoerce(TimeValueType.MINUTES, parseInt(evt.target.value))}/>


        <span className={`time-divider timer-element--visible ${isReadOnly && _timeObject.hours === 0 && _timeObject.minutes === 0  ? 'timer-element--invisible' : ''}`}>
          :
        </span>


        <input type="number" name="seconds" placeholder="00" min={min} max={max}  
               disabled={isReadOnly}
               value={_timeObject.seconds === 0 ? '' :padTimeEntity(_timeObject.seconds)} 
               onChange={(evt)=>handleChangeAndCoerce(TimeValueType.SECONDS, parseInt(evt.target.value))}/>

      </div>
    );
}

export default Timer;
