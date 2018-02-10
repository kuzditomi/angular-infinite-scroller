import { Descriptor } from './descriptor';
import { ScrollerFactory } from "./scroller-factory";
import { DOMManager } from './dom-manager';
import { ScrollDetector } from './scroll-detector';

declare var angular;

const scrollerModule = angular.module('angular-infinite-scroller', []);

scrollerModule.directive('infiniteScroller', () => {
    return {
        transclude: 'element',
        link: (scope: ng.IScope, element: JQLite, attr: ng.IAttributes, ctrl, linker: ng.ITranscludeFunction) => {
            const descriptor = Descriptor.createFrom(scope, attr);
            const domManager = new DOMManager(element);
            const scrollDetector = new ScrollDetector(element);
            const scroller = ScrollerFactory.createFrom(descriptor, domManager, linker, scrollDetector);
        }
    }
});
