import { ICastObject, ICastEvent } from "./Cast"

export interface ICastParser {
  parse(text: string): ICastObject
}

export class AsciinemaCastParser implements ICastParser {
  public parse(text: string): ICastObject {
    try {
      return new AsciinemaCastV1Parser().parse(text)
    } catch (err) {
      return new AsciinemaCastV2Parser().parse(text)
    }
  }
}

/**
 * Asciinema cast v1 parser
 * https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md
 */
export class AsciinemaCastV1Parser implements ICastParser {
  public parse(text: string): ICastObject {
    const j = JSON.parse(text)
    const stdouts: Array<[number, string]> = j.stdout

    let timestamp = 0.0
    const events = stdouts.map((e: [number, string]) => {
      timestamp += e[0]
      return {
        time: timestamp,
        type: 'o',
        data: e[1]
      }
    })

    return {
      header: {
        version: 1,
        width: j.width,
        height: j.height,
        duration: j.duration
      },
      events
    }
  }
}

/**
 * Asciinema cast v2 parser
 * https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v2.md
 */
export class AsciinemaCastV2Parser implements ICastParser {
  public parse(text: string): ICastObject {
    const lines = text.trim().split('\n').filter(txt => txt)

    if (lines.length) {
      const header = JSON.parse(lines[0])
      const events = lines.slice(1)

      const cast: ICastObject = {
        header,
        events: events.map(e => {
          const j = JSON.parse(e)
          return {
            time: j[0],
            type: j[1],
            data: j[2]
          }
        })
      }

      cast.header.duration = cast.events[cast.events.length - 1].time

      return cast
    } else {
      throw new Error('Invalid cast format')
    }
  }
}

export class CastIndexer {
  private _frameIndex: number[] = []
  constructor(
    private _cast: ICastObject,
    private _step: number = 3000
  ) {
    const events = _cast.events
    for (let i = 0, n = 0; i < events.length; i++) {
      const ev = events[i]
      if (ev.time >= ((1 + n) * this._step)) {
        this._frameIndex.push(i)
        n++
      }
    }
  }

  private _getEventsIndexRange(t: number): [number, number] {
    if (t < 0) { throw new Error('Invalid time') }
    const v = Math.floor(t / this._step)
    return [
      this._frameIndex[v],
      v < this._frameIndex.length ? this._frameIndex[v + 1] : this._cast.events.length
    ]
  }
}
