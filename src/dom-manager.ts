declare var angular;

export interface IDOMManager {
    CreateRevealerElement(): JQLite;

    AppendElement(element: JQLite): void;
    PrependElement(element: JQLite): void;
    AppendElementToContainer(element: JQLite,containerToAppend: JQLite): void;
    PrependElementToContainer(element: JQLite, containerToPrepend: JQLite): void;

    GetScrollBottomPosition(): number;
    GetScrollTopPosition(): number;
    GetRelativePositionOf(elementRatio: number): number;

    GetElementBottomPosition(element: JQLite): number;
    GetElementTopPosition(element: JQLite): number;

    FixScroll(relativePosition: number);
    Remove(element: JQLite): void;
}

export class DOMManager implements IDOMManager {
    private container: JQLite;
    private containerElement: HTMLElement;

    constructor(private element: JQLite) {
        this.container = element.parent();
        this.containerElement = this.container[0];
    }

    CreateRevealerElement(): JQLite {
        return angular.element('<div class="revealer"></div>');
    }

    GetElementTopPosition(element: JQLite): number {
        return element[0].offsetTop;
    }
    Remove(element: JQLite): void {
        element.remove();
    }
    GetScrollTopPosition = () => {
        return this.containerElement.offsetTop + this.containerElement.scrollTop;
    }
    GetElementBottomPosition(element: JQLite) {
        return element[0].offsetTop + element[0].offsetHeight;
    }
    GetScrollBottomPosition = () => {
        return this.containerElement.offsetTop + this.containerElement.scrollTop + this.containerElement.offsetHeight;
    }
    GetRelativePositionOf(elementRatio: number): number {
        return this.containerElement.offsetTop + this.containerElement.offsetHeight * elementRatio;
    }
    AppendElement = (element: JQLite) => {
        this.container.append(element);
    }
    PrependElement = (element: JQLite) => {
        this.container.prepend(element);
    }
    AppendElementToContainer = (element: JQLite, containerToAppend: JQLite) => {
        containerToAppend.append(element);
    }
    PrependElementToContainer = (element: JQLite, containerToPrepend: JQLite) => {
        containerToPrepend.prepend(element);
    }
    FixScroll(relativePosition: number) {
        this.containerElement.scrollTo(0, this.containerElement.offsetHeight / 2);
    }
}