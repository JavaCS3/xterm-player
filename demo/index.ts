import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { TICK_INTERVAL } from '../src/Timer'

const div = document.getElementById('app')
if (div) {
  const term = new Terminal()
  term.open(div)
}
