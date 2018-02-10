import { ScrollerFactory } from "../src/scroller-factory";
import { Descriptor } from "../src/descriptor";
import { ElementsManager } from "../src/elements-manager";
import { RevealerElementsManager } from "../src/revealer-elements-manager";
import { DOMManager } from "../src/dom-manager";
import { Scroller } from "../src/scroller";
import { ScrollDetector } from "../src/scroll-detector";

describe("Scroller factory", function () {
    it("uses normal element manager by default", function () {
        // Arrange
        let watchCallback;
        const scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$on', '$watchCollection', '$new']);
        scopeMock.$watchCollection.and.callFake((_, updatecallback) => watchCallback = updatecallback);
        scopeMock.$new.and.returnValue({});

        const parentElementMock = jasmine.createSpyObj<JQLite>("parentElementMock", ["bind", "append"]);
        const scrollDetectorMock = jasmine.createSpyObj<ScrollDetector>("scrollDetectorMock", ["SubscribeToElement"]);
        const domManagerMock = jasmine.createSpyObj<DOMManager>("domManagerMock", ["AppendElementToContainer", "GetScrollBottomPosition", "GetElementBottomPosition"]);
        domManagerMock.GetScrollBottomPosition.and.returnValue(100);
        domManagerMock.GetElementBottomPosition.and.returnValues([0, 1, 2]);

        const descriptorMock = {
            Scope: scopeMock,
            Settings: {
                BufferSize: 2
            }
        } as any as Descriptor;

        const linkerMock = function () { } as ng.ITranscludeFunction;

        // Act
        const createdScroller = ScrollerFactory.createFrom(descriptorMock, domManagerMock, linkerMock, scrollDetectorMock);
        watchCallback([1, 2, 3])

        // Assert
        expect(domManagerMock.AppendElementToContainer).toHaveBeenCalledTimes(3);
    });
});