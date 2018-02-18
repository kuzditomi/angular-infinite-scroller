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