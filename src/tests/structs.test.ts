import { Timer, TimeUnit } from '../structs'

test('test no tick delta time', () => {
  const timer = new Timer()

  expect(timer.deltaMs()).toBe(0)
})

test('test timer is not fully initialized', () => {
  const timer = new Timer()

  timer.tick(1)

  expect(timer.deltaMs()).toBe(0)
})

test('test tick negative timestamp', () => {
  const timer = new Timer()

  expect(() => {
    timer.tick(-1)
  }).toThrowError('Time can not earlier than previous time')
})

test('test 1 tick with TimeUnit', () => {
  const timer = new Timer()

  timer.tick(1, TimeUnit.Sec)

  expect(timer.deltaMs()).toBe(0)
  expect(timer.deltaSec()).toBe(0)

  timer.tick(1001, TimeUnit.Ms)

  expect(timer.deltaMs()).toBe(1)
  expect(timer.deltaSec()).toBe(1 / 1000)
})
