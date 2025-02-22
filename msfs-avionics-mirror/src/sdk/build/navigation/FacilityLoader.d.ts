import { GeoKdTreeSearchFilter } from '../utils/datastructures';
import { AirportFacility, AirwaySegment, BoundaryFacility, Facility, FacilitySearchType, FacilitySearchTypeLatLon, FacilityType, FacilityTypeMap, IntersectionFacility, Metar, NdbFacility, NearestSearchResults, UserFacility, VorFacility } from './Facilities';
import { FacilityRepository } from './FacilityRepository';
/**
 * A type map of search type to concrete search session type.
 */
export declare type SessionTypeMap = {
    /** Plain search session. */
    [FacilitySearchType.All]: NearestSearchSession<any, any>;
    /** Airport search session. */
    [FacilitySearchType.Airport]: NearestAirportSearchSession;
    /** Intersection search session. */
    [FacilitySearchType.Intersection]: NearestIntersectionSearchSession;
    /** VOR search session. */
    [FacilitySearchType.Vor]: NearestVorSearchSession;
    /** NDB search session. */
    [FacilitySearchType.Ndb]: NearestSearchSession<string, string>;
    /** Boundary search session. */
    [FacilitySearchType.Boundary]: NearestBoundarySearchSession;
    /** Nearest user facility search session. */
    [FacilitySearchType.User]: NearestUserFacilitySearchSession;
};
/**
 * A type map of search type to concrete search session type.
 */
export declare type SearchTypeMap = {
    /** Plain search session. */
    [FacilitySearchType.All]: Facility;
    /** Airport search session. */
    [FacilitySearchType.Airport]: AirportFacility;
    /** Intersection search session. */
    [FacilitySearchType.Intersection]: IntersectionFacility;
    /** VOR search session. */
    [FacilitySearchType.Vor]: VorFacility;
    /** NDB search session. */
    [FacilitySearchType.Ndb]: NdbFacility;
    /** Boundary search session. */
    [FacilitySearchType.Boundary]: BoundaryFacility;
    /** Nearest user facility search session. */
    [FacilitySearchType.User]: UserFacility;
};
/**
 * A type map of facility type to facility search type.
 */
export declare const FacilityTypeSearchType: {
    /** Airport facility type. */
    LOAD_AIRPORT: FacilitySearchType;
    /** Intersection facility type. */
    LOAD_INTERSECTION: FacilitySearchType;
    /** NDB facility type. */
    LOAD_NDB: FacilitySearchType;
    /** VOR facility type. */
    LOAD_VOR: FacilitySearchType;
    /** USR facility type. */
    USR: FacilitySearchType;
};
/**
 * A class that handles loading facility data from the simulator.
 */
