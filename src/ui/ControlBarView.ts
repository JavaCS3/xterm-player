import { XtermPlayer, IPlayerState } from 'xterm-player'
import { $div, $span, addDisposableDomListener } from './DomHelper'
import { ProgressBarView } from './ProgressBarView'
import { IComponent } from './Types'
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
    $div({ class: 'xp-setting-item', text: '0.5x', attrs: { 'data-rate': '0.5' } }),
    $div({ class: 'xp-setting-item', text: 'Normal', attrs: { 'data-rate': '1.0' } }),
    $div({ class: 'xp-setting-item', text: '1.5x', attrs: { 'data-rate': '1.5' } }),
    $div({ class: 'xp-setting-item', text: '2.0x', attrs: { 'data-rate': '2.0' } }),
  ]
  private _volume: HTMLElement

  private _progressBar: ProgressBarView = new ProgressBarView()

  private _state: IPlayerState = 'Paused'
  private _currentTime: number = 0
  private _duration: number = 0

  constructor(private _player: XtermPlayer) {
    this.element = $div({ class: 'xp-control-bar' },
      this._progressBar.element,
      $div({ class: 'xp-control-bar-left' },
        this._playbackButton = $div({ class: 'xp-icon-button' }),
        this._volume = $div({ class: 'xp-icon-button' }),
        this._timeDisplay = $span({ class: 'xp-time-display' }),
      ),
      $div({ class: 'xp-control-bar-right' },
        $div({ class: 'xp-playback-rate-setting' },
          this._playbackRate = $div({ class: 'xp-playback-rate', text: '1.0x' }),
          this._playbackRateSettingBox = $div({ class: 'xp-setting-box' }, ...this._playbackRateItems)
        )
      )
    )
    addDisposableDomListener(this._playbackRate, 'click', () => {
      this._playbackRateSettingBox.classList.toggle('xp-setting-box-open')
    })
    this._playbackRateItems.forEach(item => {
      addDisposableDomListener(item, 'click', () => {
        this._player.playbackRate = parseFloat(item.dataset['rate'] || '1')
      })
    })
    addDisposableDomListener(this._volume, 'click', () => {
      if (this._player.muted) {
        this._player.muted = false
      } else {
        this._player.muted = true
      }
    })
    this._player.onVolumeChanged(this._updateVolume.bind(this))
    this._player.onMuteChanged(this._updateVolume.bind(this))
    this._updatePlaybackButton()
    this._updateTimeDisplay()
    this._updateVolume()
  }

  public get state(): IPlayerState { return this._state }
  public set state(s: IPlayerState) {
    if (this._state !== s) {
      this._state = s
      this._updatePlaybackButton()
    }
  }
  public get currentTime(): number { return this._currentTime }
  public set currentTime(value: number) {
    if (value !== this._currentTime) {
      this._currentTime = value
      this._updateTimeDisplay()
      this._updateProgress()
    }
  }
  public get playbackRate(): number { return this._player.playbackRate }
  public set playbackRate(value: number) { this._playbackRate.innerText = value.toFixed(1) + 'x' }
  public get duration(): number { return this._duration }
  public set duration(value: number) {
    if (value !== this._duration) {
      this._duration = value
      this._updateTimeDisplay()
    }
  }

  public onPlaybackButtonClick(listener: (ev: any) => void): IDisposable {
    return addDisposableDomListener(this._playbackButton, 'click', listener)
  }
  public onSeek(listener: (p: number) => void): IDisposable {
    return this._progressBar.onSeek(listener)
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
  private _updateProgress() {
    this._progressBar.progress = this.currentTime / this.duration
  }
  private _updateVolume() {
    if (this._player.muted) {
      this._volume.innerHTML = Icons.VolumeMute
      return
    }
    const v = this._player.volume
    if (v >= 0.95) {
      this._volume.innerHTML = Icons.VolumeHigh
    } else if (v > 0) {
      this._volume.innerHTML = Icons.VolumeLow
    } else {
      this._volume.innerHTML = Icons.VolumeMute
    }
  }
}
