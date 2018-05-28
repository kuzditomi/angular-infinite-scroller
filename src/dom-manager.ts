export interface IDOMManager {
    AppendElement(element: ng.IAugmentedJQuery): void;
    PrependElement(element: ng.IAugmentedJQuery): void;
    AppendElementToContainer(element: ng.IAugmentedJQuery, containerToAppend: ng.IAugmentedJQuery): void;
    PrependElementToContainer(element: ng.IAugmentedJQuery, containerToPrepend: ng.IAugmentedJQuery): void;

    GetScrollBottomPosition(): number;
    GetScrollTopPosition(): number;
    GetRelativePositionOf(elementRatio: number): number;

    GetElementBottomPosition(element: ng.IAugmentedJQuery): number;
    GetElementTopPosition(element: ng.IAugmentedJQuery): number;

    FixScroll(relativePosition: number);
    Remove(element: ng.IAugmentedJQuery): void;

    UpdateElementsWith(elements: ng.IAugmentedJQuery[]): void;
}

export class DOMManager implements IDOMManager {
    private container: ng.IAugmentedJQuery;
    private containerElement: HTMLElement;

    constructor(element: ng.IAugmentedJQuery) {
        this.container = element.parent();
        this.containerElement = this.container[0];
    }

    GetElementTopPosition = (element: ng.IAugmentedJQuery): number => element[0].offsetTop;

    Remove = (element: ng.IAugmentedJQuery) => element.remove();

    GetScrollTopPosition = () => this.containerElement.offsetTop + this.containerElement.scrollTop;

    GetElementBottomPosition = (element: ng.IAugmentedJQuery) => element[0].offsetTop + element[0].offsetHeight;

    GetScrollBottomPosition = () => this.containerElement.offsetTop + this.containerElement.scrollTop + this.containerElement.offsetHeight;

    GetRelativePositionOf = (elementRatio: number) => this.containerElement.offsetTop + this.containerElement.offsetHeight * elementRatio;

    AppendElement = (element: ng.IAugmentedJQuery) => this.container.append(element);

    PrependElement = (element: ng.IAugmentedJQuery) => this.container.prepend(element);

    AppendElementToContainer = (element: ng.IAugmentedJQuery, containerToAppend: ng.IAugmentedJQuery) => containerToAppend.append(element);

    PrependElementToContainer = (element: ng.IAugmentedJQuery, containerToPrepend: ng.IAugmentedJQuery) => containerToPrepend.prepend(element);

    FixScroll = (relativePosition: number) => this.containerElement.scrollTo(0, this.containerElement.offsetHeight * relativePosition);

    UpdateElementsWith = (elements: ng.IAugmentedJQuery[]): void => {
        this.containerElement.innerHTML = '';
        for (let element of elements) {
            this.containerElement.appendChild(element[0]);
        }
    }
}
