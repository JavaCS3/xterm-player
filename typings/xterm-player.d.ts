/// <reference lib="dom"/>

declare module 'xterm-player' {
  export class XTermPlayer {
    /**
     * The element containing the xterm player
     */
    readonly el: HTMLElement

    /**
     * The url of xterm video cast file
     */
    url: string

    /**
     * The playback rate of xterm player
     */
    playbackRate: number

    /**
     * Create XTermPlayer object
     * @param url The url of xterm video cast file
     * @param el The element to create the xterm player within
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
