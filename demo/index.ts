import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { SerializeAddon } from 'xterm-addon-serialize'
import { Timer, IntervalTicker, AnimationFrameTicker } from '../src/Timer'
import { ICastEvent } from '../src/Cast'
import { AsciinemaCastParser } from '../src/CastParser'
import { CastFrameQueue, IFrame, NULL_FRAME } from '../src/Frame'
import cast from '../assets/2.cast'

function writeSync(term: Terminal, data: string) {
  (<any>term)._core.writeSync(data)
}

const div = document.getElementById('app')
if (div) {
  fetch(cast).then(res => {
    res.text().then(text => {
      const parser = new AsciinemaCastParser()
      const castObject = parser.parse(text)
      const term = new Terminal({
        cols: castObject.header.width,
        rows: castObject.header.height,
      })
      const termShadow = new Terminal({
        cols: castObject.header.width,
        rows: castObject.header.height,
      })
      const serializer = new SerializeAddon()
      termShadow.loadAddon(serializer)
      term.open(div)
      const t = new Timer(new AnimationFrameTicker())
      const q = new CastFrameQueue(castObject, 30, (s: string): string => {
        console.log('snapshoting...')
        termShadow.reset()
        writeSync(termShadow, s)
        return serializer.serialize()
      })

      console.log('duration', q)

      term.onKey((arg: { key: string }) => {
        if (arg.key === ' ') {
          if (t.isRunning()) {
            console.log('PAUSED')
            t.pause()
          } else {
            console.log('RUNNING')
            t.start()
          }
        }
      })
      t.timescale = 5
      // t.duration = 60000

      let lastDuration = 0
      let prevFrame: IFrame = NULL_FRAME
      t.onTick((duration: number) => {
        const time = duration / 1000
        const f = q.frame(time)
        // console.log('time', time, 'prev', prevFrame, 'current', f)
        if (prevFrame === f) {
          writeSync(term, f.data(time, lastDuration))
        } else {
          term.reset()
          writeSync(term, f.prev?.snapshot() + f.data(time))
        }
        if (q.isEnd(f)) {
          console.log('STOP')
          t.pause()
          return
        }
        prevFrame = f
        lastDuration = time
      })
      t.start()

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

