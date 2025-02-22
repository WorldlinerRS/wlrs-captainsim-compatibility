import { AbstractSubscribable } from '../sub/AbstractSubscribable';
/**
 * A Subject which provides a {@link GeoPointInterface} value.
 */
export class GeoPointSubject extends AbstractSubscribable {
    /**
     * Constructor.
     * @param value The value of this subject.
     */
    constructor(value) {
        super();
        this.value = value;
        /** @inheritdoc */
        this.isMutableSubscribable = true;
    }
    /**
     * Creates a GeoPointSubject.
     * @param initialVal The initial value.
     * @returns A GeoPointSubject.
     */
    static create(initialVal) {
        return new GeoPointSubject(initialVal);
    }
    /**
     * Creates a GeoPointSubject.
     * @param initialVal The initial value.
     * @returns A GeoPointSubject.
     * @deprecated Use `GeoPointSubject.create()` instead.
     */
    static createFromGeoPoint(initialVal) {
        return new GeoPointSubject(initialVal);
    }
    /** @inheritdoc */
    get() {
        return this.value.readonly;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    set(arg1, arg2) {
        const isArg1Number = typeof arg1 === 'number';
        const equals = isArg1Number ? this.value.equals(arg1, arg2) : this.value.equals(arg1);
        if (!equals) {
            isArg1Number ? this.value.set(arg1, arg2) : this.value.set(arg1);
            this.notify();
        }
    }
}
