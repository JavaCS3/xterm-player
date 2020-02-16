import { IComponent } from "./Component"
import { createElement } from './DomHelper'

export class ControlBarView implements IComponent {
  public readonly element: HTMLElement
  private _playbackButton: HTMLElement

  constructor() {
    this.element = createElement('div', { class: 'control-bar' },
      this._playbackButton = createElement('span', { class: 'playback-button' })
    )

    this._playbackButton.innerText = '>'
  }
  public play(): void {
    this._playbackButton.innerText = '||'
  }
  public pause(): void {
    this._playbackButton.innerText = '>'
  }
}
