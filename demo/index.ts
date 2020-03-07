import { XtermPlayer } from '../src/Player'
import cast1 from '../assets/1.cast'
import cast5 from '../assets/5.cast'

function $id(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) { throw new Error('Cannot find element ' + id) }
  return el
}

const app = $id('app')
const castOption = <HTMLSelectElement>$id('cast-option')

const player = new XtermPlayer(cast1, app)

castOption.onchange = () => {
  console.log('select', castOption.value)
  player.url = castOption.value
}
