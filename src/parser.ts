export interface ICastHeader {
    version: number
    width: number
    height: number
}

export interface ICastEvent {
    time: number
    type: string
    data: string
}

export interface ICastObject {
    header: ICastHeader
    events: ICastEvent[]
}

export interface IParser {
    parse(text: string): ICastObject
}

export class AsciinemaCastV2Parser implements IParser {
    public parse(text: string): ICastObject {
        throw new Error('Method not implemented.')
    }
}

