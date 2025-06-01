# Changelog

## [3.0.0-rc.0](https://github.com/dsktschy/viewport-extra/compare/v2.4.1...v3.0.0-rc.0) (2025-06-01)


### ⚠ BREAKING CHANGES

* fallback to main/module fields for bundlers that do not support exports field, instead of browser field
* rename min-width/max-width in content attribute to minimum-width/maximum-width
* provide artifacts with and without GlobalParameters support
* remove setContent function
* use attributes of all viewport meta elements as parameters
* do not warn or fall back to defaults for invalid Content values
* always use width of window when scale is 1 for comparison with minimum and maximum width
* provide artifacts with and without side effects
* avoid retaining state
* provide ES2022 and ES5 artifacts
* handle .ts and .js extensions as ES modules
* aggregate artifacts into one directory
* remove ViewportExtra class

### Features

* provide artifacts with and without GlobalParameters support ([52fd329](https://github.com/dsktschy/viewport-extra/commit/52fd3292e16bdb606d7514beda12b163dab07a96))
* provide artifacts with and without side effects ([f796bde](https://github.com/dsktschy/viewport-extra/commit/f796bde09bfa72a2d466786d7ba112c97378c8a1))
* provide ES2022 and ES5 artifacts ([4a776e5](https://github.com/dsktschy/viewport-extra/commit/4a776e55db79fd426c2c9ebccb09ed45a5fd4f48))


### Bug Fixes

* fallback to main/module fields for bundlers that do not support exports field, instead of browser field ([a6803a3](https://github.com/dsktschy/viewport-extra/commit/a6803a34bbcd8afc899addf11097acd7f7d10413))
* link artifacts and source maps with sourceMappingURL ([8807520](https://github.com/dsktschy/viewport-extra/commit/880752000dd5fa627d827a51e3e0407f23dc2f35))


### Miscellaneous Chores

* aggregate artifacts into one directory ([419303a](https://github.com/dsktschy/viewport-extra/commit/419303a9977283c3ce23bb97d83f70a15158e1f3))
* always use width of window when scale is 1 for comparison with minimum and maximum width ([4188ad1](https://github.com/dsktschy/viewport-extra/commit/4188ad100123bde8eded31dae053d80704b76407))
* avoid retaining state ([01a1106](https://github.com/dsktschy/viewport-extra/commit/01a1106847dd3db0459b071c1ed12d883a450934))
* do not warn or fall back to defaults for invalid Content values ([edd5152](https://github.com/dsktschy/viewport-extra/commit/edd5152321c2fad6825af4824bbb4ffe839175ed))
* handle .ts and .js extensions as ES modules ([90c72ab](https://github.com/dsktschy/viewport-extra/commit/90c72ab7e950889600c9995efa45a03ac3d96372))
* remove setContent function ([0f8591f](https://github.com/dsktschy/viewport-extra/commit/0f8591f984fad53ea4081e341f9ded8ef0dad620))
* remove ViewportExtra class ([018a299](https://github.com/dsktschy/viewport-extra/commit/018a299b8bba685b2679d32f18bc90fba5a34a63))
* rename min-width/max-width in content attribute to minimum-width/maximum-width ([d7d0b01](https://github.com/dsktschy/viewport-extra/commit/d7d0b01a89266945f92bdc2d63bc8355424674dc))
* use attributes of all viewport meta elements as parameters ([aae1c12](https://github.com/dsktschy/viewport-extra/commit/aae1c1244e0adc721ae4781d6622f59486519f0c))

## [2.4.1](https://github.com/dsktschy/viewport-extra/compare/v2.4.1-rc.0...v2.4.1) (2025-04-05)


### Miscellaneous Chores

* stabilize 2.4.1 ([8c1864b](https://github.com/dsktschy/viewport-extra/commit/8c1864b2979bd78bc423a090f718c468b637c16d))

## [2.4.1-rc.0](https://github.com/dsktschy/viewport-extra/compare/v2.4.0...v2.4.1-rc.0) (2025-04-01)


### Bug Fixes

* recover IE11 compatibility ([747de2c](https://github.com/dsktschy/viewport-extra/commit/747de2cc8a6d727dd916676c1e0a2f61e2718c9a))

## [2.4.0](https://github.com/dsktschy/viewport-extra/compare/v2.4.0-rc.0...v2.4.0) (2025-01-25)


### Miscellaneous Chores

* stabilize 2.4.0 ([724d49c](https://github.com/dsktschy/viewport-extra/commit/724d49c0e66c240bf9c5e3855103b78ea1d579a9))

## [2.4.0-rc.0](https://github.com/dsktschy/viewport-extra/compare/v2.3.0...v2.4.0-rc.0) (2025-01-13)


### Features

* enable to specify decimal places for output content attribute ([b433a1b](https://github.com/dsktschy/viewport-extra/commit/b433a1bfc2d3fc0927c3230167d15acd876c05b8))

## [2.3.0](https://github.com/dsktschy/viewport-extra/compare/v2.3.0-rc.0...v2.3.0) (2025-01-13)


### Miscellaneous Chores

* stabilize 2.3.0 ([180ef2e](https://github.com/dsktschy/viewport-extra/commit/180ef2e8f4eceb1baf906cb44cfa1f22ae36afff))

## [2.3.0-rc.0](https://github.com/dsktschy/viewport-extra/compare/v2.2.0...v2.3.0-rc.0) (2025-01-05)


### Features

* enable different settings per media ([ff3ce53](https://github.com/dsktschy/viewport-extra/commit/ff3ce53066b6c4749b34e0c02ba1b0bb7b247303))

## [2.2.0](https://github.com/dsktschy/viewport-extra/compare/v2.2.0-rc.1...v2.2.0) (2025-01-05)


### Miscellaneous Chores

* stabilize 2.2.0 ([d10b314](https://github.com/dsktschy/viewport-extra/commit/d10b314e87bb5f1bf6cf7cb7f9f967a74a8348a0))

## [2.2.0-rc.1](https://github.com/dsktschy/viewport-extra/compare/v2.2.0-rc.0...v2.2.0-rc.1) (2025-01-05)


### Bug Fixes

* enable getContent to run in environments where no window object exists ([143f61c](https://github.com/dsktschy/viewport-extra/commit/143f61c3d66195bc2a7ec1e1ce3ec0e2291de12c))

## [2.2.0-rc.0](https://github.com/dsktschy/viewport-extra/compare/v2.1.4...v2.2.0-rc.0) (2024-12-23)


### Features

* add option to use width of window when scale is 1 for comparison with minimum and maximum width ([eba278e](https://github.com/dsktschy/viewport-extra/commit/eba278eb66b67dd4ada329fc7aef962fa39d87e6))
