/// <reference lib="dom"/>

declare module 'xterm-player' {
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
     */
    constructor(url: string, el: HTMLElement)

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
