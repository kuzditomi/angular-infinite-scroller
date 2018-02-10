export class ScrollSettings {
    BufferSize: number;

    private constructor() { 
        this.BufferSize = 10;
    }

    static createFrom(attr: ng.IAttributes): ScrollSettings {
        const settingsObject = new ScrollSettings();

        if (attr['scrollBufferSize']) {
            try {
                const size = parseInt(attr['scrollBufferSize']);
                if (isNaN(size))
                    throw '';

                settingsObject.BufferSize = size;
            } catch {
                throw "could not initialize scroll settings, ScrollBufferSize is not a number";
            }
        }

        return settingsObject;
    }
}

export class Descriptor {
    private constructor() { }

    public Settings: ScrollSettings;
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

        const settings = ScrollSettings.createFrom(attr);

        const descriptor = new Descriptor();
        descriptor.CollectionString = collectionString;
        descriptor.IndexString = indexString;
        descriptor.UseRevealer = attr['useRevealer'] != undefined;
        descriptor.Element = element;
        descriptor.Scope = scope;
        descriptor.Settings = settings;

        return descriptor;
    }
}
