import { Descriptor } from './descriptor';
import { ScrollerFactory } from "./scroller-factory";

declare var angular;

const scrollerModule = angular.module('angular-infinite-scroller', []);

scrollerModule.directive('infiniteScroller', () => {
    return {
        priority: 1000,
        restrict: 'A',
        transclude: 'element',
        link: (scope: ng.IScope, element: JQLite, attr: ng.IAttributes, ctrl, linker: ng.ITranscludeFunction) => {
            const descriptor = Descriptor.createFrom(scope, element, attr);
            const scroller = ScrollerFactory.createFrom(descriptor, linker);
        }
    }
});
