import { XtermPlayer } from '../src/Player'
import cast1 from '../assets/1.cast'

function $id(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) { throw new Error('Cannot find element ' + id) }
  return el
}

const SAMPLE_CAST_URLS: { [key: string]: string } = {
  'asciinema-1': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/1.cast',
  'asciinema-2': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/5.cast',
  'asciinema-3': 'https://raw.githubusercontent.com/JavaCS3/xterm-player/master/assets/4.cast',
  'terminalizer': 'https://raw.githubusercontent.com/faressoft/terminalizer-player/master/data.json'
}

const app = $id('app')
const castOption = <HTMLSelectElement>$id('cast-option')

const player = new XtermPlayer(cast1, app)

castOption.onchange = () => {
  player.url = SAMPLE_CAST_URLS[castOption.value] || cast1
}
