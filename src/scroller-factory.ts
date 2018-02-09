import { Descriptor } from "./descriptor";
import { ScrollDetector } from "./scroll-detector";
import { ElementsManager } from "./elements-manager";
import { Scroller, IScroller } from "./scroller";
import { RevealerElementsManager } from "./revealer-elements-manager";
import { DOMManager } from "./dom-manager";

export class ScrollerFactory {
    static createFrom(descriptor: Descriptor, linker: ng.ITranscludeFunction): IScroller {
        const detector = new ScrollDetector();
        const domManager = new DOMManager(descriptor.Element.parent());

        if (descriptor.UseRevealer) {
            const elementsManager = new RevealerElementsManager(descriptor, linker);
            return new Scroller(descriptor, detector, elementsManager);
        } else {
            const elementsManager = new ElementsManager(descriptor, domManager, linker);
            return new Scroller(descriptor, detector, elementsManager);
        }
    }
}
