import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { ICastObject } from './Cast'
import { Timer, AnimationFrameTicker } from './Timer'
import { CastFrameQueue, NULL_FRAME, IFrame } from './Frame'

function writeSync(term: Terminal, data: string) {
  if (data.length) {
    (<any>term)._core.writeSync(data)
  }
}

export class CastPlayer {
  private _term: Terminal
  private _timer: Timer
  private _queue: CastFrameQueue

  constructor(
    private _el: HTMLElement,
    private _cast: ICastObject
  ) {
    const term = this._term = new Terminal({
      cols: _cast.header.width,
      rows: _cast.header.height,
      fontFamily: 'Consolas, Menlo'
    })
    const timer = this._timer = new Timer(new AnimationFrameTicker(), 1.0, _cast.header.duration)
    const queue = this._queue = new CastFrameQueue(_cast, 30)
    this._term.open(_el)

    let lastTime: number = 0
    let prevFrame: IFrame = NULL_FRAME
    timer.onTick((now: number) => {
      const frame = queue.frame(now)
      if (prevFrame === frame && now > lastTime) {
        writeSync(term, frame.data(now, lastTime))
      } else {
        term.reset()
        if (frame.prev) {
          writeSync(term, frame.prev.snapshot() + frame.data(now))
        } else {
          writeSync(term, frame.data(now))
        }
      }
      prevFrame = frame
      lastTime = now
    })

    term.onKey((ev: { domEvent: KeyboardEvent }) => {
      const timer = this._timer
      switch (ev.domEvent.code) {
        case 'Space':
          if (timer.isRunning()) {
            timer.pause()
          } else {
            timer.start()
          }
          break
        case 'ArrowRight':
          timer.time += 3000
          break
        case 'ArrowLeft':
          timer.time -= 3000
          break
      }
    })
  }
  public get timescale(): number { return this._timer.timescale }
  public set timescale(ts: number) { this._timer.timescale = ts }

  public get state(): string { return this._timer.state.toString() }

  public play(): void { this._timer.start() }
  public pause(): void { this._timer.pause() }
  public stop(): void { this._timer.stop() }
}
