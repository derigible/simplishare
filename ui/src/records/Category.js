import Event from './Event'

export default class CategoryRecord {
  constructor (category, state) {
    Object.keys(category).forEach((k) => { this[k] = category[k] })
    this.state = state
  }

  get events () {
    return Object.values(this.state.event.entities)
      .filter((e) => e.categories.includes(this.id))
      .map((e) => new Event(e, this.state))
  }
}
