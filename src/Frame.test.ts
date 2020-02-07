import { CastFrame } from './Frame'
import { ICastObject } from './Cast'

const cast: ICastObject = {
  header: {
    version: 1,
    width: 10,
    height: 10,
    duration: 10
  },
  events: [
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' },
    { time: 3, type: 'o', data: 'D' },
    { time: 4, type: 'o', data: 'E' },
    { time: 5, type: 'o', data: 'F' },
    { time: 6, type: 'o', data: 'G' },
    { time: 7, type: 'o', data: 'H' },
    { time: 8, type: 'o', data: 'I' },
    { time: 9, type: 'o', data: 'J' },
  ]
}

test('CastFrame: test out of range', () => {
  expect(() => new CastFrame(0, 5, cast.events, 0, 9)).toThrow(/Invalid events range/)
  expect(() => new CastFrame(-1, 5, cast.events, 0, 4)).toThrow(/Invalid events range/)
  expect(() => new CastFrame(0, 5, cast.events, 0, 100)).toThrow(/Invalid events range/)
  expect(() => new CastFrame(0, 1, [])).toThrow(/Empty events/)
})

test('CastFrame: test dataOf', () => {
  const cf = new CastFrame(0, 5, cast.events, 0, 5)
  expect(cf.dataOf(0.0)).toBe('A')
  expect(cf.dataOf(0.5)).toBe('A')

  expect(cf.dataOf(1.0)).toBe('AB')
  expect(cf.dataOf(1.5)).toBe('AB')

  expect(cf.dataOf(2.0)).toBe('ABC')
  expect(cf.dataOf(2.5)).toBe('ABC')

  expect(cf.dataOf(3.0)).toBe('ABCD')
  expect(cf.dataOf(3.5)).toBe('ABCD')

  expect(cf.dataOf(4.0)).toBe('ABCDE')
  expect(cf.dataOf(4.5)).toBe('ABCDE')

  expect(cf.dataOf(5.0)).toBe('ABCDE')
  expect(() => cf.dataOf(5.1)).toThrow(/Cannot get data of/)
})

test('CastFrame: test dataOf zero size frame', () => {
  const cf = new CastFrame(0, 0, [{ time: 0, type: 'o', data: 'A' }], 0, 1)
  expect(cf.dataOf(0.0)).toBe('A')
  expect(() => cf.dataOf(5.1)).toThrow(/Cannot get data of/)
})
