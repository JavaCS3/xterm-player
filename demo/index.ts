import 'xterm/css/xterm.css'
import { AsciinemaCastParser } from '../src/CastParser'
import { CastPlayer } from '../src/Player'
import cast from '../assets/6.cast'

const div = document.getElementById('app')
if (div) {
  fetch(cast).then(res => {
    res.text().then(text => {
      const parser = new AsciinemaCastParser()
      const co = parser.parse(text)
      const player = new CastPlayer(div, co)
      player.timescale = 3
    })
  })

}

