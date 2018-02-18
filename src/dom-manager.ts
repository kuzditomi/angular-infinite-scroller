declare var angular;

export interface IDOMManager {
    CreateRevealerElement(): ng.IAugmentedJQuery;

    AppendElement(element: ng.IAugmentedJQuery): void;
    PrependElement(element: ng.IAugmentedJQuery): void;
    AppendElementToContainer(element: ng.IAugmentedJQuery,containerToAppend: ng.IAugmentedJQuery): void;
    PrependElementToContainer(element: ng.IAugmentedJQuery, containerToPrepend: ng.IAugmentedJQuery): void;

    GetScrollBottomPosition(): number;
    GetScrollTopPosition(): number;
    GetRelativePositionOf(elementRatio: number): number;

    GetElementBottomPosition(element: ng.IAugmentedJQuery): number;
    GetElementTopPosition(element: ng.IAugmentedJQuery): number;

    FixScroll(relativePosition: number);
    Remove(element: ng.IAugmentedJQuery): void;
}

export class DOMManager implements IDOMManager {
    private container: ng.IAugmentedJQuery;
    private containerElement: HTMLElement;

    constructor(private element: ng.IAugmentedJQuery) {
        this.container = element.parent();
        this.containerElement = this.container[0];
    }

    CreateRevealerElement(): ng.IAugmentedJQuery {
        return angular.element('<div class="revealer"></div>');
    }

    GetElementTopPosition(element: ng.IAugmentedJQuery): number {
        return element[0].offsetTop;
    }
    Remove(element: ng.IAugmentedJQuery): void {
        element.remove();
    }
    GetScrollTopPosition = () => {
        return this.containerElement.offsetTop + this.containerElement.scrollTop;
    }
    GetElementBottomPosition(element: ng.IAugmentedJQuery) {
        return element[0].offsetTop + element[0].offsetHeight;
    }
    GetScrollBottomPosition = () => {
        return this.containerElement.offsetTop + this.containerElement.scrollTop + this.containerElement.offsetHeight;
    }
    GetRelativePositionOf(elementRatio: number): number {
        return this.containerElement.offsetTop + this.containerElement.offsetHeight * elementRatio;
    }
    AppendElement = (element: ng.IAugmentedJQuery) => {
        this.container.append(element);
    }
    PrependElement = (element: ng.IAugmentedJQuery) => {
        this.container.prepend(element);
    }
    AppendElementToContainer = (element: ng.IAugmentedJQuery, containerToAppend: ng.IAugmentedJQuery) => {
        containerToAppend.append(element);
    }
    PrependElementToContainer = (element: ng.IAugmentedJQuery, containerToPrepend: ng.IAugmentedJQuery) => {
        containerToPrepend.prepend(element);
    }
    FixScroll(relativePosition: number) {
        this.containerElement.scrollTo(0, this.containerElement.offsetHeight / 2);
    }
}