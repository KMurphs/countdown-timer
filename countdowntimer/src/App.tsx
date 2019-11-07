import React, { useState, useEffect } from 'react';

import CurrentTask from './components/CurrentTask/CurrentTask';
import CountDown from './components/CountDown/CountDown';
import TaskDetails from './components/TaskDetails/TaskDetails.jsx';
import './App.css';


declare global {
    interface Window {
        ipcRenderer: any;
    }
}

let ipcRenderer = window.ipcRenderer
let ipcChannel: string = 'app.tsx'

function App() {

    interface IMsg{
        command: string,
        data: any,
    }

    const [msg, setMsg] = useState({command: '', data: ''})
    useEffect(() => {
        // Effect is normally scheduled to be run after each re-render 
        // But will Only re-run the effect if msg changes
        ipcRenderer.send(ipcChannel, msg)
    }, [msg]); 


    ipcRenderer.on(ipcChannel, (event: any, arg: IMsg) => {
        console.log(arg)
    })


    return ( 
        <div className = "App">
            <CurrentTask editTask={(value: string)=>setMsg({command: 'editTask', data: value})} 
                         editTime={(hours: number, minutes: number, seconds: number)=>setMsg({command: 'editTime', data: JSON.stringify({hours: hours, minutes: minutes, seconds: seconds})})}/> 
            <CountDown/> 
            <TaskDetails/> 
        </div >
    );
}

export default App;