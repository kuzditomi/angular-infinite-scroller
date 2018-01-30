/// <reference path="descriptor.ts" />
/// <reference path="scroller-factory.ts" />
/// <reference path="elements-manager.ts" />

const scrollerModule = angular.module('angular-infinite-scroller', []);

scrollerModule.directive('infiniteScroller', () => {
    return {
        transclude: 'element',
        link: (scope: ng.IScope, element: JQLite, attr: ng.IAttributes, ctrl, linker: ng.ITranscludeFunction) => {
            const descriptor = Descriptor.createFrom(scope, element, attr);
            const scroller = ScrollerFactory.createFrom(descriptor, linker);
        }
    }
});
