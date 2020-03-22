import { createElement as n, addDisposableDomListener } from './DomHelper'
import { title } from '../Utils'

test('createElement no opts', () => {
  const div = n('div')

  expect(div.localName).toBe('div')
})

test('createElement with opts', () => {
  const mock = jest.fn()
  const div = n('div', {
    attrs: { a: '1', b: '2' },
    class: 'a b',
    on: { click: mock }
  })

  expect(div.localName).toBe('div')
  expect(div.getAttribute('class')).toBe('a b')
  div.dispatchEvent(new Event('click'))
  expect(mock).toBeCalled()
})

test('createElement nested', () => {
  let a
  const div = n('div', {},
    a = n('a')
  )
  expect(div.localName).toBe('div')
  expect(div.children.length).toBe(1)
  expect(div.children[0]).toBe(a)
})

test(title(addDisposableDomListener, 'dispose'), () => {
  const div = document.createElement('div')
  const mock = jest.fn()
  const disposable = addDisposableDomListener(div, 'test', mock)

  div.dispatchEvent(new Event('test'))
  expect(mock).toBeCalledTimes(1)

  disposable.dispose()

  div.dispatchEvent(new Event('test'))
  expect(mock).toBeCalledTimes(1)

  // double dispose
  disposable.dispose()

  div.dispatchEvent(new Event('test'))
  expect(mock).toBeCalledTimes(1)
})
