export abstract class Base {
    constructor(initilizer?) {
        if (initilizer) {
            Object.assign(this, initilizer);
        }
    }

    public toObject() {
        return { ...this };
    }
}
