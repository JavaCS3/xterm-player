import { EventEmitter } from './Events'

test('should fire listeners multiple times', () => {
  const order: string[] = []
  const emitter = new EventEmitter<number>()
  emitter.onEvent(data => order.push(data + 'a'))
  emitter.onEvent(data => order.push(data + 'b'))
  emitter.fire(1)
  emitter.fire(2)
  expect(order).toEqual(['1a', '1b', '2a', '2b'])
})

test('should not fire listeners once disposed', () => {
  const order: string[] = []
  const emitter = new EventEmitter<number>()
  emitter.onEvent(data => order.push(data + 'a'))
  const disposeB = emitter.onEvent(data => order.push(data + 'b'))
  emitter.onEvent(data => order.push(data + 'c'))
  emitter.fire(1)
  disposeB.dispose()
  emitter.fire(2)
  expect(order).toEqual(['1a', '1b', '1c', '2a', '2c'])
})

test('event emitter disposed', () => {
  const order: string[] = []
  const emitter = new EventEmitter<number>()
  const disposeA = emitter.onEvent(data => order.push(data + 'a'))
  const disposeB = emitter.onEvent(data => order.push(data + 'b'))
  emitter.fire(1)
  emitter.fire(2)
  expect(order).toEqual(['1a', '1b', '2a', '2b'])

  emitter.dispose()
  emitter.fire(1)
  emitter.fire(2)
  expect(order).toEqual(['1a', '1b', '2a', '2b'])

  disposeA.dispose()
  disposeB.dispose()
})
