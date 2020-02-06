import { AsciinemaCastV2Parser, AsciinemaCastV1Parser } from './CastParser'

const CAST_V1 = `
{
  "version": 1,
  "width": 80,
  "height": 24,
  "duration": 1.515658,
  "command": "/bin/zsh",
  "title": "",
  "env": {
    "TERM": "xterm-256color",
    "SHELL": "/bin/zsh"
  },
  "stdout": [
    [1, "Hello"],
    [1, "World"]
  ]
}
`

const CAST_V2 = `
{"version": 2, "width": 130, "height": 38, "timestamp": 1555641211, "env": {"SHELL": "/usr/local/bin/fish", "TERM": "xterm-256color"}}
[0, "o", "A"]
[1, "o", "B"]
[2, "o", "C"]
`

test('test AsciinemaCastV2Parser', () => {
  const parser = new AsciinemaCastV2Parser()
  const co = parser.parse(CAST_V2)

  expect(co.header.width).toBe(130)
  expect(co.header.height).toBe(38)
  expect(co.header.version).toBe(2)
  expect(co.header.duration).toBe(2)

  expect(co.events).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1, type: 'o', data: 'B' },
    { time: 2, type: 'o', data: 'C' }
  ])
})

test('test AsciinemaCastV1Parser', () => {
  const parser = new AsciinemaCastV1Parser()
  const co = parser.parse(CAST_V1)

  expect(co.header.width).toBe(80)
  expect(co.header.height).toBe(24)
  expect(co.header.version).toBe(1)
  expect(co.header.duration).toBe(1.515658)

  expect(co.events).toEqual([
    { time: 1, type: 'o', data: 'Hello' },
    { time: 2, type: 'o', data: 'World' },
  ])
})
