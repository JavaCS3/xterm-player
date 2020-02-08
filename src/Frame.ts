import { ICastEvent, ICastObject } from './Cast'
import { Slice } from './Utils'

export interface IFrame {
  readonly time: number
  readonly size: number
  prev: IFrame | null
  data(endTime: number, startTime?: number): string
  snapshot(): string
}

export type FrameSnapshortFn = (s: string) => string

export const DEFAULT_FRAME_SNAPSHOT_FN = (s: string) => s

export class CastEventsFrame implements IFrame {
  private _prev: IFrame | null = null
  private _snapshortCache: string | null = null

  constructor(
    public readonly time: number,
    public readonly size: number,
    private _events: Slice<ICastEvent>,
    private _snapshotFn: FrameSnapshortFn = DEFAULT_FRAME_SNAPSHOT_FN
  ) {
    if (!_events.len()) { throw new Error('Invalid frame: empty events') }
    if (time < 0 || size <= 0) { throw new Error('Invalid frame: inccorrect time or size') }
    if (_events.get(0).time >= time + size) { throw new Error('Invalid frame: invalid events') }
  }
  public set prev(f: IFrame | null) {
    if (f !== this._prev) {
      this._prev = f
      this._snapshortCache = null
    }
  }
  public get prev(): IFrame | null {
    return this._prev
  }
  data(endTime: number, startTime: number = -1): string {
    if ((endTime < this.time) || (endTime >= (this.time + this.size))) {
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
    if (this._snapshortCache !== null) {
      return this._snapshortCache
    }
    const tmp: string[] = new Array<string>(this._events.len())
    for (let i = 0; i < this._events.len(); i++) {
      tmp[i] = this._events.get(i).data
    }
    if (this.prev) {
      return this._snapshotFn(this.prev.snapshot() + tmp.join(''))
    }
    return tmp.join('')
  }
}

const MAX_FRAME_EVENTS_COUNT = 10

export class CastFrameQueue {
  private _frames: Array<IFrame> = []

  constructor(cast: ICastObject, private _maxFrameEventsCount: number = MAX_FRAME_EVENTS_COUNT) {
    const events = cast.events
    this._frames = new Array<IFrame>(Math.ceil(events.length / _maxFrameEventsCount))

    let prev: IFrame | null = null
    let start = 0, end = 1, n = 0
    for (; end < events.length; end++) {
      if (0 === (end % this._maxFrameEventsCount)) {
        const startTime = events[start].time
        const endTime = events[end].time
        const f = new CastEventsFrame(startTime, endTime - startTime, new Slice<ICastEvent>(cast.events, start, end))
        f.prev = prev
        prev = f
        start = end
        this._frames[n++] = f
      }
    }
    if (start < events.length) {
      const startTime = events[start].time
      const endTime = events[events.length - 1].time
      const f = new CastEventsFrame(startTime, endTime - startTime + 0.1, new Slice<ICastEvent>(cast.events, start, events.length))
      f.prev = prev
      this._frames[n] = f
    }
  }
  public len(): number { return this._frames.length }
  public frame(time: number): IFrame {
    if (time < 0) { throw new Error('Time must be positive') }
    if (!this._frames.length) { throw new Error('Empty frames') }
    // bisearch
    const frames = this._frames
    let min = 0
    let max = frames.length - 1
    let mid = 0
    while (max >= min) {
      mid = (min + max) >> 1
      const f = frames[mid]
      const startTime = f.time, endTime = f.time + f.size
      if (time >= endTime) {
        min = mid + 1
      } else if (time < startTime) {
        max = mid - 1
      } else {
        return f
      }
    }
    return frames[frames.length - 1]
  }
}
