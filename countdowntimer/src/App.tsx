import React, { useState, useEffect } from 'react';

import CurrentTask from './components/CurrentTask/CurrentTask';
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
    let _msg: IMsg = {
        command: '',
        data: null
    }



    const [msg, setMsg] = useState(_msg)
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
                         editTime={(hours: number, minutes: number, seconds: number)=>setMsg({command: 'editTime', data: {hours: hours, minutes: minutes, seconds: seconds}})}/> 
        </div >
    );
}

export default App;