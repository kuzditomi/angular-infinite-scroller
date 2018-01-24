// help from: http://liamkaufman.com/blog/2013/05/13/understanding-angularjs-directives-part1-ng-repeat-and-compile/
(function () {
    const scrollerModule = angular.module('angular-infinite-scroller', []);
    const BUFFER_COUNT = 5;

    scrollerModule.directive('infiniteScroller', function () {
        return {
            transclude: 'element',
            compile: function (element, attr, linker) {
                return function ($scope) {
                    let loop = attr.infiniteScroller,
                        match = loop.match(/^\s*(.+)\s+in\s+(.*?)$/),
                        indexString = match[1],
                        collectionString = match[2],
                        parent = element.parent(),
                        elements = [];

                    $scope.$watchCollection(collectionString, function (collection) {
                        cleanChildren();
                        addChildren($scope, collection);
                    });

                    function cleanChildren() {
                        for (i = 0; i < elements.length; i++) {
                            elements[i].el.remove();
                            elements[i].scope.$destroy();
                        };
                        elements = [];
                    }

                    function addChildren($scope, collection) {
                        let countTillStop = BUFFER_COUNT;

                        for (i = 0; i < collection.length && countTillStop > 0; i++) {
                            let childScope = $scope.$new();
                            childScope[indexString] = collection[i];

                            linker(childScope, function (clone) {
                                parent.append(clone);
                                let block = {};
                                block.el = clone;
                                block.scope = childScope;
                                elements.push(block);

                                let parentEl = parent[0];
                                let blockEl = block.el[0];
                                let parentBottom = parentEl.offsetTop + parentEl.scrollTop + parentEl.offsetHeight;
                                let blockBottom = blockEl.offsetTop + blockEl.offsetHeight;

                                if (blockBottom > parentBottom) {
                                    countTillStop --;
                                }
                            });
                        }
                    }
                }
            }
        }
    });
})();
