/// <reference path="descriptor.ts" />
/// <reference path="scroller.ts" />

class ScrollerFactory {
    static createFrom(descriptor: Descriptor, linker: ng.ITranscludeFunction): IScroller {
        const detector = new ScrollDetector();

        if (descriptor.UseRevealer) {
            const elementsManager = new RevealerElementsManager(descriptor, linker);
            return new Scroller(descriptor, detector, elementsManager);
        } else {
            const elementsManager = new ElementsManager(descriptor, linker);
            return new Scroller(descriptor, detector, elementsManager);
        }
    }
}
