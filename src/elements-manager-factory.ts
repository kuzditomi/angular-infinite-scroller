import { Descriptor } from './descriptor';
import { IDOMManager } from './dom-manager';
import { IElementsManager, ElementsManager } from './elements-manager';
import { TrackByElementsManager } from './track-by-elements-manager';

export class ElementsManagerFactory {
    public static createFrom(descriptor: Descriptor, domManager: IDOMManager, linker: ng.ITranscludeFunction, parser: ng.IParseService): IElementsManager {
        if (descriptor.TrackByExpression) {
            return new TrackByElementsManager(descriptor, domManager, linker, parser);
        }

        return new ElementsManager(descriptor, domManager, linker);
    }
}
