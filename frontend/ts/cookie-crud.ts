const DAY_IN_SECONDS = 86_400

export const cookieRead = (name: string) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
  }
  return ''
}

const cookieWrite = (
  name: string,
  value: string,
  seconds: number = DAY_IN_SECONDS,
) => {
  const date = new Date()
  date.setTime(date.getTime() + seconds * 1_000)
  const expires = '; expires=' + date.toUTCString()
  const domain =
    '; domain=' + window.location.host.replace(/.*?\./, '.').replace(/:.*/, '')
  const path = '; path=/'

  window.document.cookie = name + '=' + value + expires + domain + path
}

export const cookieDelete = (name: string) => {
  cookieWrite(name, '', -1)
}

// Debug
// let date = new Date(Date.now() + 86400e3);
// date = date.toUTCString();
// document.cookie = "kind=chocolatechip; domain=site.com; expires=" + date;
