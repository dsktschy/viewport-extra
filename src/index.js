// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory();
  } else {
    // Browser globals
    root.ViewportExtra = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  var ViewportExtra

  ViewportExtra = function (options) {
    // Properties that is null are not be applied
    this.minWidth = this.maxWidth = null
    // Single numelic argument is used as minWidth
    if (typeof options === 'number') {
      this.minWidth = options
    // Object argument can set values to all properties
    } else if (typeof options === 'object') {
      if (typeof options.minWidth === 'number') this.minWidth = options.minWidth
      if (typeof options.maxWidth === 'number') this.maxWidth = options.maxWidth
      // Invalid combination of properties
      if (typeof this.minWidth === 'number' && typeof this.maxWidth === 'number') {
        if (this.minWidth > this.maxWidth) {
          throw new Error('ViewportExtra requires that maxWidth is not less than minWidth')
        }
      }
    // Invalid argument types
    } else {
      throw new Error('ViewportExtra requires an argument that is number or object')
    }
    this.applyToElement()
  }

  ViewportExtra.prototype.applyToElement = function () {
    if (window == null) return
    var content = ViewportExtra.createContent(this, window)
    if (content) ViewportExtra.element.setAttribute('content', content)
  }

  // Static method to enable to test
  // Use innerWidth instead of screen.width, because innerWidth are always current width
  ViewportExtra.createContent = function (_this, _window) {
    var width, initialScale, contents
    width = initialScale = ''
    contents = []
    if (_this.minWidth != null && _this.minWidth === _this.maxWidth) {
      width = 'width=' + _this.minWidth
      initialScale = 'initial-scale=' + _window.innerWidth / _this.minWidth
    } else if (_this.minWidth != null && _window.innerWidth < _this.minWidth) {
      width = 'width=' + _this.minWidth
      initialScale = 'initial-scale=' + _window.innerWidth / _this.minWidth
    } else if (_this.maxWidth != null && _window.innerWidth > _this.maxWidth) {
      width = 'width=' + _this.maxWidth
      initialScale = 'initial-scale=' + _window.innerWidth / _this.maxWidth
    }
    [ width, initialScale ].forEach(function (value) {
      if (value) contents.push(value)
    })
    return contents.join(',')
  }

  ViewportExtra.createElement = function () {
    var element = document.createElement('meta')
    element.setAttribute('name', 'viewport')
    element.setAttribute('content', 'width=device-width,initial-scale=1')
    document.head.insertBefore(element, null)
    return element
  }

  // Static property because viewport element is always only one
  ViewportExtra.element = (function () {
    if (window == null) return null
    return (
      document.querySelector('[name="viewport"]') ||
      ViewportExtra.createElement()
    )
  })()

  return ViewportExtra
}));
