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
							dominant-baseline="middle" 
							text-anchor="middle" 
							className="text" 
							fill={`${props.percentage > 100 ? 'white': 'black'}`}>
								{content}
				</text>
			</svg>
		</div>


	);

}

export default TimerShort;