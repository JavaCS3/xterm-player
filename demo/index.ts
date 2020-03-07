import { XtermPlayer } from '../src/Player'
import cast1 from '../assets/1.cast'
import cast5 from '../assets/5.cast'

const div = document.getElementById('app')
if (div) {
  const player = new XtermPlayer(cast1, div)
  // setTimeout(() => {
  //   player.url = cast5
  // }, 5000)
}

