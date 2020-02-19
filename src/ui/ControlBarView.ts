import { IComponent } from "./Component"
import { createElement } from './DomHelper'

export class ControlBarView implements IComponent {
  public readonly element: HTMLElement

  private _playbackButton: HTMLElement
  private _playbackIcon: HTMLElement

  private _playing: boolean = false

  constructor() {
    this.element = createElement('div', { class: 'control-bar' },
      this._playbackButton = createElement('span', { class: 'playback-button' },
        this._playbackIcon = createElement('i', { class: 'icon' })
      )
    )
    this._updatePlaybackButton()
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

  public onPlayButtonClick(listener: EventListenerOrEventListenerObject): void {
    this._playbackButton.addEventListener('click', listener)
  }

  private _updatePlaybackButton() {
    const icon = this._playbackIcon
    icon.classList.remove('icon-pause', 'icon-play')
    if (this._playing) {
      icon.classList.add('icon-pause')
    } else {
      icon.classList.add('icon-play')
    }
  }
}
