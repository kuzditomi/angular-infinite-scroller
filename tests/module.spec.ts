declare var angular;

// this is purely here for the test coverage
describe('angular module', function () {
    it('correctly registers directive', function () {
        // Arrange
        angular.mock.module('angular-infinite-scroller');

        let rs: ng.IRootScopeService;
        let compileService: ng.ICompileService;

        inject(['$rootScope', '$compile', function (rootScope, compile) {
            rs = rootScope;
            compileService = compile;
        }]);

        const elm = angular.element(
            '<div class="container">' +
            '<div infinite-scroller="item in items"></div>' +
            '</div>',
        );
        const scope = rs.$new() as any;
        const newScopes = [];
        scope.items = [1, 2, 3];
        scope.$new = function () {
            const newScope = rs.$new();
            newScopes.push(newScope);

            return newScope;
        };

        // Act
        const transcludefn = compileService(elm);
        const transcludedElement = transcludefn(scope);
        scope.$digest();

        // Assert
        expect(transcludedElement.children.length).toEqual(3);
    });
});
