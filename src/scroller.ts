import { Descriptor } from "./descriptor";
import { ScrollDetector } from "./scroll-detector";
import { ElementsManager } from "./elements-manager";

export interface IScroller {

}

export class Scroller implements IScroller {
    private get scope(): ng.IScope {
        return this.descriptor.Scope;
    }

    public constructor(private descriptor: Descriptor, private scrollDetector: ScrollDetector, private elementsManager: ElementsManager) {
        this.scrollDetector.OnScrollDown = this.onScrollDown;
        this.scrollDetector.OnScrollUp = this.onScrollUp;

        this.scrollDetector.SubscribeTo(descriptor.Element);
        
        this.scope.$watchCollection(descriptor.CollectionString, this.onCollectionUpdated);
    }

    private onCollectionUpdated = (newCollection: any[]): void => {
        this.elementsManager.UpdateCollection(newCollection);
    };

    private onScrollDown = (): void => {
        this.scope.$apply(() => {
            this.elementsManager.AddBottom();
            this.elementsManager.RemoveTop();
        });
    };

    private onScrollUp = (): void => {
        this.scope.$apply(() => {
            this.elementsManager.AddTop();
            this.elementsManager.RemoveBottom();
        });
    };
}
