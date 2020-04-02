import { XtermPlayer } from 'xterm-player'
import { createElement, addDisposableDomListener } from './DomHelper'
import { ControlBarView } from './ControlBarView'
import { ProgressBarView } from './ProgressBarView'
import { State, IComponent } from './Types'
import Icons from './Icons'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement
  public readonly progressBar: ProgressBarView = new ProgressBarView()
  public readonly controlBar: ControlBarView = new ControlBarView(this._player)

  private _bottom: HTMLElement
  private _bigButton: HTMLElement
  private _spinner: HTMLElement

  private _state: State = 'Paused'

  constructor(private _player: XtermPlayer) {
    const el = this.element = createElement('div', { class: 'xterm-player', attrs: { tabindex: '0' } },
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
    addDisposableDomListener(el, 'mouseenter', () => {
      if (this.state === 'Running') {
        this._showBottom(true)
      }
    })
    addDisposableDomListener(el, 'mouseleave', () => {
      if (this.state === 'Running') {
        this._showBottom(false)
      }
    })
    addDisposableDomListener(el, 'keydown', (ev: KeyboardEvent) => {
      switch (ev.code) {
        case 'Space':
          this._togglePlayPauseReplay()
          break
        case 'ArrowRight':
          this._player.currentTime += 3000
          break
        case 'ArrowLeft':
          this._player.currentTime -= 3000
          break
      }
    }, true)
    addDisposableDomListener(this._bigButton, 'click', this._togglePlayPauseReplay.bind(this))

    this.controlBar.onPlaybackButtonClick(this._togglePlayPauseReplay.bind(this))

    this._updateBigButton()
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

  private _showBottom(value: boolean) {
    this._bottom.style.opacity = value ? '1' : '0'
  }
  private _updateBigButton(): void {
    switch (this.state) {
      case 'Paused':
        this._bigButton.style.display = 'block'
        this._bigButton.innerHTML = Icons.Pause
        this._spinner.style.display = 'none'
        break
      case 'Stopped':
        this._bigButton.style.display = 'block'
        this._bigButton.innerHTML = Icons.Replay
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
  private _togglePlayPauseReplay(): void {
    if (this.state === 'Running') {
      this._player.pause()
    } else if (this.state === 'Stopped') {
      this._player.replay()
    } else {
      this._player.play()
    }
  }
}
