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

export const enum TimeUnit {
  Ms = 1,
  Sec = 1000
}

export class Timer {
  private previousMs: number = 0.0
  private currentMs: number = 0.0

  public tick(time: number, unit: TimeUnit = TimeUnit.Ms): void {
    if (time > 0) {
      this.previousMs = this.currentMs
      this.currentMs = time * unit
    }
  }

  public deltaMs(): number {
    return this.currentMs - this.previousMs
  }

  public deltaSec(): number {
    return (this.currentMs - this.previousMs) / TimeUnit.Sec
  }
}
