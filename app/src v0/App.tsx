import React from 'react';
import logo from './logo.svg';
import './App.css';


import Timer from './components/Timer/Timer'

declare global {
    interface Window {
        ipcRenderer: any;
    }
}

let ipcRenderer = window.ipcRenderer


const App: React.FC = () => {

    // Synchronous message emmiter and handler
    console.log(ipcRenderer.sendSync('react-synchronous-message', 'react sync ping')) 

    // Async message handler
    ipcRenderer.on('react-asynchronous-reply', (event: any, arg: any) => {
        console.log(arg)
    })

    // Async message sender
    ipcRenderer.send('react-asynchronous-message', 'react async ping')
		 
	return (
		<div className="App">
			<Timer/>
		</div>
	);
}

export default App;
