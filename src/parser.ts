import { ICastObject } from './structs'

export interface IParser {
  parse(text: string): ICastObject
}

export class AsciinemaCastParser implements IParser {
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
// tslint:disable-next-line: max-classes-per-file
export class AsciinemaCastV1Parser implements IParser {
  public parse(text: string): ICastObject {
    const json = JSON.parse(text)
    const stdouts: Array<[number, string]> = json.stdout

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
      'header': {
        version: 1,
        width: json.width,
        height: json.height
      },
      'events': events
    }
  }
}

/**
 * Asciinema cast v2 parser
 * https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v2.md
 */
// tslint:disable-next-line: max-classes-per-file
export class AsciinemaCastV2Parser implements IParser {
  public parse(text: string): ICastObject {
    const lines = text.trim().split('\n').filter(txt => txt)

    if (lines.length) {
      const header = JSON.parse(lines[0])
      const events = lines.slice(1)

      return {
        'header': header,
        'events': events.map(e => {
          const json = JSON.parse(e)
          return {
            time: json[0],
            type: json[1],
            data: json[2]
          }
        })
      }
    } else {
      throw new Error('Invalid cast format')
    }
  }
}

