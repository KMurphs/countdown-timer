import React from 'react';
import CurrentTask from './components/CurrentTask/CurrentTask.jsx';
import CountDown from './components/CountDown/CountDown.jsx';
import TaskDetails from './components/TaskDetails/TaskDetails.jsx';
import './App.css';

function App() {
    return ( 
        <div className = "App">
            <CurrentTask></CurrentTask> 
            <CountDown></CountDown> 
            <TaskDetails></TaskDetails> 
        </div >
    );
}

export default App;