import React, { useState, useEffect } from 'react';
import './TimerLong.css';
import {getColor} from './CountDownFormat'

type Props = {
  content: string;
  percentage: number;
}


const TimerLong: React.FC<Props> = (props) => {

	const content = props.content || '00.00' 
	const percentage = props.percentage || 25 



	return (
		<div className="Timer-Long">
			<span>{content}</span>
			<div></div>
			<div style={{'right': percentage + '%', 'background': getColor(100-percentage/100)}}></div>
		</div>
	);

}

export default TimerLong;
