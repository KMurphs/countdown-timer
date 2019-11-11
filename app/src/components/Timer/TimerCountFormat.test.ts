import {parseTimeValue, getSignificantDisplay, getLongDisplay} from './CountDownFormat'



describe('CountDown Format functions', () => {

  test('Can parse time value', () => {
    let testData = [
      { timeValue: 0, expIsNeg: false, expHours: 0, expMinutes: 0, expSeconds: 0},
      { timeValue: 1, expIsNeg: false, expHours: 0, expMinutes: 0, expSeconds: 1},
      { timeValue: -1, expIsNeg: true, expHours: 0, expMinutes: 0, expSeconds: 1},
      { timeValue: 59, expIsNeg: false, expHours: 0, expMinutes: 0, expSeconds: 59},
      { timeValue: -59, expIsNeg: true, expHours: 0, expMinutes: 0, expSeconds: 59},
      { timeValue: 60, expIsNeg: false, expHours: 0, expMinutes: 1, expSeconds: 0},
      { timeValue: -60, expIsNeg: true, expHours: 0, expMinutes: 1, expSeconds: 0},
      { timeValue: 61, expIsNeg: false, expHours: 0, expMinutes: 1, expSeconds: 1},
      { timeValue: -61, expIsNeg: true, expHours: 0, expMinutes: 1, expSeconds: 1},
      { timeValue: 3599, expIsNeg: false, expHours: 0, expMinutes: 59, expSeconds: 59},
      { timeValue: -3599, expIsNeg: true, expHours: 0, expMinutes: 59, expSeconds: 59},
      { timeValue: 3600, expIsNeg: false, expHours: 1, expMinutes: 0, expSeconds: 0},
      { timeValue: -3600, expIsNeg: true, expHours: 1, expMinutes: 0, expSeconds: 0},
      { timeValue: 3601, expIsNeg: false, expHours: 1, expMinutes: 0, expSeconds: 1},
      { timeValue: -3601, expIsNeg: true, expHours: 1, expMinutes: 0, expSeconds: 1},
      { timeValue: 86399, expIsNeg: false, expHours: 23, expMinutes: 59, expSeconds: 59},
      { timeValue: -86399, expIsNeg: true, expHours: 23, expMinutes: 59, expSeconds: 59},
      { timeValue: 86400, expIsNeg: false, expHours: 24, expMinutes: 0, expSeconds: 0},
      { timeValue: -86400, expIsNeg: true, expHours: 24, expMinutes: 0, expSeconds: 0},
      { timeValue: 86401, expIsNeg: false, expHours: 24, expMinutes: 0, expSeconds: 1},
      { timeValue: -86401, expIsNeg: true, expHours: 24, expMinutes: 0, expSeconds: 1},
    ]
    testData.forEach(item => {
      let parsedTimeValue = parseTimeValue(item.timeValue)
      expect(parsedTimeValue.isNegative).toBe(item.expIsNeg);
      expect(parsedTimeValue.hours).toBe(item.expHours);
      expect(parsedTimeValue.minutes).toBe(item.expMinutes);
      expect(parsedTimeValue.seconds).toBe(item.expSeconds);
    })

  });

  test('Can display only significant time components', () => {
    let testData = [
      { timeValue: 0, displayValue: '00'},
      { timeValue: 1, displayValue: '01'},
      { timeValue: -1, displayValue: '-01'},
      { timeValue: 59, displayValue: '59'},
      { timeValue: -59, displayValue: '-59'},
      { timeValue: 60, displayValue: '01:00'},
      { timeValue: -60, displayValue: '-01:00'},
      { timeValue: 61, displayValue: '01:01'},
      { timeValue: -61, displayValue: '-01:01'},
      { timeValue: 3599, displayValue: '59:59'},
      { timeValue: -3599, displayValue: '-59:59'},
      { timeValue: 3600, displayValue: '1h'},
      { timeValue: -3600, displayValue: '-1h'},
      { timeValue: 3601, displayValue: '1h'},
      { timeValue: -3601, displayValue: '-1h'},
      { timeValue: 86399, displayValue: '24h'},
      { timeValue: -86399, displayValue: '-24h'},
      { timeValue: 86400, displayValue: '24h'},
      { timeValue: -86400, displayValue: '-24h'},
      { timeValue: 86401, displayValue: '24h'},
      { timeValue: -86401, displayValue: '-24h'},
      { timeValue: 84600, displayValue: '24h'},
      { timeValue: -84600, displayValue: '-24h'},
      { timeValue: 88199, displayValue: '24h'},
      { timeValue: -88199, displayValue: '-24h'},
      { timeValue: 5.25, displayValue: '05'},
      { timeValue: -5.25, displayValue: '-05'},
    ]
    testData.forEach(item => {
      expect(getSignificantDisplay(item.timeValue)).toBe(item.displayValue);
    })

  });

  test('Can display only significant time components with comma as decimal separator', () => {
    let testData = [
      { timeValue: 5.25, displayValue: '05'},
      { timeValue: -5.25, displayValue: '-05'},
    ]
    testData.forEach(item => {
      expect(getSignificantDisplay(item.timeValue, ',')).toBe(item.displayValue);
    })

  });

  test('Can display long time value', () => {
    let testData = [
      { timeValue: 0, displayValue: '00.00'},
      { timeValue: 1, displayValue: '01.00'},
      { timeValue: -1, displayValue: '-01.00'},
      { timeValue: 1.25, displayValue: '01.25'},
      { timeValue: -1.25, displayValue: '-01.25'},
      { timeValue: 21.25, displayValue: '21.25'},
      { timeValue: -21.25, displayValue: '-21.25'},
      { timeValue: 59.25, displayValue: '59.25'},
      { timeValue: -59.25, displayValue: '-59.25'},
      { timeValue: 60, displayValue: '01:00.00'},
      { timeValue: -60, displayValue: '-01:00.00'},
      { timeValue: 61.25, displayValue: '01:01.25'},
      { timeValue: -61.25, displayValue: '-01:01.25'},
      { timeValue: 3599.25, displayValue: '59:59.25'},
      { timeValue: -3599.25, displayValue: '-59:59.25'},
      { timeValue: 3600, displayValue: '1:00:00.00'},
      { timeValue: -3600, displayValue: '-1:00:00.00'},
      { timeValue: 3601.25, displayValue: '1:00:01.25'},
      { timeValue: -3601.25, displayValue: '-1:00:01.25'},
    ]
    testData.forEach(item => {
      expect(getLongDisplay(item.timeValue)).toBe(item.displayValue);
    })

  });
});