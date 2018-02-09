export interface IDOMManager {
    AppendElementToContainer(element: JQLite): void;
    PrependElementToContainer(element: JQLite): void;

    GetScrollBottomPosition(): number;
    GetScrollTopPosition(): number;

    GetElementBottomPosition(element: JQLite): number;
    GetElementTopPosition(element: JQLite): number;

    Remove(element: JQLite): void;
}

export class DOMManager implements IDOMManager {
    private containerElement: HTMLElement;

    constructor(private container: JQLite) {
        this.containerElement = this.container[0];
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
    AppendElementToContainer = (element: JQLite) => {
        this.container.append(element);
    }
    PrependElementToContainer = (element: JQLite) => {
        this.container.prepend(element);
    }
}