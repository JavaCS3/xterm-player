import { XtermPlayer } from '../src/Player'

const audioCast = require('../assets/audio.cast')

function $id(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) { throw new Error('Cannot find element ' + id) }
  return el
}

const SAMPLE_CAST_URLS: { [key: string]: string } = {
  'sample cast with audio': audioCast,
  'asciinema-1': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/1.cast',
  'asciinema-2': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/5.cast',
  'asciinema-3': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/4.cast',
  'asciinema-custom-theme': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/custom-theme.cast',
  'terminalizer': 'https://raw.githubusercontent.com/faressoft/terminalizer-player/master/data.json',
}

const app = $id('app')
const castOption = <HTMLSelectElement>$id('cast-option')

let player = new XtermPlayer(audioCast, app)
let prevCast = 'sample cast with audio'

const solarized_dark_theme = {
  // a solarized dark theme
  background: '#002b36',
  foreground: '#839496',
  cursor: '#839496',
  cursorAccent: '#839496',
  selection: '#073642',
  black: '#073642',
  brightBlack: '#002b36',
  blue: '#268bd2',
  brightBlue: '#839496',
  red: '#dc322f',
  brightRed: '#cb4b16',
  green: '#859900',
  brightGreen: '#586e75',
  yellow: '#b58900',
  brightYellow: '#657b83',
  magenta: '#d33682',
  brightMagenta: '#6c71c4',
  cyan: '#2aa198',
  brightCyan: '#93a1a1',
  white: '#eee8d5',
  brightWhite: '#fdf6e3',
}

castOption.onchange = () => {
  if (castOption.value === prevCast) return


  if (castOption.value === 'asciinema-custom-theme') {
    $id('app').innerHTML = ''
    player = new XtermPlayer(
      SAMPLE_CAST_URLS[castOption.value],
      app,
      { theme: solarized_dark_theme },
    )
  } else if (prevCast === 'asciinema-custom-theme') {
    $id('app').innerHTML = ''
    player = new XtermPlayer(
      SAMPLE_CAST_URLS[castOption.value],
      app,
    )
  }

  prevCast = castOption.value

  player.url = SAMPLE_CAST_URLS[castOption.value] || audioCast
}
