import React, { useState } from 'react';
import './CurrentTask.css';

import Timer, { TimeValueType } from '../Timer/Timer';

function CurrentTask({editTask, editTime}:
                     {editTask: (newValue: string)=>void, editTime: (hours: number, minutes: number, seconds: number)=>void}) {


    const [task, _setTask] = useState('')
    const [timer, _setTimer] = useState({
        hours: 0, 
        minutes: 0, 
        seconds: 0
    })


    const setTask = (newTask: string)=>{
        editTask(newTask)
        _setTask(newTask)
    }
    const setTimer = (type: TimeValueType, value: number)=>{
        const _hours = type === TimeValueType.HOURS ? value : timer.hours
        const _minutes = type === TimeValueType.MINUTES ? value : timer.minutes
        const _seconds = type === TimeValueType.SECONDS ? value : timer.seconds
        editTime(_hours, _minutes, _seconds)
        _setTimer({
            hours: _hours, 
            minutes: _minutes, 
            seconds: _seconds
        })
    }
 

    
    return ( 
        <div className = "CurrentTask">

            <div id="task" className="task">
              <input type="text" name="task" placeholder="What do you want to work on" value={task} onChange={(evt)=>setTask(evt.target.value)}/>
            </div>

            <Timer timeObject = {{ hours: timer.hours, minutes: timer.minutes, seconds: timer.seconds }} 
                   handleChange={(type: TimeValueType, value: number)=>setTimer(type, value)}/> 

        </div >
    );
}

export default CurrentTask;


