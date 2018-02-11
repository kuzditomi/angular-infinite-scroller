import { DOMManager } from "./dom-manager";

export class ScrollDetector {
    private lastScrollTop = 0;
    private BUFFER_COUNT = 5;

    constructor(private element: JQLite) { }

    public SubscribeToElement = () => {
        const parentEl: HTMLElement = this.element.parent()[0];

        parentEl.onscroll = () => {
            if (this.lastScrollTop < parentEl.scrollTop) {
                const current = parentEl.scrollTop + parentEl.offsetHeight;
                const bottom = parentEl.scrollHeight;

                if (current == bottom) {
                    this.OnScrollDown && this.OnScrollDown();
                }
            } else if (this.lastScrollTop > parentEl.scrollTop) {
                const topElement = parentEl.children[0];
                if (parentEl.scrollTop <= (topElement.clientHeight * this.BUFFER_COUNT)) {
                    this.OnScrollUp && this.OnScrollUp();
                }
            }
            this.lastScrollTop = parentEl.scrollTop;
        };
    }

    public OnScrollDown?: () => void;
    public OnScrollUp?: () => void;
}
