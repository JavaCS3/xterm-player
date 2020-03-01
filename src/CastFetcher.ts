import { ICastObject } from './Cast'
import { AsciinemaCastParser } from './CastParser'

async function innerFetchCast(url: string): Promise<ICastObject> {
  const res = await fetch(url)
  const txt = await res.text()
  const parser = new AsciinemaCastParser()

  return parser.parse(txt)
}

export default function fetchCast(url: string): Promise<ICastObject> {
  return innerFetchCast(url)
}