export declare class FacilityLoader {
    private readonly facilityRepo;
    readonly onInitialized: () => void;
    private static readonly MAX_FACILITY_CACHE_ITEMS;
    private static readonly MAX_AIRWAY_CACHE_ITEMS;
    private static facilityListener;
    private static readonly requestQueue;
    private static readonly mismatchRequestQueue;
    private static readonly facCache;
    private static readonly typeMismatchFacCache;
    private static readonly airwayCache;
    private static readonly searchSessions;
    private static readonly facRepositorySearchTypes;
    private static repoSearchSessionId;
    private static isInitialized;
    private static readonly initPromiseResolveQueue;
    /**
     * Creates an instance of the FacilityLoader.
     * @param facilityRepo A local facility repository.
     * @param onInitialized A callback to call when the facility loader has completed initialization.
     */
    constructor(facilityRepo: FacilityRepository, onInitialized?: () => void);
    /**
     * Initializes this facility loader.
     */
    private static init;
    /**
     * Waits until this facility loader is initialized.
     * @returns A Promise which is fulfilled when this facility loader is initialized.
     */
    private awaitInitialization;
    /**
     * Retrieves a facility.
     * @param type The type of facility to retrieve.
     * @param icao The ICAO of the facility to retrieve.
     * @returns A Promise which will be fulfilled with the requested facility, or rejected if the facility could not be
     * retrieved.
     */
    getFacility<T extends FacilityType>(type: T, icao: string): Promise<FacilityTypeMap[T]>;
    /**
     * Retrieves a facility from the local facility repository.
     * @param type The type of facility to retrieve.
     * @param icao The ICAO of the facility to retrieve.
     * @returns A Promise which will be fulfilled with the requested facility, or rejected if the facility could not be
     * retrieved.
     */
    private getFacilityFromRepo;
    /**
     * Retrieves a facility from Coherent.
     * @param type The type of facility to retrieve.
     * @param icao The ICAO of the facility to retrieve.
     * @returns A Promise which will be fulfilled with the requested facility, or rejected if the facility could not be
     * retrieved.
     */
    private getFacilityFromCoherent;
    /**
     * Gets airway data from the sim.
     * @param airwayName The airway name.
     * @param airwayType The airway type.
     * @param icao The 12 character FS ICAO of at least one intersection in the airway.
     * @returns The retrieved airway.
     * @throws an error if no airway is returned
     */
    getAirway(airwayName: string, airwayType: number, icao: string): Promise<AirwayObject>;
    /**
     * Starts a nearest facilities search session.
     * @param type The type of facilities for which to search.
     * @returns A Promise which will be fulfilled with the new nearest search session.
     */
    startNearestSearchSession<T extends FacilitySearchType>(type: T): Promise<SessionTypeMap[T]>;
    /**
     * Starts a sim-side nearest facilities search session through Coherent.
     * @param type The type of facilities for which to search.
     * @returns A Promise which will be fulfilled with the new nearest search session.
     */
    private startCoherentNearestSearchSession;
    /**
     * Starts a repository facilities search session.
     * @param type The type of facilities for which to search.
     * @returns A Promise which will be fulfilled with the new nearest search session.
     * @throws Error if the search type is not supported.
     */
    private startRepoNearestSearchSession;
    /**
     * Gets a METAR for an airport.
     * @param airport An airport.
     * @returns The METAR for the airport, or undefined if none could be obtained.
     */
    getMetar(airport: AirportFacility): Promise<Metar | undefined>;
    /**
     * Gets a METAR for an airport.
     * @param ident An airport ident.
     * @returns The METAR for the airport, or undefined if none could be obtained.
     */
    getMetar(ident: string): Promise<Metar | undefined>;
    /**
     * Searches for the METAR issued for the closest airport to a given location.
     * @param lat The latitude of the center of the search, in degrees.
     * @param lon The longitude of the center of the search, in degrees.
     * @returns The METAR issued for the closest airport to the given location, or undefined if none could be found.
     */
    searchMetar(lat: number, lon: number): Promise<Metar | undefined>;
    /**
     * Cleans up a raw METAR object.
     * @param raw A raw METAR object.
     * @returns A cleaned version of the raw METAR object, or undefined if the raw METAR is empty.
     */
    private static cleanMetar;
    /**
     * Searches for ICAOs by their ident portion only.
     * @param filter The type of facility to filter by. Selecting ALL will search all facility type ICAOs.
     * @param ident The partial or complete ident to search for.
     * @param maxItems The max number of matches to return.
     * @returns A collection of matched ICAOs.
     */
    searchByIdent(filter: FacilitySearchType, ident: string, maxItems?: number): Promise<string[]>;
    /**
     * Searches for facilities matching a given ident, and returns the matching facilities, with nearest at the beginning of the array.
     * @param filter The type of facility to filter by. Selecting ALL will search all facility type ICAOs, except for boundary facilities.
     * @param ident The exact ident to search for. (ex: DEN, KDEN, ITADO)
     * @param lat The latitude to find facilities nearest to.
     * @param lon The longitude to find facilities nearest to.
     * @param maxItems The max number of matches to return.
     * @returns An array of matching facilities, sorted by distance to the given lat/lon, with nearest at the beginning of the array.
     */
    findNearestFacilitiesByIdent<T extends FacilitySearchTypeLatLon>(filter: T, ident: string, lat: number, lon: number, maxItems?: number): Promise<SearchTypeMap[T][]>;
    /**
     * A callback called when a facility is received from the simulator.
     * @param facility The received facility.
     */
    private static onFacilityReceived;
    /**
     * A callback called when a search completes.
     * @param results The results of the search.
     */
    private static onNearestSearchCompleted;
    /**
     * Adds a facility to the cache.
     * @param fac The facility to add.
     * @param isTypeMismatch Whether to add the facility to the type mismatch cache.
     */
    private static addToFacilityCache;
    /**
     * Adds an airway to the airway cache.
     * @param airway The airway to add.
     */
    private static addToAirwayCache;
}
/**
 * A session for searching for nearest facilities.
 */
