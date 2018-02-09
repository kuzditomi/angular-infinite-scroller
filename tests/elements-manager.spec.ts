import { ElementsManager, IElementsManager } from "../src/elements-manager";
import { Descriptor } from "../src/descriptor";
import { IDOMManager } from "../src/dom-manager";

describe("Elements manager", function () {
    it("populates container element properly on creation", function () {
        // Arrange
        const linkerMock = function () { } as ng.ITranscludeFunction;
        const scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$on', '$new']);
        scopeMock.$new.and.returnValue({});

        const domManagerMock = jasmine.createSpyObj<IDOMManager>('domManagerMock', [
            'AppendElementToContainer',
            'GetScrollBottomPosition',
            'GetElementBottomPosition'
        ]);
        domManagerMock.GetScrollBottomPosition.and.returnValue(100);
        domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112);

        const descriptorMock = {
            IndexString: 'item',
            CollectionString: 'items',
            Scope: scopeMock as ng.IScope
        } as Descriptor;

        const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

        // Act
        elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

        // Assert
        expect(domManagerMock.AppendElementToContainer).toHaveBeenCalledTimes(12); // 2 elements + overflow(10)
    });
});