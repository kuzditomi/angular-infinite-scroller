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
            scope.items = [];

            scope.fillItems = function () {
                scope.items = numbers;
            };

            // floating list
            scope.floatingList = numbers.slice();

            // table
            let rows = [];
            for (var i = 0; i < 100; i++) {
                rows.push({
                    id: i,
                    name: 'number ' + i
                })
            }
            scope.rows = rows;

            // bit complex
            let stuffs = [];
            let words = ['this', 'is', 'some', 'word', 'to', 'randomly', 'pick', 'three', 'with', 'some', 'super', 'complex', 'logic'];

            for (var i = 0; i < 100; i++) {
                let color = Math.random();
                let name = "";
                for (var j = 0; j < 3; j++) {
                    name += words[Math.floor(Math.random() * words.length)] + " ";
                }

                stuffs.push({
                    id: i,
                    name: name,
                    color: color < 0.66 ? (color < 0.33 ? 'green' : 'blue') : 'red'
                });
            }

            scope.stuffs = stuffs;
        }
    ]);
}())