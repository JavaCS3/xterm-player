import { createElement } from './DomHelper'
import { IComponent } from './Component'
import { ControlBarView } from './ControlBarView'
import { ProgressBarView } from './ProgressBarView'
import { ITimerState as State } from '../Timer'
import IconPause from './icons/pause.svg'
import IconReplay from './icons/replay.svg'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement
  public readonly progressBar: ProgressBarView = new ProgressBarView()
  public readonly controlBar: ControlBarView = new ControlBarView()

  private _bigPause: HTMLElement
  private _bottom: HTMLElement

  private _state: State = 'Paused'

  constructor() {
    this.element = createElement('div', { class: 'xterm-player', attrs: { tabindex: '0' } },
      this.videoWrapper = createElement('div', { class: 'video-wrapper' }),
      this._bigPause = createElement('div', { class: 'overlay center big-button' }),
      this._bottom = createElement('div', { class: 'bottom' },
        this.progressBar.element,
        this.controlBar.element
      )
    )
    this._updateBigButton()
    this.element.addEventListener('mouseenter', () => {
      if (this.state === 'Running') {
        this._showBottom(true)
      }
    })
    this.element.addEventListener('mouseleave', () => {
      if (this.state === 'Running') {
        this._showBottom(false)
      }
    })
  }

  public get state(): State { return this._state }
  public set state(v: State) {
    if (this._state !== v) {
      this._state = v
      this._updateBigButton()
      if (this._state !== 'Running') {
        this._showBottom(true)
      }
    }
  }

  public onBigButtonClick(cb: EventListenerOrEventListenerObject): void {
    this._bigPause.addEventListener('click', cb)
  }

  private _showBottom(value: boolean) {
    this._bottom.style.opacity = value ? '1' : '0'
  }
  private _updateBigButton(): void {
    switch (this.state) {
      case 'Paused':
        this._bigPause.style.display = 'block'
        this._bigPause.innerHTML = IconPause
        break
      case 'Stopped':
        this._bigPause.style.display = 'block'
        this._bigPause.innerHTML = IconReplay
        break
      default:
        this._bigPause.style.display = 'none'
        break
    }
  }
}
