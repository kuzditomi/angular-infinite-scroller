import { Scroller } from "../src/scroller";
import { Descriptor } from "../src/descriptor";
import { ScrollDetector } from "../src/scroll-detector";
import { IElementsManager } from "../src/elements-manager";

describe("Scroller", function () {
    let scopeMock: jasmine.SpyObj<ng.IScope>,
        scrollDetectorMock: jasmine.SpyObj<ScrollDetector>,
        descriptorMock: Descriptor;

    beforeEach(function () {
        scrollDetectorMock = jasmine.createSpyObj<ScrollDetector>('scrollDetectorMock', ['SubscribeToElement']);
        scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$watchCollection', '$apply']);

        descriptorMock = {
            Scope: scopeMock as ng.IScope
        } as Descriptor;
    });

    describe("watcher", function () {
        it("alerts element manager on collection change", function () {
            // Arrange
            let watchHandler;
            const elementsManagerMock = jasmine.createSpyObj<IElementsManager>('elementsManagerMock', ['UpdateCollection']);
            scopeMock.$watchCollection.and.callFake(function (collection, callback) {
                watchHandler = callback;
            });

            const scoller = new Scroller(descriptorMock, scrollDetectorMock, elementsManagerMock);

            // Act
            watchHandler([1, 2, 3])

            // Assert
            expect(elementsManagerMock.UpdateCollection).toHaveBeenCalledWith([1, 2, 3]);
        });
    });


    describe("on scrolling", function () {
        it("instruments element manager on scroll down", function () {
            // Arrange
            const elementsManagerMock = jasmine.createSpyObj<IElementsManager>('elementsManagerMock', ['AddBottom', 'RemoveTop', 'AddTop', 'RemoveBottom']);
            const scroller = new Scroller(descriptorMock, scrollDetectorMock, elementsManagerMock);
            scopeMock.$apply.and.callFake(callback => callback());

            // Act
            scrollDetectorMock.OnScrollDown();

            // Assert
            expect(scopeMock.$apply).toHaveBeenCalled();
            expect(elementsManagerMock.AddBottom).toHaveBeenCalled();
            expect(elementsManagerMock.RemoveTop).toHaveBeenCalled();
        });

        it("instruments element manager on scroll up", function () {
            // Arrange
            const elementsManagerMock = jasmine.createSpyObj<IElementsManager>('elementsManagerMock', ['AddBottom', 'RemoveTop', 'AddTop', 'RemoveBottom']);
            const scroller = new Scroller(descriptorMock, scrollDetectorMock, elementsManagerMock);
            scopeMock.$apply.and.callFake(callback => callback());

            // Act
            scrollDetectorMock.OnScrollUp();

            // Assert
            expect(scopeMock.$apply).toHaveBeenCalled();
            expect(elementsManagerMock.AddTop).toHaveBeenCalled();
            expect(elementsManagerMock.RemoveBottom).toHaveBeenCalled();
        });
    });

});