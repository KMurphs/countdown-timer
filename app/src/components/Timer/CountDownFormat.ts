interface TimeComponents {
  isNegative: boolean,
  hours: number,
  minutes: number,
  seconds: number,
}



const getSignificantDisplay = (countdownValueSec: number, decimalSeparator: string = '.'):string => {

  let timeObj: TimeComponents = parseTimeValue(countdownValueSec)
  let display: string = ''


  if(timeObj.hours > 0){
    // if time is (23h31' to 24h30') display 24h
    display = `${Math.round(timeObj.hours + timeObj.minutes/60).toString().replace('.', decimalSeparator)}h`

  }else if(timeObj.minutes > 0){
    display = `${padWithZeros(Math.round(timeObj.minutes).toString(), 2)}:${padWithZeros(Math.round(timeObj.seconds).toString(), 2)}`

  }else{
    display = padWithZeros(Math.round(timeObj.seconds).toString(), 2)

  }

  if(countdownValueSec === 0){
    display = '00'
  }


  return `${timeObj.isNegative?'-':''}${display}`
}

const getLongDisplay = (countdownValueSec: number, useTextSeparator: boolean = false, decimalSeparator: string = '.', displayDecimal: boolean = true):string => {

  let timeObj: TimeComponents = parseTimeValue(countdownValueSec)
  let hoursSeparator = useTextSeparator ? 'H' : ':'
  let minsSeparator = useTextSeparator ? 'MIN' : ':'

  return `${timeObj.isNegative?'- ' : ''
          }${timeObj.hours>0 ? timeObj.hours+hoursSeparator : ''
          }${timeObj.minutes>0 || timeObj.hours>0?padWithZeros(timeObj.minutes.toString(), 2)+minsSeparator : ''
          }${padWithZeros(displayDecimal ? timeObj.seconds.toFixed(2): timeObj.seconds.toFixed(0), 2)}`
}


const padWithZeros = (value: string, width: number, decimalSeparator: string = '.'):string => {
  return (value.split(decimalSeparator)[0]).length < width ? padWithZeros('0'+value, width): value
}





const parseTimeValue = (timeValueSec: number):TimeComponents => {

  let remainingSec:number
  let posTimeValueSec:number = Math.abs(timeValueSec)

  remainingSec = posTimeValueSec
  let hours = Math.floor(remainingSec / 3600)
  remainingSec = posTimeValueSec - hours*3600
  let minutes = Math.floor(remainingSec / 60)
  remainingSec = posTimeValueSec - hours*3600 - minutes*60

  let timeObj: TimeComponents = {
    isNegative: timeValueSec < 0,
    hours: hours,
    minutes: minutes,
    seconds: remainingSec,
  }

  return timeObj
}

function getColor(perc: number){
  var hue = ((perc)*120).toString(10);
  return ["hsl(",hue,",60%,50%)"].join("");
}


export { parseTimeValue, getSignificantDisplay, getLongDisplay, getColor , padWithZeros}
