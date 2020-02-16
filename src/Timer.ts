export const TICK_INTERVAL = 1000 / 30

type TickerCallback = () => void

export interface ITicker {
  start(cb: TickerCallback): void
  stop(): void
  now(): number
}

export class DummyTicker implements ITicker {
  private _cb: TickerCallback | null = null
  private _time: number = 0

  constructor(private _interval: number = TICK_INTERVAL) { }

  public start(cb: TickerCallback): void {
    this._cb = cb
  }
  public stop(): void {
    this._cb = null
  }
  public now(): number {
    return this._time
  }
  public tick(): void {
    this._time += this._interval
    if (this._cb) {
      this._cb()
    }
  }
}

export class IntervalTicker implements ITicker {
  private _tid: NodeJS.Timeout | null = null
  public constructor(public interval: number = TICK_INTERVAL) { }
  public start(cb: TickerCallback): void {
    this.stop()
    this._tid = setInterval(cb, this.interval)
  }
  public stop(): void {
    if (this._tid) {
      clearInterval(this._tid)
      this._tid = null
    }
  }
  public now(): number { return Date.now() }
}

export class AnimationFrameTicker implements ITicker {
  private _rafid: number = 0
  private _cb: TickerCallback | null = null
  private _tick() {
    if (this._cb) { this._cb() }
    if (this._rafid) {
      this._rafid = requestAnimationFrame(this._tick.bind(this))
    }
  }
  public start(cb: TickerCallback): void {
    this.stop()
    this._cb = cb
    this._rafid = requestAnimationFrame(this._tick.bind(this))
  }
  public stop(): void {
    if (this._rafid) {
      cancelAnimationFrame(this._rafid)
      this._rafid = 0
      this._cb = null
    }
  }
  public now(): number { return Date.now() }
}

const TIMESCALE_MIN = 0, TIMESCALE_MAX = 5

export enum TimerState {
  RUNNING,
  PAUSED,
  STOPPED
}

export type TickEventCallback = (time: number) => void

export class Timer {
  private _lasttime: number = 0
  private _time: number = 0
  private _state: TimerState = TimerState.STOPPED
  private _cb: TickEventCallback = () => { }

  public constructor(
    private _ticker: ITicker,
    private _timescale: number = 1,
    private _duration: number = 0
  ) { }

  public get timescale(): number { return this._timescale }
  public set timescale(timescale: number) {
    if (timescale <= TIMESCALE_MIN || timescale > TIMESCALE_MAX) {
      throw new Error(`timescale must be between ${TIMESCALE_MIN} and ${TIMESCALE_MAX}`)
    }
    this._timescale = timescale
  }

  public get time(): number { return this._time }
  public set time(time: number) {
    if (time < 0) { time = 0 }
    if (time === this._time) { return }
    if (this._duration && (time > this._duration)) {
      this._time = this._duration
      this.stop()
    } else {
      this._time = time
    }
    this._lasttime = this._ticker.now()
    this._cb(this._time)
  }

  public get state(): TimerState { return this._state }
  public get progress(): number {
    if (this._duration) {
      return this.time / this._duration
    }
    return 0.0
  }

  public onTick(cb: TickEventCallback): void { this._cb = cb }

  public isRunning(): boolean { return this._state === TimerState.RUNNING }
  public isPaused(): boolean { return this._state === TimerState.PAUSED }
  public isStopped(): boolean { return this._state === TimerState.STOPPED }

  public start(): void {
    this._state = TimerState.RUNNING
    this._lasttime = this._ticker.now()
    this._ticker.start(() => {
      const now = this._ticker.now()
      const delta = (now - this._lasttime) * this._timescale
      if (this._duration && ((this._time + delta) > this._duration)) {
        this._time = this._duration
        this.stop()
      } else {
        this._time += delta
      }
      this._lasttime = now
      this._cb(this._time)
    })
  }
  public pause(): void {
    this._state = TimerState.PAUSED
    this._ticker.stop()
  }
  public stop(): void {
    this._state = TimerState.STOPPED
    this._ticker.stop()
  }
}
