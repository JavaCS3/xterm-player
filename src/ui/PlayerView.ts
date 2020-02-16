import { createElement } from './DomHelper'
import { IComponent } from './Component'
import { ControlBarView } from './ControlBarView'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapperElement: HTMLElement
  public readonly controlBar: ControlBarView
  constructor() {
    this.videoWrapperElement = createElement('div', { class: 'video-wrapper' })
    this.controlBar = new ControlBarView()
    this.element = createElement('div', { class: 'xterm-player' },
      this.videoWrapperElement,
      this.controlBar.element
    )
  }
}