export interface NearestSearchSession<TAdded, TRemoved> {
    /**
     * Searches for nearest facilities from the specified point.
     * @param lat The latitude, in degrees.
     * @param lon The longitude, in degrees.
     * @param radius The radius around the point to search, in meters.
     * @param maxItems The maximum number of items.
     * @returns The nearest search results.
     */
    searchNearest(lat: number, lon: number, radius: number, maxItems: number): Promise<NearestSearchResults<TAdded, TRemoved>>;
}
/**
 * A session for searching for nearest facilities through Coherent.
 */
declare class CoherentNearestSearchSession<TAdded, TRemoved> implements NearestSearchSession<TAdded, TRemoved> {
    protected readonly sessionId: number;
    private readonly searchQueue;
    /**
     * Creates an instance of a CoherentNearestSearchSession.
     * @param sessionId The ID of the session.
     */
    constructor(sessionId: number);
    /** @inheritdoc */
    searchNearest(lat: number, lon: number, radius: number, maxItems: number): Promise<NearestSearchResults<TAdded, TRemoved>>;
    /**
     * A callback called by the facility loader when a nearest search has completed.
     * @param results The search results.
     */
    onSearchCompleted(results: NearestSearchResults<TAdded, TRemoved>): void;
}
/**
 * A session for searching for nearest airports.
 */
export declare class NearestAirportSearchSession extends CoherentNearestSearchSession<string, string> {
    /**
     * Default filters for the nearest airports search session.
     */
    static Defaults: {
        ShowClosed: boolean;
        ClassMask: number;
        SurfaceTypeMask: number;
        ApproachTypeMask: number;
        MinimumRunwayLength: number;
        ToweredMask: number;
    };
    /**
     * Sets the filter for the airport nearest search.
     * @param showClosed Whether or not to show closed airports.
     * @param classMask A bitmask to determine which JS airport classes to show.
     */
    setAirportFilter(showClosed: boolean, classMask: number): void;
    /**
     * Sets the extended airport filters for the airport nearest search.
     * @param surfaceTypeMask A bitmask of allowable runway surface types.
     * @param approachTypeMask A bitmask of allowable approach types.
     * @param toweredMask A bitmask of untowered (1) or towered (2) bits.
     * @param minRunwayLength The minimum allowable runway length, in meters.
     */
    setExtendedAirportFilters(surfaceTypeMask: number, approachTypeMask: number, toweredMask: number, minRunwayLength: number): void;
}
/**
 * A session for searching for nearest intersections.
 */
export declare class NearestIntersectionSearchSession extends CoherentNearestSearchSession<string, string> {
    /**
     * Default filters for the nearest intersections search session.
     */
    static Defaults: {
        TypeMask: number;
    };
    /**
     * Sets the filter for the intersection nearest search.
     * @param typeMask A bitmask to determine which JS intersection types to show.
     */
    setIntersectionFilter(typeMask: number): void;
}
/**
 * A session for searching for nearest VORs.
 */
export declare class NearestVorSearchSession extends CoherentNearestSearchSession<string, string> {
    /**
     * Default filters for the nearest VORs search session.
     */
    static Defaults: {
        ClassMask: number;
        TypeMask: number;
    };
    /**
     * Sets the filter for the VOR nearest search.
     * @param classMask A bitmask to determine which JS VOR classes to show.
     * @param typeMask A bitmask to determine which JS VOR types to show.
     */
    setVorFilter(classMask: number, typeMask: number): void;
}
/**
 * A session for searching for nearest airspace boundaries.
 */
export declare class NearestBoundarySearchSession extends CoherentNearestSearchSession<BoundaryFacility, number> {
    /**
     * Sets the filter for the boundary nearest search.
     * @param classMask A bitmask to determine which boundary classes to show.
     */
    setBoundaryFilter(classMask: number): void;
}
/**
 * A session for searching for nearest user facilities.
 */
