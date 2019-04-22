import { Timer, TimeUnit } from '../structs'

test('test no tick delta time', () => {
  const timer = new Timer()

  expect(timer.deltaMs()).toBe(0)
})

test('test 1 tick delta time', () => {
  const timer = new Timer()

  timer.tick(1)

  expect(timer.deltaMs()).toBe(1)
})

test('test tick negative timestamp', () => {
  const timer = new Timer()

  timer.tick(-1)

  expect(timer.deltaMs()).toBe(0)
})

test('test 1 tick with TimeUnit', () => {
  const timer = new Timer()

  timer.tick(1, TimeUnit.Sec)

  expect(timer.deltaMs()).toBe(1000)
  expect(timer.deltaSec()).toBe(1)

  timer.tick(1001, TimeUnit.Ms)

  expect(timer.deltaMs()).toBe(1)
  expect(timer.deltaSec()).toBe(1 / 1000)
})
