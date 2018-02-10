import { Descriptor } from "./descriptor";
import { IDOMManager } from "./dom-manager";

export type Item = {
    Element: JQLite,
    Scope: ng.IScope
}

export interface IElementsManager {
    UpdateCollection(newCollection: any[]): void;
    AddTop(): void;
    AddBottom(): void;
    RemoveTop(): void;
    RemoveBottom(): void;
}

export class ElementsManager implements IElementsManager {
    private collection: any[];
    private items: Item[];
    private displayFrom: number;
    private displayTo: number;

    constructor(private descriptor: Descriptor, private domManager: IDOMManager, private linker: ng.ITranscludeFunction) {
        this.items = [];
        this.displayFrom = 0;
        this.displayTo = 0;

        // this way the memory can only leak until the scroller lives
        this.descriptor.Scope.$on('$destroy', () => {
            this.items = [];
        });
    }

    public UpdateCollection = (newCollection: any[]) => {
        if (this.collection == undefined) {
            this.collection = newCollection;
            this.AddBottom();
        } else {
            this.collection = newCollection;
            this.updateScopes();
        }
    }

    public AddTop = () => {
        let countTillStop = this.descriptor.Settings.BufferSize;

        for (var i = this.displayFrom - 1; i >= 0 && countTillStop > 0; i--) {
            const newElement = this.transcludeElement(i);
            this.domManager.PrependElementToContainer(newElement.Element);
            this.items.unshift(newElement);

            countTillStop--;
        }

        this.displayFrom = i + 1;
    };

    public AddBottom = () => {
        // add this many children below visible area
        let overflowCounter = this.descriptor.Settings.BufferSize;

        for (var i = this.displayTo; i < this.collection.length && overflowCounter > 0; i++) {
            const item = this.transcludeElement(i);
            this.domManager.AppendElementToContainer(item.Element);
            this.items.push(item);

            const blockEl = item.Element;
            const parentBottom = this.domManager.GetScrollBottomPosition();
            const blockBottom = this.domManager.GetElementBottomPosition(blockEl);

            if (blockBottom > parentBottom) {
                overflowCounter--;
            }
        }

        this.displayTo = i;
    };

    public RemoveTop = () => {
        if (this.items.length < this.descriptor.Settings.BufferSize) {
            return;
        }

        let hasInvisibleChildren = true;
        while (hasInvisibleChildren) {
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
    };

    public RemoveBottom = () => {
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
    };

    private updateScopes = () => {
        for (var i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            item.Scope[this.descriptor.IndexString] = this.collection[this.displayFrom + i];
        }

        // TODO: clean dom if removal took place 
    };

    private transcludeElement = (index: number): Item => {
        const item = {} as Item;

        const childScope = this.descriptor.Scope.$new();
        childScope[this.descriptor.IndexString] = this.collection[index];

        this.linker(childScope, (clone: JQLite) => {
            item.Element = clone;
            item.Scope = childScope;
        });

        return item;
    }

    private removeElement = (index: number) => {
        const item = this.items.splice(index, 1)[0];
        this.domManager.Remove(item.Element);
        item.Scope.$destroy();
    }
}
