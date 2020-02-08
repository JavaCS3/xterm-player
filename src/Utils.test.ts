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
