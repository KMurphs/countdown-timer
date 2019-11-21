import React, { useState, useEffect } from 'react';
import './CollapsableContainer.css';








type Props = {
	header: string,
	data: Array<string|any>
}

const CollapsableContainer: React.FC<Props> = (props) => {

	const [isPaneOpened, setIsPaneOpened] = useState<boolean>(false)

	let header: string = props.header
	let data: Array<string|any> = props.data

	return (
		<div className="CollapsableContainer">

			<div className="collapse-header" onClick={(evt)=>setIsPaneOpened(isPaneOpened => !isPaneOpened)}>
				<div className={`collapse-indicator ${isPaneOpened?'collapse-indicator--opened':''}`}><i className="fas fa-caret-right"></i></div>
				<div className='collapse-header-text'>{header}</div>
			</div>

			<div className={`collapse-body ${isPaneOpened?'collapse-body--opened':''}`}>
				{data.length > 0 && data.map((item, index) => (
					<div key={index}>
						{item}
					</div>
				))}
			</div>


		</div>
	);


}

export default CollapsableContainer;
