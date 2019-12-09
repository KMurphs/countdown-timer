import React  from 'react';
import './TimerRange.css';





type TimerRangeProps = {
  value: number,
  setValue: (newVal: number)=>void
}



const TimerRange: React.FC<TimerRangeProps> = ({value, setValue}) => {

  const [min, max] = [0, 100]
  let coercedValue = value > 100 
                        ? 100 
                        : value < 0 
                            ? 0 
                            : value

  const timerRangeStyle = { "--min": min, "--max": max, "--val": coercedValue } as React.CSSProperties;
	return (
    <div className="timer-range-container">
      <input type="range" 
            min={min} 
            max={max}
            step={0.01}
            style={timerRangeStyle} 
            className={`${value===0 ? 'at-zero' : ''}`}
            value={coercedValue} 
            onChange={(evt)=>setValue(parseInt(evt.target.value))}/>
    </div>
  );
  
  
}

export default TimerRange;