export interface IHTMLElementOption {
  attrs?: { [key: string]: string }
  class?: string
  on?: { [event: string]: EventListenerOrEventListenerObject }
}

export function createElement(name: string, opts?: IHTMLElementOption, ...children: HTMLElement[]): HTMLElement {
  const el = document.createElement(name)
  if (opts) {
    if (opts.attrs) {
      for (const key in opts.attrs) { el.setAttribute(key, opts.attrs[key]) }
    }
    if (opts.class) {
      el.setAttribute('class', opts.class)
    }
    if (opts.on) {
      for (const ev in opts.on) { el.addEventListener(ev, opts.on[ev]) }
    }
  }
  el.append(...children)
  return el
}
