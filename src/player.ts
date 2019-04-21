import 'xterm/src/xterm.css'
import { Terminal } from 'xterm'
import { ICastObject, ICastHeader, ICastEvent } from './parser'

export interface IPlayerOptions {
    rows?: number
    cols?: number,
    cast: ICastObject
    el: HTMLElement
}

const DEFAULT_OPTIONS = {
    rows: 38,
    cols: 130
}

export class Player {
    private options: IPlayerOptions
    private cast: ICastObject
    private castHeader: ICastHeader
    private castEvents: ICastEvent[]
    private term: Terminal

    private currenEventIndex: number = 0
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

        if (this.currenEventIndex < this.castEvents.length) {
            const e = this.castEvents[this.currenEventIndex++]

            this.term.write(e.data)

            requestAnimationFrame(this.tick.bind(this))
        }
    }
}
