import { BoundaryFacility } from './Facilities';
import { LodBoundary } from './LodBoundary';
/**
 * A cache of LodBoundary objects.
 */
export declare class LodBoundaryCache {
    readonly size: number;
    readonly lodDistanceThresholds: readonly number[];
    readonly lodVectorCountTargets: readonly number[];
    private readonly cache;
    /**
     * Constructor.
     * @param size The maximum size of this cache.
     * @param lodDistanceThresholds The Douglas-Peucker distance thresholds, in great-arc radians, for each LOD level
     * used by this cache's LodBoundary objects.
     * @param lodVectorCountTargets The vector count targets for each LOD level used by this cache's LodBoundary objects.
     */
    constructor(size: number, lodDistanceThresholds: readonly number[], lodVectorCountTargets: readonly number[]);
    /**
     * Retrieves a LodBoundary from this cache corresponding to a boundary facility. If the requested LodBoundary does
     * not exist, it will be created and added to this cache.
     * @param facility A boundary facility.
     * @returns The LodBoundary corresponding to `facility`.
     */
    get(facility: BoundaryFacility): LodBoundary;
    /**
     * Creates a new LodBoundary and adds it to this cache.
     * @param facility The facility from which to create the new LodBoundary.
     * @returns The newly created LodBoundary.
     */
    private create;
}
//# sourceMappingURL=LodBoundaryCache.d.ts.map