import React, { useState, useEffect } from 'react';
import './InputRange.css';




type Props = {
  range: number,
  setRange: (futureRange: number) => void,
  min?: number,
  max?: number,
}

const InputRange: React.FC<Props> = ({range, setRange, min, max}) => {

  // const [range, setRange] = useState<number>(10)

  var styleVars = { '--min': min, '--max': max, '--val': range } as React.CSSProperties;
	return (
    <div className="input-range">
      <input type="range" min={min} max={max} value={range} 
             style={styleVars}
             onChange={(evt)=>setRange(evt.target.valueAsNumber)}/>
    </div>
	);

}
InputRange.defaultProps = {
  min: 0,
  max: 100, 
}
export default InputRange;


