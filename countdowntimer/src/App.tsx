import React, { useState, useEffect } from 'react';

import CurrentTask from './components/CurrentTask/CurrentTask';
import CountDown from './components/CountDown/CountDown';
import TaskDetails from './components/TaskDetails/TaskDetails';
import './App.css';


interface IMsg{
    command: string,
    data: any,
}

export interface ITimeObject { 
    isNeg: boolean,
    hours: number,
    minutes: number,
    seconds: number,
} 


declare global {
    interface Window {
        ipcRenderer: any;
    }
}

let ipcRenderer = window.ipcRenderer
let ipcChannel: string = 'app.tsx'

function App() {


    const [timeObject, setTimeObject] = useState<ITimeObject>({isNeg: false, hours: 0, minutes: 0, seconds: 0})
    const [msg, setMsg] = useState<IMsg>({command: '', data: ''})

    
    useEffect(() => {
        ipcRenderer.send(ipcChannel, msg)
    }, [msg]); 


    ipcRenderer.on(ipcChannel, (event: any, arg: IMsg) => {
        console.log(arg)
    })


    return ( 
        <div className = "App">

            <CurrentTask editTask={(value: string)=>setMsg({command: 'editTask', data: value})} 
                         editTime={(hours: number, minutes: number, seconds: number)=>{
                             let timeObj: ITimeObject = {isNeg: false, hours: hours, minutes: minutes, seconds: seconds}; 
                             setMsg({command: 'editTime', data: timeObj}); 
                             setTimeObject(timeObj)}
                        }/> 

            <CountDown countdownDuration={timeObject} 
                       onCompleted={(completedTimeStamp: Date)=>setMsg({command: 'countdownCompleted', data: completedTimeStamp})}
                       /> 

            <TaskDetails/> 

        </div >
    );
}

export default App;