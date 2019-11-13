import React, { useState, useEffect } from 'react';
import './TimerShort.css';
import {getColor} from './CountDownFormat'

type Props = {
  content: string;
  percentage: number;
}


const TimerShort: React.FC<Props> = (props) => {
	const boxSize = 120
	const diameter = 100
	const circonference = diameter * 22 / 7 

	const content = props.content || '00.00' 
	const percentage = props.percentage * circonference / 100 || 25 

	// console.log('Percentage', props.percentage)
	
	return (
		<div className="Timer-Short">
			<svg viewBox={`0 0 ${boxSize} ${boxSize}`}>
				<path d={`M${boxSize/2} ${(boxSize-diameter)/2} a ${diameter/2} ${diameter/2} 0 0 1 0 ${diameter} a ${diameter/2} ${diameter/2} 0 0 1 0 -${diameter}`}
							fill="none"
							stroke="#eee"
							strokeWidth="3"
							strokeDasharray={`${circonference}, ${circonference}`}/>
				<path d={`M${boxSize/2} ${(boxSize-diameter)/2} a ${diameter/2} ${diameter/2} 0 0 1 0 ${diameter} a ${diameter/2} ${diameter/2} 0 0 1 0 -${diameter}`}
							fill={`${props.percentage > 100 ? 'red': 'none'}`}
							stroke={`${getColor(100-props.percentage/100)}`}
							strokeWidth="3"
							strokeDasharray={`${percentage},  ${circonference}`}/>
				<text x="50%" 
							y="50%" 
							dominantBaseline="middle" 
							textAnchor="middle" 
							className="text" 
							fill={`${props.percentage > 100 ? 'white': 'black'}`}>
								{content}
				</text>

				<circle cx={`${50+(50/1.2)*Math.sin(2*(22/7)*(1/100)*props.percentage)}%`} 
								cy={`${50-(50/1.2)*Math.cos(2*(22/7)*(1/100)*props.percentage)}%`}  
								r="6" stroke="none" strokeWidth="3" fill="rgba(0,0,0,0)" 
								onMouseDown={(evt)=>console.log(evt, evt.clientX, evt.clientY, evt)}/>
			</svg>
		</div>


	);

}

export default TimerShort;