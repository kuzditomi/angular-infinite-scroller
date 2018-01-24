(function () {
    const app = angular.module("example", ['angular-infinite-scroller']);

    app.controller('ExampleController', [
        '$scope',
        function (scope) {
            scope.szia = 'Hello';

            let numbers = [];
            for (var i = 0; i < 100; i++) {
                numbers.push(i);
            }

            scope.items = numbers;
        }
    ]);
}())