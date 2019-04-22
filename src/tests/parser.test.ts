import { AsciinemaCastV2Parser } from '../parser'

const CAST = `
{"version": 2, "width": 130, "height": 38, "timestamp": 1555641211, "env": {"SHELL": "/usr/local/bin/fish", "TERM": "xterm-256color"}}
[0, "o", "A"]
[1, "o", "B"]
[2, "o", "C"]
`

test('test AsciinemaCastV2Parser', () => {
    const parser = new AsciinemaCastV2Parser()
    const co = parser.parse(CAST)

    expect(co.header.width).toBe(130)
    expect(co.header.height).toBe(38)
    expect(co.header.version).toBe(2)

    expect(co.events).toEqual([
        { time: 0, type: 'o', data: 'A' },
        { time: 1, type: 'o', data: 'B' },
        { time: 2, type: 'o', data: 'C' }
    ])
})
