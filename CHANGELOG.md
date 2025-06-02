# Changelog

## [3.0.0-rc.0](https://github.com/dsktschy/viewport-extra/compare/v2.4.1...v3.0.0-rc.0) (2025-06-02)


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

* provide artifacts with and without GlobalParameters support ([7107dee](https://github.com/dsktschy/viewport-extra/commit/7107dee38376710437bf04e16aad5a2bbf39cc64))
* provide artifacts with and without side effects ([06a2515](https://github.com/dsktschy/viewport-extra/commit/06a25155a1be43b077565bf5fe2f90b1fb7736ad))
* provide ES2022 and ES5 artifacts ([e01b358](https://github.com/dsktschy/viewport-extra/commit/e01b358c2e17e895a8883df5cff1d7b8cc0a185e))


### Bug Fixes

* fallback to main/module fields for bundlers that do not support exports field, instead of browser field ([3d75511](https://github.com/dsktschy/viewport-extra/commit/3d755116ebb566eafdf725761925b8308ba09925))
* link artifacts and source maps with sourceMappingURL ([04cd287](https://github.com/dsktschy/viewport-extra/commit/04cd287e252c1407c75d2c2407d7bec574047f93))


### Miscellaneous Chores

* aggregate artifacts into one directory ([10dd103](https://github.com/dsktschy/viewport-extra/commit/10dd103850f75775bd3aef8d549f0fda9cc1d36e))
* always use width of window when scale is 1 for comparison with minimum and maximum width ([fea3f9b](https://github.com/dsktschy/viewport-extra/commit/fea3f9b3a2c319ee9221a3d95962b396872e4014))
* avoid retaining state ([573eb1d](https://github.com/dsktschy/viewport-extra/commit/573eb1d5f21da0e3743648f0d80d67a5c085e729))
* do not warn or fall back to defaults for invalid Content values ([6f79e93](https://github.com/dsktschy/viewport-extra/commit/6f79e938a035681c8a26b8e89816be3c882717a1))
* handle .ts and .js extensions as ES modules ([5e818eb](https://github.com/dsktschy/viewport-extra/commit/5e818ebe679f614fb327400093313165387c903a))
* remove setContent function ([237c991](https://github.com/dsktschy/viewport-extra/commit/237c9918babdccb6b69c9b00feacb4703c41d8e2))
* remove ViewportExtra class ([a7914d8](https://github.com/dsktschy/viewport-extra/commit/a7914d8c809469e0339d8f684a0f58fd78e9b8c1))
* rename min-width/max-width in content attribute to minimum-width/maximum-width ([bad4492](https://github.com/dsktschy/viewport-extra/commit/bad44922b19cfbe14cafc7c135e12dd519089a62))
* use attributes of all viewport meta elements as parameters ([2589a42](https://github.com/dsktschy/viewport-extra/commit/2589a420d34482c93641597eed8f7a32c1caaf6b))

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
