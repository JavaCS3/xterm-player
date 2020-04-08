import 'xterm/css/xterm.css'
import './ui/ui.scss'
import * as xterm from 'xterm'
import { XtermPlayer as XtermPlayerApi, IPlayerOptions, IPlayerState } from 'xterm-player'
import { SimpleTimer, MediaTimer, AnimationFrameTicker, ITimer, NullTimer } from './Timer'
import { CastFrameQueue, NULL_FRAME, IFrame, NullFrameQueue, IFrameQueue } from './Frame'
import { EventEmitter, IEvent } from './Events'
import { PlayerView } from './ui/PlayerView'
import fetchCast from './CastFetcher'

function writeSync(term: xterm.Terminal, data: string) {
  if (data.length) {
    (<any>term)._core.writeSync(data)
  }
}

function createTerminal(options: IPlayerOptions): xterm.Terminal {
  const opts: xterm.ITerminalOptions = {
    fontSize: options.fontSize || 15,
    fontFamily: options.fontFamily || 'Consolas, Menlo',
    fontWeight: options.fontWeight || 'normal',
    fontWeightBold: options.fontWeightBold || 'bold',
    theme: options.theme || {},
  }

  // Workaround: xterm.js only supports browser env via global variable Terminal,
  // which is different from typescript usage.
  // Use constructor from window.Terminal if it's browser env
  if (xterm.Terminal) {
    return new xterm.Terminal(opts)
  }
  if (window) {
    return new window.Terminal(opts)
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

  private _onReady = new EventEmitter<void>()
  private _onLoading = new EventEmitter<void>()
  private _onAfterRender = new EventEmitter<void>()
  private _onCurrentTimeChanged = new EventEmitter<void>()
  private _onStateChanged = new EventEmitter<void>()

  public get onReady(): IEvent<void> { return this._onReady.onEvent }
  public get onLoading(): IEvent<void> { return this._onLoading.onEvent }
  public get onAfterRender(): IEvent<void> { return this._onAfterRender.onEvent }
  public get onCurrentTimeChanged(): IEvent<void> { return this._onCurrentTimeChanged.onEvent }
  public get onStateChanged(): IEvent<void> { return this._onStateChanged.onEvent }

  constructor(
    url: string,
    el: HTMLElement,
    options: IPlayerOptions = {}
  ) {
    this.el = el
    this._url = url
    this._term = createTerminal(options)
    this._audio = new Audio()

    const view = this._view = new PlayerView(this)
    el.append(this._view.element)
    this._term.open(this._view.videoWrapper)
    this._term.focus()

    this._load()

    view.controlBar.onSeek((percent: number) => this.currentTime = percent * this._timer.duration)
  }

  private _load(): void {
    this._loading = true
    this._onLoading.fire()
    this._onStateChanged.fire()
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
        this._onReady.fire()
        this._onStateChanged.fire()
        this._timer.onTick(this._render.bind(this))
        this._timer.onStateChange(() => this._onStateChanged.fire())
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
  public set playbackRate(rate: number) {
    this._view.controlBar.currentPlaybackRate = this._timer.timescale = rate
  }

  public get currentTime(): number { return this._timer.time }
  public set currentTime(time: number) {
    this._timer.time = time
    this._onCurrentTimeChanged.fire()
  }

  public get duration(): number { return this._timer.duration }

  public get state(): IPlayerState {
    return this._loading ? 'Loading' : this._timer.state
  }

  public play(): void { this._timer.start() }
  public replay(): void {
    this.currentTime = 0
    this._timer.start()
  }
  public pause(): void { this._timer.pause() }
  public stop(): void { this._timer.stop() }

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

    this._onAfterRender.fire()
  }
}
