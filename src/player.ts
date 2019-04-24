import 'xterm/src/xterm.css'
import { Terminal, RendererType } from 'xterm'
import { ICastObject, ICastHeader, ICastEvent, Timer } from './structs'
import { State, Animation } from './Animation'
import { findEvents } from './helper'

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
  private duration: number = 0.0
  private animation: Animation = new Animation(this.update.bind(this))

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

    this.term.on('key', (e) => {
      if (e === ' ') {
        if (this.animation.getState() === State.Playing) {
          this.pause()
        } else {
          this.play()
        }
      }
    })
  }

  public play(): void {
    this.animation.play()
  }

  public pause(): void {
    this.animation.pause()
  }

  private update(animation: Animation): void {
    this.duration += animation.timeDeltaSec()

    const pastEvents = findEvents(this.castEvents, this.duration, this.nextEventIndex)

    pastEvents.forEach((e) => {
      this.term.write(e.data)
      this.nextEventIndex++
    })

    if (this.nextEventIndex >= this.castEvents.length) {
      animation.stop()
    }
  }
}
