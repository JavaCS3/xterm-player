import { XtermPlayer } from 'xterm-player'
import { $div, addDisposableDomListener } from './DomHelper'
import { ControlBarView } from './ControlBarView'
import { State, IComponent } from './Types'
import Icons from './Icons'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement
  public readonly controlBar: ControlBarView = new ControlBarView(this._player)

  private _bigButton: HTMLElement
  private _spinner: HTMLElement

  private _state: State = 'Paused'

  constructor(private _player: XtermPlayer) {
    const el = this.element = $div({ class: 'xp', attrs: { tabindex: '0' } },
      this.videoWrapper = $div({ class: 'video-wrapper' }),
      this._bigButton = $div({ class: 'xp-overlay xp-overlay-center xp-big-button' }),
      this._spinner = $div({ class: 'xp-overlay xp-overlay-center sk-flow' },
        $div({ class: 'sk-flow-dot' }),
        $div({ class: 'sk-flow-dot' }),
        $div({ class: 'sk-flow-dot' }),
      ),
      this.controlBar.element
    )
    addDisposableDomListener(el, 'mouseenter', () => {
      if (this.state === 'Running') {
        this._showControlBar()
      }
    })
    addDisposableDomListener(el, 'mouseleave', () => {
      if (this.state === 'Running') {
        this._hideControlBar()
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

    this._player.onReady(() => {
      this.controlBar.currentTime = this._player.currentTime
      this.controlBar.duration = this._player.duration
    })
    this._player.onAfterRender(() => {
      this.controlBar.currentTime = this._player.currentTime
    })
    this._player.onCurrentTimeChanged(() => {
      this.controlBar.currentTime = this._player.currentTime
    })
    this._player.onStateChanged(() => {
      this.state = this._player.state
    })
  }

  public get state(): State { return this._state }
  public set state(v: State) {
    if (this._state !== v) {
      this._state = v
      this.controlBar.state = v
      this._updateBigButton()
      if (this._state !== 'Running') {
        this._showControlBar()
      }
    }
  }

  private _showControlBar(): void {
    this.controlBar.element.style.opacity = '1'
  }
  private _hideControlBar(): void {
    this.controlBar.element.style.opacity = '0'
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
