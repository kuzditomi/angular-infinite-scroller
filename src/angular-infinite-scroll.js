// help from: http://liamkaufman.com/blog/2013/05/13/understanding-angularjs-directives-part1-ng-repeat-and-compile/
const scrollerModule = angular.module('angular-infinite-scroller', []);
const BUFFER_COUNT = 5;
const LOAD_COUNT = 10;

scrollerModule.directive('infiniteScroller', function () {
    return {
        transclude: 'element',
        link: function (scope, element, attr, ctrl, linker) {
            let loop = attr.infiniteScroller,
                match = loop.match(/^\s*(.+)\s+in\s+(.*?)$/),
                indexString = match[1],
                collectionString = match[2],
                parent = element.parent(),
                elements = [],
                from = 0,
                to = 0,
                lastScrollTop = 0,
                collection;

            scope.$watchCollection(collectionString, function (newCollection) {
                collection = newCollection;

                // first population
                if (elements.length == 0) {
                    addChildrenBottom(LOAD_COUNT);
                    return;
                }

                for (var i = 0; i < elements.length; i++) {
                    let element = elements[i];
                    element.scope[indexString] = collection[from + i];
                }
            });

            parent.bind('scroll', function (evt) {
                scope.$apply(function () {
                    let el = parent[0];

                    if (lastScrollTop < el.scrollTop) {
                        // scrolling down    
                        let current = el.scrollTop + el.offsetHeight;
                        let bottom = el.scrollHeight;

                        if (current == bottom) {
                            addChildrenBottom();
                            removeChildrenTop();
                        }
                    } else if (lastScrollTop > el.scrollTop) {
                        // scrolling up
                        if (el.scrollTop < (elements[0].el[0].scrollHeight * BUFFER_COUNT)) {
                            addChildrenTop();
                            removeChildrenBottom();
                        }
                    }
                });

                lastScrollTop = parent[0].scrollTop;
            });

            function cleanChildren() {
                for (i = 0; i < elements.length; i++) {
                    elements[i].el.remove();
                    elements[i].scope.$destroy();
                };
                elements = [];
            }

            function addChildrenTop() {
                let countTillStop = LOAD_COUNT;

                for (var i = from - 1; i >= 0 && countTillStop > 0; i--) {
                    let childScope = scope.$new();
                    childScope[indexString] = collection[i];

                    linker(childScope, function (clone) {
                        parent.prepend(clone);
                        let block = {};
                        block.el = clone;
                        block.scope = childScope;
                        elements.unshift(block);
                    });

                    countTillStop--;
                }

                from = i + 1;
            }

            function addChildrenBottom(addminimum) {
                let countTillStop = addminimum || BUFFER_COUNT;

                for (var i = to; i < collection.length && countTillStop > 0; i++) {
                    let childScope = scope.$new();
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
                        let blockBottom = parentEl.offsetTop + blockEl.offsetTop + blockEl.offsetHeight;

                        if (blockBottom > parentBottom) {
                            countTillStop--;
                        }
                    });
                }

                to = i;
            }

            function removeChildrenTop() {
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
                        from++;
                    } else {
                        hasInvisibleChildren = false;
                    }
                }
            }

            function removeChildrenBottom() {
                if (elements.length < BUFFER_COUNT) {
                    return;
                }

                let hasInvisibleChildren = true;

                while (hasInvisibleChildren) {
                    let el = elements[elements.length - BUFFER_COUNT].el[0];
                    let elementTop = el.offsetTop;
                    let bottom = parent[0].offsetHeight + parent[0].scrollTop + parent[0].offsetHeight;

                    if (elementTop > bottom) {
                        removeElement(elements.length - 1);
                        to--;
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
});

if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = scrollerModule;
}
