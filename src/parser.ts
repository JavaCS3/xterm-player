import { ICastObject } from './structs'

export interface IParser {
  parse(text: string): ICastObject
}

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

