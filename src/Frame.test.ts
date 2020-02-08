import { CastEventsFrame, CastFrameQueue } from './Frame'
import { ICastObject, ICastEvent } from './Cast'
import { Slice } from './Utils'

const cast: ICastObject = {
  header: {
    version: 1,
    width: 10,
    height: 10,
    duration: 9
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

test('CastEventsFrame: empty events', () => {
  expect(() => new CastEventsFrame(0, 1, new Slice<ICastEvent>([]))).toThrow(/empty events/)
})

test('CastEventsFrame: inccorrect time or size', () => {
  expect(() => new CastEventsFrame(-1, 5, new Slice<ICastEvent>(cast.events, 0, 5))).toThrow(/inccorrect time or size/)
  expect(() => new CastEventsFrame(0, 0, new Slice<ICastEvent>(cast.events, 0, 5))).toThrow(/inccorrect time or size/)
})

test('CastEventsFrame: test data', () => {
  const f = new CastEventsFrame(0, 5, new Slice<ICastEvent>(cast.events, 0, 5))

  expect(f.data(0.0)).toBe('A')
  expect(f.data(0.5)).toBe('A')

  expect(f.data(1.0)).toBe('AB')
  expect(f.data(1.5)).toBe('AB')

  expect(f.data(2.0)).toBe('ABC')
  expect(f.data(2.5)).toBe('ABC')

  expect(f.data(3.0)).toBe('ABCD')
  expect(f.data(3.5)).toBe('ABCD')

  expect(f.data(4.0)).toBe('ABCDE')
  expect(f.data(4.5)).toBe('ABCDE')

  expect(f.data(3.0, 1.0)).toBe('CD')

  expect(() => f.data(5.0)).toThrow(/Cannot get data of/)
  expect(() => f.data(5.1)).toThrow(/Cannot get data of/)
})

test('CastEventsFrame: test snapshot', () => {
  const f1 = new CastEventsFrame(0, 5, new Slice<ICastEvent>(cast.events, 0, 5))
  const f2 = new CastEventsFrame(5, 10, new Slice<ICastEvent>(cast.events, 5, 10))

  f2.prev = f1

  expect(f1.snapshot()).toBe('ABCDE')
  expect(f2.snapshot()).toBe('ABCDEFGHIJ')
  expect(f2.snapshot()).toBe('ABCDEFGHIJ')

  f2.prev = null

  expect(f2.snapshot()).toBe('FGHIJ')
})

test('CastFrameQueue: test', () => {
  const q = new CastFrameQueue(cast, 4)

  expect(q.len()).toBe(3)

  expect(q.frame(0).time).toBe(0)
  expect(q.frame(0.5).time).toBe(0)
  expect(q.frame(1).time).toBe(0)
  expect(q.frame(2).time).toBe(0)
  expect(q.frame(3.5).time).toBe(0)

  expect(q.frame(4).time).toBe(4)
  expect(q.frame(4.5).time).toBe(4)
  expect(q.frame(7.8).time).toBe(4)

  expect(q.frame(8.0).time).toBe(8)
  expect(q.frame(9.0).time).toBe(8)

  const f1 = q.frame(0)
  const f2 = q.frame(4)
  const f3 = q.frame(8)

  expect(f1.prev).toBe(null)
  expect(f2.prev).toBe(f1)
  expect(f3.prev).toBe(f2)

  expect(f1.data(3.99)).toBe('ABCD')
  expect(f2.data(7.99)).toBe('EFGH')
  expect(f3.data(11.00)).toBe('IJ')
})
