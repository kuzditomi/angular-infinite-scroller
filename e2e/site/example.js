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

            const persons = [
                'Bela', 'Denes', 'Aladar'
            ].map((name, index) => {
                return {
                    id: index + 1,
                    name
                };
            });

            scope.persons = [];

            scope.initPersons = () => {
                scope.persons = persons.slice();
            };

            scope.addPerson = () => {
                scope.persons.push({
                    id: scope.persons.length + 1,
                    name: scope.newName
                });
            };

            scope.removePerson = () => {
                scope.persons.splice(0, 1); // remove Denes
            };
        }
    ]);
}());