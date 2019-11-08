import React, { useState, useEffect } from 'react';
// import './CountDown.css';

import { ITimeObject } from '../../App';
import Timer, { TimeValueType } from '../Timer/Timer';

function CountDown({countdownDuration, onCompleted}:
                   {countdownDuration: ITimeObject, onCompleted:(completedTimeStamp: Date)=>void}) {


    const [timeObject, setTimeObject] = useState<ITimeObject>({isNeg: false, hours: 0, minutes: 0, seconds: 0})        
    const [startTime, setStartTime] = useState<number>(0)        
    const [targetTime, setTargetTime] = useState<number>(0)        
    const [pauseTime, setPauseTime] = useState<number>(0)       

    useEffect(() => {
        const interval = setInterval(() => {

            if(pauseTime === 0 && targetTime>0){

                let remainingMs = targetTime - new Date().getTime()
                let remainingDt = new Date(Math.abs(remainingMs)) 
                let isNegative = remainingMs < 0
                let minutes = remainingDt.getMinutes()
                let seconds = remainingDt.getSeconds()
                let hours = Math.abs(Math.floor((getCountdownDurationInMs(countdownDuration) - remainingMs)/3600000))

                console.log(getCountdownDurationInMs(countdownDuration), Math.abs(remainingMs), getCountdownDurationInMs(countdownDuration) - Math.abs(remainingMs), Math.floor((getCountdownDurationInMs(countdownDuration) - Math.abs(remainingMs))/3600000))
                console.log(`${isNegative ? hours : hours}:${minutes}:${seconds}`, targetTime, remainingMs, isNegative, getCountdownDurationInMs(countdownDuration))
                setTimeObject({
                    isNeg: isNegative,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds,
                })
              
            }

        }, 250);
        return () => clearInterval(interval);
    }, [targetTime, pauseTime, startTime, countdownDuration]);

    
    const getCountdownDurationInMs = (timeObj: ITimeObject)=>{
        return (timeObj.hours * 3600 + timeObj.minutes * 60 + timeObj.seconds) * 1000
    }

    const handleStart = ()=>{
        let now = new Date().getTime()
        setStartTime(now);
        setTargetTime(now + getCountdownDurationInMs(countdownDuration))
    }
    const handleStop = ()=>{
        setTimeObject({
            isNeg: false,
            hours: 0,
            minutes: 0,
            seconds: 0,
        })
        setTargetTime(0)
    }
    const handlePause = ()=>{
        setPauseTime(new Date().getTime())
    }
    const handleResume = ()=>{
        let durationSincePaused = (new Date().getTime()) - pauseTime
        let shiftedStartTime = startTime + durationSincePaused
    
        setStartTime(shiftedStartTime)
        setTargetTime(shiftedStartTime + getCountdownDurationInMs(countdownDuration))
        setPauseTime(0)
    }
    
    return ( 
        <div className = "CountDown">    
            <Timer timeObject = {{isTimeNegative: timeObject.isNeg, hours: timeObject.hours, minutes: timeObject.minutes, seconds: timeObject.seconds }} 
                   isReadOnly={true}
                   handleChange={(type: TimeValueType, value: number)=>{}}/>

            <button id="start" className="start" onClick={(evt)=>{handleStart()}}>Start</button>
            <button id="stop" className="stop" onClick={(evt)=>{handleStop()}}>Stop</button>
            <button id="pause" className="pause" onClick={(evt)=>{handlePause()}}>Pause</button>
            <button id="resume" className="resume" onClick={(evt)=>{handleResume()}}>Resume</button>

        </div >
    );
}

export default CountDown;