export class ScrollDetector {
    private lastScrollTop = 0;
    private BUFFER_COUNT = 5;

    public OnScrollDown?: () => void;
    public OnScrollUp?: () => void;

    constructor(private element: ng.IAugmentedJQuery) { }

    public SubscribeToElement = () => {
        const parentEl: HTMLElement = this.element.parent()[0];

        parentEl.onscroll = () => {
            if (this.lastScrollTop < parentEl.scrollTop) {
                const current = parentEl.scrollTop + parentEl.offsetHeight;
                const bottom = parentEl.scrollHeight;

                if (this.OnScrollDown && current === bottom) {
                    this.OnScrollDown();
                }
            } else if (this.lastScrollTop > parentEl.scrollTop) {
                const topElement = parentEl.children[0];
                if (this.OnScrollUp && parentEl.scrollTop <= (topElement.clientHeight * this.BUFFER_COUNT)) {
                    this.OnScrollUp();
                }
            }
            this.lastScrollTop = parentEl.scrollTop;
        };
    }
}
