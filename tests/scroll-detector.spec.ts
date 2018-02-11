import { ScrollDetector } from "../src/scroll-detector";

describe("Scroll detector", function () {
    let elementMock;
    let parentMock;
    let scrollDetector: ScrollDetector;

    beforeEach(function () {
        parentMock = {
            0: {
                children: [
                    {}
                ]
            } as any as HTMLElement
        };

        elementMock = {
            0: {},
            parent: () => parentMock
        };

        scrollDetector = new ScrollDetector(elementMock);
    });

    describe("gives no sign", function () {
        it("when bottom is too far", function () {
            // Arrange
            parentMock[0].scrollHeight = 1000;
            parentMock[0].scrollTop = 90;
            parentMock[0].offsetHeight = 10;

            let isScrollCalled: boolean = false;
            scrollDetector.OnScrollDown = () => isScrollCalled = true;
            scrollDetector.OnScrollUp = () => isScrollCalled = true;

            // Act
            scrollDetector.SubscribeToElement();
            parentMock[0].onscroll({} as UIEvent);

            // Assert
            expect(isScrollCalled).toBeFalsy();
        });

        it("when scroll is the same", function () {
            // Arrange
            parentMock[0].scrollTop = 100;

            let isScrollCalled: boolean = false;
            scrollDetector.OnScrollUp = () => isScrollCalled = true;
            scrollDetector.OnScrollDown = () => isScrollCalled = true;

            scrollDetector.SubscribeToElement();
            parentMock[0].onscroll({} as UIEvent); // scroll once

            parentMock[0].scrollTop = 100;

            // Act
            parentMock[0].onscroll({} as UIEvent);

            // Assert
            expect(isScrollCalled).toBeFalsy();
        });

        it("when top is too far", function () {
            // Arrange
            parentMock[0].scrollHeight = 1000;
            parentMock[0].scrollTop = 100;
            parentMock[0].offsetHeight = 10;

            let isScrollCalled: boolean = false;
            scrollDetector.OnScrollUp = () => isScrollCalled = true;

            scrollDetector.SubscribeToElement();
            parentMock[0].onscroll({} as UIEvent); // scroll down first

            parentMock[0].scrollHeight = 1000;
            parentMock[0].scrollTop = 90;
            parentMock[0].offsetHeight = 10;

            parentMock[0].children[0].clientHeight = 10;

            // Act
            parentMock[0].onscroll({} as UIEvent);

            // Assert
            expect(isScrollCalled).toBeFalsy();
        });
    })

    describe("signs to load", function () {
        it("if bottom is reached", function () {
            // Arrange
            parentMock[0].scrollHeight = 100;
            parentMock[0].scrollTop = 90;
            parentMock[0].offsetHeight = 10;

            let isScrollDownCalled: boolean = false;
            scrollDetector.OnScrollDown = () => isScrollDownCalled = true;

            // Act
            scrollDetector.SubscribeToElement();
            parentMock[0].onscroll({} as UIEvent);

            // Assert
            expect(isScrollDownCalled).toBeTruthy();
        });

        it("if top is reached", function () {
            // Arrange
            parentMock[0].scrollHeight = 1000;
            parentMock[0].scrollTop = 100;
            parentMock[0].offsetHeight = 10;

            let isScrollCalled: boolean = false;
            scrollDetector.OnScrollUp = () => isScrollCalled = true;

            scrollDetector.SubscribeToElement();
            parentMock[0].onscroll({} as UIEvent); // scroll down first

            parentMock[0].scrollHeight = 1000;
            parentMock[0].scrollTop = 0;
            parentMock[0].offsetHeight = 10;

            parentMock[0].children[0].clientHeight = 10;

            // Act
            parentMock[0].onscroll({} as UIEvent);

            // Assert
            expect(isScrollCalled).toBeTruthy();
        });
    });
});