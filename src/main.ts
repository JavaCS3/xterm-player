import 'xterm/src/xterm.css'
import axios from 'axios'
import { Terminal } from 'xterm'
import cast from './demo.cast'

interface IEvent {
  ts: number
  type: string
  data: string
}

const term = new Terminal({
  rendererType: 'canvas',
  cols: 130,
  rows: 38
})

const div = document.getElementById('terminal')

if (div) {
  term.open(div)
}

axios
  .get<string>(cast)
  .then(res => {
    const lines: string[] = res.data.split('\n')
    const events: IEvent[] = lines.map((line, index) => {
      if (index !== 0 && line) {
        const json = JSON.parse(line)
        return {
          ts: json[0],
          type: json[1],
          data: json[2]
        }
      } else {
        return {
          ts: 0.0,
          type: 's',
          data: ''
        }
      }
    })
    events.shift()

    let i = 0

    // for (let i = 0 i < events.length / 2 i++) {
    //   const e = events[i]
    //   term.write(e.data)
    // }
    function animate() {
      if (i < events.length) {
        const e = events[i]
        term.write(e.data)
        i++
        requestAnimationFrame(animate)
      }
    }
    animate()
  })
  .catch(console.error)