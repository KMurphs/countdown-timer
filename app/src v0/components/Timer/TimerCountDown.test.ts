import CountDownTimer from './CountDownTimer'



describe('CountDown Timer functions', () => {

  test('CountDown Timer to be target before starting', () => {
    let countDownTarget: number = 90
    let countDownTimer: CountDownTimer = new CountDownTimer(90)
    expect(countDownTimer.getSecValue()).toBe(countDownTarget);
  });


  test('CountDown Timer to decrease after starting', () => {
    let countDownTarget: number = 1
    let countDownTimer: CountDownTimer = new CountDownTimer(countDownTarget)
    let halfTarget: number = countDownTarget/2
    countDownTimer.start()
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBeLessThan(halfTarget)
    }, halfTarget*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBeLessThan(0)
    }, countDownTarget*1000)
  });


  test('CountDown Timer to stop decrease on pause', () => {
    let countDownTarget: number = 1
    let countDownTimer: CountDownTimer = new CountDownTimer(countDownTarget)
    let halfTarget: number = countDownTarget/2
    let pauseValue: number = 0
    countDownTimer.start()
    setTimeout(()=>{
      countDownTimer.pause()
      pauseValue = countDownTimer.getSecValue()
      expect(pauseValue).toBeLessThan(halfTarget)
    }, halfTarget*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBe(pauseValue)
    }, countDownTarget*1000)
  });


  test('CountDown Timer to decrease on resume after pause', () => {
    let countDownTarget: number = 1
    let countDownTimer: CountDownTimer = new CountDownTimer(countDownTarget)
    let halfTarget: number = countDownTarget/2
    let pauseValue: number = 0
    countDownTimer.start()
    setTimeout(()=>{
      countDownTimer.pause()
      pauseValue = countDownTimer.getSecValue()
      expect(pauseValue).toBeLessThan(halfTarget)
    }, halfTarget*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBe(pauseValue)
    }, countDownTarget*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBe(pauseValue)
      countDownTimer.resume()
      expect(countDownTimer.getSecValue()).toBeLessThan(pauseValue)
    }, halfTarget*3*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBeLessThan(0)
    }, halfTarget*4*1000)
  });


  test('CountDown Timer to be target after stop', () => {
    let countDownTarget: number = 1
    let countDownTimer: CountDownTimer = new CountDownTimer(countDownTarget)
    let halfTarget: number = countDownTarget/2
    let pauseValue: number = 0
    countDownTimer.start()
    setTimeout(()=>{
      countDownTimer.pause()
      pauseValue = countDownTimer.getSecValue()
      expect(pauseValue).toBeLessThan(halfTarget)
    }, halfTarget*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBe(pauseValue)
    }, countDownTarget*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBe(pauseValue)
      countDownTimer.resume()
      expect(countDownTimer.getSecValue()).toBeLessThan(pauseValue)
    }, halfTarget*3*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBeLessThan(0)
    }, halfTarget*4*1000)
    setTimeout(()=>{
      countDownTimer.stop()
      expect(countDownTimer.getSecValue()).toBe(countDownTarget);
    }, halfTarget*5*1000)
    setTimeout(()=>{
      expect(countDownTimer.getSecValue()).toBe(countDownTarget);
    }, halfTarget*6*1000)
  });
});