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
  private _vtimer: Timer
  private _queue: CastFrameQueue
  private _view: PlayerView
  private _audio: HTMLAudioElement

  private _canplay: boolean = false
  private _durationMs: number = 0
  private _lastVTimeMs: number = 0
  private _lastVFrame: IFrame = NULL_FRAME

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

    this._durationMs = _cast.header.duration
    this._queue = new CastFrameQueue(_cast, 30)
    this._vtimer = new Timer(new AnimationFrameTicker(), 1.0, this._durationMs)
    const audio = this._audio = new Audio(_cast.header.audio)

    if (_cast.header.audio) {
      this._canplay = false
      audio.oncanplay = (e) => {
        this._canplay = true
      }
      audio.onloadedmetadata = () => {
        console.log(audio.duration)
        this._durationMs = audio.duration * 1000
        this._vtimer.stop()
        this._vtimer = new Timer(new AnimationFrameTicker(), 1.0, this._durationMs)
        this._vtimer
          .onTick(this._onTick.bind(this))
          .onStateChange(this._updatePlaying.bind(this))
        this._updateDuration()
      }
      audio.ontimeupdate = () => {
        const delta = this._audio.currentTime * 1000 - this._vtimer.time
        if (Math.abs(delta) > 30) {
          console.debug('av sync delta', delta)
          this._vtimer.syncTime(this._audio.currentTime * 1000)
        }
      }
      audio.onended = () => {
        this._onTick(this.now())
        this.stop()
      }
    } else {
      this._canplay = true
      this._updateDuration()
      this._vtimer
        .onTick(this._onTick.bind(this))
        .onStateChange(this._updatePlaying.bind(this))
    }

    term.onKey((ev: { domEvent: KeyboardEvent }) => {
      if (!this._canplay) { return }

      switch (ev.domEvent.code) {
        case 'Space':
          this._togglePlayPauseReplay()
          break
        case 'ArrowRight':
          this._audio.currentTime += 3
          this._vtimer.time += 3000
          break
        case 'ArrowLeft':
          this._audio.currentTime -= 3
          this._vtimer.time -= 3000
          break
      }
    })

    this._view.controlBar.onPlayButtonClick(this._togglePlayPauseReplay.bind(this))
    this._view.progressBar.onSeek((percent: number) => {
      if (!this._canplay) { return }

      this._vtimer.time = percent * this._durationMs
      this._audio.currentTime = percent * this._durationMs / 1000
    })
  }
  public get playbackRate(): number {
    return this._vtimer.timescale
  }
  public set playbackRate(rate: number) {
    this._audio.playbackRate = this._vtimer.timescale = rate
  }

  public play(): void {
    this._audio.play()
    this._vtimer.start()
  }
  public replay(): void {
    this._audio.currentTime = 0
    this._audio.play()

    this._vtimer.time = 0
    this._vtimer.start()
  }
  public pause(): void {
    this._audio.pause()
    this._vtimer.pause()
  }
  public stop(): void {
    this._vtimer.stop()
  }

  public isPlaying(): boolean {
    if (this._audio.src) { return !this._audio.paused }
    return this._vtimer.isRunning()
  }
  public isPaused(): boolean {
    if (this._audio.src) { return this._audio.paused }
    return this._vtimer.isPaused()
  }
  public isEnded(): boolean {
    if (this._audio.src) { return this._audio.currentTime >= this._audio.duration }
    return this._vtimer.isStopped()
  }

  public progress(): number {
    if (this._audio.src) { return this._audio.currentTime / this._audio.duration }
    return this._vtimer.progress
  }

  public now(): number {
    if (this._audio.src) { return this._audio.currentTime * 1000 }
    return this._vtimer.time
  }

  private _togglePlayPauseReplay(): void {
    if (!this._canplay) { return }

    if (this.isPlaying()) {
      this.pause()
    } else if (this.isEnded()) {
      this.replay()
    } else {
      this.play()
    }
  }

  private _updateDuration(): void {
    this._view.controlBar.duration = this._durationMs
  }

  private _updatePlaying(): void {
    this._view.controlBar.playing = this._vtimer.isRunning()
  }

  private _updateProgressAndCurrentTime(): void {
    this._view.progressBar.progress = this.progress()
    this._view.controlBar.currentTime = this.now()
  }

  private _onTick(now: number): void {
    const frame = this._queue.frame(now)
    if (this._lastVFrame === frame && now > this._lastVTimeMs) {
      writeSync(this._term, frame.data(now, this._lastVTimeMs))
    } else {
      this._term.reset()
      if (frame.prev) {
        writeSync(this._term, frame.prev.snapshot() + frame.data(now))
      } else {
        writeSync(this._term, frame.data(now))
      }
    }
    this._lastVFrame = frame
    this._lastVTimeMs = now

    this._updateProgressAndCurrentTime()
  }
}
