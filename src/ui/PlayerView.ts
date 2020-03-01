import { createElement } from './DomHelper'
import { IComponent } from './Component'
import { ControlBarView } from './ControlBarView'
import { ProgressBarView } from './ProgressBarView'
import IconPause from './icons/pause.svg'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement = createElement('div', { class: 'video-wrapper' })
  public readonly progressBar: ProgressBarView = new ProgressBarView()
  public readonly controlBar: ControlBarView = new ControlBarView()

  private _stateOverlay: HTMLElement = createElement('div', { class: 'overlay state-overlay' })
  private _bottom: HTMLElement

  constructor() {
    this._stateOverlay.innerHTML = IconPause
    this.element = createElement('div', { class: 'xterm-player', attrs: { tabindex: '0' } },
      this.videoWrapper,
      this._stateOverlay,
      this._bottom = createElement('div', { class: 'bottom' },
        this.progressBar.element,
        this.controlBar.element
      )
    )
  }

  public showBottom(value: boolean) {
    this._bottom.style.opacity = value ? '1' : '0'
  }
  public showPause(value: boolean) {
    this._stateOverlay.style.display = value ? 'block' : 'none'
  }
}
