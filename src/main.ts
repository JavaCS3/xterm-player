import 'xterm/src/xterm.css'
import axios from 'axios'
import { Player } from './player'
import { AsciinemaCastParser } from './parser'
import cast from './assets/1.cast'


axios
  .get<string>(cast, { transformResponse: undefined })
  .then(res => {
    const parser = new AsciinemaCastParser()
    const castObject = parser.parse(res.data as string)

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
