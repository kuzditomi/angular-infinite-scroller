import { Descriptor } from './descriptor';
import { IDOMManager } from './dom-manager';

export interface Item {
    Element: ng.IAugmentedJQuery;
    Scope: ng.IScope;
}

export interface IElementsManager {
    UpdateCollection(newCollection: any[]): void;
    AddTop(): void;
    AddBottom(): void;
    RemoveTop(): void;
    RemoveBottom(): void;
}

export class ElementsManager implements IElementsManager {
    protected collection: any[];
    protected items: Item[];
    protected displayFrom: number;
    protected displayTo: number;

    public constructor(protected descriptor: Descriptor, protected domManager: IDOMManager, protected linker: ng.ITranscludeFunction) {
        this.collection = [];
        this.items = [];
        this.displayFrom = 0;
        this.displayTo = 0;

        this.descriptor.Scope.$on('$destroy', () => this.onDestroy);
    }

    public UpdateCollection(newCollection: any[]) {
        this.collection = newCollection;
        this.fixDisplayWindow();
        this.fillBottom();
        this.overwriteScopes();
        this.cleanUpBottom();
    }

    public AddTop() {
        let countTillStop = this.descriptor.Settings.BufferSize;

        let i = 0;
        for (i = this.displayFrom - 1; i >= 0 && countTillStop > 0; i--) {
            const newElement = this.transcludeElement(i);
            this.domManager.PrependElement(newElement.Element);
            this.items.unshift(newElement);

            countTillStop--;
        }

        this.displayFrom = i + 1;
    }

    public AddBottom() {
        const parentBottom = this.domManager.GetScrollBottomPosition();

        // add this many children below visible area
        let overflowCounter = this.descriptor.Settings.BufferSize;

        let i = 0;
        for (i = this.displayTo; i < this.collection.length && overflowCounter > 0; i++) {
            const item = this.transcludeElement(i);
            this.domManager.AppendElement(item.Element);
            this.items.push(item);

            const blockEl = item.Element;
            const blockBottom = this.domManager.GetElementBottomPosition(blockEl);

            if (blockBottom > parentBottom) {
                overflowCounter--;
            }
        }

        this.displayTo = i;
    }

    public RemoveTop() {
        let hasInvisibleChildren = true;
        while (hasInvisibleChildren) {
            if (this.items.length <= this.descriptor.Settings.BufferSize) {
                break;
            }

            const el = this.items[this.descriptor.Settings.BufferSize].Element;
            const elementBottom = this.domManager.GetElementBottomPosition(el);
            const scrollTop = this.domManager.GetScrollTopPosition();

            if (elementBottom < scrollTop) {
                this.removeElement(0);
                this.displayFrom++;
            } else {
                hasInvisibleChildren = false;
            }
        }
    }

    public RemoveBottom() {
        if (this.items.length < this.descriptor.Settings.BufferSize) {
            return;
        }

        let hasInvisibleChildren = true;
        while (hasInvisibleChildren) {
            const el = this.items[this.items.length - this.descriptor.Settings.BufferSize].Element;
            const elementTop = this.domManager.GetElementTopPosition(el);
            const bottom = this.domManager.GetScrollBottomPosition();

            if (elementTop > bottom) {
                this.removeElement(this.items.length - 1);
                this.displayTo--;
            } else {
                hasInvisibleChildren = false;
            }
        }
    }

    // tries to keep the current windows size, but adjust window based on the new collection size
    protected fixDisplayWindow = () => {
        const endDiff = this.displayTo - this.collection.length;
        if (endDiff > 0) {
            this.displayTo -= endDiff;
            const fixedFrom = this.displayFrom - endDiff;
            this.displayFrom = fixedFrom > 0 ? fixedFrom : 0;
        }
    }

    protected onDestroy() {
        this.items = [];
    }

    protected fillBottom() {
        const parentBottom = this.domManager.GetScrollBottomPosition();

        // don't add more if elements are already out of sight
        if (this.items.length > 0) {
            const lastItem = this.items[this.items.length - 1];
            const lastItemBottom = this.domManager.GetElementBottomPosition(lastItem.Element);

            if (lastItemBottom > parentBottom) {
                return;
            }
        }

        this.AddBottom();
    }

    protected cleanUpBottom = () => {
        let i = this.collection.length;
        while (i < this.items.length) {
            this.removeElement(i);
        }
    }

    protected transcludeElement(index: number): Item {
        const item = {} as Item;

        const childScope = this.descriptor.Scope.$new();
        childScope[this.descriptor.IndexExpression] = this.collection[index];

        this.linker(childScope, (clone: ng.IAugmentedJQuery) => {
            item.Element = clone;
            item.Scope = childScope;
        });

        return item;
    }

    protected removeElement(index: number) {
        const item = this.items.splice(index, 1)[0];
        this.domManager.Remove(item.Element);
        item.Scope.$destroy();
    }

    private overwriteScopes = () => {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            item.Scope[this.descriptor.IndexExpression] = this.collection[this.displayFrom + i];
        }
    }
}
