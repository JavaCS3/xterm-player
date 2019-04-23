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
  private previousMs: number = -1.0
  private currentMs: number = -1.0

  public tick(time: number, unit: TimeUnit = TimeUnit.Ms): void {
    if (time < 0) { return }

    if (this.previousMs < 0) {
      this.previousMs = this.currentMs = time * unit
    } else {
      this.previousMs = this.currentMs
      this.currentMs = time * unit
    }
  }

  public reset(): void {
    this.previousMs = -1.0
    this.currentMs = -1.0
  }

  /**
   * Get delta time in ms between the last two ticks.
   *
   * *You must have at least two ticks before you can get delta*
   * @returns ms
   */
  public deltaMs(): number {
    return this.currentMs - this.previousMs
  }

  /**
   * Get delta time in sec between the last two ticks.
   *
   * *You must have at least two ticks before you can get delta*
   * @returns sec
   */
  public deltaSec(): number {
    return (this.currentMs - this.previousMs) / TimeUnit.Sec
  }
}
