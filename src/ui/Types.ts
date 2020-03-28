import { ITimerState } from '../Timer'

export type State = 'Loading' | ITimerState

export interface IComponent {
  readonly element: HTMLElement
}
