/**
 * This file is a helper tool to assist in window.location behavior as JS DOM does not implement window.location completely.
 * window.location is mocked and a hrefSetSpy is supplied for detecting redirects.
 * hrefInit is used to modify the current href without triggering the hrefSetSpy
 */

// Actuals
let _url = ''
const windowLocationActual = window.location
const windowHistoryActual = window.history

export interface IMockedLocation extends Location {
  hrefInit: any
  hrefSetSpy: any
  ancestorOrigins: any
  assignSpy: any
  hashSetSpy: any
  hostSetSpy: any
  hostnameSetSpy: any
  originSetSpy: any
  pathnameSetSpy: any
  portSetSpy: any
  protocolSetSpy: any
  reload: any
  reloadSpy: any
  replace: any
  replaceSpy: any
  searchSetSpy: any
}

export interface IMockedHistory extends History {
  replaceStateSpy: any
}

export const replaceAndMockLocation = (initialUrl = ''): void => {
  _url = initialUrl || window.location.href

  const location: IMockedLocation = {
    set hrefInit(url: string) {
      _url = url.toString()
    },
    hrefSetSpy: jest.fn(),
    get href() {
      return _url
    },
    set href(value) {
      location.hrefSetSpy(value)
      _url = value.toString()
    },
    get ancestorOrigins() {
      return ''
    },
    get hash() {
      return `#${_url.replace(/^.*\#/, '')}`
    },
    hashSetSpy: jest.fn(),
    set hash(value) {
      location.hashSetSpy(value)
      _url = _url.replace(location.hash, `#${value.replace(/^#/, '')}`)
    },
    get host() {
      return location.origin.replace(/.*\/\//, '')
    },
    hostSetSpy: jest.fn(),
    set host(value) {
      location.hostSetSpy(value)
      _url = _url.replace(location.host, value)
    },
    get hostname() {
      return location.host.replace(/:.*/, '')
    },
    hostnameSetSpy: jest.fn(),
    set hostname(value) {
      location.hostnameSetSpy(value)
      _url = _url.replace(location.hostname, value)
    },
    get origin() {
      const defaultProtocol = 'http:'
      const protocol = _url.replace(/\/\/.*/, '')
      const address = _url.replace(/.*\/\//, '')
      return `${protocol || defaultProtocol}//${address
        .replace(/\/.*/, '')
        .replace(/\?.*/, '')
        .replace(/\#.*/, '')}`
    },
    originSetSpy: jest.fn(),
    set origin(value) {
      location.originSetSpy(value)
      _url = _url.replace(location.origin, value)
    },
    get pathname() {
      const defaultProtocol = 'http:'
      const protocol = _url.replace(/\/\/.*/, '')
      const address = _url.replace(/.*\/\//, '')
      return `${protocol || defaultProtocol}//${address.replace(/\?.*$/, '').replace(/\#.*/, '')}`
    },
    pathnameSetSpy: jest.fn(),
    set pathname(value) {
      location.pathnameSetSpy(value)
      _url = _url.replace(location.pathname, value)
    },
    get port() {
      return _url.replace(/.*:/, '').replace(/\/.*/, '')
    },
    portSetSpy: jest.fn(),
    set port(value) {
      location.portSetSpy(value)
      _url = _url.replace(location.port, value)
    },
    get protocol() {
      return _url.replace(/\/\/.*/, '')
    },
    protocolSetSpy: jest.fn(),
    set protocol(value) {
      location.protocolSetSpy(value)
      _url = _url.replace(location.protocol, value)
    },
    get search() {
      return `?${_url.replace(/.*\?/, '')}`
    },
    searchSetSpy: jest.fn(),
    set search(value) {
      location.searchSetSpy(value)
      _url = _url.replace(location.search, `?${value.replace(/^\?/, '')}`)
    },
    assignSpy: jest.fn(),
    assign: (value: string | URL) => {
      location.assignSpy(value)
      _url = value.toString()
    },
    reloadSpy: jest.fn(),
    reload: () => {
      location.reloadSpy()
      location.href = location.href
    },
    replaceSpy: jest.fn(),
    replace: (value: string | URL) => {
      location.replaceSpy(value)
      _url = value.toString()
    },
  }
  // @ts-ignore
  delete window.location
  // @ts-ignore
  window.location = location as IMockedLocation

  const history: IMockedHistory = {
    ...window.history,
    replaceStateSpy: jest.fn(),
    replaceState: (_, __, value: string | URL) => {
      history.replaceStateSpy(value)
      _url = value.toString()
    },
  }
  // @ts-ignore
  delete window.history
  // @ts-ignore
  window.history = history as IMockedHistory
}

export const restoreWindowLocation = (): void => {
  // @ts-ignore
  window.history = windowHistoryActual
  window.location = windowLocationActual
}
