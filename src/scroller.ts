import { Descriptor } from "./descriptor";
import { ScrollDetector } from "./scroll-detector";
import { IElementsManager } from "./elements-manager";

export interface IScroller {

}

export class Scroller implements IScroller {
    private get scope(): ng.IScope {
        return this.descriptor.Scope;
    }

    public constructor(private descriptor: Descriptor, private scrollDetector: ScrollDetector, private elementsManager: IElementsManager) {
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
