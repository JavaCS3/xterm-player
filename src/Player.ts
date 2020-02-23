import 'xterm/css/xterm.css'
import './ui/ui.css'
import { Terminal } from 'xterm'
import { ICastObject } from './Cast'
import { Timer, AnimationFrameTicker, IntervalTicker } from './Timer'
import { CastFrameQueue, NULL_FRAME, IFrame } from './Frame'
import { PlayerView } from './ui/PlayerView'

function writeSync(term: Terminal, data: string) {
  if (data.length) {
    (<any>term)._core.writeSync(data)
  }
}

export class CastPlayer {
  private _term: Terminal
  private _timer: Timer
  private _queue: CastFrameQueue
  private _view: PlayerView
  private _duration: number = 0

  constructor(
    private _el: HTMLElement,
    private _cast: ICastObject
  ) {
    const term = this._term = new Terminal({
      cols: _cast.header.width,
      rows: _cast.header.height,
      fontFamily: 'Consolas, Menlo'
    })

    this._view = new PlayerView()
    _el.append(this._view.element)
    this._term.open(this._view.videoWrapper)

    this._duration = _cast.header.duration

    const timer = this._timer = new Timer(new AnimationFrameTicker(), 1.0, this._duration)
    const queue = this._queue = new CastFrameQueue(_cast, 30)

    let lastTime: number = 0
    let prevFrame: IFrame = NULL_FRAME
    timer
      .onTick((now: number) => {
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
        this._view.progressBar.progress = timer.progress
        this._view.controlBar.currentTime = now
      })
      .onStateChange(() => {
        this._view.controlBar.playing = timer.isRunning()
      })

    term.onKey((ev: { domEvent: KeyboardEvent }) => {
      const timer = this._timer
      switch (ev.domEvent.code) {
        case 'Space':
          this._togglePlayPauseReplay()
          break
        case 'ArrowRight':
          timer.time += 3000
          break
        case 'ArrowLeft':
          timer.time -= 3000
          break
      }
    })

    this._view.controlBar.onPlayButtonClick(this._togglePlayPauseReplay.bind(this))
    this._view.progressBar.onSeek((percent: number) => {
      this._timer.time = percent * this._duration
    })
  }
  public get playbackRate(): number { return this._timer.timescale }
  public set playbackRate(ts: number) { this._timer.timescale = ts }

  public play(): void { this._timer.start() }
  public pause(): void { this._timer.pause() }
  public stop(): void { this._timer.stop() }
  public replay(): void {
    this._timer.time = 0
    this._timer.start()
  }

  private _togglePlayPauseReplay(): void {
    if (this._timer.isRunning()) {
      this.pause()
    } else if (this._timer.isPaused()) {
      this.play()
    } else {
      this.replay()
    }
  }
}
