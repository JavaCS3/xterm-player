import { createElement } from './DomHelper'
import { IComponent } from './Component'
import { ControlBarView } from './ControlBarView'
import { ProgressBarView } from './ProgressBarView'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement = createElement('div', { class: 'video-wrapper' })
  public readonly progressBar: ProgressBarView = new ProgressBarView()
  public readonly controlBar: ControlBarView = new ControlBarView()

  constructor() {
    this.element = createElement('div', { class: 'xterm-player' },
      this.videoWrapper,
      createElement('div', { class: 'bottom' },
        this.progressBar.element,
        this.controlBar.element
      )
    )
  }
}
