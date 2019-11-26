import React, { useState, useEffect } from 'react';
import {Switch, Route} from 'react-router-dom';
import controller from './controller'
import './App.css';

import MainUI from './components/MainUI/MainUI';

export enum TAppHeightState {
	CLOSED = 50,
	OPENED = 400
}

declare global {
    interface Window {
        ipcRenderer: any;
    }
}

let ipcRenderer = window.ipcRenderer


const App: React.FC = () => {


    const handleResize = (appHeight: TAppHeightState) : void => {

        // Synchronous message emmiter and handler
        console.log(ipcRenderer.sendSync('msgFromApp', {
            command: 'resize-height',
            data: appHeight === TAppHeightState.CLOSED
        }))

    }

		 
	return (
		<div className="App">
            <Switch>
                <Route exact path='/' render={(props:any) => 
                    <MainUI getProjects={controller.getProjectsName}
                            getProjectWithName={controller.getProjectWithName}
                            onResizeAppHeight={handleResize}
                            createSprintOnProjectWithName={controller.createSprintOnProjectWithName}
                            setSprintOnProjectWithName={controller.setSprintOnProjectWithName}
                            startSprintOnPrjectWithName={controller.startSprintOnPrjectWithName}
                            pauseSprintOnPrjectWithName={controller.pauseSprintOnPrjectWithName}
                            resumeSprintOnPrjectWithName={controller.resumeSprintOnPrjectWithName}
                            stopSprintOnPrjectWithName={controller.stopSprintOnPrjectWithName}
                            resetSprintOnPrjectWithName={controller.resetSprintOnPrjectWithName}
                            getSprintElapsedTimeOnPrjectWithName={controller.getSprintElapsedTimeOnPrjectWithName}
                    /> 
                }/>
                {/* <Route component={Default}></Route> */}
            </Switch>
		</div>
	);
}

export default App;
