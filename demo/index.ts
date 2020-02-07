import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { SerializeAddon } from 'xterm-addon-serialize'
import { Timer, IntervalTicker } from '../src/Timer'
import { ICastEvent } from '../src/Cast'
import { AsciinemaCastParser } from '../src/CastParser'
import cast from '../src/assets/5.cast'

const div = document.getElementById('app')
if (div) {
  const term = new Terminal()
  const term2 = new Terminal()
  const serializer = new SerializeAddon()
  const t = new Timer(new IntervalTicker(1000))
  term.open(div)
  term2.loadAddon(serializer)

  fetch(cast).then(res => {
    res.text().then(text => {
      const parser = new AsciinemaCastParser()
      const castObject = parser.parse(text)

      // const ci = new CastIndexer(castObject, 3)
      // console.log(ci.getFrameIndexRangeOfTime(10))

      // const data = castObject.events.map((ev: ICastEvent): string => {
      //   return ev.data
      // }).join('')
      // term2.write(data, () => {
      //   console.log(serializer.serialize())
      //   term.write(serializer.serialize())
      // })
    })
  })

}

