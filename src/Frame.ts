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

export class CastFrameQueue {
  private _frames: Array<IFrame> = []

  constructor(
    cast: ICastObject,
    private _framesize: number = 3000
  ) {
    const events = cast.events
    const count = Math.ceil(cast.header.duration / _framesize)
    this._frames = new Array<CastEventsFrame>(count)

    let prev: IFrame | null = null
    let n = 0, start = 0, end = 0
    for (; end < events.length; end++) {
      const ev = events[end]
      if (ev.time >= ((1 + n) * this._framesize)) {
        const f = new CastEventsFrame(n * this._framesize, this._framesize, new Slice<ICastEvent>(cast.events, start, end))
        f.prev = prev
        prev = this._frames[n++] = f
        start = end
      }
    }
    if (n < count) {
      const f = new CastEventsFrame(n * this._framesize, this._framesize, new Slice<ICastEvent>(cast.events, start, end))
      f.prev = prev
      this._frames[n] = f
    }
  }
  public len(): number { return this._frames.length }
  public frame(time: number): IFrame {
    return this._frames[Math.floor(time / this._framesize)]
  }
}
