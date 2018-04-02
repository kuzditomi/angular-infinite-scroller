import { Descriptor } from './descriptor';
import { ScrollerFactory } from './scroller-factory';
import { DOMManager } from './dom-manager';
import { ScrollDetector } from './scroll-detector';

declare var angular;

export const scrollerModule = angular.module('angular-infinite-scroller', []);

scrollerModule.directive('infiniteScroller', () => {
    return {
        priority: 1000,
        restrict: 'A',
        transclude: 'element',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attr: ng.IAttributes, _ctrl, linker: ng.ITranscludeFunction) => {
            const descriptor = Descriptor.createFrom(scope, attr);
            const domManager = new DOMManager(element);
            const scrollDetector = new ScrollDetector(element);

            ScrollerFactory.createFrom(descriptor, domManager, linker, scrollDetector);
        },
    };
});
