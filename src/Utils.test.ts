import { Slice } from './Utils'

test('Slice: test slice without start end', () => {
  const l = [1, 2, 3, 4, 5]
  const s = new Slice<number>(l)

  expect(s.len()).toBe(5)
  for (let i = 0; i < l.length; i++) {
    expect(s.get(i)).toBe(l[i])
  }
})

test('Slice: test slice with start end', () => {
  const l = [1, 2, 3, 4, 5]
  const s = new Slice<number>(l, 1, 3)
  const ref = l.slice(1, 3)

  expect(s.len()).toBe(ref.length)
  for (let i = 0; i < ref.length; i++) {
    expect(s.get(i)).toBe(ref[i])
  }
})

test('Slice: test slice end out of bounds', () => {
  const start = 0, end = 100
  const l = [1, 2, 3, 4, 5]
  const s = new Slice<number>(l, start, end)
  const ref = l.slice(start, end)

  expect(s.len()).toBe(ref.length)
  for (let i = 0; i < ref.length; i++) {
    expect(s.get(i)).toBe(ref[i])
  }
})

test('Slice: test slice empty #1', () => {
  const start = 0, end = 0
  const l = [1, 2, 3, 4, 5]
  const s = new Slice<number>(l, start, end)
  const ref = l.slice(start, end)

  expect(s.len()).toBe(ref.length)
  for (let i = 0; i < ref.length; i++) {
    expect(s.get(i)).toBe(ref[i])
  }
})

test('Slice: test slice empty #2', () => {
  const start = 100, end = 100
  const l = [1, 2, 3, 4, 5]
  const s = new Slice<number>(l, start, end)
  const ref = l.slice(start, end)

  expect(s.len()).toBe(ref.length)
  for (let i = 0; i < ref.length; i++) {
    expect(s.get(i)).toBe(ref[i])
  }
})
