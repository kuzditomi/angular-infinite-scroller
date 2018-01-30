/// <reference path="descriptor.ts" />
/// <reference path="scroller.ts" />
/// <reference path="revealer-scroller.ts" />

class ScrollerFactory {
    static createFrom(descriptor: Descriptor, linker: ng.ITranscludeFunction): IScroller {
        const detector = new ScrollDetector();
        const elementsManager = new ElementsManager(descriptor, linker);

        if (descriptor.UseRevealer) {
            return new RevealerScroller(descriptor, detector, elementsManager);
        }

        return new Scroller(descriptor, detector, elementsManager);
    }
}
