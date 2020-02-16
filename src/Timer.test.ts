import { IntervalTicker, AnimationFrameTicker, DummyTicker, Timer, TICK_INTERVAL } from './Timer'

const intervalTicker = new IntervalTicker()
const animationFrameTicker = new AnimationFrameTicker()

beforeEach(() => {
  intervalTicker.stop()
  animationFrameTicker.stop()
})

test('IntervalTicker: tick one time', (done) => {
  expect.assertions(1)
  const mock = jest.fn()
  const t = intervalTicker
  t.start(() => {
    t.stop()
    mock()
    expect(mock).toBeCalledTimes(1)
    done()
  })
})

test('IntervalTicker: stop intermediately after start', (done) => {
  expect.assertions(1)
  const mock = jest.fn()
  const t = intervalTicker
  t.start(mock)
  t.stop()
  setTimeout(() => {
    expect(mock).not.toBeCalled()
    done()
  }, 2 * TICK_INTERVAL)
})

test('AnimationFrameTicker: tick one time', (done) => {
  expect.assertions(1)
  const mock = jest.fn()
  const t = animationFrameTicker
  t.start(() => {
    t.stop()
    mock()
    expect(mock).toBeCalledTimes(1)
    done()
  })
})

test('AnimationFrameTicker: stop intermediately after start', (done) => {
  expect.assertions(1)
  const mock = jest.fn()
  const t = animationFrameTicker
  t.start(mock)
  t.stop()
  setTimeout(() => {
    expect(mock).not.toBeCalled()
    done()
  }, 2 * TICK_INTERVAL)
})

test('DummyTicker: test tick', () => {
  const t = new DummyTicker(1)
  const n = 5
  const mock = jest.fn()
  t.start(mock)
  for (let i = 0; i < n; i++) {
    t.tick()
  }
  expect(mock).toBeCalledTimes(n)
  expect(t.now()).toBe(n)
})

test('Timer: test duration', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(5)
})

test('Timer: test set timescale in constructor', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker, 2)
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(5 * t.timescale)
})

test('Timer: test set timescale use property', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  t.timescale = 2
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(5 * t.timescale)
})

test('Timer: dynamic set timescale #1', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  t.timescale = 2
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(7)
})

test('Timer: dynamic set timescale #2', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  t.timescale = 2
  ticker.tick()
  t.timescale = 3
  ticker.tick()
  expect(t.duration).toBe(8)
})

test('Timer: test pause', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  t.pause()
  // the following ticks are ignored
  ticker.tick()
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(6)
})

test('Timer: test state', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  expect(t.isStopped()).toBeTruthy()
  t.start()
  expect(t.isRunning()).toBeTruthy()
  t.pause()
  expect(t.isPaused()).toBeTruthy()
  t.stop()
  expect(t.isStopped()).toBeTruthy()
})

test('Timer: test onTick event', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  const mock = jest.fn()
  t.onTick(mock)
  ticker.tick()
  ticker.tick()
  expect(mock).not.toBeCalled()
  t.start()
  ticker.tick(); expect(mock).toBeCalledWith(1)
  ticker.tick(); expect(mock).toBeCalledWith(2)
  ticker.tick(); expect(mock).toBeCalledWith(3)
  t.pause() // the following ticks are ignored
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(mock).toBeCalledTimes(3)
  t.start()
  ticker.tick(); expect(mock).toBeCalledWith(4)
  ticker.tick(); expect(mock).toBeCalledWith(5)
  ticker.tick(); expect(mock).toBeCalledWith(6)
  expect(t.duration).toBe(6)
})

test('Timer: test set duration', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker)
  const mock = jest.fn()
  t.onTick(mock)
  ticker.tick()
  ticker.tick()
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(3)
  t.duration = 0
  expect(mock).toBeCalledWith(0)
  expect(t.duration).toBe(0)
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(3)
})

test('Timer: test maxDuration', () => {
  const ticker = new DummyTicker(1)
  const t = new Timer(ticker, undefined, 3)
  const mock = jest.fn()
  t.onTick(mock)
  t.start()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  ticker.tick()
  expect(t.duration).toBe(3)
  expect(mock).toBeCalledTimes(4)
  expect(t.isStopped()).toBeTruthy()
  t.duration = 100
  expect(t.duration).toBe(3)
})
