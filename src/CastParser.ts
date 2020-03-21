import { ICastObject } from './Cast'
import { MILLISECOND } from './Types'

export interface ICastParser {
  parse(text: string): ICastObject
}

export function parse(text: string): ICastObject {
  const factories = [
    AsciinemaCastParser,
    TerminalizerParser
  ]
  for (let i = 0; i < factories.length; i++) {
    const cls = factories[i]
    try {
      console.debug('trying ' + cls.name)
      return (new cls()).parse(text)
    } catch (e) { }
  }
  throw new Error('None of the available parsers can parse the cast')
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
    const events = stdouts.map(e => {
      timestamp += e[0] * MILLISECOND
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
        duration: j.duration * MILLISECOND
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
            time: j[0] * MILLISECOND,
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

export class TerminalizerParser implements ICastParser {
  public parse(text: string): ICastObject {
    const j = JSON.parse(text)
    const records: Array<{ delay: number; content: string }> = j.records

    let timestamp = 0.0
    const events = records.map(rec => {
      timestamp += rec.delay
      return {
        time: timestamp,
        type: 'o',
        data: rec.content
      }
    })

    return {
      header: {
        version: 1,
        width: j.config.cols,
        height: j.config.rows,
        duration: timestamp
      },
      events
    }
  }
}
