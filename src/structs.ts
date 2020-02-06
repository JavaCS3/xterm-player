

export const enum TimeUnit {
  Ms = 1,
  Sec = 1000
}

export class Timer {
  private previousMs: number = 0
  private currentMs: number = 0

  public tick(time: number, unit: TimeUnit = TimeUnit.Ms): void {
    time = time * unit

    if (time < this.previousMs) {
      throw Error('Time can not earlier than previous time')
    }

    if (this.previousMs) {
      this.previousMs = this.currentMs
      this.currentMs = time
    } else {
      this.previousMs = this.currentMs = time
    }
  }

  public reset(): void {
    this.previousMs = 0
    this.currentMs = 0
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
