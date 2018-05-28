import { DOMManager } from '../src/dom-manager';

describe('Dom manager', function () {
    let containerElement: jasmine.SpyObj<HTMLElement>;
    let containerJquery: jasmine.SpyObj<ng.IAugmentedJQuery>;
    let mockContainerJQuery: jasmine.SpyObj<ng.IAugmentedJQuery>;

    beforeEach(() => {
        containerElement = jasmine.createSpyObj<HTMLElement>('containerElement', ['scrollTo', 'appendChild']);

        containerJquery = jasmine.createSpyObj<ng.IAugmentedJQuery>('containerJquery', ['prepend', 'append']);
        containerJquery[0] = containerElement;

        mockContainerJQuery = jasmine.createSpyObj<ng.IAugmentedJQuery>('mockContainerJQuery', ['parent']);
        mockContainerJQuery.parent.and.returnValue(containerJquery);
    });

    it('uses offset for top', function () {
        // Arrange
        const domManager = new DOMManager(mockContainerJQuery);

        const mockElement = {
            0: {
                offsetTop: 12,
            },
        } as any as ng.IAugmentedJQuery;

        // Act
        const elementTop = domManager.GetElementTopPosition(mockElement);

        // Assert
        expect(elementTop).toEqual(12);
    });

    it('removes element', function () {
        // Arrange
        const domManager = new DOMManager(mockContainerJQuery);
        const mockElement = jasmine.createSpyObj<ng.IAugmentedJQuery>('mockElement', ['remove']);

        // Act
        domManager.Remove(mockElement);

        // Assert
        expect(mockElement.remove).toHaveBeenCalled();
    });

    it('counts scrolltop position', function () {
        // Arrange
        (containerElement as any).offsetTop = 100;
        (containerElement as any).scrollTop = 500;

        const domManager = new DOMManager(mockContainerJQuery);

        // Act
        const position = domManager.GetScrollTopPosition();

        // Assert
        expect(position).toEqual(600);
    });

    it('counts scrollbottom position', function () {
        // Arrange
        (containerElement as any).scrollTop = 100;
        (containerElement as any).offsetTop = 200;
        (containerElement as any).offsetHeight = 300;

        const domManager = new DOMManager(mockContainerJQuery);

        // Act
        const position = domManager.GetScrollBottomPosition();

        // Assert
        expect(position).toEqual(600);
    });

    it('counts relative positions', function () {
        // Arrange
        (containerElement as any).offsetTop = 100;
        (containerElement as any).offsetHeight = 100;

        const domManager = new DOMManager(mockContainerJQuery);
        const ratios = [0.5, 1, 1.5, 2];
        const expectedPositions = [150, 200, 250, 300];

        // Act
        const positions = ratios.map(r => domManager.GetRelativePositionOf(r));

        // Assert
        expect(positions).toEqual(expectedPositions);
    });

    it('prepends element', function () {
        // Arrange
        const domManager = new DOMManager(mockContainerJQuery);

        // Act
        domManager.PrependElement(3 as any as ng.IAugmentedJQuery);

        // Assert
        expect(containerJquery.prepend).toHaveBeenCalledWith(3);
    });

    it('appends element to container', function () {
        // Arrange
        const domManager = new DOMManager(mockContainerJQuery);

        // Act
        domManager.AppendElementToContainer(3 as any as ng.IAugmentedJQuery, containerJquery);

        // Assert
        expect(containerJquery.append).toHaveBeenCalledWith(3);
    });

    it('prepends element to container', function () {
        // Arrange
        const domManager = new DOMManager(mockContainerJQuery);

        // Act
        domManager.PrependElementToContainer(3 as any as ng.IAugmentedJQuery, containerJquery);

        // Assert
        expect(containerJquery.prepend).toHaveBeenCalledWith(3);
    });

    it('fixes scroll position', function () {
        // Arrange
        (containerElement as any).offsetHeight = 100;

        const domManager = new DOMManager(mockContainerJQuery);
        const relativePositions = [1, 2, 3];

        // Act
        relativePositions.forEach(r => domManager.FixScroll(r));

        // Assert
        expect(containerElement.scrollTo.calls.allArgs()).toEqual([[0, 100], [0, 200], [0, 300]]);
    });

    it('updates elements in controller', function () {
        // Arrange
        (containerElement as any).innerHtml = 'something';

        const domManager = new DOMManager(mockContainerJQuery);
        const elementsToAdd = [1, 2, 3].map(n => ({ 0: n } as any as ng.IAugmentedJQuery));

        // Act
        domManager.UpdateElementsWith(elementsToAdd);

        // Assert
        expect(containerElement.innerHTML).toEqual('');
        expect(containerElement.appendChild.calls.allArgs()).toEqual([[1], [2], [3]]);
    });
});
