import React from 'react';
import CurrentTask from './components/CurrentTask/CurrentTask';
import CountDown from './components/CountDown/CountDown';
import TaskDetails from './components/TaskDetails/TaskDetails.jsx';
import './App.css';

function App() {
    return ( 
        <div className = "App">
            <CurrentTask editTask={(value: string)=>{console.log(value)}} 
                         editTime={(hours: number, minutes: number, seconds: number)=>{console.log(`${hours}:${minutes}:${seconds}`)}}/> 
            <CountDown/> 
            <TaskDetails/> 
        </div >
    );
}

export default App;