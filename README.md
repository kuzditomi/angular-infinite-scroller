# angular-infinite-scroller

[![Build Status](https://travis-ci.org/kuzditomi/angular-infinite-scroller.svg?branch=master)](https://travis-ci.org/kuzditomi/angular-infinite-scroller)
[![Coverage Status](https://coveralls.io/repos/github/kuzditomi/angular-infinite-scroller/badge.svg)](https://coveralls.io/github/kuzditomi/angular-infinite-scroller)

AngularJS directive to displays limited number of elements in an ng-repeat like manner.

## Download
[Minified version](https://raw.githubusercontent.com/kuzditomi/angular-infinite-scroller/master/dist/angular-infinite-scroller.min.js)

## Install

Import `angular-infinite-scroller` module to your main angular module.

```javascript
angular.module("example", ['angular-infinite-scroller', ... ]);
```

Then you are free to use the `infinite-scroller` directive:

```html
<div class="scroll-container">
  <div infinite-scroller="item in items">
    {{item}}
  </div>
</div>
```

Make sure to set `height` and `overflow` of the parent container: 

```css
div.scroll-container {
    height: 200px;
    overflow-y: scroll;
}
```

## Demo

See documentation and examples on [github page](https://kuzditomi.github.io/angular-infinite-scroller/).

## Examples

### Simple usage
Define the source in an angular controller
```javascript
$scope.items = [...]
```

Bind the array like you would use ng-repeat in the template
```html
<div class="scroll-container">
  <div infinite-scroller="item in items">
    {{item}}
  </div>
</div>
```

## Contribution
You are welcome to [submit issues](https://github.com/kuzditomi/angular-infinite-scroller/issues/new) or pull-requests to the repository.

### Build
Development is done with [typescript](https://www.typescriptlang.org/) and the build is using [webpack](https://webpack.js.org/).

- installing dependencies
  ```
  npm install
  ```
- build
  ```
  npm build
  ```

### Tests
Unit tests are running in [Karma](https://karma-runner.github.io) using [Jasmine](https://jasmine.github.io/).

- running tests (also generates html report under `coverage` folder)
  ```
  npm run test
  ```
 

- running Karma in debug mode with proper source-maps
  ```
  npm run test-debug
  ```

