import { IComponent } from "./Component"
import { createElement } from './DomHelper'
import IconPlay from './icons/play.svg'
import IconPause from './icons/pause.svg'

function formatTime(time: number) {
  let minutes = Math.floor(time / 60000)
  let seconds = Math.floor((time - (minutes * 60000)) / 1000)

  return `${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`
}

export class ControlBarView implements IComponent {
  public readonly element: HTMLElement

  private _playbackButton: HTMLElement
  private _playbackIcon: HTMLElement

  private _timeDisplay: HTMLElement

  private _playing: boolean = false
  private _currentTime: number = 0
  private _duration: number = 0

  constructor() {
    this.element = createElement('div', { class: 'control-bar' },
      this._playbackButton = createElement('span', { class: 'playback-button' },
        this._playbackIcon = createElement('i', { class: 'icon' })
      ),
      this._timeDisplay = createElement('div', { class: 'time-display' })
    )
    this._updatePlaybackButton()
    this._updateTimeDisplay()
  }

  public get playing(): boolean {
    return this._playing
  }
  public set playing(value: boolean) {
    if (value !== this._playing) {
      this._playing = value
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

  public onPlayButtonClick(listener: EventListenerOrEventListenerObject): void {
    this._playbackButton.addEventListener('click', listener)
  }

  private _updatePlaybackButton() {
    if (this._playing) {
      this._playbackButton.innerHTML = IconPause
    } else {
      this._playbackButton.innerHTML = IconPlay
    }
  }

  private _updateTimeDisplay() {
    this._timeDisplay.innerText = formatTime(this._currentTime) + '/' + formatTime(this._duration)
  }
}
