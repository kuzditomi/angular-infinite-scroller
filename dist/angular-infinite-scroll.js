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
                _this.collection = newCollection;
                _this.updateScopes();
            }
        };
        this.AddTop = function () {
            var countTillStop = _this.LOAD_COUNT;
            for (var i = _this.displayFrom - 1; i >= 0 && countTillStop > 0; i--) {
                var childScope = _this.descriptor.Scope.$new();
                childScope[_this.descriptor.IndexString] = _this.collection[i];
                var newElement = _this.transcludeElement(childScope, i);
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
                var childScope = _this.descriptor.Scope.$new();
                childScope[_this.descriptor.IndexString] = _this.collection[i];
                var item = _this.transcludeElement(childScope, i);
                _this.container.append(item.Element);
                _this.items.push(item);
                var blockEl = item.Element[0];
                var parentBottom = _this.containerElement.offsetTop + _this.containerElement.scrollTop + _this.containerElement.offsetHeight;
                var blockBottom = _this.containerElement.offsetTop + blockEl.offsetTop + blockEl.offsetHeight;
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
        this.transcludeElement = function (childScope, index) {
            var item = {};
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
                    if (parentEl.scrollTop < (topElement.scrollHeight * _this.BUFFER_COUNT)) {
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
/// <reference path="scroller.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RevealerScroller = /** @class */ (function (_super) {
    __extends(RevealerScroller, _super);
    function RevealerScroller(descriptor, detector, elementsManager) {
        return _super.call(this, descriptor, detector, elementsManager) || this;
    }
    return RevealerScroller;
}(Scroller));
/// <reference path="descriptor.ts" />
/// <reference path="scroller.ts" />
/// <reference path="revealer-scroller.ts" />
var ScrollerFactory = /** @class */ (function () {
    function ScrollerFactory() {
    }
    ScrollerFactory.createFrom = function (descriptor, linker) {
        var detector = new ScrollDetector();
        var elementsManager = new ElementsManager(descriptor, linker);
        if (descriptor.UseRevealer) {
            return new RevealerScroller(descriptor, detector, elementsManager);
        }
        return new Scroller(descriptor, detector, elementsManager);
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
//# sourceMappingURL=angular-infinite-scroll.js.map