export declare class NearestUserFacilitySearchSession implements NearestSearchSession<string, string> {
    private readonly repo;
    private readonly sessionId;
    private filter;
    private readonly cachedResults;
    private searchId;
    /**
     * Creates an instance of a NearestUserSearchSession.
     * @param repo The facility repository in which to search.
     * @param sessionId The ID of the session.
     */
    constructor(repo: FacilityRepository, sessionId: number);
    /** @inheritdoc */
    searchNearest(lat: number, lon: number, radius: number, maxItems: number): Promise<NearestSearchResults<string, string>>;
    /**
     * Sets the filter for this search session.
     * @param filter A function to filter the search results.
     */
    setUserFacilityFilter(filter?: GeoKdTreeSearchFilter<UserFacility>): void;
}
/**
 * An airway.
 */
export declare class AirwayObject {
    private _name;
    private _type;
    private _waypoints;
    /** Builds a Airway
     * @param name - the name of the new airway.
     * @param type - the type of the new airway.
     */
    constructor(name: string, type: number);
    /**
     * Gets the name of the airway
     * @returns the airway name
     */
    get name(): string;
    /**
     * Gets the type of the airway
     * @returns the airway type
     */
    get type(): number;
    /**
     * Gets the waypoints of this airway.
     * @returns the waypoints of this airway.
     */
    get waypoints(): IntersectionFacility[];
    /**
     * Sets the waypoints of this airway.
     * @param waypoints is the array of waypoints.
     */
    set waypoints(waypoints: IntersectionFacility[]);
}
/**
 * WT Airway Status Enum
 */
export declare enum AirwayStatus {
    /**
     * @readonly
     * @property {number} INCOMPLETE - indicates waypoints have not been loaded yet.
     */
    INCOMPLETE = 0,
    /**
     * @readonly
     * @property {number} COMPLETE - indicates all waypoints have been successfully loaded.
     */
    COMPLETE = 1,
    /**
     * @readonly
     * @property {number} PARTIAL - indicates some, but not all, waypoints have been successfully loaded.
     */
    PARTIAL = 2
}
/**
 * The Airway Builder.
 */
export declare class AirwayBuilder {
    private _initialWaypoint;
    private _initialData;
    private facilityLoader;
    private _waypointsArray;
    private _hasStarted;
    private _isDone;
    /** Creates an instance of the AirwayBuilder
     * @param _initialWaypoint is the initial intersection facility
     * @param _initialData is the intersection route to build from
     * @param facilityLoader is an instance of the facility loader
     */
    constructor(_initialWaypoint: IntersectionFacility, _initialData: AirwaySegment, facilityLoader: FacilityLoader);
    /**
     * Get whether this builder has started loading waypoints
     * @returns whether this builder has started
     */
    get hasStarted(): boolean;
    /**
     * Get whether this builder is done loading waypoints
     * @returns whether this builder is done loading waypoints
     */
    get isDone(): boolean;
    /**
     * Get the airway waypoints
     * @returns the airway waypoints, or null
     */
    get waypoints(): IntersectionFacility[] | null;
    /** Steps through the airway waypoints
     * @param stepForward is the direction to step; true = forward, false = backward
     * @param arrayInsertFunc is the arrayInsertFunc
     */
    _step(stepForward: boolean, arrayInsertFunc: (wpt: IntersectionFacility) => void): Promise<void>;
    /** Steps Forward through the airway waypoints
     * @returns the step forward function
     */
    _stepForward(): Promise<void>;
    /** Steps Backward through the airway waypoints
     * @returns the step backward function
     */
    _stepBackward(): Promise<void>;
    /**
     * Sets the array into which this builder will load waypoints.
     * @param array is the array into which the builder will load waypoints
     */
    setWaypointsArray(array: IntersectionFacility[]): void;
    /**
     * Begins loading waypoints for this builder's parent airway.
     * @returns a Promise to return a status code corresponding to Airway.Status when this builder has
     * finished loading waypoints.
     */
    startBuild(): Promise<AirwayStatus>;
}
export {};
//# sourceMappingURL=FacilityLoader.d.ts.map