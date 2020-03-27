import { IComponent } from './Component'
import { createElement } from './DomHelper'
import { State } from './Types'
import IconPlay from './icons/play.svg'
import IconPause from './icons/pause.svg'
import IconReplay from './icons/replay.svg'

function formatTime(time: number) {
  let minutes = Math.floor(time / 60000)
  let seconds = Math.floor((time - (minutes * 60000)) / 1000)

  return `${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`
}

export class ControlBarView implements IComponent {
  public readonly element: HTMLElement

  private _playbackButton: HTMLElement
  private _timeDisplay: HTMLElement

  private _state: State = 'Paused'
  private _currentTime: number = 0
  private _duration: number = 0

  constructor() {
    this.element = createElement('div', { class: 'control-bar' },
      this._playbackButton = createElement('span', { class: 'playback-button' }),
      this._timeDisplay = createElement('div', { class: 'time-display' })
    )
    this._updatePlaybackButton()
    this._updateTimeDisplay()
  }

  public get state(): State { return this._state }
  public set state(v: State) {
    if (this._state !== v) {
      this._state = v
      this._updatePlaybackButton()
    }
  }
  public get currentTime(): number { return this._currentTime }
  public set currentTime(value: number) {
    if (value !== this._currentTime) {
      this._currentTime = value
      this._updateTimeDisplay()
    }
  }
  public set duration(value: number) {
    if (value !== this._duration) {
      this._duration = value
      this._updateTimeDisplay()
    }
  }

  public onPlaybackButtonClick(listener: EventListenerOrEventListenerObject): void {
    this._playbackButton.addEventListener('click', listener)
  }

  private _updatePlaybackButton() {
    switch (this.state) {
      case 'Running':
        this._playbackButton.innerHTML = IconPause
        break
      case 'Paused':
        this._playbackButton.innerHTML = IconPlay
        break
      case 'Stopped':
        this._playbackButton.innerHTML = IconReplay
        break
    }
  }
  private _updateTimeDisplay() {
    this._timeDisplay.innerText = formatTime(this._currentTime) + '/' + formatTime(this._duration)
  }
}
