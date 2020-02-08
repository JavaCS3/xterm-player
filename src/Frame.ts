import { ICastEvent, ICastObject } from './Cast'
import { Slice } from './Utils'

export interface IFrame {
  readonly time: number
  readonly size: number
  prev: IFrame | null
  data(endTime: number, startTime?: number): string
}

export class CastEventsFrame implements IFrame {
  public prev: IFrame | null = null

  constructor(
    public readonly time: number,
    public readonly size: number,
    private _events: Slice<ICastEvent>
  ) {
    if (!_events.len()) { throw new Error('Invalid frame: empty events') }
    if (time < 0 || size <= 0) { throw new Error('Invalid frame: inccorrect time or size') }
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
