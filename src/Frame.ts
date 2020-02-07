import { ICastEvent, ICastObject } from './Cast'

export interface IFrame {
  readonly time: number
  readonly size: number
  setPrev(f: IFrame | null): void
  prev(): IFrame | null
  dataOf(t: number): string
}

export class CastFrame implements IFrame {
  private _prev: IFrame | null = null

  constructor(
    public readonly time: number,
    public readonly size: number,
    private _events: Array<ICastEvent>,
    private _low: number = 0, private _high: number = 0
  ) {
    if (!_events.length) { throw new Error('Empty events') }
    if ((time < 0)
      || (_low < 0)
      || (_high > _events.length)
      || (_events[_low].time < time)
      || (_high === _events.length ? false : (_events[_high].time > (time + size)))) {
      throw new Error('Invalid events range')
    }
  }
  setPrev(f: IFrame | null): void { this._prev = f }
  prev(): IFrame | null { return this._prev }
  dataOf(t: number): string {
    if ((t < this.time) || (t > (this.time + this.size))) {
      throw new Error(`Cannot get data of time(${t})`)
    }
    const tmp: string[] = []
    for (let i = this._low; i < this._high; i++) {
      const ev = this._events[i]
      if (ev.time <= t) {
        tmp.push(ev.data)
      } else {
        break
      }
    }
    return tmp.join('')
  }
}

export class FrameBuilder {
  private _frames: CastFrame[] = []

  constructor(
    private _cast: ICastObject,
    private _framesize: number = 3000
  ) {
    this._frames = new Array<CastFrame>(Math.floor(_cast.header.duration / _framesize))
    const events = _cast.events
    for (let i = 0, n = 0, prev: IFrame | null = null; i < events.length; i++) {
      const ev = events[i]
      if (ev.time >= ((1 + n) * this._framesize)) {
        const f = new CastFrame(n, _framesize, events, n, n + 1)
        f.setPrev(prev)
        this._frames[n++] = f
      }
    }
  }
  public frameOf(t: number): IFrame {
    return this._frames[0]
  }
}
