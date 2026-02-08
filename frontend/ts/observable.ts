type ObserverType = (payload: object) => void

/** Observable pattern */
export class AuthSubject {
  private _observers: ObserverType[]

  subscribe(observer: ObserverType) {
    this._observers.push(observer)
    return {
      unsubscribe: () => {
        this._observers = this._observers.filter((obs) => obs != observer)
      },
    }
  }

  emit(payload: object) {
    this._observers.forEach((observer) => {
      observer(payload)
    })
  }
}
