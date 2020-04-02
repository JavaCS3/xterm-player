import { IDisposable } from "../Types"

export interface IHTMLElementOption {
  attrs?: { [key: string]: string }
  class?: string
  text?: string
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
    if (opts.text) {
      el.innerText = opts.text
    }
  }
  el.append(...children)
  return el
}

export function $div(opts?: IHTMLElementOption, ...children: HTMLElement[]): HTMLElement {
  return createElement('div', opts, ...children)
}

export function $span(opts?: IHTMLElementOption, ...children: HTMLElement[]): HTMLElement {
  return createElement('span', opts, ...children)
}

/**
 * Adds a disposable listener to a node in the DOM, returning the disposable.
 * @param type The event type.
 * @param handler The handler for the listener.
 */
export function addDisposableDomListener(
  node: Element | Window | Document,
  type: string,
  handler: (e: any) => void,
  useCapture?: boolean
): IDisposable {
  node.addEventListener(type, handler, useCapture)
  let disposed = false
  return {
    dispose: () => {
      if (disposed) {
        return
      }
      disposed = true
      node.removeEventListener(type, handler, useCapture)
    }
  }
}
