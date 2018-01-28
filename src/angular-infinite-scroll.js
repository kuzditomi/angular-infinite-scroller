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
                collection,
                useRevealer = attr['useRevealer'] != undefined;

            scope.$watchCollection(collectionString, function (newCollection) {
                collection = newCollection;

                // first population
                if (elements.length == 0) {
                    addChildrenBottom(LOAD_COUNT);
                    return;
                }

                for (var i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    element.scope[indexString] = collection[from + i];
                }
            });

            parent.bind('scroll', function (evt) {
                scope.$apply(function () {
                    const el = parent[0];

                    if (lastScrollTop < el.scrollTop) {
                        // scrolling down    
                        const current = el.scrollTop + el.offsetHeight;
                        const bottom = el.scrollHeight;

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
                const parentElement = parent;

                for (var i = from - 1; i >= 0 && countTillStop > 0; i--) {
                    const childScope = scope.$new();
                    childScope[indexString] = collection[i];

                    const newElement = transcludeElement(childScope, i);
                    parentElement.prepend(newElement.el);
                    elements.unshift(newElement);

                    countTillStop--;
                }

                from = i + 1;
            }

            function addChildrenBottom() {
                const parentElement = parent;

                // add this many children below visible area
                let overflowCounter = elements.length > 0 ? BUFFER_COUNT : LOAD_COUNT;

                for (var i = to; i < collection.length && overflowCounter > 0; i++) {
                    const childScope = scope.$new();
                    childScope[indexString] = collection[i];

                    const newElement = transcludeElement(childScope, i);
                    parentElement.append(newElement.el);
                    elements.push(newElement);

                    const parentEl = parent[0];
                    const blockEl = newElement.el[0];
                    const parentBottom = parentEl.offsetTop + parentEl.scrollTop + parentEl.offsetHeight;
                    const blockBottom = parentEl.offsetTop + blockEl.offsetTop + blockEl.offsetHeight;

                    if (blockBottom > parentBottom) {
                        overflowCounter--;
                    }
                }

                to = i;
            }

            function transcludeElement(childScope, index) {
                const block = {};

                linker(childScope, function (clone) {
                    block.el = clone;
                    block.scope = childScope;
                });

                return block;
            }

            function removeChildrenTop() {
                if (elements.length < BUFFER_COUNT) {
                    return;
                }

                let hasInvisibleChildren = true;
                while (hasInvisibleChildren) {
                    const el = elements[BUFFER_COUNT].el[0];
                    const elementBottom = el.offsetTop + el.offsetHeight;
                    const scrollTop = parent[0].offsetTop + parent[0].scrollTop;

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
                    const el = elements[elements.length - BUFFER_COUNT].el[0];
                    const elementTop = el.offsetTop;
                    const bottom = parent[0].offsetHeight + parent[0].scrollTop + parent[0].offsetHeight;

                    if (elementTop > bottom) {
                        removeElement(elements.length - 1);
                        to--;
                    } else {
                        hasInvisibleChildren = false;
                    }
                }
            }

            function removeElement(index) {
                const el = elements.splice(index, 1)[0];
                el.el.remove();
                el.scope.$destroy();
            }
        }
    }
});

if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = scrollerModule;
}
