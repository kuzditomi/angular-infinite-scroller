import { Item, IElementsManager } from './elements-manager';
import { Descriptor } from './descriptor';
import { DOMManager } from './dom-manager';

type Revealer = {
    Element: ng.IAugmentedJQuery;
    Items: Item[];
};

export class RevealerElementsManager implements IElementsManager {
    private collection: any[];
    private displayFrom: number;
    private displayTo: number;

    private revealers: Revealer[];
    private revealerSize: number;

    private REVEALER_SIZE_TO_CONTAINER = 0.75;

    constructor(private descriptor: Descriptor, private domManager: DOMManager, private linker: ng.ITranscludeFunction) {
        this.revealers = [];
        this.displayFrom = 0;
        this.displayTo = 0;

        // this way the memory can only leak until the scroller lives
        this.descriptor.Scope.$on('$destroy', () => {
            this.revealers = [];
        });
    }

    public UpdateCollection = (newCollection: any[]) => {
        if (this.collection === undefined) {
            this.collection = newCollection;
            this.InitializeRevealer();
            this.AddBottom();
        } else {
            this.collection = newCollection;
            this.updateScopes();
        }
    }

    public InitializeRevealer = () => {
        const newRevealer = this.createRevealer();
        this.revealers.push(newRevealer);
        this.domManager.AppendElement(newRevealer.Element);

        let i = 0;
        let isRevealerFilled = false;

        while (!isRevealerFilled) {
            if (i >= this.collection.length)
                break;

            const item = this.transcludeElement(i);
            this.domManager.AppendElementToContainer(item.Element, newRevealer.Element);
            newRevealer.Items.push(item);

            const fillUntil = this.domManager.GetRelativePositionOf(this.REVEALER_SIZE_TO_CONTAINER);
            const blockBottom = this.domManager.GetElementBottomPosition(item.Element);

            if (blockBottom > fillUntil) {
                /*
                    i had no better idea how to detect bottom line for the case of using floats,
                    so when the first element passes the line, let's just correct it by removing that one
                 */
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
    }

    public AddTop = () => {
        if (this.displayFrom === 0) {
            return;
        }

        const newRevealer = this.createRevealer();
        this.revealers.unshift(newRevealer);
        this.domManager.PrependElement(newRevealer.Element);

        let i = 0;
        for (i = 0; i < this.revealerSize; i++) {
            const index = this.displayFrom + 1 - i;
            if (index < 0) {
                break;
            }

            const newElement = this.transcludeElement(this.displayFrom - 1 - i);
            this.domManager.PrependElementToContainer(newElement.Element, newRevealer.Element);
            newRevealer.Items.unshift(newElement);
        }

        this.displayFrom -= i;
    }

    public AddBottom = () => {
        if (this.displayTo >= this.collection.length) {
            return;
        }

        const newRevealer = this.createRevealer();
        this.revealers.push(newRevealer);
        this.domManager.AppendElement(newRevealer.Element);

        let i = 0;
        for (i = 0; i < this.revealerSize && this.displayTo + i < this.collection.length; i++) {
            const item = this.transcludeElement(this.displayTo + i);
            newRevealer.Element.append(item.Element);
            newRevealer.Items.push(item);
        }

        this.displayTo += i;
    }

    public RemoveTop = () => {
        if (this.revealers.length <= 3) {
            return;
        }

        const revealer = this.revealers.shift();
        this.displayFrom += revealer.Items.length;

        while (revealer.Items.length > 0) {
            const item = revealer.Items.pop();
            item.Element.remove(); // TODO: might be unnecessary, since we remove the revealer too
            item.Scope.$destroy();
        }

        revealer.Element.remove();
    }

    public RemoveBottom = () => {
        if (this.revealers.length <= 3) {
            return;
        }

        const revealer = this.revealers.pop();
        this.displayTo -= revealer.Items.length;

        while (revealer.Items.length > 0) {
            const item = revealer.Items.pop();
            this.domManager.Remove(item.Element);
            item.Scope.$destroy();
        }

        this.domManager.Remove(revealer.Element);
        this.domManager.FixScroll(0.5);
    }

    private updateScopes = () => {
        let index = this.displayFrom;

        for (let revealer of this.revealers) {
            for (let i = 0; i < this.revealerSize; i++) {
                const hasItemToBind = index < this.collection.length;
                const hasElementToBind = revealer.Items.length > i;

                if (hasItemToBind && hasElementToBind) {
                    // nothing special, bind scope
                    revealer.Items[i].Scope[this.descriptor.IndexExpression] = this.collection[index];
                } else if (hasItemToBind) {
                    // create element and bind
                    const item = this.transcludeElement(index);
                    this.domManager.AppendElementToContainer(item.Element, revealer.Element);
                    revealer.Items.push(item);
                } else if (hasElementToBind) {
                    // remove element
                    const item = revealer.Items.pop();
                    item.Scope.$destroy();
                    this.domManager.Remove(item.Element);
                } else {
                    continue;
                }

                index++;
            }

            if (revealer.Items.length === 0) {
                // remove revealer if it's not necessary anymore
                this.domManager.Remove(revealer.Element);
            }
        }

        const currentDisplayTo = this.displayTo;
        this.displayTo = index;

        if (index < currentDisplayTo && this.collection.length > index) {
            // create new revealers if necessary
            this.AddBottom();
        } else {
            // remove unnecessary revealers
            this.revealers = this.revealers.filter(r => r.Items.length > 0);
        }
    }

    private transcludeElement = (index: number): Item => {
        const item = {} as Item;

        const childScope = this.descriptor.Scope.$new();
        childScope[this.descriptor.IndexExpression] = this.collection[index];

        this.linker(childScope, (clone: ng.IAugmentedJQuery) => {
            item.Element = clone;
            item.Scope = childScope;
        });

        return item;
    }

    private createRevealer = (): Revealer => {
        const revealerElement = this.domManager.CreateRevealerElement();

        const revealer: Revealer = {
            Element: revealerElement,
            Items: [],
        };

        return revealer;
    }
}
