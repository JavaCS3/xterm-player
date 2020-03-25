import { IDisposable } from './Types'
import { addDisposableDomListener } from './ui/DomHelper'

export const TICK_INTERVAL = 1000 / 30

type TickerCallback = () => void

export interface ITicker {
  readonly running: boolean
  start(cb: TickerCallback): void
  stop(): void
  now(): number
}

export class DummyTicker implements ITicker {
  private _cb: TickerCallback | null = null
  private _time: number = 0

  constructor(private _interval: number = TICK_INTERVAL) { }

  public get running(): boolean { return this._cb !== null }

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

  public get running(): boolean { return this._tid != null }
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

  public get running(): boolean { return this._rafid != 0 }

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
    }
    this._cb = null
  }
  public now(): number { return performance.now() }
}

const TIMESCALE_MIN = 0, TIMESCALE_MAX = 5

export type ITimerState = 'Running' | 'Paused' | 'Stopped'
export type ITimerReadyCallback = () => void
export type ITimerTickCallback = (time: number) => void
export type ITimerStateChangeCallback = (state: ITimerState) => void

const NULL_FN = () => { }

export interface ITimer extends IDisposable {
  readonly ready: boolean
  readonly state: ITimerState
  readonly duration: number
  readonly progress: number
  timescale: number
  time: number

  start(): void
  pause(): void
  stop(): void

  isRunning(): boolean
  isPaused(): boolean
  isStopped(): boolean

  onReady(cb: ITimerReadyCallback): ITimer
  onTick(cb: ITimerTickCallback): ITimer
  onStateChange(cb: ITimerStateChangeCallback): ITimer
}

export class NullTimer implements ITimer {
  ready: boolean = false
  state: ITimerState = 'Paused'
  duration: number = NaN
  progress: number = NaN
  timescale: number = 1
  time: number = 0

  start(): void { }
  pause(): void { }
  stop(): void { }
  isRunning(): boolean { return false }
  isPaused(): boolean { return true }
  isStopped(): boolean { return false }
  onReady(cb: ITimerReadyCallback): ITimer { return this }
  onTick(cb: ITimerTickCallback): ITimer { return this }
  onStateChange(cb: ITimerStateChangeCallback): ITimer { return this }
  dispose(): void { }
}

export class SimpleTimer implements ITimer {
  public readonly ready = true
  private _lasttime: number = 0
  private _time: number = 0
  private _timescale: number = 1
  private _state: ITimerState = 'Paused'
  private _onReadyCb: ITimerReadyCallback = NULL_FN
  private _onTickCb: ITimerTickCallback = NULL_FN
  private _onStateChangeCb: ITimerStateChangeCallback = NULL_FN

  public constructor(
    private _ticker: ITicker,
    private _duration: number = Infinity
  ) { }

  public get duration(): number { return this._duration }

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
    if (time > this._duration) {
      this._time = this._duration
      this.stop()
    } else {
      this._time = time
    }
    this._lasttime = this._ticker.now()
  }

  private _setState(state: ITimerState): void {
    if (this._state !== state) {
      this._state = state
      this._onStateChangeCb(this._state)
    }
  }

  public get state(): ITimerState { return this._state }
  public get progress(): number { return this.time / this._duration }

  public onReady(cb: ITimerReadyCallback): ITimer {
    this._onReadyCb = cb
    this._onReadyCb() // This is intended to make initialization process the same as MediaTimer
    return this
  }
  public onTick(cb: ITimerTickCallback): ITimer {
    this._onTickCb = cb
    return this
  }
  public onStateChange(cb: ITimerStateChangeCallback): ITimer {
    this._onStateChangeCb = cb
    return this
  }

  public isRunning(): boolean { return this._state === 'Running' }
  public isPaused(): boolean { return this._state === 'Paused' }
  public isStopped(): boolean { return this._state === 'Stopped' }

  public start(): void {
    if (this.isRunning()) {
      return
    }
    if ((!this.isRunning()) && (this.time >= this._duration)) {
      return
    }
    this._setState('Running')
    this._lasttime = this._ticker.now()
    this._ticker.start(() => {
      const now = this._ticker.now()
      const delta = (now - this._lasttime) * this._timescale
      if ((this._time + delta) > this._duration) {
        this._time = this._duration
        this.stop()
      } else {
        this._time += delta
      }
      this._lasttime = now
      this._onTickCb(this._time)
    })
  }
  public pause(): void {
    this._ticker.stop()
    this._setState('Paused')
  }
  public stop(): void {
    this._ticker.stop()
    this._setState('Stopped')
  }
  public dispose(): void {
    this._onReadyCb = this._onStateChangeCb = this._onTickCb = NULL_FN
    this.stop()
  }
}

