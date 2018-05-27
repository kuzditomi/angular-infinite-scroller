import { Descriptor } from './descriptor';
import { DOMManager } from './dom-manager';
import { ScrollDetector } from './scroll-detector';
import { Scroller } from './scroller';
import { ElementsManagerFactory } from './elements-manager-factory';

declare var angular;

export const scrollerModule = angular.module('angular-infinite-scroller', []);

scrollerModule.directive('infiniteScroller', ['$parse', (parser: ng.IParseService) => {
    return {
        priority: 1000,
        restrict: 'A',
        transclude: 'element',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attr: ng.IAttributes, _ctrl, linker: ng.ITranscludeFunction) => {
            const descriptor = Descriptor.createFrom(scope, attr);
            const domManager = new DOMManager(element);
            const scrollDetector = new ScrollDetector(element);
            const elementsManager = ElementsManagerFactory.createFrom(descriptor, domManager, linker, parser);

            const scroller = new Scroller(descriptor, scrollDetector, elementsManager);

            scroller.Subscribe();
        },
    };
}]);
