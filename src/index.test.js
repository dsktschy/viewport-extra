const ViewportExtra = require('./index')

describe('ViewportExtra', () => {
  describe('createContent()', () => {
    test('{ minWidth: 360 }, innerWidth: 359', execute.bind(this, ...[
      { minWidth: 360 },
      { innerWidth: 359 },
      `width=360,initial-scale=${359 / 360}`
    ]))
    test('{ minWidth: 360 }, innerWidth: 360', execute.bind(this, ...[
      { minWidth: 360 },
      { innerWidth: 360 },
      ''
    ]))
    test('{ minWidth: 360 }, innerWidth: 361', execute.bind(this, ...[
      { minWidth: 360 },
      { innerWidth: 361 },
      ''
    ]))
    test('{ maxWidth: 360 }, innerWidth: 359', execute.bind(this, ...[
      { maxWidth: 360 },
      { innerWidth: 359 },
      ''
    ]))
    test('{ maxWidth: 360 }, innerWidth: 360', execute.bind(this, ...[
      { maxWidth: 360 },
      { innerWidth: 360 },
      ''
    ]))
    test('{ maxWidth: 360 }, innerWidth: 361', execute.bind(this, ...[
      { maxWidth: 360 },
      { innerWidth: 361 },
      `width=360,initial-scale=${361 / 360}`
    ]))
    test('{ minWidth: 360, maxWidth: 414 }, innerWidth: 359', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 414 },
      { innerWidth: 359 },
      `width=360,initial-scale=${359 / 360}`
    ]))
    test('{ minWidth: 360, maxWidth: 414 }, innerWidth: 360', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 414 },
      { innerWidth: 360 },
      ''
    ]))
    test('{ minWidth: 360, maxWidth: 414 }, innerWidth: 375', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 414 },
      { innerWidth: 375 },
      ''
    ]))
    test('{ minWidth: 360, maxWidth: 414 }, innerWidth: 414', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 414 },
      { innerWidth: 414 },
      ''
    ]))
    test('{ minWidth: 360, maxWidth: 414 }, innerWidth: 415', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 414 },
      { innerWidth: 415 },
      `width=414,initial-scale=${415 / 414}`
    ]))
    test('{ minWidth: 360, maxWidth: 360 }, innerWidth: 359', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 360 },
      { innerWidth: 359 },
      `width=360,initial-scale=${359 / 360}`
    ]))
    test('{ minWidth: 360, maxWidth: 360 }, innerWidth: 360', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 360 },
      { innerWidth: 360 },
      `width=360,initial-scale=1`
    ]))
    test('{ minWidth: 360, maxWidth: 360 }, innerWidth: 361', execute.bind(this, ...[
      { minWidth: 360, maxWidth: 360 },
      { innerWidth: 361 },
      `width=360,initial-scale=${361 / 360}`
    ]))
    function execute (_this, _window, result) {
      expect(ViewportExtra.createContent(_this, _window)).toBe(result)
    }
  })
})
