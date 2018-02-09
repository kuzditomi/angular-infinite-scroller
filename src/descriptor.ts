export class Descriptor {
    private constructor() { }

    public CollectionString: string
    public IndexString: string;
    public UseRevealer: boolean;
    public Scope: ng.IScope;
    public Element: JQLite;

    static createFrom(scope: ng.IScope, element: JQLite, attr: ng.IAttributes): Descriptor {
        const loop = attr.infiniteScroller,
            match = loop.match(/^\s*(.+)\s+in\s+(.*?)$/),
            indexString = match[1],
            collectionString = match[2];

        const descriptor = new Descriptor();
        descriptor.CollectionString = collectionString;
        descriptor.IndexString = indexString;
        descriptor.UseRevealer = attr['useRevealer'] != undefined;
        descriptor.Element = element;
        descriptor.Scope = scope;

        return descriptor;
    }
}
