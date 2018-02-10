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
            Scope: scopeMock as ng.IScope,
            Settings: {
                BufferSize: 10
            }
        } as Descriptor;
    });

    describe("initialization", function () {
        it("populates container element with proper maximum amount on creation", function () {
            // Arrange
            scopeMock.$new.and.returnValue({});
            descriptorMock.Settings.BufferSize = 5;

            domManagerMock.GetScrollBottomPosition.and.returnValue(100);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112);

            const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

            // Act
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

            // Assert
            expect(domManagerMock.AppendElementToContainer).toHaveBeenCalledTimes(7); // 2 elements below the bottom + 5 buffersize
        });

        it("populates container element with proper scope values on creation", function () {
            // Arrange
            const bufferSize = 3;
            const scopeValues = ['a', 2, false, 4.0, { property: 'yes' }, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            const createdChildScopes = [];
            const expectedChildScopes = scopeValues
                .slice(0, 2 + bufferSize) // there will be 2 elements visible
                .map(value => { return { item: value }; });

            scopeMock.$new.and.callFake(function () {
                const newChildScope = {};
                createdChildScopes.push(newChildScope);

                return newChildScope;
            });

            descriptorMock.Settings.BufferSize = bufferSize;

            domManagerMock.GetScrollBottomPosition.and.returnValue(100);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112);

            const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

            // Act
            elementsManager.UpdateCollection(scopeValues);

            // Assert
            expect(createdChildScopes).toEqual(expectedChildScopes);
        });
    });

    describe("scroll down", function () {
        it("adds new elements", function () {
            
        });
    });
});