(function () {
    const app = angular.module("example", ['angular-infinite-scroller']);

    app.directive('dirtyCheck', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                let original = null;

                scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newvalue, oldvalue) {
                    if (original === null && newvalue != undefined)
                        original = newvalue;

                    if (newvalue != oldvalue) {
                        element.addClass('mydirty');
                    }
                    if (newvalue == original) {
                        element.removeClass('mydirty');
                    }
                });
            }
        };
    });

    app.controller('ExampleController', [
        '$scope',
        function (scope) {
            // simple list
            let numbers = [];
            for (var i = 0; i < 100; i++) {
                numbers.push(i);
            }

            scope.items = numbers;

            // ordered person list
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

            scope.addPersonFiltered = () => {
                scope.filteredList.unshift({
                    id: -1,
                    name: 'X'
                });
            };

            scope.removePerson = () => {
                scope.persons.splice(0, 1); // remove Denes
            };

            // filtered list
            const As = Array.from(Array(10)).map(n => 'A');
            const Bs = Array.from(Array(10)).map(n => 'B');
            const Cs = Array.from(Array(10)).map(n => 'C');
            const Ds = Array.from(Array(10)).map(n => 'D');

            scope.filteredList = As.concat(Bs).concat(Cs).concat(Ds).map((letter, index) => {
                return {
                    id: index,
                    name: letter
                };
            });
        }
    ]);
}());