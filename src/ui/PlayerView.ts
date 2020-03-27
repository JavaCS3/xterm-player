import { createElement } from './DomHelper'
import { IComponent } from './Component'
import { ControlBarView } from './ControlBarView'
import { ProgressBarView } from './ProgressBarView'
import { State } from './Types'
import IconPause from './icons/pause.svg'
import IconReplay from './icons/replay.svg'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement
  public readonly progressBar: ProgressBarView = new ProgressBarView()
  public readonly controlBar: ControlBarView = new ControlBarView()

  private _bottom: HTMLElement
  private _bigButton: HTMLElement
  private _spinner: HTMLElement

  private _state: State = 'Paused'

  constructor() {
    this.element = createElement('div', { class: 'xterm-player', attrs: { tabindex: '0' } },
      this.videoWrapper = createElement('div', { class: 'video-wrapper' }),
      this._bigButton = createElement('div', { class: 'overlay center big-button ' }),
      this._spinner = createElement('div', { class: 'overlay center sk-flow' },
        createElement('div', { class: 'sk-flow-dot' }),
        createElement('div', { class: 'sk-flow-dot' }),
        createElement('div', { class: 'sk-flow-dot' }),
      ),
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
      this.controlBar.state = v
      this._updateBigButton()
      if (this._state !== 'Running') {
        this._showBottom(true)
      }
    }
  }

  public onBigButtonClick(cb: EventListenerOrEventListenerObject): void {
    this._bigButton.addEventListener('click', cb)
  }

  private _showBottom(value: boolean) {
    this._bottom.style.opacity = value ? '1' : '0'
  }
  private _updateBigButton(): void {
    switch (this.state) {
      case 'Paused':
        this._bigButton.style.display = 'block'
        this._bigButton.innerHTML = IconPause
        this._spinner.style.display = 'none'
        break
      case 'Stopped':
        this._bigButton.style.display = 'block'
        this._bigButton.innerHTML = IconReplay
        this._spinner.style.display = 'none'
        break
      case 'Running':
        this._bigButton.style.display = 'none'
        this._spinner.style.display = 'none'
        break
      case 'Loading':
        this._bigButton.style.display = 'none'
        this._spinner.style.display = 'flex'
      default:
        break
    }
  }
}
