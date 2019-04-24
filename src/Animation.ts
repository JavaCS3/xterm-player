import { Timer } from './structs'

export const enum State {
  Playing,
  Paused,
  Stopped
}

export type IAnimationUpdateCallback = (animation: Animation) => void

export class Animation {
  private state: State = State.Stopped
  private timer: Timer = new Timer()
  private rafId: number = -1

  constructor(private updateCallback: IAnimationUpdateCallback) { }

  public getState(): State {
    return this.state
  }

  public timeDeltaMs() {
    return this.timer.deltaMs()
  }

  public timeDeltaSec() {
    return this.timer.deltaSec()
  }

  public play(): void {
    this.timer.tick(performance.now())  // TODO: Use polyfill later
    this.rafId = requestAnimationFrame(this.tick.bind(this))
  }

  public pause(): void {
    cancelAnimationFrame(this.rafId)

    this.state = State.Paused
    this.timer.reset()
  }

  public stop(): void {
    cancelAnimationFrame(this.rafId)

    this.state = State.Stopped
    this.timer.reset()
  }

  private tick(timestampMs: number): void {
    this.timer.tick(timestampMs)
    this.state = State.Playing

    this.updateCallback(this)

    if (this.state === State.Playing) {
      this.rafId = requestAnimationFrame(this.tick.bind(this))
    }
  }
}
