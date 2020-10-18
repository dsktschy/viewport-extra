const ViewportExtra = require('./index')

describe('ViewportExtra', () => {
  describe('createContent()', () => {
    test(
      '{ minWidth: 360 }, documentWidth: 359',
      execute.bind(this, ...[
        { minWidth: 360 },
        { document: { documentElement: { clientWidth: 359 } } },
        `width=360,initial-scale=${359 / 360}`
      ])
    )
    test(
      '{ minWidth: 360 }, documentWidth: 360',
      execute.bind(this, ...[
        { minWidth: 360 },
        { document: { documentElement: { clientWidth: 360 } } },
        ''
      ])
    )
    test(
      '{ minWidth: 360 }, documentWidth: 361',
      execute.bind(this, ...[
        { minWidth: 360 },
        { document: { documentElement: { clientWidth: 361 } } },
        ''
      ])
    )
    test(
      '{ maxWidth: 360 }, documentWidth: 359',
      execute.bind(this, ...[
        { maxWidth: 360 },
        { document: { documentElement: { clientWidth: 359 } } },
        ''
      ])
    )
    test(
      '{ maxWidth: 360 }, documentWidth: 360',
      execute.bind(this, ...[
        { maxWidth: 360 },
        { document: { documentElement: { clientWidth: 360 } } },
        ''
      ])
    )
    test(
      '{ maxWidth: 360 }, documentWidth: 361',
      execute.bind(this, ...[
        { maxWidth: 360 },
        { document: { documentElement: { clientWidth: 361 } } },
        `width=360,initial-scale=${361 / 360}`
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 414 }, documentWidth: 359',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 414 },
        { document: { documentElement: { clientWidth: 359 } } },
        `width=360,initial-scale=${359 / 360}`
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 414 }, documentWidth: 360',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 414 },
        { document: { documentElement: { clientWidth: 360 } } },
        ''
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 414 }, documentWidth: 375',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 414 },
        { document: { documentElement: { clientWidth: 375 } } },
        ''
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 414 }, documentWidth: 414',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 414 },
        { document: { documentElement: { clientWidth: 414 } } },
        ''
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 414 }, documentWidth: 415',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 414 },
        { document: { documentElement: { clientWidth: 415 } } },
        `width=414,initial-scale=${415 / 414}`
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 360 }, documentWidth: 359',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 360 },
        { document: { documentElement: { clientWidth: 359 } } },
        `width=360,initial-scale=${359 / 360}`
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 360 }, documentWidth: 360',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 360 },
        { document: { documentElement: { clientWidth: 360 } } },
        `width=360,initial-scale=1`
      ])
    )
    test(
      '{ minWidth: 360, maxWidth: 360 }, documentWidth: 361',
      execute.bind(this, ...[
        { minWidth: 360, maxWidth: 360 },
        { document: { documentElement: { clientWidth: 361 } } },
        `width=360,initial-scale=${361 / 360}`
      ])
    )
    function execute (_this, _window, result) {
      expect(ViewportExtra.createContent(_this, _window)).toBe(result)
    }
  })
})
