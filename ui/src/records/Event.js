export default class EventRecord {
  constructor (event, state) {
    Object.keys(event).forEach((k) => { this[k] = event[k] })
    this.state = state
  }

  get categories () {
    return this._categories.map((c) => this.state.category.entities[c] || {})
  }

  set categories (categories) {
    this._categories = categories
  }

  get month () {
    return parseInt(this.date.split('-')[1], 10)
  }

  get year () {
    return parseInt(this.date.split('-')[0], 10)
  }

  isInCurrentMonth () {
    return this.month === new Date().getMonth() + 1
  }

  isInCurrentYear () {
    return this.year === new Date().getFullYear()
  }
}
