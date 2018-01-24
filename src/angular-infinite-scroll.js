// help from: http://liamkaufman.com/blog/2013/05/13/understanding-angularjs-directives-part1-ng-repeat-and-compile/
(function () {
    const scrollerModule = angular.module('angular-infinite-scroller', []);
    const BUFFER_COUNT = 5;
    const LOAD_COUNT = 10;

    scrollerModule.directive('infiniteScroller',
        ['$compile',
            function (compile) {
                return {
                    transclude: 'element',
                    compile: function (element, attr, linker) {
                        return function ($scope) {
                            let loop = attr.infiniteScroller,
                                match = loop.match(/^\s*(.+)\s+in\s+(.*?)$/),
                                indexString = match[1],
                                collectionString = match[2],
                                parent = element.parent(),
                                elements = [],
                                from = to = 0,
                                collection;

                            $scope.$watchCollection(collectionString, function (newCollection) {
                                collection = newCollection;
                                //cleanChildren();
                                addChildren();
                            });

                            parent.bind('scroll', function (evt) {
                                $scope.$apply(function () {
                                    let el = evt.target;
                                    let current = el.scrollTop + el.offsetHeight;
                                    let bottom = el.scrollHeight

                                    if (current == bottom) {
                                        addChildren();
                                        removeTopChildren();
                                    }
                                });
                            });

                            function cleanChildren() {
                                for (i = 0; i < elements.length; i++) {
                                    elements[i].el.remove();
                                    elements[i].scope.$destroy();
                                };
                                elements = [];
                            }

                            function addChildren(addminimum) {
                                let countTillStop = addminimum || BUFFER_COUNT;

                                for (var i = to; i < collection.length && countTillStop > 0; i++) {
                                    let childScope = $scope.$new();
                                    childScope[indexString] = collection[i];

                                    linker(childScope, function (clone) {
                                        parent.append(clone);
                                        let block = {};
                                        block.el = clone;
                                        block.scope = childScope;
                                        elements.push(block);

                                        // limit initial display
                                        let parentEl = parent[0];
                                        let blockEl = block.el[0];
                                        let parentBottom = parentEl.offsetTop + parentEl.scrollTop + parentEl.offsetHeight;
                                        let blockBottom = blockEl.offsetTop + blockEl.offsetHeight;

                                        if (blockBottom > parentBottom) {
                                            countTillStop--;
                                        }
                                    });
                                }

                                to = i;
                            }

                            function removeTopChildren() {
                                if (elements.length < BUFFER_COUNT) {
                                    return;
                                }

                                let hasInvisibleChildren = true;

                                while (hasInvisibleChildren) {
                                    let el = elements[BUFFER_COUNT].el[0];
                                    let elementBottom = el.offsetTop + el.offsetHeight;
                                    let scrollTop = parent[0].offsetTop + parent[0].scrollTop;

                                    if (elementBottom < scrollTop) {
                                        removeElement(0);
                                        from++
                                    } else {
                                        hasInvisibleChildren = false;
                                    }
                                }
                            }

                            function removeElement(index) {
                                let el = elements.splice(index, 1)[0];
                                el.el.remove();
                                el.scope.$destroy();
                            }
                        }
                    }
                }
            }]);
})();
