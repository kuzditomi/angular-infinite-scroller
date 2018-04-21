import { ScrollSettings } from './scroll-settings';

interface ExpressionDescriptor {
    index: string;
    collection: string;
    trackBy: string;
}

export class Descriptor {
    public Settings: ScrollSettings;
    public CollectionExpression: string;
    public IndexExpression: string;
    public TrackByExpression: string;
    public Scope: ng.IScope;

    private constructor() { }

    static createFrom(scope: ng.IScope, attr: ng.IAttributes): Descriptor {
        const settings = ScrollSettings.createFrom(attr);
        const expressionDesc = Descriptor.parseExpression(attr.infiniteScroller);

        const descriptor = new Descriptor();
        descriptor.CollectionExpression = expressionDesc.collection;
        descriptor.IndexExpression = expressionDesc.index;
        descriptor.TrackByExpression = expressionDesc.trackBy;
        descriptor.Scope = scope;
        descriptor.Settings = settings;

        return descriptor;
    }

    private static parseExpression(expression: string): ExpressionDescriptor {
        // parser logic mostly copied from ngRepeater https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js
        let match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

        if (!match) {
            throw Error(`Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '${expression}'.`);
        }

        const lhs = match[1];
        const rhs = match[2];
        const trackByExp = match[3];

        match = lhs.match(/^(?:(\s*[$\w]+))$/);

        if (!match) {
            throw Error(`'_item_' in '_item_ in _collection_' should be an identifier but got '${lhs}'.`);
        }

        return {
            collection: rhs,
            index: match[1],
            trackBy: trackByExp,
        };
    }
}
