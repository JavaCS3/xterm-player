import 'xterm/src/xterm.css'
import { Terminal, RendererType } from 'xterm'
import { ICastObject, ICastHeader, ICastEvent } from './parser'
import { findEvents } from './utils'

export interface IPlayerOptions {
    rows?: number
    cols?: number,
    cast: ICastObject
    el: HTMLElement
    cursorBlink?: boolean
    rendererType?: RendererType
}

const DEFAULT_OPTIONS = {
    rows: 24,
    cols: 80,
    cursorBlink: true,
    rendererType: 'canvas'
}

export class Player {
    private options: IPlayerOptions
    private cast: ICastObject
    private castHeader: ICastHeader
    private castEvents: ICastEvent[]
    private term: Terminal

    private nextEventIndex: number = 0
    private timestampBeginMs: number = 0.0

    constructor(options: IPlayerOptions) {
        this.options = Object.assign(DEFAULT_OPTIONS, options)

        this.cast = this.options.cast
        this.castHeader = this.cast.header
        this.castEvents = this.cast.events

        this.options = Object.assign(this.options, {
            rows: this.castHeader.height,
            cols: this.castHeader.width
        })

        this.term = new Terminal(this.options)
        this.term.open(this.options.el)
    }

    public play(): void {
        this.tick()
    }

    public pause(): void {
        console.log()
    }

    private tick(nowMs?: number): void {
        let durationMs = 0.0

        if (nowMs) {
            if (this.timestampBeginMs) {
                durationMs = nowMs - this.timestampBeginMs
            } else {
                this.timestampBeginMs = nowMs
            }
        }

        const pastEvents = findEvents(this.castEvents, durationMs / 1000, this.nextEventIndex)

        pastEvents.forEach((e) => {
            this.term.write(e.data)
            this.nextEventIndex++
        })

        if (this.nextEventIndex < this.castEvents.length) {
            requestAnimationFrame(this.tick.bind(this))
        }
    }
}
