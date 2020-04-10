/// <reference lib="dom"/>


declare module 'xterm-player' {

  import * as xterm from 'xterm'

  /**
   * An object containing start up options for the player
   */
  export interface IPlayerOptions {
    /**
     * The font size used to render text
     */
    fontSize?: number

    /**
     * The font family used to render text
     */
    fontFamily?: string

    /**
     * The font weight used to render non-bold text
     */
    fontWeight?: xterm.FontWeight

    /**
     * The font weight used to render bold text
     */
    fontWeightBold?: xterm.FontWeight

    /**
     * The color theme of the terminal
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

  export type IPlayerState = 'Loading' | 'Running' | 'Paused' | 'Stopped'

  export class XtermPlayer {
    /**
     * The element containing the XtermPlayer
     */
    readonly el: HTMLElement

    /**
     * The url of xterm video cast file
     */
    url: string

    /**
     * The playback rate of XtermPlayer
     */
    playbackRate: number


    /**
     * Current time of XtermPlayer in milliseconds
     */
    currentTime: number

    /**
     * The duration of XtermPlayer, might be NaN if XtermPlayer is not ready yet
     */
    readonly duration: number

    /**
     * The state of xterm player
     */
    readonly state: IPlayerState

    /**
     * Create XtermPlayer object
     * @param url The url of xterm video cast file
     * @param el The element to create the XtermPlayer within
     * @param options The options for XtermPlayer
     */
    constructor(url: string, el: HTMLElement, options?: IPlayerOptions)

    /**
    * Adds an event listener for when the player is ready to play
    */
    readonly onReady: IEvent<void>

    /**
     * Adds an event listener for when the player is loading
     */
    readonly onLoading: IEvent<void>

    /**
     * Adds an event listener for when the player finished current render
     */
    readonly onAfterRender: IEvent<void>

    /**
     * Adds an event listener for when the player currentTime changed
     */
    readonly onCurrentTimeChanged: IEvent<number>

    /**
     * Adds an event listener for when the player playbackRate changed
     */
    readonly onPlaybackRateChanged: IEvent<number>

    /**
     * Adds an event listener for when the player state changed
     */
    readonly onStateChanged: IEvent<IPlayerState>

    /**
     * Play the xterm video
     */
    play(): void

    /**
     * Replay the xterm video
     */
    replay(): void

    /**
     * Pause the xterm video
     */
    pause(): void
  }
}
