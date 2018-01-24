(function () {
    const app = angular.module("example", ['angular-infinite-scroller']);

    app.controller('ExampleController', [
        '$scope',
        function (scope) {
            scope.szia = 'Hello';
            scope.items = [
                1,
                2,
                3
            ]
        }
    ]);
}())