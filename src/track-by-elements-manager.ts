import { ElementsManager, Item } from './elements-manager';
import { Descriptor } from './descriptor';
import { IDOMManager } from './dom-manager';

interface TrackableItem extends Item {
    TrackByValue: string;
}

export class TrackByElementsManager extends ElementsManager {
    private trackByParser: ng.ICompiledExpression;

    public constructor(descriptor: Descriptor, domManager: IDOMManager, linker: ng.ITranscludeFunction, parser: ng.IParseService) {
        super(descriptor, domManager, linker);

        this.trackByParser = parser(descriptor.TrackByExpression);
    }

    public UpdateCollection(newCollection: any[]) {
        super.UpdateCollection(newCollection);

        for (let item of this.items) {
            (item as TrackableItem).TrackByValue = this.trackByParser(item.Scope);
        }
    }
}
