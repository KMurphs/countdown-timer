import React, { useState, useEffect } from 'react';
import {Switch, Route} from 'react-router-dom';
import controller from './controller'
import './App.css';


// import Timer from './components/Timer/Timer'
import TaskPage from './components/TaskPage/TaskPage'
import SummaryPage from './components/SummaryPage/SummaryPage'

declare global {
    interface Window {
        ipcRenderer: any;
    }
}

let ipcRenderer = window.ipcRenderer


const App: React.FC = () => {





    const [, setReRenderer] = useState<boolean>(true)
    const [height, setHeight] = useState<number|null>(null)

    // // Async message handler
    // ipcRenderer.on('react-asynchronous-reply', (event: any, arg: any) => {
    //     console.log(arg)
    // })

    // // Async message sender
    // ipcRenderer.send('react-asynchronous-message', 'react async ping')

    const handleResize = () : void => {

        const monitorRate = 10
        const monitorTimeSpan = 1000
        const monitorResize = (monitorTimeSpan: number, lastHeight: number|null): void => {
            console.log('Monitoring Resizing for the next ', monitorTimeSpan, 'ms')

            let appElement = document.querySelector(".App")
            let _height = appElement === null ? 0 : appElement.clientHeight
            

            if(lastHeight === null){
                let _winHeight = 600

                // Save Current Height
                setHeight(_winHeight)

                // Synchronous message emmiter and handler
                console.log(ipcRenderer.sendSync('msgFromApp', {
                    command: 'resize-height',
                    data: _winHeight
                }))
            }

            if(_height === lastHeight){
                let _winHeight = _height

                // Save Current Height
                setHeight(_winHeight)

                // Synchronous message emmiter and handler
                console.log(ipcRenderer.sendSync('msgFromApp', {
                    command: 'resize-height',
                    data: _winHeight
                }))
            }

            
            lastHeight = _height
            monitorTimeSpan -= monitorRate
            if(monitorTimeSpan > 0){
                setTimeout(() => monitorResize(monitorTimeSpan, lastHeight), monitorRate)
            }
        }
        monitorResize(monitorTimeSpan, null)

    }

		 
	return (
		<div className="App">
            <Switch>
                <Route exact path='/' render={(props:any) => 
                    <div>
                        <TaskPage getProjects={controller.getProjectsName} 
                                    getProjectSprints={controller.getProjectWithName} 
                                    handleSprintStart={controller.startSprintOnPrjectWithName}
                                    handleSprintPause={controller.pauseSprintOnPrjectWithName}
                                    handleSprintResume={controller.resumeSprintOnPrjectWithName}
                                    handleSprintReset={controller.resetSprintOnPrjectWithName}
                                    handleSprintStop={controller.stopSprintOnPrjectWithName}
                                    getCurrentSprintElapsedTime={controller.getCurrentSprintElapsedTime}
                                    getSprintElapsedTimeByID={controller.getSprintElapsedTimeOnPrjectWithName}
                                    getCurrentSprint={controller.getCurrentSprint}
                                    setCurrentSprint={controller.setCurrentSprint}
                                    handleNewSprint={(projectName)=>{
                                        setReRenderer(reRenderer=>!reRenderer)
                                        return controller.createSprintOnProjectWithName(projectName)
                                    }}
                                    handleDetailChanges={(projectName, sprintID, changedDetails) => {
                                        setReRenderer(reRenderer=>!reRenderer)
                                        return controller.setSprintOnProjectWithName(projectName, sprintID, changedDetails)
                                    }}/> 
                    </div>
                }/>
                <Route exact path='/summary'  render={(props) => 
                    <div>
                        <SummaryPage getCurrentSprint={controller.getCurrentSprint}
                                    setCurrentSprint={controller.setCurrentSprint}
                                    getProjects={controller.getProjectsName} 
                                    getProjectSprints={controller.getProjectWithName} 
                                    onMouseAtBorders={handleResize} 
                                    getCurrentSprintElapsedTime={controller.getCurrentSprintElapsedTime}/>
                    </div>
                }/>
                {/* <Route component={Default}></Route> */}
            </Switch>
		</div>
	);
}

export default App;
