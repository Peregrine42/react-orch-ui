import _ from 'lodash'

export default class Instrument {
  static numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = 
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  static valid(data) {
    return {
      id: data.id,
      name: data.name,
      amount: data.amount,
      reserved: data.reserved,
      price: data.price,
      description: data.description
    }
  }
  static sorter(instrument) {
    return instrument.name
  }
  static prerender(instrument) {
    instrument.inStock = 
      instrument.amount - instrument.reserved
    let price = parseFloat(instrument.price)
      .toFixed(2)
    let string = Instrument.numberWithCommas(price)
    instrument.formattedPrice = string
    return instrument
  }
  static baseURL() {
    return (
      "http://localhost:3000/instruments"
    )
  }
  static indexFromID(id, rows) {
    return _.findIndex(rows, (row) => {
      return id === row.id
    })
  }
  static findByID(id, rows) {
    let index = Instrument.indexFromID(id, rows)
    return rows[index] || false
  }
  static update(rows, newData) {
    let oldData = Instrument
      .findByID(newData.id, rows)
    if (!oldData) { return newData }
    return (_.extend(newData, oldData, 
      (v, o) => {
        return _.isUndefined(v) || 
          parseFloat(o) == parseFloat(v) ? o : v
      })
    )
  }
}