class ScrollDetector {
    private lastScrollTop = 0;
    private BUFFER_COUNT = 5;

    constructor() {

    }

    public SubscribeTo = (element: JQLite) => {
        const parent: JQLite = element.parent();
        const parentEl: HTMLElement = parent[0];

        parent.bind('scroll', () => {
            if (this.lastScrollTop < parentEl.scrollTop) {
                const current = parentEl.scrollTop + parentEl.offsetHeight;
                const bottom = parentEl.scrollHeight;

                if (current == bottom) {
                    this.OnScrollDown && this.OnScrollDown();
                }
            } else if (this.lastScrollTop > parentEl.scrollTop) {
                const topElement = parentEl.children[0];

                if (parentEl.scrollTop < (topElement.scrollHeight * this.BUFFER_COUNT)) {
                    this.OnScrollUp && this.OnScrollUp();
                }
            }
            this.lastScrollTop = parent[0].scrollTop;
        });
    }

    public OnScrollDown?: () => void;
    public OnScrollUp?: () => void;
}
