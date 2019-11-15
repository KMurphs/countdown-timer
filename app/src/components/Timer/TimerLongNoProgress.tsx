import React from 'react';
import './TimerLong.css';
import {getColor} from './CountDownFormat'

type Props = {
  content: string;
	percentage: number;
}


const TimerLong: React.FC<Props> = (props) => {

	const content = props.content || '00.00' 
	const percentage = props.percentage || 25 
	const progressVisible = false



	return (
		<div className={`Timer-Long ${props.content===''?'Timer-invisible':''}`}>
			<span>{content}</span>
			<div style={{'display': `${progressVisible?'inherit':'none'}`}}></div>
			<div style={{'right': percentage + '%', 'background': getColor(100-percentage/100), 'display': `${progressVisible?'inherit':'none'}`}}></div>
		</div>
	);

}

export default TimerLong;
