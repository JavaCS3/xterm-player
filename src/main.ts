import 'xterm/src/xterm.css'
import axios from 'axios'
import { Player } from './player'
import { AsciinemaCastV2Parser } from './parser'
import cast from './demo.cast'


axios
  .get<string>(cast)
  .then(res => {
    const parser = new AsciinemaCastV2Parser()
    const castObject = parser.parse(res.data)

    const div = document.getElementById('terminal')

    if (!div) {
      return
    }

    const player = new Player({
      cast: castObject,
      el: div
    })

    player.play()
  })
  .catch(console.error)