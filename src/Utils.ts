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


function add0(n: number): string { return n < 10 ? '0' + n : '' + n }
/**
 * Parse second to time string
 *
 * @param {Number} millisecond
 * @return {String} 00:00 or 00:00:00
 */
export function formatTime(millisecond: number): string {
  const second = millisecond / 1000
  if (second === 0 || second === Infinity || isNaN(millisecond)) {
    return '00:00'
  }
  const hour = Math.floor(second / 3600)
  const min = Math.floor((second - hour * 3600) / 60)
  const sec = Math.floor(second - hour * 3600 - min * 60)
  return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
}
