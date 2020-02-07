import { ICastEvent } from './Cast'
import { findEvents } from './helper'

test('test findEvents from in all events', () => {
  const events = [
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ]

  expect(findEvents(events, 0.0)).toEqual([
    { time: 0, type: 'o', data: 'A' }
  ])
  expect(findEvents(events, 0.5)).toEqual([
    { time: 0, type: 'o', data: 'A' }
  ])
  expect(findEvents(events, 1.0)).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' }
  ])
  expect(findEvents(events, 1.5)).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' }
  ])
  expect(findEvents(events, 2.0)).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ])
  expect(findEvents(events, 2.5)).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ])
})

test('test findEvents from in from index', () => {
  const events = [
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ]

  expect(findEvents(events, 0.0, 0)).toEqual([
    { time: 0, type: 'o', data: 'A' }
  ])
  expect(findEvents(events, 0.5, 0)).toEqual([
    { time: 0, type: 'o', data: 'A' }
  ])
  expect(findEvents(events, 1.0, 0)).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' }
  ])

  expect(findEvents(events, 0, 1)).toEqual([])
  expect(findEvents(events, 1.5, 1)).toEqual([
    { time: 1, type: 'o', data: 'B' },
  ])
  expect(findEvents(events, 100, 1)).toEqual([
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ])

  expect(findEvents(events, 100, -1)).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ])
})

test('test findEvents from in empty ', () => {
  const events = [] as ICastEvent[]

  expect(findEvents(events, 0.1)).toEqual([])
  expect(findEvents(events, 0.1, 100)).toEqual([])
  expect(findEvents(events, -1, 100)).toEqual([])
})
