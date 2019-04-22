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
