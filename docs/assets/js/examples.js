const app = angular.module("example", ['angular-infinite-scroller']);


app.controller('ExampleController', [
    '$scope', function (scope) {
        scope.simpleitems = Array(100).fill().map((v, i) => i + 1);

        const names = ['Rich', 'Leon', 'Jefferson', 'Glady', 'Vivien', 'Kyong', 'Kamilah', 'Kasi', 'Ralph', 'Leota', 'Jeromy', 'Bernardina', 'Sammie', 'Chris', 'Jetta'];
        scope.tablerows = Array(100).fill().map((v, i) => {
            const randName = names[Math.floor(Math.random() * names.length)];
            return {
                id: i + 1,
                name: randName
            };
        });
    }]);