import 'xterm/css/xterm.css'
import './ui/ui.css'
import * as xterm from 'xterm'
import { XtermPlayer as XtermPlayerApi } from 'xterm-player'
import fetchCast from './CastFetcher'
import { SimpleTimer, MediaTimer, AnimationFrameTicker, IntervalTicker, ITimer, NullTimer } from './Timer'
import { CastFrameQueue, NULL_FRAME, IFrame, NullFrameQueue, IFrameQueue } from './Frame'
import { PlayerView } from './ui/PlayerView'

function writeSync(term: xterm.Terminal, data: string) {
  if (data.length) {
    (<any>term)._core.writeSync(data)
  }
}

function createTerminal(options?: xterm.ITerminalOptions): xterm.Terminal {
  // Workaround: xterm.js only supports browser env via global variable Terminal,
  // which is different from typescript usage.
  // Use constructor from window.Terminal if it's browser env
  if (xterm.Terminal) {
    return new xterm.Terminal(options)
  }
  if (window) {
    return new window.Terminal(options)
  }
  throw new Error('Cannot create xterm Terminal object')
}

export class XtermPlayer implements XtermPlayerApi {
  public readonly el: HTMLElement

  private _url: string = ''
  private _term: xterm.Terminal
  private _view: PlayerView
  private _timer: ITimer = new NullTimer()
  private _queue: IFrameQueue = new NullFrameQueue()
  private _audio: HTMLAudioElement

  private _loading: boolean = false
  private _lasttime: number = 0
  private _lastframe: IFrame = NULL_FRAME

  constructor(
    url: string,
    el: HTMLElement
  ) {
    this.el = el
    this._url = url
    this._term = createTerminal({ fontFamily: 'Consolas, Menlo' })
    this._audio = new Audio()

    const view = this._view = new PlayerView()
    el.append(this._view.element)
    this._term.open(this._view.videoWrapper)
    this._term.focus()

    this._load()

    view.onKeyDown((ev: KeyboardEvent) => {
      switch (ev.code) {
        case 'Space':
          this._togglePlayPauseReplay()
          break
        case 'ArrowRight':
          this.currentTime += 3000
          break
        case 'ArrowLeft':
          this.currentTime -= 3000
          break
      }
    })
    view.onBigButtonClick(this._togglePlayPauseReplay.bind(this))
    view.controlBar.onPlaybackButtonClick(this._togglePlayPauseReplay.bind(this))
    view.progressBar.onSeek(percent => this.currentTime = percent * this._timer.duration)
  }

  private _load(): void {
    this._loading = true
    this._updateUIState()
    fetchCast(this._url).then((cast) => {
      this._term.reset()
      this._term.resize(cast.header.width, cast.header.height)

      this._timer.dispose()
      this._queue.dispose()

      if (cast.header.audio) {
        this._timer = new MediaTimer(this._audio)
        this._audio.src = cast.header.audio
        this._audio.load()
      } else {
        this._timer = new SimpleTimer(new AnimationFrameTicker(), cast.header.duration)
      }

      this._queue = new CastFrameQueue(cast, 30)
      this._timer.onReady(() => {
        this._loading = false
        this._updateUIState()
        this._updateDuration()
        this._updateProgressAndCurrentTime()
        this._timer
          .onTick(this._render.bind(this))
          .onStateChange(this._updateUIState.bind(this))
      })
    }).catch(console.error)
  }

  public get url(): string { return this._url }
  public set url(url: string) {
    if (url !== this._url) {
      this._url = url
      this._load()
    }
  }

  public get playbackRate(): number { return this._timer.timescale }
  public set playbackRate(rate: number) { this._timer.timescale = rate }

  public get currentTime(): number { return this._timer.time }
  public set currentTime(time: number) {
    this._timer.time = time
    this._updateProgressAndCurrentTime()
  }

  public play(): void { this._timer.start() }
  public replay(): void {
    this.currentTime = 0
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
  private _updateUIState(): void { this._view.state = this._loading ? 'Loading' : this._timer.state }
  private _updateProgressAndCurrentTime(): void {
    this._view.progressBar.progress = this._timer.progress
    this._view.controlBar.currentTime = this.currentTime
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
