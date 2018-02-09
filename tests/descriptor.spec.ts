import { Descriptor } from "../src/descriptor";

describe("Descriptor", function () {
    it("parses collection and index strings properly", function () {
        const scope = {} as ng.IScope;
        const element = {} as JQLite;
        const attr = {
            infiniteScroller: 'something in somecollection'
        } as any as ng.IAttributes;

        const descriptor = Descriptor.createFrom(scope, element, attr);
        
        expect(descriptor.IndexString).toEqual('something');
        expect(descriptor.CollectionString).toEqual('somecollection');
    });
});