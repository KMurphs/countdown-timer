import React from 'react';


// import './TaskStatus.css';

enum Status{
  SCHEDULED = 0,
  EXECUTING,
  PAUSED,
  COMPLETED,
}

type Props = {
	status: Status,
	percentage: number
}

const TaskStatus: React.FC<Props> = (props) => {

	const status = props.status || Status.SCHEDULED

	const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number):{[key: string]: number} => {
		let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
	
		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}
	const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {

    let start = polarToCartesian(x, y, radius, endAngle);
    let end = polarToCartesian(x, y, radius, startAngle);

    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    let d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
        "L", x,y,
        "L", start.x, start.y
    ].join(" ");

    return d;       
	}

	return (
		<div className="TaskStatus">

			{
				(status === Status.SCHEDULED && (<i className="far fa-clock"></i>)) ||
				(status === Status.PAUSED && (<i className="fas fa-pause-circle"></i>)) ||
				(status === Status.COMPLETED && (<i className="fas fa-check"></i>)) ||
				(status === Status.EXECUTING && (
					<svg width="24px" height="24px">
						<path id="arc" fill="white" stroke="white" strokeWidth="0" 
								  d={describeArc(10, 12, 8, 0, props.percentage > 0 && props.percentage < 100 ? 3.59 * props.percentage : 0)}/>
						<circle cx="10" cy="12" r="8" stroke="gray" strokeWidth="1" fill="rgba(0,0,0,0)"/>
					</svg>
				)) 
			}
			
		</div>
	);
}

export default TaskStatus;
