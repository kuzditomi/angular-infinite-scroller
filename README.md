# angular-infinite-scroller

[![Build Status](https://travis-ci.org/kuzditomi/angular-infinite-scroller.svg?branch=master)](https://travis-ci.org/kuzditomi/angular-infinite-scroller)
[![Coverage Status](https://coveralls.io/repos/github/kuzditomi/angular-infinite-scroller/badge.svg)](https://coveralls.io/github/kuzditomi/angular-infinite-scroller)

AngularJS directive to displays limited number of elements in an ng-repeat like manner.

## Download
[Download minified version](https://raw.githubusercontent.com/kuzditomi/angular-infinite-scroller/master/dist/angular-infinite-scroller.min.js)

Or install via npm

```javascript
npm install angular-infinite-scroller
```

## Install
Include script reference to your page
```html
<script src="node_modules/angular-infinite-scroller/dist/angular-infinite-scroller.min.js"></script>
```
or include
```angular-infinite-scroller.min.js```
in any other way to your bundle.

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

## Known issues

### Binding with curly brackets
First population of items is using calculation based on items' height, so it's important to make rows rendered with it's <strong>final height</strong> even before the binding actually happened.
To prevent accidental linebreaking before the template is linked avoid using brackets for longer texts. Instead of:
```html
<p>{{currentCar.Owner.Firstname + '' + currentCar.Owner.LastName}}</p>
```
Use
```html
<p ng-bind="currentCar.Owner.Firstname + '' + currentCar.Owner.LastName"></p>
```

### One time binding
DOM elements in the list are reused in the scrolling process, and are not cleaned up completely.
To make this behaviour work, avoid using one time binding in the list.

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
- try lint autofix
  ```
  npm lint-fix
  ```

### Tests
Unit tests are running in [Karma](https://karma-runner.github.io) using [Jasmine](https://jasmine.github.io/).

- running unit-tests (also generates html report under `coverage` folder)
  ```
  npm run test
  ```
- running Karma in debug mode with proper source-maps
  ```
  npm run test-debug
  ```
- running UI tests
  ```javascript
  npm run webdriver-update // install/update webdriver for protractor
  npm run e2e:serve // serve static site for UI tests
  npm run e2e:local // run protractor against localhost
  ```

