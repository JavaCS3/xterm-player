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
     * Create XtermPlayer object
     * @param url The url of xterm video cast file
     * @param el The element to create the XtermPlayer within
     * @param options The options for XtermPlayer
     */
    constructor(url: string, el: HTMLElement, options?: IPlayerOptions)

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

    /**
     * Stop the xterm video
     */
    stop(): void
  }
}
