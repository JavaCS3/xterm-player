import { ICastEvent } from './parser'

function crop(low: number, high: number, value: number): number {
    if (value < low) {
        return low
    } else if (value > high) {
        return high
    } else {
        return value
    }
}

export function findEvents(events: ICastEvent[], withinTime: number, fromIndex?: number): ICastEvent[] {
    fromIndex = crop(0, events.length - 1, fromIndex || 0)

    let guess = -1
    let min = fromIndex
    let max = events.length - 1
    let delta = -1

    if (max < 0) {
        return []
    }

    while (min <= max) {
        // tslint:disable-next-line: no-bitwise
        guess = (min + max) >> 1


        delta = events[guess].time - withinTime

        if (delta === 0) {
            return events.slice(fromIndex, 1 + guess)
        } else if (delta < 0) {
            min = guess + 1
        } else {
            max = guess - 1
        }
    }

    if (delta > 0) {
        return events.slice(fromIndex, (guess - 1 >= 0 ? guess : 1))
    } else {
        return events.slice(fromIndex, 1 + guess)
    }
}