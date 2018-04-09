(function () {
    const app = angular.module("example", ['angular-infinite-scroller']);

    app.controller('ExampleController', [
        '$scope',
        function (scope) {
            // simple list
            let numbers = [];
            for (var i = 0; i < 100; i++) {
                numbers.push(i);
            }

            scope.items = numbers;
        }
    ]);
}());