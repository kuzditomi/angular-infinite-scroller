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
            'AppendElement',
            'PrependElement',
            'GetScrollBottomPosition',
            'GetElementBottomPosition',
            'GetScrollTopPosition',
            'Remove'
        ]);

        scopeMock = jasmine.createSpyObj<ng.IScope>('scopeMock', ['$on', '$new']);

        linkerMock = (_, linkCallback) => linkCallback();

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
            expect(domManagerMock.AppendElement).toHaveBeenCalledTimes(7); // 2 elements below the bottom + 5 buffersize
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

        it("populates container element with 'late' initialization too", function () {
            // Arrange
            scopeMock.$new.and.returnValue({});
            descriptorMock.Settings.BufferSize = 5;

            domManagerMock.GetScrollBottomPosition.and.returnValue(120);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112);

            const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

            // Act
            elementsManager.UpdateCollection([]);
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            // Assert
            expect(domManagerMock.AppendElement).toHaveBeenCalledTimes(10);
        });

        it("doesnt overpopulate container element with 'late' initialization", function () {
            // Arrange
            scopeMock.$new.and.returnValue({});
            descriptorMock.Settings.BufferSize = 2;

            domManagerMock.GetScrollBottomPosition.and.returnValue(120);
            domManagerMock.GetElementBottomPosition.and.returnValues(
                80, 100, 101, 120, // first visible set
                121, 122, // buffer
                130, // below visible
                106, 107, 108, 109, 110, 111, 112 // random values
            );

            const elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);

            // Act
            elementsManager.UpdateCollection([]);
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

            // Assert
            expect(domManagerMock.AppendElement).toHaveBeenCalledTimes(6);
        });
    });

    describe("adds elements", function () {
        let elementsManager: ElementsManager;

        beforeEach(function () {
            scopeMock.$new.and.returnValue({});
            descriptorMock.Settings.BufferSize = 2;
            domManagerMock.GetScrollBottomPosition.and.returnValue(100);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102);

            elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); // will insert 4 elements (2 visible + 2 buffer)
            domManagerMock.AppendElement.calls.reset();
        });

        it("adds new elements to bottom if necessary", function () {
            // Arrange new addition
            domManagerMock.AppendElement.calls.reset();
            domManagerMock.GetScrollBottomPosition.and.returnValue(120);
            domManagerMock.GetElementBottomPosition.and.returnValues(110, 111, 120, 121, 122, 123, 124, 125); // first param is for the check

            // Act
            elementsManager.AddBottom();

            // Assert
            expect(domManagerMock.AppendElement).toHaveBeenCalledTimes(5); // 3 new visible + 2 buffer
        });

        it("adds new elements to top if necessary", function () {
            // Arrange initialization
            scopeMock.$new.and.returnValue({ $destroy: () => { } });
            descriptorMock.Settings.BufferSize = 2;
            domManagerMock.GetScrollBottomPosition.and.returnValue(100);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102);

            elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); // will insert 4 elements (2 visible + 2 buffer)

            // Arrange removal from top
            domManagerMock.GetElementBottomPosition.and.returnValues(99, 99, 99, 99, 101); // removes 4
            domManagerMock.GetScrollTopPosition.and.returnValue(100);
            elementsManager.RemoveTop();

            // Act
            elementsManager.AddTop();

            // Assert
            expect(domManagerMock.PrependElement).toHaveBeenCalledTimes(2); // 2 buffer
        });
    });

    describe("removes element", function () {
        let elementsManager: ElementsManager;

        it("removes top", function () {
            // Arrange initialization
            scopeMock.$new.and.returnValue({ $destroy: () => { } });
            descriptorMock.Settings.BufferSize = 2;
            domManagerMock.GetScrollBottomPosition.and.returnValue(100);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 81, 82, 83, 84, 84, 100, 101, 102, 103);

            elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); // will insert 9 elements (7 visible + 2 buffer)

            // Arrange removal from top
            domManagerMock.GetElementBottomPosition.and.returnValues(98, 99, 100, 101, 102); // the third item is already visibly
            domManagerMock.GetScrollTopPosition.and.returnValue(100);

            // Act
            elementsManager.RemoveTop();

            // Assert
            expect(domManagerMock.Remove).toHaveBeenCalledTimes(2);
        });

        it("removes top until at least buffersize", function () {
            // Arrange initialization
            scopeMock.$new.and.returnValue({ $destroy: () => { } });
            descriptorMock.Settings.BufferSize = 2;
            domManagerMock.GetScrollBottomPosition.and.returnValue(100);
            domManagerMock.GetElementBottomPosition.and.returnValues(80, 100, 101, 102);

            elementsManager = new ElementsManager(descriptorMock, domManagerMock, linkerMock);
            elementsManager.UpdateCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); // will insert 4 elements (2 visible + 2 buffer)

            // Arrange removal from top
            domManagerMock.GetElementBottomPosition.and.returnValues(98, 99, 100, 101, 102); // the third item is already visibly
            domManagerMock.GetScrollTopPosition.and.returnValue(100);

            // Act
            elementsManager.RemoveTop();

            // Assert
            expect(domManagerMock.Remove).toHaveBeenCalledTimes(2);
        });
    });
});