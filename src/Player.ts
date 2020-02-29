import 'xterm/css/xterm.css'
import './ui/ui.css'
import { Terminal } from 'xterm'
import { ICastObject } from './Cast'
import { SimpleTimer, MediaTimer, AnimationFrameTicker, IntervalTicker, ITimer } from './Timer'
import { CastFrameQueue, NULL_FRAME, IFrame } from './Frame'
import { PlayerView } from './ui/PlayerView'

function writeSync(term: Terminal, data: string) {
  if (data.length) {
    (<any>term)._core.writeSync(data)
  }
}

export class CastPlayer {
  private _term: Terminal
  private _timer: ITimer
  private _queue: CastFrameQueue
  private _view: PlayerView
  private _audio: HTMLAudioElement

  private _lasttime: number = 0
  private _lastframe: IFrame = NULL_FRAME

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

    this._queue = new CastFrameQueue(_cast, 30)
    this._audio = new Audio(_cast.header.audio)

    if (_cast.header.audio) {
      this._timer = new MediaTimer(this._audio)
    } else {
      this._timer = new SimpleTimer(new AnimationFrameTicker(), _cast.header.duration)
    }

    this._timer.onReady(() => {
      this._updateDuration()
      this._timer
        .onTick(this._render.bind(this))
        .onStateChange(this._updatePlaying.bind(this))
    })

    term.onKey((ev: { domEvent: KeyboardEvent }) => {
      switch (ev.domEvent.code) {
        case 'Space':
          this._togglePlayPauseReplay()
          break
        case 'ArrowRight':
          this._timer.time += 3000
          this._updateProgressAndCurrentTime()
          break
        case 'ArrowLeft':
          this._timer.time -= 3000
          this._updateProgressAndCurrentTime()
          break
      }
    })

    this._view.controlBar.onPlayButtonClick(this._togglePlayPauseReplay.bind(this))
    this._view.progressBar.onSeek((percent: number) => {
      this._timer.time = percent * this._timer.duration
      this._updateProgressAndCurrentTime()
    })
  }
  public get playbackRate(): number { return this._timer.timescale }
  public set playbackRate(rate: number) { this._timer.timescale = rate }

  public play(): void { this._timer.start() }
  public replay(): void {
    this._timer.time = 0
    this._timer.start()
  }
  public pause(): void { this._timer.pause() }
  public stop(): void { this._timer.stop() }

  private _togglePlayPauseReplay(): void {
    if (this._timer.isRunning()) {
      this.pause()
    } else if (this._timer.isStopped()) {
      this.replay()
    } else {
      this.play()
    }
  }

  private _updateDuration(): void { this._view.controlBar.duration = this._timer.duration }
  private _updatePlaying(): void { this._view.controlBar.playing = this._timer.isRunning() }
  private _updateProgressAndCurrentTime(): void {
    this._view.progressBar.progress = this._timer.progress
    this._view.controlBar.currentTime = this._timer.time
  }

  private _render(now: number): void {
    // console.log('now ' + now.toFixed(2) + ' duration: ' + this._timer.duration.toFixed(2))
    const frame = this._queue.frame(now)
    if (this._lastframe === frame && now > this._lasttime) {
      writeSync(this._term, frame.data(now, this._lasttime))
    } else {
      this._term.reset()
      if (frame.prev) {
        writeSync(this._term, frame.prev.snapshot() + frame.data(now))
      } else {
        writeSync(this._term, frame.data(now))
      }
    }
    this._lastframe = frame
    this._lasttime = now

    this._updateProgressAndCurrentTime()
  }
}
