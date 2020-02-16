import { ICastObject } from "./Cast"

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

const MS = 1000

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
      timestamp += e[0] * MS
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
        duration: j.duration * MS
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
            time: j[0] * MS,
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
