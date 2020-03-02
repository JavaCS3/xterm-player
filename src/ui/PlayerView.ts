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

  private _bigPause: HTMLElement = createElement('div', { class: 'overlay center big-pause' })
  private _bottom: HTMLElement

  constructor() {
    this._bigPause.innerHTML = IconPause
    this.element = createElement('div', { class: 'xterm-player', attrs: { tabindex: '0' } },
      this.videoWrapper,
      this._bigPause,
      this._bottom = createElement('div', { class: 'bottom' },
        this.progressBar.element,
        this.controlBar.element
      )
    )
  }

  public showBottom(value: boolean) {
    this._bottom.style.opacity = value ? '1' : '0'
  }
  public showBigPause(value: boolean) {
    this._bigPause.style.display = value ? 'block' : 'none'
  }

  public onBigPauseClick(cb: EventListenerOrEventListenerObject): void {
    this._bigPause.addEventListener('click', cb)
  }
}
