/// <reference path="descriptor.ts" />
/// <reference path="scroll-detector.ts" />
/// <reference path="elements-manager.ts" />

interface IScroller {
    onScrollDown(): void;
    onScrollUp(): void;
    onCollectionUpdated(newCollection: any[]): void;
}

class Scroller implements IScroller {
    private get scope(): ng.IScope {
        return this.descriptor.Scope;
    }

    public constructor(private descriptor: Descriptor, private scrollDetector: ScrollDetector, private elementsManager: IElementsManager) {
        this.scrollDetector.OnScrollDown = this.onScrollDown;
        this.scrollDetector.OnScrollUp = this.onScrollUp;

        this.scrollDetector.SubscribeTo(descriptor.Element);

        this.scope.$watchCollection(descriptor.CollectionString, this.onCollectionUpdated);
    }

    onCollectionUpdated = (newCollection: any[]): void => {
        this.elementsManager.UpdateCollection(newCollection);
    };

    onScrollDown = (): void => {
        this.scope.$apply(() => {
            this.elementsManager.AddBottom();
            this.elementsManager.RemoveTop();
        });
    };

    onScrollUp = (): void => {
        this.scope.$apply(() => {
            this.elementsManager.AddTop();
            this.elementsManager.RemoveBottom();
        });
    };
}
