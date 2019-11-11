
export const updateRate: number = 250

interface CountDownTimer {
  // members of your "class" go here.
  durationMs: number,
  startMoment: number,
  pauseMoment: number,
  start: ()=>void
  pause: ()=>void
  resume: ()=>void
  stop: ()=>void
  getSecValue: ()=>number
}



const CountDownTimer = function(this: CountDownTimer, durationSec: number){
  this.durationMs = durationSec * 1000
  this.startMoment = -1
  this.pauseMoment = -1
} as any as { new (durationSec: number): CountDownTimer; };







CountDownTimer.prototype.start = function(this: CountDownTimer){
  if(this.startMoment === -1){
    this.startMoment = new Date().getTime()
  }
}
CountDownTimer.prototype.pause = function(this: CountDownTimer){
  if(this.pauseMoment === -1){
    this.pauseMoment = new Date().getTime()
  }
}
CountDownTimer.prototype.resume = function(this: CountDownTimer){
  if(this.pauseMoment > -1){
    this.startMoment = this.startMoment + new Date().getTime() - this.pauseMoment
    this.pauseMoment = -1
  }
}
CountDownTimer.prototype.stop = function(this: CountDownTimer){
  this.startMoment = -1
  this.pauseMoment = -1
}




CountDownTimer.prototype.getSecValue = function(this: CountDownTimer){
  let now = new Date().getTime()


  // Timer has not started
  let msValue = this.durationMs 
  

  //Timer has started
  if(this.startMoment > -1){
    msValue = this.durationMs - now + this.startMoment

    
    // Timer is paused
    if(this.pauseMoment > -1){
      msValue = this.pauseMoment - this.startMoment
    }
  }

  return msValue/1000
}



export default CountDownTimer;
