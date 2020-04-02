import { XtermPlayer } from 'xterm-player'
import { $div, $span, addDisposableDomListener } from './DomHelper'
import { State, IComponent } from './Types'
import { IDisposable } from '../Types'
import { formatTime } from '../Utils'
import Icons from './Icons'

export class ControlBarView implements IComponent {
  public readonly element: HTMLElement

  private _playbackButton: HTMLElement
  private _timeDisplay: HTMLElement
  private _playbackRate: HTMLElement
  private _playbackRateSettingBox: HTMLElement
  private _playbackRateItems: HTMLElement[] = [
    $div({ class: 'setting-item', text: '0.5x', attrs: { 'data-rate': '0.5' } }),
    $div({ class: 'setting-item', text: 'Normal', attrs: { 'data-rate': '1.0' } }),
    $div({ class: 'setting-item', text: '1.5x', attrs: { 'data-rate': '1.5' } }),
    $div({ class: 'setting-item', text: '2.0x', attrs: { 'data-rate': '2.0' } }),
  ]

  private _state: State = 'Paused'
  private _currentTime: number = 0
  private _duration: number = 0

  constructor(private _player: XtermPlayer) {
    this.element = $div({ class: 'control-bar' },
      $div({ class: 'left' },
        this._playbackButton = $div({ class: 'playback-button' }),
        this._timeDisplay = $span({ class: 'time-display' })
      ),
      $div({ class: 'right' },
        $div({ class: 'playback-rate-setting' },
          this._playbackRate = $div({ class: 'playback-rate', text: '1.0x' }),
          this._playbackRateSettingBox = $div({ class: 'setting-box' }, ...this._playbackRateItems)
        )
      )
    )
    addDisposableDomListener(this._playbackRate, 'click', () => {
      this._playbackRateSettingBox.classList.toggle('open')
    })
    this._playbackRateItems.forEach(item => {
      addDisposableDomListener(item, 'click', () => {
        this._player.playbackRate = parseFloat(item.dataset['rate'] || '1')
      })
    })
    this._updatePlaybackButton()
    this._updateTimeDisplay()
  }

  public get state(): State { return this._state }
  public set state(v: State) {
    if (this._state !== v) {
      this._state = v
      this._updatePlaybackButton()
    }
  }
  public get currentTime(): number { return this._currentTime }
  public set currentTime(value: number) {
    if (value !== this._currentTime) {
      this._currentTime = value
      this._updateTimeDisplay()
    }
  }
  public get currentPlaybackRate(): number { return this._player.playbackRate }
  public set currentPlaybackRate(value: number) { this._playbackRate.innerText = value.toFixed(1) + 'x' }
  public set duration(value: number) {
    if (value !== this._duration) {
      this._duration = value
      this._updateTimeDisplay()
    }
  }

  public onPlaybackButtonClick(listener: (ev: any) => void): IDisposable {
    return addDisposableDomListener(this._playbackButton, 'click', listener)
  }

  private _updatePlaybackButton() {
    switch (this.state) {
      case 'Running':
        this._playbackButton.innerHTML = Icons.Pause
        break
      case 'Paused':
        this._playbackButton.innerHTML = Icons.Play
        break
      case 'Stopped':
        this._playbackButton.innerHTML = Icons.Replay
        break
    }
  }
  private _updateTimeDisplay() {
    this._timeDisplay.innerText = formatTime(this._currentTime) + ' / ' + formatTime(this._duration)
  }
}
