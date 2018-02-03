var Descriptor = /** @class */ (function () {
    function Descriptor() {
    }
    Descriptor.createFrom = function (scope, element, attr) {
        var loop = attr.infiniteScroller, match = loop.match(/^\s*(.+)\s+in\s+(.*?)$/), indexString = match[1], collectionString = match[2];
        var descriptor = new Descriptor();
        descriptor.CollectionString = collectionString;
        descriptor.IndexString = indexString;
        descriptor.UseRevealer = attr['useRevealer'] != undefined;
        descriptor.Element = element;
        descriptor.Scope = scope;
        return descriptor;
    };
    return Descriptor;
}());
/// <reference path="descriptor.ts" />
var ElementsManager = /** @class */ (function () {
    function ElementsManager(descriptor, linker) {
        var _this = this;
        this.descriptor = descriptor;
        this.linker = linker;
        this.BUFFER_COUNT = 5;
        this.LOAD_COUNT = 10;
        this.UpdateCollection = function (newCollection) {
            if (_this.collection == undefined) {
                _this.collection = newCollection;
                _this.AddBottom();
            }
            else {
                // there is some memory-leak when removing elements from the collection, but this is low priority for now :(
                _this.collection = newCollection;
                _this.updateScopes();
            }
        };
        this.AddTop = function () {
            var countTillStop = _this.LOAD_COUNT;
            for (var i = _this.displayFrom - 1; i >= 0 && countTillStop > 0; i--) {
                var newElement = _this.transcludeElement(i);
                _this.container.prepend(newElement.Element);
                _this.items.unshift(newElement);
                countTillStop--;
            }
            _this.displayFrom = i + 1;
        };
        this.AddBottom = function () {
            // add this many children below visible area
            var overflowCounter = _this.items.length > 0 ? _this.BUFFER_COUNT : _this.LOAD_COUNT;
            for (var i = _this.displayTo; i < _this.collection.length && overflowCounter > 0; i++) {
                var item = _this.transcludeElement(i);
                _this.container.append(item.Element);
                _this.items.push(item);
                var blockEl = item.Element[0];
                var parentBottom = _this.containerElement.offsetTop + _this.containerElement.scrollTop + _this.containerElement.offsetHeight;
                var blockBottom = blockEl.offsetTop + blockEl.offsetHeight;
                if (blockBottom > parentBottom) {
                    overflowCounter--;
                }
            }
            _this.displayTo = i;
        };
        this.RemoveTop = function () {
            if (_this.items.length < _this.BUFFER_COUNT) {
                return;
            }
            var hasInvisibleChildren = true;
            while (hasInvisibleChildren) {
                var el = _this.items[_this.BUFFER_COUNT].Element[0];
                var elementBottom = el.offsetTop + el.offsetHeight;
                var scrollTop = _this.containerElement.offsetTop + _this.containerElement.scrollTop;
                if (elementBottom < scrollTop) {
                    _this.removeElement(0);
                    _this.displayFrom++;
                }
                else {
                    hasInvisibleChildren = false;
                }
            }
        };
        this.RemoveBottom = function () {
            if (_this.items.length < _this.BUFFER_COUNT) {
                return;
            }
            var hasInvisibleChildren = true;
            while (hasInvisibleChildren) {
                var el = _this.items[_this.items.length - _this.BUFFER_COUNT].Element[0];
                var elementTop = el.offsetTop;
                var bottom = _this.containerElement.offsetHeight + _this.containerElement.scrollTop + _this.containerElement.offsetHeight;
                if (elementTop > bottom) {
                    _this.removeElement(_this.items.length - 1);
                    _this.displayTo--;
                }
                else {
                    hasInvisibleChildren = false;
                }
            }
        };
        this.updateScopes = function () {
            for (var i = 0; i < _this.items.length; i++) {
                var item = _this.items[i];
                item.Scope[_this.descriptor.IndexString] = _this.collection[_this.displayFrom + i];
            }
        };
        this.transcludeElement = function (index) {
            var item = {};
            var childScope = _this.descriptor.Scope.$new();
            childScope[_this.descriptor.IndexString] = _this.collection[index];
            _this.linker(childScope, function (clone) {
                item.Element = clone;
                item.Scope = childScope;
            });
            return item;
        };
        this.removeElement = function (index) {
            var item = _this.items.splice(index, 1)[0];
            item.Element.remove();
            item.Scope.$destroy();
        };
        this.items = [];
        this.displayFrom = 0;
        this.displayTo = 0;
        this.container = descriptor.Element.parent();
        this.containerElement = this.container[0];
        // this way the memory can only leak until the scroller lives
        this.descriptor.Scope.$on('$destroy', function () {
            _this.items = [];
        });
    }
    return ElementsManager;
}());
var ScrollDetector = /** @class */ (function () {
    function ScrollDetector() {
        var _this = this;
        this.lastScrollTop = 0;
        this.BUFFER_COUNT = 5;
        this.SubscribeTo = function (element) {
            var parent = element.parent();
            var parentEl = parent[0];
            parent.bind('scroll', function () {
                if (_this.lastScrollTop < parentEl.scrollTop) {
                    var current = parentEl.scrollTop + parentEl.offsetHeight;
                    var bottom = parentEl.scrollHeight;
                    if (current == bottom) {
                        _this.OnScrollDown && _this.OnScrollDown();
                    }
                }
                else if (_this.lastScrollTop > parentEl.scrollTop) {
                    var topElement = parentEl.children[0];
                    if (topElement && parentEl.scrollTop <= (topElement.scrollHeight * _this.BUFFER_COUNT)) {
                        _this.OnScrollUp && _this.OnScrollUp();
                    }
                }
                _this.lastScrollTop = parent[0].scrollTop;
            });
        };
    }
    return ScrollDetector;
}());
/// <reference path="descriptor.ts" />
/// <reference path="scroll-detector.ts" />
/// <reference path="elements-manager.ts" />
var Scroller = /** @class */ (function () {
    function Scroller(descriptor, scrollDetector, elementsManager) {
        var _this = this;
        this.descriptor = descriptor;
        this.scrollDetector = scrollDetector;
        this.elementsManager = elementsManager;
        this.onCollectionUpdated = function (newCollection) {
            _this.elementsManager.UpdateCollection(newCollection);
        };
        this.onScrollDown = function () {
            _this.scope.$apply(function () {
                _this.elementsManager.AddBottom();
                _this.elementsManager.RemoveTop();
            });
        };
        this.onScrollUp = function () {
            _this.scope.$apply(function () {
                _this.elementsManager.AddTop();
                _this.elementsManager.RemoveBottom();
            });
        };
        this.scrollDetector.OnScrollDown = this.onScrollDown;
        this.scrollDetector.OnScrollUp = this.onScrollUp;
        this.scrollDetector.SubscribeTo(descriptor.Element);
        this.scope.$watchCollection(descriptor.CollectionString, this.onCollectionUpdated);
    }
    Object.defineProperty(Scroller.prototype, "scope", {
        get: function () {
            return this.descriptor.Scope;
        },
        enumerable: true,
        configurable: true
    });
    return Scroller;
}());
/// <reference path="descriptor.ts" />
/// <reference path="scroller.ts" />
var ScrollerFactory = /** @class */ (function () {
    function ScrollerFactory() {
    }
    ScrollerFactory.createFrom = function (descriptor, linker) {
        var detector = new ScrollDetector();
        if (descriptor.UseRevealer) {
            var elementsManager = new RevealerElementsManager(descriptor, linker);
            return new Scroller(descriptor, detector, elementsManager);
        }
        else {
            var elementsManager = new ElementsManager(descriptor, linker);
            return new Scroller(descriptor, detector, elementsManager);
        }
    };
    return ScrollerFactory;
}());
/// <reference path="descriptor.ts" />
/// <reference path="scroller-factory.ts" />
/// <reference path="elements-manager.ts" />
var scrollerModule = angular.module('angular-infinite-scroller', []);
scrollerModule.directive('infiniteScroller', function () {
    return {
        transclude: 'element',
        link: function (scope, element, attr, ctrl, linker) {
            var descriptor = Descriptor.createFrom(scope, element, attr);
            var scroller = ScrollerFactory.createFrom(descriptor, linker);
        }
    };
});
/// <reference path="descriptor.ts" />
/// <reference path="elements-manager.ts" />
var RevealerElementsManager = /** @class */ (function () {
    function RevealerElementsManager(descriptor, linker) {
        var _this = this;
        this.descriptor = descriptor;
        this.linker = linker;
        this.BUFFER_COUNT = 5;
        this.LOAD_COUNT = 10;
        this.REVEALER_SIZE_TO_CONTAINER = 0.75;
        this.UpdateCollection = function (newCollection) {
            if (_this.collection == undefined) {
                _this.collection = newCollection;
                _this.InitializeRevealer();
                _this.AddBottom();
            }
            else {
                // TODO: rebind revealers
                // TODO: fill revealers if needed
                // TODO: create new / remove revealers if needed
            }
        };
        this.InitializeRevealer = function () {
            var newRevealer = _this.createRevealer();
            _this.revealers.push(newRevealer);
            _this.container.append(newRevealer.Element);
            var i = 0;
            var isRevealerFilled = false;
            while (!isRevealerFilled) {
                var item = _this.transcludeElement(i);
                newRevealer.Element.append(item.Element);
                newRevealer.Items.push(item);
                var blockEl = item.Element[0];
                var fillUntil = _this.containerElement.offsetTop + _this.containerElement.offsetHeight * _this.REVEALER_SIZE_TO_CONTAINER;
                var blockBottom = blockEl.offsetTop + blockEl.offsetHeight;
                if (blockBottom > fillUntil) {
                    // oops too much...
                    var item_1 = newRevealer.Items.pop();
                    item_1.Scope.$destroy();
                    item_1.Element.remove();
                    isRevealerFilled = true;
                    break;
                }
                i++;
            }
            _this.revealerSize = i;
            _this.displayTo = i;
        };
        this.AddTop = function () {
            if (_this.displayFrom == 0) {
                return;
            }
            var newRevealer = _this.createRevealer();
            _this.revealers.unshift(newRevealer);
            _this.container.prepend(newRevealer.Element);
            var countTillStop = _this.LOAD_COUNT;
            for (var i = 0; i < _this.revealerSize; i++) {
                var index = _this.displayFrom + 1 - i;
                if (index < 0) {
                    break;
                }
                var newElement = _this.transcludeElement(_this.displayFrom - 1 - i);
                newRevealer.Element.prepend(newElement.Element);
                newRevealer.Items.unshift(newElement);
            }
            _this.displayFrom -= i;
        };
        this.AddBottom = function () {
            if (_this.displayTo == _this.collection.length) {
                return;
            }
            var newRevealer = _this.createRevealer();
            _this.revealers.push(newRevealer);
            _this.container.append(newRevealer.Element);
            for (var i = 0; i < _this.revealerSize && _this.displayTo + i < _this.collection.length; i++) {
                var item = _this.transcludeElement(_this.displayTo + i);
                newRevealer.Element.append(item.Element);
                newRevealer.Items.push(item);
            }
            _this.displayTo += i;
        };
        this.RemoveTop = function () {
            if (_this.revealers.length <= 3) {
                return;
            }
            var revealer = _this.revealers.shift();
            _this.displayFrom += revealer.Items.length;
            while (revealer.Items.length > 0) {
                var item = revealer.Items.pop();
                item.Element.remove(); // TODO: might be unnecessary
                item.Scope.$destroy();
            }
            revealer.Element.remove();
        };
        this.RemoveBottom = function () {
            if (_this.revealers.length <= 3) {
                return;
            }
            var revealer = _this.revealers.pop();
            _this.displayTo -= revealer.Items.length;
            while (revealer.Items.length > 0) {
                var item = revealer.Items.pop();
                item.Element.remove(); // TODO: might be unnecessary
                item.Scope.$destroy();
            }
            revealer.Element.remove();
            _this.containerElement.scrollTo(0, _this.containerElement.offsetHeight / 2);
        };
        this.transcludeElement = function (index) {
            var item = {};
            var childScope = _this.descriptor.Scope.$new();
            childScope[_this.descriptor.IndexString] = _this.collection[index];
            _this.linker(childScope, function (clone) {
                item.Element = clone;
                item.Scope = childScope;
            });
            return item;
        };
        this.createRevealer = function () {
            var revealerElement = angular.element('<div class="revealer"></div>');
            var revealer = {
                Element: revealerElement,
                Items: []
            };
            return revealer;
        };
        this.revealers = [];
        this.container = descriptor.Element.parent();
        this.containerElement = this.container[0];
        this.displayFrom = 0;
        this.displayTo = 0;
        // this way the memory can only leak until the scroller lives
        this.descriptor.Scope.$on('$destroy', function () {
            _this.revealers = [];
        });
    }
    return RevealerElementsManager;
}());
//# sourceMappingURL=angular-infinite-scroll.js.map