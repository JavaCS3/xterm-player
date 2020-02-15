import { ICastEvent, ICastObject } from './Cast'
import { Slice } from './Utils'

export interface IFrame {
  readonly startTime: number
  readonly endTime: number
  prev: IFrame | null
  duration(): number
  data(endTime: number, startTime?: number): string
  snapshot(): string
}

class NullFrame implements IFrame {
  public prev: IFrame | null = null
  constructor(
    public readonly startTime: number = 0,
    public readonly endTime: number = 0
  ) { }
  duration(): number { return this.endTime - this.startTime }
  data(endTime: number, startTime?: number): string { return '' }
  snapshot(): string {
    if (this.prev) {
      return this.prev.snapshot()
    }
    return ''
  }
}

export type FrameSnapshotFn = (s: string) => string
export const DEFAULT_FRAME_SNAPSHOT_FN = (s: string) => s
export const NULL_FRAME: IFrame = Object.freeze<NullFrame>(new NullFrame())
export const START_FRAME: IFrame = NULL_FRAME

export class CastEventsFrame implements IFrame {
  private _prev: IFrame | null = null
  private _snapshotCache: string | null = null

  constructor(
    public readonly startTime: number,
    public readonly endTime: number,
    private _events: Slice<ICastEvent>,
    private _snapshotFn: FrameSnapshotFn = DEFAULT_FRAME_SNAPSHOT_FN
  ) {
    if (!_events.len()) { throw new Error('Invalid frame: empty events') }
    if ((startTime < 0) || ((endTime - startTime) <= 0)) { throw new Error('Invalid frame: inccorrect time or size') }
    if (_events.get(0).time >= endTime) { throw new Error('Invalid frame: invalid events') }
  }
  public set prev(f: IFrame | null) {
    if (f !== this._prev) {
      this._prev = f
      this._snapshotCache = null
    }
  }
  public get prev(): IFrame | null {
    return this._prev
  }
  public duration(): number {
    return this.endTime - this.startTime
  }
  data(endTime: number, startTime: number = -1): string {
    if ((endTime < this.startTime) || (endTime >= this.endTime)) {
      throw new Error(`Cannot get data of time(${endTime})`)
    }
    const tmp: string[] = []
    for (let i = 0; i < this._events.len(); i++) {
      const ev = this._events.get(i)
      if (ev.time > endTime) { break }
      if (startTime < ev.time && ev.time <= endTime) {
        tmp.push(ev.data)
      }
    }
    return tmp.join('')
  }
  snapshot(): string {
    if (this._snapshotCache !== null) {
      return this._snapshotCache
    }
    const tmp: string[] = new Array<string>(this._events.len())
    for (let i = 0; i < this._events.len(); i++) {
      tmp[i] = this._events.get(i).data
    }
    const ret = (this.prev ? this._snapshotFn(this.prev.snapshot() + tmp.join('')) : tmp.join(''))
    return this._snapshotCache = ret
  }
}

const DEFAULT_FRAME_EVENTS_STEP = 30

export class CastFrameQueue {
  private _endFrame: IFrame
  private _frames: Array<IFrame> = []

  constructor(
    cast: ICastObject,
    step: number = DEFAULT_FRAME_EVENTS_STEP,
    snapshotFn: FrameSnapshotFn = DEFAULT_FRAME_SNAPSHOT_FN
  ) {
    const duration = cast.header.duration
    const events = cast.events

    this._frames = new Array<IFrame>(2 + Math.ceil(events.length / step))
    this._frames[0] = START_FRAME
    this._frames[this._frames.length - 1] = this._endFrame = new NullFrame(duration, duration)

    for (let start = 0, n = 1, prev: IFrame = START_FRAME; start < events.length; start += step) {
      const end = start + step
      const slice = new Slice<ICastEvent>(cast.events, start, end) // TODO: Do a benchmark of [].slice vs Slice
      const startTime = slice.get(0).time
      const endTime = end < events.length ? events[end].time : duration
      const f = new CastEventsFrame(startTime, endTime, slice, snapshotFn)
      f.prev = prev
      this._frames[n++] = prev = f
    }

    this._endFrame.prev = this._frames[this._frames.length - 2]
  }
  public isEnd(frame: IFrame): boolean { return frame === this._endFrame }
  public len(): number { return this._frames.length - 2 }
  public frame(time: number): IFrame {
    if (time < 0) { throw new Error('Time must not be negative') }
    if (!this.len()) { throw new Error('Empty frames') }
    // bisearch
    const frames = this._frames
    let min = 1, mid = 0, max = this.len()
    if (time >= this._frames[max].endTime) { return this._endFrame }
    while (max >= min) {
      mid = (min + max) >> 1
      const f = frames[mid]
      if (time >= f.endTime) {
        min = mid + 1
      } else if (time < f.startTime) {
        max = mid - 1
      } else {
        return f
      }
    }
    return NULL_FRAME
  }
}
