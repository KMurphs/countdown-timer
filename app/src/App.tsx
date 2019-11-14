import React, { useState, useEffect } from 'react';
import controller from './controller'
import './App.css';


// import Timer from './components/Timer/Timer'
import TaskPage from './components/TaskPage/TaskPage'

declare global {
    interface Window {
        ipcRenderer: any;
    }
}

let ipcRenderer = window.ipcRenderer


const App: React.FC = () => {

    const [, setReRenderer] = useState<boolean>(true)


    // Synchronous message emmiter and handler
    console.log(ipcRenderer.sendSync('react-synchronous-message', 'react sync ping')) 

    // Async message handler
    ipcRenderer.on('react-asynchronous-reply', (event: any, arg: any) => {
        console.log(arg)
    })

    // Async message sender
    ipcRenderer.send('react-asynchronous-message', 'react async ping')

    let projectName = 'TestProject'
    let projectSprints = controller.getProjectWithName(projectName)
		 
	return (
		<div className="App">
			{/* <Timer/> */}
            <TaskPage projectName={projectName} projectSprints={projectSprints} 
                      handleSprintStart={controller.startSprintOnPrjectWithName}
                      handleSprintPause={controller.pauseSprintOnPrjectWithName}
                      handleSprintResume={controller.resumeSprintOnPrjectWithName}
                      handleSprintStop={controller.stopSprintOnPrjectWithName}
                      getCurrentSprintElapsedTime={controller.getCurrentSprintElapsedTime}
                      getSprintElapsedTimeByID={controller.getSprintElapsedTimeOnPrjectWithName}
                      getCurrentSprint={controller.getCurrentSprint}
                      handleNewSprint={(projectName)=>{
                        setReRenderer(reRenderer=>!reRenderer)
                        return controller.createSprintOnProjectWithName(projectName)
                      }}
                      handleDetailChanges={(projectName, sprintID, changedDetails) => {
                        setReRenderer(reRenderer=>!reRenderer)
                        return controller.setSprintOnProjectWithName(projectName, sprintID, changedDetails)
                      }}/>
		</div>
	);
}

export default App;
