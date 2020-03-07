import { AsciinemaCastV2Parser, AsciinemaCastV1Parser, TerminalizerParser, parse } from './CastParser'
import { title } from './Utils'

test(title(AsciinemaCastV2Parser, 'test'), () => {
  const parser = new AsciinemaCastV2Parser()
  const co = parser.parse(CAST_ASCIINEMA_V2)

  expect(co.header.width).toBe(130)
  expect(co.header.height).toBe(38)
  expect(co.header.version).toBe(2)
  expect(co.header.duration).toBe(2000)

  expect(co.events).toEqual([
    { time: 0, type: 'o', data: 'A' },
    { time: 1000, type: 'o', data: 'B' },
    { time: 2000, type: 'o', data: 'C' }
  ])
})

test(title(AsciinemaCastV1Parser, 'test'), () => {
  const parser = new AsciinemaCastV1Parser()
  const co = parser.parse(CAST_ASCIINEMA_V1)

  expect(co.header.width).toBe(80)
  expect(co.header.height).toBe(24)
  expect(co.header.version).toBe(1)
  expect(co.header.duration).toBe(1.515658 * 1000)

  expect(co.events).toEqual([
    { time: 1000, type: 'o', data: 'Hello' },
    { time: 2000, type: 'o', data: 'World' },
  ])
})

test(title(TerminalizerParser, 'test'), () => {
  const parser = new TerminalizerParser()
  const co = parser.parse(CAST_TERMINALIZER)

  expect(co.header.width).toBe(80)
  expect(co.header.height).toBe(25)
  expect(co.header.version).toBe(1)
  expect(co.header.duration).toBe(10)

  expect(co.events).toEqual([
    { time: 1, type: 'o', data: 'A' },
    { time: 3, type: 'o', data: 'B' },
    { time: 6, type: 'o', data: 'C' },
    { time: 10, type: 'o', data: 'D' }
  ])
})

test(title(parse, 'test'), () => {
  parse(CAST_ASCIINEMA_V1)
  parse(CAST_ASCIINEMA_V2)
  parse(CAST_TERMINALIZER)

  expect(() => parse('invalid cast')).toThrow(/None of the available/)
})

const CAST_ASCIINEMA_V1 = `
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

const CAST_ASCIINEMA_V2 = `
{"version": 2, "width": 130, "height": 38, "timestamp": 1555641211, "env": {"SHELL": "/usr/local/bin/fish", "TERM": "xterm-256color"}}
[0, "o", "A"]
[1, "o", "B"]
[2, "o", "C"]
`

const CAST_TERMINALIZER = `
{
  "config": {
    "command": "bash -l",
    "cwd": "/Users/faressoft",
    "env": { "recording": true },
    "cols": 80,
    "rows": 25,
    "repeat": 0,
    "quality": 100,
    "frameDelay": "auto",
    "cursorStyle": "block",
    "fontFamily": "Monaco, Lucida Console, Ubuntu Mono, Monospace",
    "fontSize": 12,
    "lineHeight": 1,
    "letterSpacing": 0
  },
  "records": [
    {
      "delay": 1,
      "content": "A"
    },
    {
      "delay": 2,
      "content": "B"
    },
    {
      "delay": 3,
      "content": "C"
    },
    {
      "delay": 4,
      "content": "D"
    }
  ]
}
`