export class MediaTimer implements ITimer {
  private _ready: boolean = false
  private _state: ITimerState = 'Paused'
  private _onReadyCb: ITimerReadyCallback = NULL_FN
  private _onTickCb: ITimerTickCallback = NULL_FN
  private _onStateChangeCb: ITimerStateChangeCallback = NULL_FN

  private _disposes: IDisposable[] = []

  constructor(
    private _media: HTMLMediaElement,
    private _ticker: ITicker = new AnimationFrameTicker()
  ) {
    this._disposes = [
      addDisposableDomListener(_media, 'error', () => { console.error('error') }),
      addDisposableDomListener(_media, 'waiting', () => { console.log('waiting') }),
      addDisposableDomListener(_media, 'durationchange', () => { console.log('durationchange') }),
      addDisposableDomListener(_media, 'canplay', () => { this._ready = true; this._onReadyCb() }),
      addDisposableDomListener(_media, 'play', () => { this._setState('Running') }),
      addDisposableDomListener(_media, 'pause', () => { this._setState('Paused') }),
      addDisposableDomListener(_media, 'ended', () => {
        this.stop()
        this._onTickCb(this.time)
      }),
      addDisposableDomListener(_media, 'seeking', () => {
        if (this.isRunning()) {
          this._ticker.stop()
        }
      }),
      addDisposableDomListener(_media, 'seeked', () => {
        if (this.isRunning()) {
          this._ticker.start(this._tick.bind(this))
        }
      }),
    ]
  }

  public get ready(): boolean { return this._ready }
  public get progress(): number { return this._media.currentTime / this._media.duration }
  public get duration(): number { return this._media.duration * 1000 }
  public get state(): ITimerState { return this._state }
  public get time(): number { return this._media.currentTime * 1000 }
  public set time(t: number) { if (this._ready) { this._media.currentTime = t / 1000 } }
  public get timescale(): number { return this._media.playbackRate }
  public set timescale(s: number) { this._media.playbackRate = s }

  private _setState(state: ITimerState) {
    if (this._state !== state) {
      this._state = state
      this._onStateChangeCb(this._state)
    }
  }

  private _tick() {
    // In Safari, the audio currentTime may exceed it's duration,
    // or a little bit less than the duration
    if (this.isStopped() && this._ticker.running) {
      this.stop()
    }
    this._onTickCb(this.time)
  }

  public start(): void {
    if (!this._ready) { return }
    this._ticker.start(this._tick.bind(this))
    this._media.play()
  }
  public pause(): void {
    if (!this._ready) { return }
    this._ticker.stop()
    this._media.pause()
  }
  public stop(): void {
    if (!this._ready) { return }
    this._ticker.stop()
    this._setState('Stopped')
  }
  public isRunning(): boolean { return !this._media.paused && !this._media.ended }
  public isPaused(): boolean { return this._media.paused }
  public isStopped(): boolean { return this._media.ended || (this._ready && (this._media.currentTime >= this._media.duration)) }

  public onReady(cb: ITimerReadyCallback): ITimer {
    this._onReadyCb = cb
    return this
  }
  public onTick(cb: ITimerTickCallback): ITimer {
    this._onTickCb = cb
    return this
  }
  public onStateChange(cb: ITimerStateChangeCallback): ITimer {
    this._onStateChangeCb = cb
    return this
  }
  public dispose(): void {
    this._ready = false
    this._media.pause()
    this._disposes.forEach(d => d.dispose())

    this._onReadyCb = this._onStateChangeCb = this._onTickCb = NULL_FN
    this._ticker.stop()
    this._setState('Stopped')
  }
}
