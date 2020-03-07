import { ICastObject } from './Cast'
import { parse } from './CastParser'

async function innerFetchCast(url: string): Promise<ICastObject> {
  const res = await fetch(url, { mode: 'no-cors' })

  return parse(await res.text())
}

export default function fetchCast(url: string): Promise<ICastObject> {
  return innerFetchCast(url)
}
