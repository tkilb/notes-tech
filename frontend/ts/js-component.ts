export default abstract class JsComponent<TProps> {
  static refs: { [key: string]: any }
  protected _ref: string
  protected _element: HTMLElement
  protected _props: TProps
  protected _abortControllers: AbortController[]

  constructor(element: HTMLElement, props: TProps) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    let instance
    if (typeof element.dataset.ref === 'undefined') {
      instance = this
      // Properties
      this._ref = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
      this._element = element

      // Register component
      JsComponent.refs[this._ref] = this
      element.dataset.ref = this._ref.toString()
    } else {
      // If this element has already been instantiated, use the existing reference.
      instance = JsComponent.refs[element.dataset.ref]
    }
    this._abortControllers = []
    this._props = props
    return instance
  }

  public render() {
    this._element.innerHTML = this.template(this._props)
      .replace(/\>\s+\</g, '><')
      .trim()
    this.onRender(this._props)
    return this
  }

  public reRender(props: TProps) {
    this._props = props
    return this.render()
  }

  abstract template(props: TProps): string

  protected onRender(props: TProps) {}

  public destroy() {
    // Clean up event listeners
    for (const abortController of this._abortControllers) {
      abortController.abort()
    }
    this._element.innerHTML = ''
  }
}

JsComponent.refs = {}
