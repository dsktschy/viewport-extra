export class NonnumericInitialScaleError extends Error {
  constructor() {
    super('Viewport Extra received invalid initial-scale.')
    this.name = 'NonnumericInitialScaleError'
  }
}

export class NoOptionsError extends Error {
  constructor() {
    super('Viewport Extra requires at least one of mix-width or max-width.')
    this.name = 'NoOptionsError'
  }
}

export class NonnumericMinWidthError extends Error {
  constructor() {
    super('Viewport Extra received invalid min-width.')
    this.name = 'NonnumericMinWidthError'
  }
}

export class NonnumericMaxWidthError extends Error {
  constructor() {
    super('Viewport Extra received invalid max-width.')
    this.name = 'NonnumericMaxWidthError'
  }
}

export class ReversedOptionsError extends Error {
  constructor() {
    super('Viewport Extra received max-width that is less than min-width.')
    this.name = 'ReversedOptionsError'
  }
}
