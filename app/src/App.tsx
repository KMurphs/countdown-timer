import React, { useState, useEffect } from 'react';
import './App.css';

import Main from './components/Main/Main';

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
            <Main/>
		</div>
	);
}

export default App;
