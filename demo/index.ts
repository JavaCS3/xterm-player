import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { SerializeAddon } from 'xterm-addon-serialize'
import { Timer, IntervalTicker, AnimationFrameTicker } from '../src/Timer'
import { ICastEvent } from '../src/Cast'
import { AsciinemaCastParser } from '../src/CastParser'
import { CastFrameQueue, IFrame, NULL_FRAME } from '../src/Frame'
import cast from '../src/assets/1.cast'

function writeSync(term: Terminal, data: string) {
  (<any>term)._core.writeSync(data)
}

const div = document.getElementById('app')
if (div) {
  const term = new Terminal()
  // const term2 = new Terminal()
  // const serializer = new SerializeAddon()
  const t = new Timer(new AnimationFrameTicker())
  term.open(div)
  // term2.loadAddon(serializer)

  fetch(cast).then(res => {
    res.text().then(text => {
      const parser = new AsciinemaCastParser()
      const castObject = parser.parse(text)
      const q = new CastFrameQueue(castObject)

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
      t.timescale = 3
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
        if (q.isStopFrame(f)) {
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

