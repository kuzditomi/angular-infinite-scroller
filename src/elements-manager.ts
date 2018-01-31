/// <reference path="descriptor.ts" />

type Item = {
    Element: JQLite,
    Scope: ng.IScope
}

interface IElementsManager {
    UpdateCollection(newCollection: any[]): void;
    AddTop(): void;
    AddBottom(): void;
    RemoveTop(): void;
    RemoveBottom(): void;
}

class ElementsManager implements IElementsManager {
    private collection: any[];
    private container: JQLite;
    private containerElement: HTMLElement;
    private items: Item[];
    private displayFrom: number;
    private displayTo: number;

    private BUFFER_COUNT = 5;
    private LOAD_COUNT = 10;

    constructor(private descriptor: Descriptor, private linker: ng.ITranscludeFunction) {
        this.items = [];
        this.displayFrom = 0;
        this.displayTo = 0;
        this.container = descriptor.Element.parent();
        this.containerElement = this.container[0];

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
            // there is some memory-leak when removing elements from the collection, but this is low priority for now :(

            this.collection = newCollection;
            this.updateScopes();
        }
    }

    public AddTop = () => {
        let countTillStop = this.LOAD_COUNT;

        for (var i = this.displayFrom - 1; i >= 0 && countTillStop > 0; i--) {
            const newElement = this.transcludeElement(i);
            this.container.prepend(newElement.Element);
            this.items.unshift(newElement);

            countTillStop--;
        }

        this.displayFrom = i + 1;
    };

    public AddBottom = () => {
        // add this many children below visible area
        let overflowCounter = this.items.length > 0 ? this.BUFFER_COUNT : this.LOAD_COUNT;

        for (var i = this.displayTo; i < this.collection.length && overflowCounter > 0; i++) {
            const item = this.transcludeElement(i);
            this.container.append(item.Element);
            this.items.push(item);

            const blockEl = item.Element[0];
            const parentBottom = this.containerElement.offsetTop + this.containerElement.scrollTop + this.containerElement.offsetHeight;
            const blockBottom = blockEl.offsetTop + blockEl.offsetHeight;

            if (blockBottom > parentBottom) {
                overflowCounter--;
            }
        }

        this.displayTo = i;
    };

    public RemoveTop = () => {
        if (this.items.length < this.BUFFER_COUNT) {
            return;
        }

        let hasInvisibleChildren = true;
        while (hasInvisibleChildren) {
            const el = this.items[this.BUFFER_COUNT].Element[0];
            const elementBottom = el.offsetTop + el.offsetHeight;
            const scrollTop = this.containerElement.offsetTop + this.containerElement.scrollTop;

            if (elementBottom < scrollTop) {
                this.removeElement(0);
                this.displayFrom++;
            } else {
                hasInvisibleChildren = false;
            }
        }
    };

    public RemoveBottom = () => {
        if (this.items.length < this.BUFFER_COUNT) {
            return;
        }

        let hasInvisibleChildren = true;
        while (hasInvisibleChildren) {
            const el = this.items[this.items.length - this.BUFFER_COUNT].Element[0];
            const elementTop = el.offsetTop;
            const bottom = this.containerElement.offsetHeight + this.containerElement.scrollTop + this.containerElement.offsetHeight;

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
        item.Element.remove();
        item.Scope.$destroy();
    }
}
