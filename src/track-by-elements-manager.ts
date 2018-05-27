import { ElementsManager, Item } from './elements-manager';
import { Descriptor } from './descriptor';
import { IDOMManager } from './dom-manager';

interface TrackableItem extends Item {
    TrackByValue: string;
}

export class TrackByElementsManager extends ElementsManager {
    private trackByParser: ng.ICompiledExpression;
    private trackedItems: { [key: string]: TrackableItem };
    private tempScope: ng.IScope;

    protected items: TrackableItem[];

    public constructor(descriptor: Descriptor, domManager: IDOMManager, linker: ng.ITranscludeFunction, parser: ng.IParseService) {
        super(descriptor, domManager, linker);

        this.trackByParser = parser(descriptor.TrackByExpression);
        this.trackedItems = {};
        this.tempScope = this.descriptor.Scope.$new();
    }

    public UpdateCollection(newCollection: any[]) {
        const originalLength = this.collection.length;
        this.collection = newCollection;
        this.fixDisplayWindow();
        this.fillBottom();

        if (originalLength > 0) {
            this.updateItemsList();
            this.updateElements();
        }
    }

    protected transcludeElement(index: number): TrackableItem {
        const item = super.transcludeElement(index) as TrackableItem;

        item.TrackByValue = this.trackByParser(item.Scope);
        this.trackedItems[item.TrackByValue] = item;

        return item;
    }

    protected removeElement(index: number) {
        const item = this.items[index];
        delete (this.trackedItems[item.TrackByValue]);

        super.removeElement(index);
    }

    protected onDestroy() {
        super.onDestroy();
        this.tempScope.$destroy();
        this.trackedItems = null;
    }

    private updateItemsList() {
        const newItemList: TrackableItem[] = [];
        const newItemsHash: { [key: string]: TrackableItem } = {};

        // populate new items
        for (let i = this.displayFrom; i < this.displayTo; i++) {
            const trackByKey = this.getTrackByOfCollectionItem(i);
            if (this.trackedItems[trackByKey]) {
                newItemList.push(this.trackedItems[i]);
                newItemsHash[trackByKey] = this.trackedItems[i];
            } else {
                const newItem = this.transcludeElement(i) as TrackableItem;
                newItemList.push(newItem);
                newItemsHash[trackByKey] = newItem;
            }
        }

        // clean up
        for (let key of Object.keys(this.trackedItems)) {
            if (!newItemsHash[key]) {
                this.trackedItems[key].Scope.$destroy();
            }
        }

        this.items = newItemList;
        this.trackedItems = newItemsHash;
    }

    private updateElements() {
        // TODO: manage elements instead of pure innerHTML
        const elements = this.items.map(i => i.Element);
        this.domManager.UpdateElementsWith(elements);
    }

    private getTrackByOfCollectionItem(index: number): string {
        this.tempScope[this.descriptor.IndexExpression] = this.collection[index];
        return this.trackByParser(this.tempScope);
    }
}
