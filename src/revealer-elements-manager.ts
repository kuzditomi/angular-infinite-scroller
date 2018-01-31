/// <reference path="descriptor.ts" />
/// <reference path="elements-manager.ts" />

type Revealer = {
    Element: JQLite;
    Items: Item[];
}

class RevealerElementsManager implements IElementsManager {
    private collection: any[];
    private container: JQLite;
    private containerElement: HTMLElement;
    private displayFrom: number;
    private displayTo: number;

    private revealers: Revealer[];
    private revealerSize: number;

    private BUFFER_COUNT = 5;
    private LOAD_COUNT = 10;

    constructor(private descriptor: Descriptor, private linker: ng.ITranscludeFunction) {
        this.revealers = [];
        this.container = descriptor.Element.parent();
        this.containerElement = this.container[0];

        // this way the memory can only leak until the scroller lives
        this.descriptor.Scope.$on('$destroy', () => {
            this.revealers = [];
        });
    }

    public UpdateCollection = (newCollection: any[]) => {
        if (this.collection == undefined) {
            this.collection = newCollection;
            this.InitializeRevealer();
            this.AddBottom();
        } else {
            // TODO: rebind revealers
            // TODO: fill revealers if needed
            // TODO: create new / remove revealers if needed
        }
    }

    public InitializeRevealer = () => {
        const newRevealer = this.createRevealer();
        this.revealers.push(newRevealer);
        this.container.append(newRevealer.Element);

        let i = 0;
        let isRevealerFilled = false;

        while (!isRevealerFilled) {
            const item = this.transcludeElement(i);
            newRevealer.Element.append(item.Element);
            newRevealer.Items.push(item);

            const blockEl = item.Element[0];
            const parentBottom = this.containerElement.offsetTop + this.containerElement.offsetHeight;
            const blockBottom = blockEl.offsetTop + blockEl.offsetHeight;

            if (blockBottom > parentBottom) {
                // oops too much...
                const item = newRevealer.Items.pop();

                item.Scope.$destroy();
                item.Element.remove();

                isRevealerFilled = true;
                break;
            }

            i++;
        }

        this.revealerSize = i;
        this.displayTo = i;
    };

    public AddTop = () => {
        const newRevealer = this.createRevealer();
        this.revealers.push(newRevealer);
        this.container.append(newRevealer.Element);

        let countTillStop = this.LOAD_COUNT;

        for (var i = 0; i < this.revealerSize; i++) {
            const index = this.displayFrom - 1 - i;
            const newElement = this.transcludeElement(i);
            newRevealer.Element.prepend(newElement.Element);
            newRevealer.Items.unshift(newElement);
        }

        this.displayFrom = i + 1;
    };

    public AddBottom = () => {
        const newRevealer = this.createRevealer();
        this.revealers.push(newRevealer);
        this.container.append(newRevealer.Element);

        for (var i = 0; i < this.revealerSize && this.displayTo + i < this.collection.length; i++) {
            const item = this.transcludeElement(this.displayTo + i);
            newRevealer.Element.append(item.Element);
            newRevealer.Items.push(item);
        }

        this.displayTo += i;
    };

    public RemoveTop = () => {
    };

    public RemoveBottom = () => {
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

    private createRevealer = (): Revealer => {
        const revealerElement = angular.element('<div class="revealer"></div>');

        const revealer: Revealer = {
            Element: revealerElement,
            Items: []
        };

        return revealer;
    };
}
