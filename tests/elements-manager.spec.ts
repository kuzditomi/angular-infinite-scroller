import { ElementsManager, IElementsManager } from "../src/elements-manager";
import { Descriptor } from "../src/descriptor";
import { IDOMManager } from "../src/dom-manager";

describe("Elements manager", function () {
    let domManagerMock;
    let scopeMock;
    let linkerMock;
    let descriptorMock;

    beforeEach(function () {
        domManagerMock = jasmine.createSpyObj<IDOMManager>('domManagerMock', [
            'AppendElementToContainer',
            'GetScrollBottomPosition',
            'GetElementBottomPosition'
        ]);

        scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$on', '$new']);

        linkerMock = function () { } as ng.ITranscludeFunction;

        descriptorMock = {
            IndexString: 'item',
            CollectionString: 'items',
            Scope: scopeMock as ng.IScope
        } as Descriptor;
    });

    it("populates container element with proper amount on creation", function () {
        // Arrange
        scopeMock.$new.and.returnValue({});

        domManagerMock.GetScrollBottomPosition.and.returnValue(100);
        domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112);

        const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

        // Act
        elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

        // Assert
        expect(domManagerMock.AppendElementToContainer).toHaveBeenCalledTimes(12); // 2 elements + overflow(10)
    });

    it("populates container element with proper scope values on creation", function () {
        // Arrange
        const scopeValues = ['a', 2, false, 4.0, { property: 'yes' }, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const createdChildScopes = [];
        const expectedChildScopes = scopeValues
            .slice(0, 12)
            .map(value => { return { item: value }; });

        scopeMock.$new.and.callFake(function () {
            const newChildScope = {};
            createdChildScopes.push(newChildScope);

            return newChildScope;
        });

        domManagerMock.GetScrollBottomPosition.and.returnValue(100);
        domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112);

        const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

        // Act
        elementsManager.UpdateCollection(scopeValues);

        // Assert
        expect(createdChildScopes).toEqual(expectedChildScopes);
    });
});