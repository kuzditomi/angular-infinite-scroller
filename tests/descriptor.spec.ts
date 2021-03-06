import { Descriptor } from '../src/descriptor';

describe('Descriptor', function () {
    describe('regex', function () {
        it('parses collection and index strings properly', function () {
            // Arrange
            const scope = {} as ng.IScope;
            const attr = {
                infiniteScroller: 'something in somecollection',
            } as any as ng.IAttributes;

            // Act
            const descriptor = Descriptor.createFrom(scope, attr);

            // Assert
            expect(descriptor.IndexExpression).toEqual('something');
            expect(descriptor.CollectionExpression).toEqual('somecollection');
        });
    });

    describe('buffer size', function () {
        it('is initialized for default value', function () {
            // Arrange
            const scope = {} as ng.IScope;
            const attr = {
                infiniteScroller: 'something in somecollection',
            } as any as ng.IAttributes;

            // Act
            const descriptor = Descriptor.createFrom(scope, attr);

            // Assert
            expect(descriptor.Settings.BufferSize).toEqual(10);
        });

        it('is parsed if given correctly', function () {
            // Arrange
            const scope = {} as ng.IScope;
            const attr = {
                infiniteScroller: 'something in somecollection',
                scrollBufferSize: '198',
            } as any as ng.IAttributes;

            // Act
            const descriptor = Descriptor.createFrom(scope, attr);

            // Assert
            expect(descriptor.Settings.BufferSize).toEqual(198);
        });

        it('throws if incorrect value is given', function () {
            // Arrange
            const scope = {} as ng.IScope;
            const attr = {
                infiniteScroller: 'something in somecollection',
                scrollBufferSize: 'this is not a number',
            } as any as ng.IAttributes;

            // Act
            const creation = () => Descriptor.createFrom(scope, attr);

            // Assert
            expect(creation).toThrow('could not initialize scroll settings, ScrollBufferSize is not a number');
        });
    });
});
