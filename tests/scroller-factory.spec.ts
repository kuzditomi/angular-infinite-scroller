import { ScrollerFactory } from "../src/scroller-factory";
import { Descriptor } from "../src/descriptor";
import { ElementsManager } from "../src/elements-manager";
import { RevealerElementsManager } from "../src/revealer-elements-manager";
import { DOMManager } from "../src/dom-manager";
import { Scroller } from "../src/scroller";
import { ScrollDetector } from "../src/scroll-detector";

describe("Scroller factory", function () {
    it("builds normal element manager by default", function () {
        // Arrange
        let watchCallback;
        const scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$on', '$watchCollection', '$new']);
        scopeMock.$watchCollection.and.callFake((_, updatecallback) => watchCallback = updatecallback);
        scopeMock.$new.and.returnValue({});

        const parentElementMock = jasmine.createSpyObj<JQLite>("parentElementMock", ["bind", "append"]);
        const scrollDetectorMock = jasmine.createSpyObj<ScrollDetector>("scrollDetectorMock", ["SubscribeToElement"]);
        const domManagerMock = jasmine.createSpyObj<DOMManager>("domManagerMock", ["AppendElement", "GetScrollBottomPosition", "GetElementBottomPosition"]);
        domManagerMock.GetScrollBottomPosition.and.returnValue(100);
        domManagerMock.GetElementBottomPosition.and.returnValues([0, 1, 2]);

        const descriptorMock = {
            Scope: scopeMock,
            Settings: {
                BufferSize: 2
            }
        } as any as Descriptor;

        const linkerMock = (_, linkCallback) => linkCallback();

        // Act
        const createdScroller = ScrollerFactory.createFrom(descriptorMock, domManagerMock, linkerMock as ng.ITranscludeFunction, scrollDetectorMock);
        watchCallback([1, 2, 3])

        // Assert
        expect(domManagerMock.AppendElement).toHaveBeenCalledTimes(3);
    });

    it("can build revealer element manager", function () {
        // Arrange
        let watchCallback;
        const scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$on', '$watchCollection', '$new']);
        scopeMock.$watchCollection.and.callFake((_, updatecallback) => watchCallback = updatecallback);
        scopeMock.$new.and.returnValue({});

        const parentElementMock = jasmine.createSpyObj<JQLite>("parentElementMock", ["bind", "append"]);
        const scrollDetectorMock = jasmine.createSpyObj<ScrollDetector>("scrollDetectorMock", ["SubscribeToElement"]);
        const domManagerMock = jasmine.createSpyObj<DOMManager>("domManagerMock", [
            "AppendElement",
            "AppendElementToContainer",
            "GetRelativePositionOf",
            "GetElementBottomPosition",
            "CreateRevealerElement"]
        );

        domManagerMock.CreateRevealerElement.and.returnValue('fakeRevealerDomElement');
        domManagerMock.GetRelativePositionOf.and.returnValue(100);
        domManagerMock.GetElementBottomPosition.and.returnValues([0, 1, 2, 3, 4, 5]);

        const descriptorMock = {
            Scope: scopeMock,
            Settings: {
                BufferSize: 2
            },
            UseRevealer: true
        } as any as Descriptor;

        const linkerMock = function (_, cloneCallback) {
            cloneCallback('fakedomelement');
        } as ng.ITranscludeFunction;

        // Act
        const createdScroller = ScrollerFactory.createFrom(descriptorMock, domManagerMock, linkerMock, scrollDetectorMock);
        watchCallback([1, 2, 3, 4, 5])

        // Assert
        expect(domManagerMock.AppendElement).toHaveBeenCalledTimes(1);
        expect(domManagerMock.AppendElement).toHaveBeenCalledWith('fakeRevealerDomElement');
        expect(domManagerMock.AppendElementToContainer).toHaveBeenCalledTimes(5);
        expect(domManagerMock.AppendElementToContainer).toHaveBeenCalledWith('fakedomelement', 'fakeRevealerDomElement');
    });
});