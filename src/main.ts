import axios from 'axios'
import { Player } from './player'
import { AsciinemaCastParser } from './parser'
import cast from './assets/232377.cast'


axios
  .get<string>(cast, { transformResponse: undefined })
  .then(res => {
    const parser = new AsciinemaCastParser()
    const castObject = parser.parse(res.data as string)

    const div = document.getElementById('app')

    if (!div) {
      return
    }

    const player = new Player({
      cast: castObject,
      el: div
    })

  })
  .catch(console.error)
