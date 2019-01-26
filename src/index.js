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
    this.minWidth = this.maxWidth = this.minHeight = this.maxHeight = null
    // Which of width and height fit to the screen
    this.scaleOrigin = 'width'
    // Single numelic argument is used as minWidth
    if (typeof options === 'number') {
      this.minWidth = options
    // Object argument can set values to all properties
    } else if (typeof options === 'object') {
      if (typeof options.minWidth === 'number') this.minWidth = options.minWidth
      if (typeof options.maxWidth === 'number') this.maxWidth = options.maxWidth
      if (typeof options.minHeight === 'number') this.minHeight = options.minHeight
      if (typeof options.maxHeight === 'number') this.maxHeight = options.maxHeight
      if (options.scaleOrigin === 'height') this.scaleOrigin = 'height'
      // Invalid combination of properties
      if (typeof this.minWidth === 'number' && typeof this.maxWidth === 'number') {
        if (this.minWidth > this.maxWidth) {
          throw new Error('ViewportExtra requires that minWidth is less than maxWidth')
        }
      }
      if (typeof this.minHeight === 'number' && typeof this.maxHeight === 'number') {
        if (this.minHeight > this.maxHeight) {
          throw new Error('ViewportExtra requires that minHeight is less than maxHeight')
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
  // Use innerWidth and innerHeight instead of screen.width and screen.height
  // Because innerWidth and innerHeight are always current width and height
  ViewportExtra.createContent = function (_this, _window) {
    var width, height, initialScale, initialScaleWidth, initialScaleHeight, content
    width = height = initialScale = initialScaleWidth = initialScaleHeight = ''
    content = []
    if (_this.minWidth != null && _this.minWidth === _this.maxWidth) {
      width = 'width=' + _this.minWidth
      initialScaleWidth = 'initial-scale=' + _window.innerWidth / _this.minWidth
    } else if (_this.minWidth != null && _window.innerWidth < _this.minWidth) {
      width = 'width=' + _this.minWidth
      initialScaleWidth = 'initial-scale=' + _window.innerWidth / _this.minWidth
    } else if (_this.maxWidth != null && _window.innerWidth > _this.maxWidth) {
      width = 'width=' + _this.maxWidth
      initialScaleWidth = 'initial-scale=' + _window.innerWidth / _this.maxWidth
    }
    if (_this.minHeight != null && _this.minHeight === _this.maxHeight) {
      height = 'height=' + _this.minHeight
      initialScaleHeight = 'initial-scale=' + _window.innerHeight / _this.minHeight
    } else if (_this.minHeight != null && _window.innerHeight < _this.minHeight) {
      height = 'height=' + _this.minHeight
      initialScaleHeight = 'initial-scale=' + _window.innerHeight / _this.minHeight
    } else if (_this.maxHeight != null && _window.innerHeight > _this.maxHeight) {
      height = 'height=' + _this.maxHeight
      initialScaleHeight = 'initial-scale=' + _window.innerHeight / _this.maxHeight
    }
    initialScale = initialScaleWidth
    if (_this.scaleOrigin === 'height' && initialScaleHeight) {
      initialScale = initialScaleHeight
    }
    for (let value of [ width, height, initialScale ]) {
      if (value) content.push(value)
    }
    return content.join(',')
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
