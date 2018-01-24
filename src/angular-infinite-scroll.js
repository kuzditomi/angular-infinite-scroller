(function () {
    const scrollerModule = angular.module('angular-infinite-scroller', []);

    scrollerModule.directive('infiniteScroller', function () {
        return {
            template: '<span>{{works}}</span>',
            scope: {

            },
            controller: [
                '$scope',
                function (scope) {
                    scope.works = 'nice';
                }
            ]
        }
    });
})();
