import { Descriptor } from './descriptor';
import { ScrollDetector } from './scroll-detector';
import { ElementsManager } from './elements-manager';
import { Scroller } from './scroller';
import { RevealerElementsManager } from './revealer-elements-manager';
import { DOMManager } from './dom-manager';

export class ScrollerFactory {
    static createFrom(descriptor: Descriptor, domManager: DOMManager, linker: ng.ITranscludeFunction, scrollDetector: ScrollDetector): Scroller {
        if (descriptor.UseRevealer) {
            const elementsManager = new RevealerElementsManager(descriptor, domManager, linker);
            return new Scroller(descriptor, scrollDetector, elementsManager);
        } else {
            const elementsManager = new ElementsManager(descriptor, domManager, linker);
            return new Scroller(descriptor, scrollDetector, elementsManager);
        }
    }
}
