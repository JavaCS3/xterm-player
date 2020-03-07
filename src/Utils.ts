import { IDisposable } from './Types'

export function title(cls: Function, str: string) {
  return cls.name + ': ' + str
}

export class Slice<T> {
  constructor(
    private _arr: Array<T>,
    private _start: number = 0,
    private _end: number = _arr.length
  ) {
    if (_start < 0) { this._start = 0 }
    if (_start > _arr.length) { this._start = _arr.length }
    if (_end > _arr.length) { this._end = _arr.length }
  }
  public get(index: number): T {
    if (index < 0 || index >= this.len()) { throw new Error('Index out of range') }
    return this._arr[index + this._start]
  }
  public len(): number { return this._end - this._start }
}


/**
 * Adds a disposable listener to a node in the DOM, returning the disposable.
 * @param type The event type.
 * @param handler The handler for the listener.
 */
export function addDisposableDomListener(
  node: Element | Window | Document,
  type: string,
  handler: (e: any) => void,
  useCapture?: boolean
): IDisposable {
  node.addEventListener(type, handler, useCapture)
  let disposed = false
  return {
    dispose: () => {
      if (!disposed) {
        return
      }
      disposed = true
      node.removeEventListener(type, handler, useCapture)
    }
  }
}
