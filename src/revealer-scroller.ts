import { Descriptor } from "./descriptor";
import { ScrollDetector } from "./scroll-detector";
import { ElementsManager } from "./elements-manager";
import { Scroller } from "./scroller";

export class RevealerScroller extends Scroller {
    public constructor(descriptor: Descriptor, detector: ScrollDetector, elementsManager: ElementsManager) {
        super(descriptor, detector, elementsManager);
    }
}
