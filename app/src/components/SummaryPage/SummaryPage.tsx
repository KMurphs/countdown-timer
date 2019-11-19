import React, { useState, useEffect } from 'react';
import { Sprint } from '../../model/model';
import './SummaryPage.css';
import TimerLong from '../Timer/TimerLongNoProgress';
import { getLongDisplay } from '../Timer/CountDownFormat';
import Input_WithAutoComplete from '../Input_WithAutoComplete/Input_WithAutoComplete';


var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];



type Props = {
	getCurrentSprint: () => {currentProject: string, currentSprint: Sprint}
	setCurrentSprint: (currentProject: string, currentSprint?: Sprint) => {currentProject: string, currentSprint: Sprint}
	getCurrentSprintElapsedTime: () => number
  getProjects: ()=>string[];
	getProjectSprints: (currentProject: string) => Sprint[];
	onMouseAtBorders: () => void;
}

const SummaryPage: React.FC<Props> = (props) => {

	const {currentProject, currentSprint} = props.getCurrentSprint()
	const [_currentProject, set_currentProject] = useState<string|null>(null) //Used for local state while user is wrting in input field
	const [currentSprintElapsedTime, setCurrentSprintElapsedTime] = useState<number>(40361)
	useEffect(()=>{
		const interval = setInterval(()=>{
			// Get current sprint and if valid get its elpased time for later consumption
			const {currentSprint} = props.getCurrentSprint()
			if(currentSprint.ID > 0){
				setCurrentSprintElapsedTime(props.getCurrentSprintElapsedTime())
			}
		}, 100)

		// When current sprint has changed, clean up effect and relaunch
		return ()=>{clearInterval(interval)}
	}, [currentSprint.ID])


	// const onMouseAtBorders = () => setTimeout(props.onMouseAtBorders, 600)



	return (
		<div className="Page SummaryPage" onMouseEnter={(evt)=>props.onMouseAtBorders()} onMouseLeave={(evt)=>props.onMouseAtBorders()}>

			<div className={`Project-Container UnderlinedInput`}>
				<div className={`Project-Name `}>
					{/* <input type="text" value={_currentProject===null ? currentProject : _currentProject} 
								onChange={(evt)=>{set_currentProject(evt.target.value)}} 
								onKeyDown={(evt)=>{
									evt.keyCode===13 && props.setCurrentSprint(_currentProject !== null ? _currentProject : '') && set_currentProject(null)
								}} 
								placeholder="What are you working on?"/> */}
				<Input_WithAutoComplete initialContent='blabla' 
															  onFieldHandleChange={(newValue)=>console.log(newValue)}
																getAutoCompleteItemsLike={()=>countries/*props.getProjectSprints(currentProject).map(item => item.Name)*/}/>
				</div>

				<div className="Project-Timer">
					<TimerLong content={currentSprint.ID > 0 ? getLongDisplay(currentSprintElapsedTime) : ''} 
										percentage={currentSprint.ID > 0 ? 100*(1-1000*currentSprintElapsedTime/currentSprint.DurationMs) : 0}/>
				</div>
				<div className="Timer-Control" style={{width: `${currentProject!=='' ? 100:0}%`}}>
					<div className="Timer-Control__circle"></div>
				</div>
				<div className="Timer-Control Timer-Control--disabled"></div>
				<span className={`Current-Sprint ${currentProject!=='' ? '':'Current-Sprint-invisible'}`}>
					(<span>{currentProject!=='' && currentSprint.Name}</span>)
				</span>
			</div>


			<div className={`Sprint-Container UnderlinedInput`}>
				<Input_WithAutoComplete initialContent='blabla' 
															  onFieldHandleChange={(newValue)=>console.log(newValue)}
																getAutoCompleteItemsLike={()=>countries/*props.getProjectSprints(currentProject).map(item => item.Name)*/}/>
			</div>




			
		</div>
	);



}

export default SummaryPage;