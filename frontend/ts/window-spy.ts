/* eslint-disable */
//@ts-ignore
const windowActual = global.window

export const setWindowUsedListener = (global: any) => {
  const windowSpy = Object.keys(window).reduce((copyWin: any, key: any) => {
    if (typeof window[key] === 'function') {
      //@ts-ignore
      copyWin[key] = jest.fn(() => window[key]())
    } else {
      copyWin[`__spy_${key}`] = jest.fn()
      Object.defineProperty(copyWin, key, {
        get: function () {
          copyWin[`__spy_${key}`]()
          return window[key]
        },
      })
    }
    return copyWin
  }, {})
  //@ts-ignore
  global.window = windowSpy
}

export const isWindowUsed = () =>
  Boolean(
    Object.keys(window).find(
      (key: any) => (window[key] as any)?.mock?.calls?.length ?? 0 > 0,
    ),
  )

export const restoreWindow = (global: any) => {
  //@ts-ignore
  global.window = windowActual
}
