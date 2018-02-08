import { Descriptor } from "./descriptor";
import { ScrollDetector } from "./scroll-detector";
import { ElementsManager } from "./elements-manager";
import { RevealerScroller } from "./revealer-scroller";
import { Scroller, IScroller } from "./scroller";

export class ScrollerFactory {
    static createFrom(descriptor: Descriptor, linker: ng.ITranscludeFunction): IScroller {
        const detector = new ScrollDetector();
        const elementsManager = new ElementsManager(descriptor, linker);

        if (descriptor.UseRevealer) {
            return new RevealerScroller(descriptor, detector, elementsManager);
        }

        return new Scroller(descriptor, detector, elementsManager);
    }
}
