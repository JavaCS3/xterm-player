/// <reference lib="dom"/>


declare module 'xterm-player' {

  import * as xterm from 'xterm'

  /**
   * An object containing start up options for the player.
   */
  export interface IPlayerOptions {
    /**
     * The font size used to render text.
     */
    fontSize?: number

    /**
     * The font family used to render text.
     */
    fontFamily?: string

    /**
     * The font weight used to render non-bold text.
     */
    fontWeight?: xterm.FontWeight

    /**
     * The font weight used to render bold text.
     */
    fontWeightBold?: xterm.FontWeight

    /**
     * The color theme of the terminal.
     */
    theme?: xterm.ITheme
  }

  /**
   * An object that can be disposed via a dispose function.
   */
  export interface IDisposable {
    dispose(): void
  }

  /**
   * An event that can be listened to.
   * @returns an `IDisposable` to stop listening.
   */
  export interface IEvent<T> {
    (listener: (arg: T) => void): IDisposable
  }

  export type IPlayerState = 'Error' | 'Loading' | 'Running' | 'Paused' | 'Stopped'

  export class XtermPlayer {
    /**
     * Builtin themes
     */
    static readonly THEME_SOLARIZED_DARK: xterm.ITheme
    static readonly THEME_SOLARIZED_LIGHT: xterm.ITheme

    /**
     * The element containing the player.
     */
    readonly el: HTMLElement

    /**
     * Gets or sets the address or URL of the cast.
     */
    url: string

    /**
     * Gets or sets the options of the player.
     */
    options: IPlayerOptions

    /**
     * Gets or sets the current rate of speed for the cast to play.
     */
    playbackRate: number

    /**
     * Gets or sets the current playback position, in milliseconds.
     */
    currentTime: number

    /**
     * Gets or sets the volume level if the cast has audio.
     */
    volume: number

    /**
     * Gets or sets a flag that indicates whether the audio is muted.
     */
    muted: boolean

    /**
     * Returns the duration in milliseconds of the current cast. A NaN value is returned if duration is not available, or Infinity if the cast is streaming.
     */
    readonly duration: number

    /**
     * The state of the player.
     */
    readonly state: IPlayerState

    /**
     * Create the player object.
     * @param url The url of xterm video cast file.
     * @param el The element to create the the player within.
     * @param options The options for the player.
     */
    constructor(url: string, el: HTMLElement, options?: IPlayerOptions)

    /**
    * Adds an event listener for when the player is ready to play.
    */
    readonly onReady: IEvent<void>

    /**
     * Adds an event listener for when the player is loading.
     */
    readonly onLoading: IEvent<void>

    /**
     * Adds an event listener for when the player finished current render.
     */
    readonly onAfterRender: IEvent<void>

    /**
     * Adds an event listener for when the player currentTime changed.
     */
    readonly onCurrentTimeChanged: IEvent<number>

    /**
     * Adds an event listener for when the player playbackRate changed.
     */
    readonly onPlaybackRateChanged: IEvent<number>

    /**
     * Adds an event listener for when the player volume changed.
     */
    readonly onVolumeChanged: IEvent<number>

    /**
     * Adds an event listener for when the player muted changed.
     */
    readonly onMutedChanged: IEvent<boolean>

    /**
     * Adds an event listener for when the player state changed.
     */
    readonly onStateChanged: IEvent<IPlayerState>

    /**
     * Starts the cast playback.
     */
    play(): void

    /**
     * Replay the cast playback.
     */
    replay(): void

    /**
     * Pause the cast playback.
     */
    pause(): void
  }
}
