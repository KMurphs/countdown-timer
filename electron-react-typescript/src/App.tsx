import React from 'react';
import logo from './logo.svg';
import './App.css';


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
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a className="App-link"
				   href="https://reactjs.org"
				   target="_blank"
				   rel="noopener noreferrer">
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
