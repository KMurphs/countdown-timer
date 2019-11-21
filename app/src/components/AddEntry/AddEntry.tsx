import React, { useState, useEffect } from 'react';
import './AddEntry.css';


type AddProps = {
	onChange: (typedEntry: string) => void
	onAdd: (typedEntry: string) => void
	placeholder?: string
	background?: string
}

const AddEntry: React.FC<AddProps> = (props) => {
	const [typedEntry, setTypedEntry] = useState<string>('')
	const handleAddEntry = (evt: any, typedEntry: string) => {
		props.onAdd(typedEntry)
		evt.preventDefault && evt.preventDefault()
		evt.stopPropagation && evt.stopPropagation()
	}
	return (
		<div className="add-entry" style={{background: props.background}} onClick={(evt) => handleAddEntry(evt, typedEntry)}>
			<div><i className="fas fa-plus"></i></div>
			<div className="input-wrapper">
						<input  type="text" placeholder={props.placeholder} 
										value={typedEntry}
										onKeyDown={(evt) => (evt.keyCode === 13 || evt.which === 13) && handleAddEntry(evt, typedEntry)}
										onChange={(evt) => {
											setTypedEntry(evt.target.value);
											props.onChange(evt.target.value);
										}}/>
			</div>
		</div>
	)
}
AddEntry.defaultProps = {
	placeholder: 'Enter a Project or Add a New One',
	background: 'transparent'
}


export default AddEntry