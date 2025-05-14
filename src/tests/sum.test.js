const sum = require('../utility/sum.js')

describe('sum function', () => {
  test('Should return the sum of a and b variables', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
