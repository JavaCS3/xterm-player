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
    rows: 38,
    cols: 130,
    cursorBlink: true,
    rendererType: 'canvas'
}

export class Player {
    private options: IPlayerOptions
    private cast: ICastObject
    private castHeader: ICastHeader
    private castEvents: ICastEvent[]
    private term: Terminal

    private currenEventIndex: number = -1
    private timestampBeginSec: number = 0.0

    constructor(options: IPlayerOptions) {
        this.options = Object.assign(DEFAULT_OPTIONS, options)

        this.term = new Terminal(this.options)
        this.term.open(this.options.el)

        this.cast = this.options.cast
        this.castHeader = this.cast.header
        this.castEvents = this.cast.events
    }

    public play(): void {
        this.tick()
    }

    public pause(): void {
        console.log()
    }

    private tick(nowMs?: number): void {
        let durationSec = 0.0

        if (nowMs) {
            if (this.timestampBeginSec) {
                durationSec = nowMs / 1000 - this.timestampBeginSec
            } else {
                this.timestampBeginSec = nowMs / 1000
            }
        }

        const pastEvents = findEvents(this.castEvents, durationSec, this.currenEventIndex)

        pastEvents.forEach((e) => {
            this.term.write(e.data)
            this.currenEventIndex++
        })

        if (this.currenEventIndex < this.castEvents.length) {
            requestAnimationFrame(this.tick.bind(this))
        }
    }
}
