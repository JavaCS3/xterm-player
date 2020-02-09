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
