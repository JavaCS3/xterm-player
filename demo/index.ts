import { XtermPlayer } from '../src/Player'
const AUDIO_CAST = require('../assets/audio.cast')

type BuiltinTheme = 'THEME_SOLARIZED_DARK' | 'THEME_SOLARIZED_LIGHT'

function $id(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) { throw new Error('Cannot find element ' + id) }
  return el
}

const SAMPLE_CAST_URLS: { [key: string]: string } = {
  'sample cast with audio': AUDIO_CAST,
  'asciinema-1': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/1.cast',
  'asciinema-2': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/5.cast',
  'asciinema-3': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/4.cast',
  'terminalizer': 'https://raw.githubusercontent.com/faressoft/terminalizer-player/master/data.json',
}

const app = $id('app')
const castOption = <HTMLSelectElement>$id('cast-option')
const themeOption = <HTMLSelectElement>$id('theme-option')

const player = new XtermPlayer(AUDIO_CAST, app)

castOption.onchange = () => {
  player.url = SAMPLE_CAST_URLS[castOption.value] || AUDIO_CAST
}
themeOption.onchange = () => {
  player.options = { theme: XtermPlayer[<BuiltinTheme>themeOption.value] }
}
