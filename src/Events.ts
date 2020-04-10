import { IDisposable } from './Types'

interface IListener<T> {
  (arg: T): void
}

export interface IEvent<T> {
  (listener: IListener<T>): IDisposable
}

export interface IEventEmitter<T> {
  onEvent: IEvent<T>
  fire(arg: T): void
  dispose(): void
}

export class EventEmitter<T> implements IEventEmitter<T> {
  private _listeners: IListener<T>[] = []
  private _event?: IEvent<T>
  private _disposed: boolean = false

  public get onEvent(): IEvent<T> {
    if (!this._event) {
      this._event = (listener: IListener<T>) => {
        this._listeners.push(listener)
        const disposable = {
          dispose: () => {
            if (!this._disposed) {
              for (let i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                  this._listeners.splice(i, 1)
                  return
                }
              }
            }
          }
        }
        return disposable
      }
    }
    return this._event
  }

  public fire(arg: T): void {
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i](arg)
    }
  }

  public dispose(): void {
    if (this._listeners) {
      this._listeners.length = 0
    }
    this._disposed = true
  }
}
