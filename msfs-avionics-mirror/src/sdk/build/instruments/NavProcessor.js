/// <reference types="msfstypes/JS/simvar" />
import { EventSubscriber } from '../data/EventSubscriber';
import { SimVarValueType } from '../data/SimVars';
import { RadioUtils } from '../utils/radio';
import { BasePublisher, SimVarPublisher } from './BasePublishers';
import { FrequencyBank, RadioType } from './RadioCommon';
/** Publish simvars for ourselves */
export class NavProcSimVarPublisher extends SimVarPublisher {
    /**
     * Create a NavProcSimVarPublisher
     * @param bus The EventBus to publish to
     * @param pacer An optional pacer to use to control the pace of publishing
     */
    constructor(bus, pacer = undefined) {
        super(NavProcSimVarPublisher.simvars, bus, pacer);
    }
}
NavProcSimVarPublisher.simvars = new Map([
    ['nav_obs_1', { name: 'NAV OBS:1', type: SimVarValueType.Degree }],
    ['nav_cdi_1', { name: 'NAV CDI:1', type: SimVarValueType.Number }],
    ['nav_dme_1', { name: 'NAV DME:1', type: SimVarValueType.NM }],
    ['nav_has_dme_1', { name: 'NAV HAS DME:1', type: SimVarValueType.Bool }],
    ['nav_has_nav_1', { name: 'NAV HAS NAV:1', type: SimVarValueType.Bool }],
    ['nav_radial_1', { name: 'NAV RADIAL:1', type: SimVarValueType.Radians }],
    ['nav_signal_1', { name: 'NAV SIGNAL:1', type: SimVarValueType.Number }],
    ['nav_ident_1', { name: 'NAV IDENT:1', type: SimVarValueType.String }],
    ['nav_to_from_1', { name: 'NAV TOFROM:1', type: SimVarValueType.Enum }],
    ['nav_localizer_1', { name: 'NAV HAS LOCALIZER:1', type: SimVarValueType.Bool }],
    ['nav_localizer_crs_1', { name: 'NAV LOCALIZER:1', type: SimVarValueType.Number }],
    ['nav_glideslope_1', { name: 'NAV HAS GLIDE SLOPE:1', type: SimVarValueType.Bool }],
    ['nav_gs_error_1', { name: 'NAV GLIDE SLOPE ERROR:1', type: SimVarValueType.Degree }],
    ['nav_raw_gs_1', { name: 'NAV RAW GLIDE SLOPE:1', type: SimVarValueType.Degree }],
    ['nav_gs_lla_1', { name: 'NAV GS LATLONALT:1', type: SimVarValueType.LLA }],
    ['nav_lla_1', { name: 'NAV VOR LATLONALT:1', type: SimVarValueType.LLA }],
    ['nav_magvar_1', { name: 'NAV MAGVAR:1', type: SimVarValueType.Degree }],
    ['nav_obs_2', { name: 'NAV OBS:2', type: SimVarValueType.Degree }],
    ['nav_cdi_2', { name: 'NAV CDI:2', type: SimVarValueType.Number }],
    ['nav_dme_2', { name: 'NAV DME:2', type: SimVarValueType.NM }],
    ['nav_has_dme_2', { name: 'NAV HAS DME:2', type: SimVarValueType.Bool }],
    ['nav_has_nav_2', { name: 'NAV HAS NAV:2', type: SimVarValueType.Bool }],
    ['nav_radial_2', { name: 'NAV RADIAL:2', type: SimVarValueType.Radians }],
    ['nav_signal_2', { name: 'NAV SIGNAL:2', type: SimVarValueType.Number }],
    ['nav_ident_2', { name: 'NAV IDENT:2', type: SimVarValueType.String }],
    ['nav_to_from_2', { name: 'NAV TOFROM:2', type: SimVarValueType.Enum }],
    ['nav_localizer_2', { name: 'NAV HAS LOCALIZER:2', type: SimVarValueType.Bool }],
    ['nav_localizer_crs_2', { name: 'NAV LOCALIZER:2', type: SimVarValueType.Number }],
    ['nav_glideslope_2', { name: 'NAV HAS GLIDE SLOPE:2', type: SimVarValueType.Bool }],
    ['nav_gs_error_2', { name: 'NAV GLIDE SLOPE ERROR:2', type: SimVarValueType.Degree }],
    ['nav_raw_gs_2', { name: 'NAV RAW GLIDE SLOPE:2', type: SimVarValueType.Degree }],
    ['nav_gs_lla_2', { name: 'NAV GS LATLONALT:2', type: SimVarValueType.LLA }],
    ['nav_lla_2', { name: 'NAV VOR LATLONALT:2', type: SimVarValueType.LLA }],
    ['nav_magvar_2', { name: 'NAV MAGVAR:2', type: SimVarValueType.Degree }],
    ['gps_dtk', { name: 'GPS WP DESIRED TRACK', type: SimVarValueType.Degree }],
    ['gps_xtk', { name: 'GPS WP CROSS TRK', type: SimVarValueType.NM }],
    ['gps_wp', { name: 'GPS WP NEXT ID', type: SimVarValueType.NM }],
    ['gps_wp_bearing', { name: 'GPS WP BEARING', type: SimVarValueType.String }],
    ['gps_wp_distance', { name: 'GPS WP DISTANCE', type: SimVarValueType.NM }],
    ['adf_bearing_1', { name: 'ADF RADIAL:1', type: SimVarValueType.Radians }],
    ['adf_signal_1', { name: 'ADF SIGNAL:1', type: SimVarValueType.Number }],
    ['mkr_bcn_state_simvar', { name: 'MARKER BEACON STATE', type: SimVarValueType.Number }],
    ['gps_obs_active_simvar', { name: 'GPS OBS ACTIVE', type: SimVarValueType.Bool }],
    ['gps_obs_value_simvar', { name: 'GPS OBS VALUE', type: SimVarValueType.Degree }]
]);
//
// Navigation event configurations
//
export var NavSourceType;
(function (NavSourceType) {
    NavSourceType[NavSourceType["Nav"] = 0] = "Nav";
    NavSourceType[NavSourceType["Gps"] = 1] = "Gps";
    NavSourceType[NavSourceType["Adf"] = 2] = "Adf";
})(NavSourceType || (NavSourceType = {}));
//* ENUM for VOR To/From Flag */
export var VorToFrom;
(function (VorToFrom) {
    VorToFrom[VorToFrom["OFF"] = 0] = "OFF";
    VorToFrom[VorToFrom["TO"] = 1] = "TO";
    VorToFrom[VorToFrom["FROM"] = 2] = "FROM";
})(VorToFrom || (VorToFrom = {}));
/** Marker beacon signal state. */
export var MarkerBeaconState;
(function (MarkerBeaconState) {
    MarkerBeaconState[MarkerBeaconState["Inactive"] = 0] = "Inactive";
    MarkerBeaconState[MarkerBeaconState["Outer"] = 1] = "Outer";
    MarkerBeaconState[MarkerBeaconState["Middle"] = 2] = "Middle";
    MarkerBeaconState[MarkerBeaconState["Inner"] = 3] = "Inner";
})(MarkerBeaconState || (MarkerBeaconState = {}));
/**
 * Encapsulation of the logic for a generic nav source.
 */
class NavSourceBase {
    /**
     * Create a bearing pointer
     * @param id The navsourceid.
     */
    constructor(id) {
        this._ident = null;
        this._bearing = null;
        this._distance = null;
        this._obs = 0;
        this._deviation = null;
        this._toFrom = VorToFrom.OFF;
        this._glideslopeDeviation = null;
        this._glideslopeAngle = null;
        this._localizerCourse = null;
        this._magneticVariation = null;
        this._isLocalizerFrequency = null;
        this.validHandler = undefined;
        this.identHandler = undefined;
        this.brgHandler = undefined;
        this.distHandler = undefined;
        this.obsHandler = undefined;
        this.deviationHandler = undefined;
        this.toFromHandler = undefined;
        this.glideslopeDeviationHandler = undefined;
        this.glideslopeAngleHandler = undefined;
        this.localizerCourseHandler = undefined;
        this.magvarHandler = undefined;
        this.isLocalizerFrequencyHandler = undefined;
        this._valid = false;
        this._activeBrg = false;
        this._activeCdi = false;
        this._hasCdi = false;
        this._hasDme = false;
        this._hasLocalizer = false;
        this._hasGlideslope = false;
        this._signal = 0;
        this._activeForCount = 0;
        if (id.type !== null && id.type in [NavSourceType.Nav, NavSourceType.Gps]) {
            this._hasCdi = true;
        }
        this.valid = false;
        this.srcId = id;
    }
    /**
     * Do we support CDI?
     * @returns A boolean with our CDI support state.
     */
    get hasCdi() {
        return this._hasCdi;
    }
    /**
     * Set a new ident.
     * @param ident The new ident string.
     */
    set ident(ident) {
        this._ident = ident;
        if (this.valid && this.activeBrg && this.identHandler !== undefined) {
            this.identHandler(ident, this.srcId);
        }
    }
    /**
     * Get an ident.
     * @returns A string identifying the nav source.
     */
    get ident() {
        if (this._signal > 0) {
            return this._ident;
        }
        else {
            return null;
        }
    }
    /**
     * Set a new bearing.
     * @param bearing The new bearing in degrees.
     */
    set bearing(bearing) {
        if (bearing !== null) {
            bearing *= 57.2958;
            bearing = (bearing + 180) % 360;
        }
        this._bearing = bearing;
        if (this.valid && this.activeBrg && this.brgHandler !== undefined) {
            this.brgHandler(bearing, this.srcId);
        }
    }
    /**
     * Get abearing.
     * @returns Bearing to the source in degrees.
     */
    get bearing() {
        return this._bearing;
    }
    /**
     * Set a new distance
     * @param distance The distance in NM.
     */
    set distance(distance) {
        this._distance = distance;
        if (this.valid && this.activeBrg && this.distHandler !== undefined) {
            this.distHandler(this.distance, this.srcId);
        }
    }
    /**
     * Get the distance to a source..
     * @returns Distance to the source in degrees.
     */
    get distance() {
        if (this.hasDme) {
            return this._distance;
        }
        else {
            return null;
        }
    }
    /**
     * Set a new OBS
     * @param obs the new bearing in degrees
     */
    set obs(obs) {
        this._obs = obs;
        if (this.activeCdi && this.obsHandler !== undefined) {
            this.obsHandler(obs, this.srcId);
        }
    }
    /**
     * Get the OBS setting.
     * @returns OBS in degrees.
     */
    get obs() {
        return this._obs;
    }
    /**
     * Set a new deviation
     * @param deviation The new deviation in points.
     */
    set deviation(deviation) {
        this._deviation = deviation;
        if (this.activeCdi && this.deviationHandler !== undefined) {
            this.deviationHandler(deviation, this.srcId);
        }
    }
    /**
     * Get the deviation.
     * @returns The deviation in points.
     */
    get deviation() {
        return this._deviation;
    }
    /**
     * Set a new VOR to/from value
     * @param toFrom The to/from value.
     */
    set toFrom(toFrom) {
        if (this.activeCdi && this.toFromHandler !== undefined) {
            this.toFromHandler(toFrom, this.srcId);
        }
        this._toFrom = toFrom;
    }
    /**
     * Get the VOR to/from value.
     * @returns The VOR to/from value.
     */
    get toFrom() {
        return this._toFrom;
    }
    /**
     * Set whether the nav radio has a loc signal
     * @param valid If the loc exists.
     */
    set hasLocalizer(valid) {
        this._hasLocalizer = valid;
        if (!this._hasLocalizer) {
            this.localizerCourse = -1;
        }
        else if (this._hasLocalizer && this.localizerCourseHandler && this.localizerCourseHandler !== null
            && this._localizerCourse !== null && this._localizerCourse >= 0) {
            this.localizerCourseHandler(this._localizerCourse, this.srcId);
        }
    }
    /**
     * Get if the radio has a loc.
     * @returns The loc bool.
     */
    get hasLocalizer() {
        return this._hasLocalizer;
    }
    /**
     * Set a new localizerCourse
     * @param course The new localizer course.
     */
    set localizerCourse(course) {
        this._localizerCourse = course !== null ? course * (180 / Math.PI) : -1;
        if (this._localizerCourse !== -1 && this.localizerCourseHandler !== undefined) {
            this.localizerCourseHandler(this._localizerCourse, this.srcId);
        }
    }
    /**
     * Get the localizerCourse.
     * @returns The glideslopeDeviation in degrees.
     */
    get localizerCourse() {
        return this._localizerCourse;
    }
    /**
     * Set whether the nav radio has a GS signal
     * @param valid If the GS exists.
     */
    set hasGlideslope(valid) {
        this._hasGlideslope = valid;
        if (this.glideslopeDeviationHandler !== undefined) {
            this.glideslopeDeviationHandler(this.glideslopeDeviation, this.srcId);
        }
    }
    /**
     * Get if the radio has a glideslope.
     * @returns The glideslope bool.
     */
    get hasGlideslope() {
        return this._hasGlideslope;
    }
    /**
     * Set a new _glideslopeDeviation
     * @param deviation The new deviation in points.
     */
    set glideslopeDeviation(deviation) {
        this._glideslopeDeviation = deviation;
        if (this.valid && this.activeCdi && this.hasGlideslope && this.glideslopeDeviationHandler !== undefined) {
            this.glideslopeDeviationHandler(deviation, this.srcId);
        }
    }
    /**
     * Get the glideslopeDeviation.
     * @returns The glideslopeDeviation in degrees.
     */
    get glideslopeDeviation() {
        return this._glideslopeDeviation;
    }
    /**
     * Set a new _glideslopeAngle
     * @param angle The new angle in degrees.
     */
    set glideslopeAngle(angle) {
        this._glideslopeAngle = angle;
        if (this.valid && this.activeCdi && this.hasGlideslope && this.glideslopeAngleHandler !== undefined) {
            this.glideslopeAngleHandler(angle, this.srcId);
        }
    }
    /**
     * Get the glideslopeAngle.
     * @returns The glideslopeAngle in degrees.
     */
    get glideslopeAngle() {
        return this._glideslopeAngle;
    }
    /**
     * Set whether there's a valid DME signal.
     * @param hasDme Whether a nav signal is present or not.
     */
    set hasDme(hasDme) {
        this._hasDme = hasDme;
        if (this.distHandler !== undefined) {
            // If hasDme state is changing, we need to publish a new distance event.
            // The getter for this.distance handles whether there's a DME signal or not.
            this.distHandler(this.distance, this.srcId);
        }
    }
    /**
     * Get whether there's a valid DME signal.
     * @returns A boolean indicatind presence of DME.
     */
    get hasDme() {
        return this._hasDme;
    }
    /**
     * Get the nav radio magvar.
     * @returns The magvar value.
     */
    get magneticVariation() {
        return this._magneticVariation;
    }
    /**
     * Set a new nav radio magvar
     * @param magvar The new nav radio magvar.
     */
    set magneticVariation(magvar) {
        this._magneticVariation = magvar;
        if (this.valid && this.activeCdi && this.magvarHandler !== undefined) {
            this.magvarHandler(magvar, this.srcId);
        }
    }
    /**
     * Get if the frequency is for a localizer.
     * @returns a bool of whether the freq is for a localizer.
     */
    get isLocalizerFrequency() {
        return this._isLocalizerFrequency;
    }
    /**
     * Sets if a frequency is for a localizer
     * @param isLocFreq whether the freq is a localizer freq.
     */
    set isLocalizerFrequency(isLocFreq) {
        if (this.isLocalizerFrequencyHandler !== undefined) {
            this.isLocalizerFrequencyHandler(isLocFreq, this.srcId);
        }
        this._isLocalizerFrequency = isLocFreq;
    }
    /**
     * Set the nav signal strength.
     * @param signal The signal strength as a number.
     */
    set signal(signal) {
        if ((this._signal == 0) != (signal == 0)) {
            // if we gain or lose signal, we need to update our ident.
            this._signal = signal;
            if (this.identHandler !== undefined) {
                // The getter for ident will handle whether we have signal or not.
                this.identHandler(this.ident, this.srcId);
            }
        }
        else {
            // repaet this from above to avoid a needless temporary assigment.
            this._signal = signal;
        }
    }
    /**
     * Set validity.
     * @param valid Whether we are valid or not.
     */
    set valid(valid) {
        // TODO Make sure this matches up with new activeBrg logic
        this._valid = valid;
        this.validHandler && this.validHandler(valid, this.srcId);
        if (valid && this.activeBrg) {
            if (this.identHandler !== undefined) {
                this.identHandler(this._ident, this.srcId);
            }
            if (this.brgHandler !== undefined) {
                this.brgHandler(this._bearing, this.srcId);
            }
            if (this.distHandler !== undefined) {
                this.distHandler(this._distance, this.srcId);
            }
            if (this.toFromHandler !== undefined) {
                this.toFromHandler(this._toFrom, this.srcId);
            }
            if (this.localizerCourseHandler !== undefined) {
                this.localizerCourseHandler(this._localizerCourse, this.srcId);
            }
            if (this.glideslopeDeviationHandler !== undefined) {
                this.glideslopeDeviationHandler(this._glideslopeDeviation, this.srcId);
            }
            if (this.magvarHandler !== undefined) {
                this.magvarHandler(this._magneticVariation, this.srcId);
            }
            if (this.isLocalizerFrequencyHandler !== undefined) {
                this.isLocalizerFrequencyHandler(this._isLocalizerFrequency, this.srcId);
            }
            if (this.obsHandler !== undefined) {
                this.obsHandler(this._obs, this.srcId);
            }
        }
        else if (this.activeBrg) {
            if (this.identHandler !== undefined) {
                this.identHandler(null, this.srcId);
            }
            if (this.brgHandler !== undefined) {
                this.brgHandler(null, this.srcId);
            }
            if (this.distHandler !== undefined) {
                this.distHandler(null, this.srcId);
            }
            if (this.toFromHandler !== undefined) {
                this.toFromHandler(this._toFrom, this.srcId);
            }
            if (this.localizerCourseHandler !== undefined) {
                this.localizerCourseHandler(null, this.srcId);
            }
            if (this.glideslopeDeviationHandler !== undefined) {
                this.glideslopeDeviationHandler(null, this.srcId);
            }
            if (this.magvarHandler !== undefined) {
                this.magvarHandler(null, this.srcId);
            }
            if (this.isLocalizerFrequencyHandler !== undefined) {
                this.isLocalizerFrequencyHandler(this._isLocalizerFrequency, this.srcId);
            }
            if (this.obsHandler !== undefined) {
                this.obsHandler(this._obs, this.srcId);
            }
        }
    }
    /**
     * Get validity
     * @returns A boolean indicating whether this is valid
     */
    get valid() {
        return this._valid;
    }
    /**
     * Set as active for bearing information
     * @param active Whether we are active for bearing info.
     */
    set activeBrg(active) {
        if (active) {
            this._activeForCount++;
        }
        else if (this._activeForCount > 0) {
            this._activeForCount--;
        }
        this.validHandler && this.validHandler(this.valid, this.srcId);
        if (!this.activeBrg || !this.valid) {
            if (this.identHandler !== undefined) {
                this.identHandler(null, this.srcId);
            }
            if (this.brgHandler !== undefined) {
                this.brgHandler(null, this.srcId);
            }
            if (this.distHandler !== undefined) {
                this.distHandler(null, this.srcId);
            }
            if (this.toFromHandler !== undefined) {
                this.toFromHandler(this._toFrom, this.srcId);
            }
            if (this.isLocalizerFrequencyHandler !== undefined) {
                this.isLocalizerFrequencyHandler(this._isLocalizerFrequency, this.srcId);
            }
        }
        else {
            if (this.identHandler !== undefined) {
                this.identHandler(this.ident, this.srcId);
            }
            if (this.brgHandler !== undefined) {
                this.brgHandler(this.bearing, this.srcId);
            }
            if (this.distHandler !== undefined) {
                this.distHandler(this.distance, this.srcId);
            }
            if (this.toFromHandler !== undefined) {
                this.toFromHandler(this._toFrom, this.srcId);
            }
            if (this.isLocalizerFrequencyHandler !== undefined) {
                this.isLocalizerFrequencyHandler(this._isLocalizerFrequency, this.srcId);
            }
        }
    }
    /**
     * Are we active for bearing information?
     * @returns Our active state
     */
    get activeBrg() {
        return this._activeForCount > 0;
    }
    /**
     * Set this at the active deviation source or not
     * @param active Whether we are active for publishing deviation info.
     */
    set activeCdi(active) {
        this._activeCdi = active;
        if (active && this.deviationHandler !== undefined) {
            this.deviationHandler(this._deviation, this.srcId);
        }
    }
    /**
     * Are we active for CDI data?
     * @returns Boolean of our CDI active state
     */
    get activeCdi() {
        return this._activeCdi;
    }
}
/**
 * A convenience class for creating a navproc configuration set.
 *
 * Implementers should instantiate this and then populate the sets with the
 * HEvents that their radio sends for various actions.
 */
export class NavProcessorConfig {
    constructor() {
        this.numNav = 2;
        this.numGps = 1;
        this.numAdf = 1;
        this.courseIncEvents = new Set();
        this.courseDecEvents = new Set();
        this.courseSyncEvents = new Set();
        this.additionalSources = new Array();
    }
}
/**
 * A publisher for navigation processor events.
 */
class NavProcPublisher extends BasePublisher {
    /**
     * Creates a NavProcPublisher
     * @param bus The event bus to publish to
     * @param pacer An optional pacer to use to control the rate of publishing
     */
    constructor(bus, pacer) {
        super(bus, pacer);
    }
    /**
     * Publish a new CDI source selection.
     * @param source The selected NavSource.
     */
    publishCdiSelect(source) {
        this.publish('cdi_select', source, true);
    }
    /**
     * Publish a new CDI deviation
     * @param deviation The deviation
     * @param source the source for thes deviation
     */
    publishDeviation(deviation, source) {
        this.publish('cdi_deviation', { source: source, deviation: deviation });
    }
    /**
     * Publish a new OBS heading
     * @param heading The heading
     * @param source The source for this heading.
     */
    publishObsHeading(heading, source) {
        this.publish('obs_set', { source: source, heading: heading });
    }
    /**
     * Publish new validity information.
     * @param index The bearing index number to update.
     * @param valid The validity state of that berign source.
     */
    publishBrgValidity(index, valid) {
        this.publish('brg_validity', { index: index, valid: valid }, true);
    }
    /**
     * Publish a new bearing source
     * @param index The source number.
     * @param source The source name.
     */
    publishBrgSrc(index, source) {
        this.publish('brg_source', { index: index, source: source });
    }
    /**
     * Publish heading of a bearing source.
     * @param index The index number to update.
     * @param direction The direction.
     */
    publishBrgDir(index, direction) {
        this.publish('brg_direction', { index: index, direction: direction });
    }
    /**
     * Publish distance to a bearing source.
     * @param index The source number.
     * @param distance The distance in NMs.
     */
    publishBrgDist(index, distance) {
        this.publish('brg_distance', { index: index, distance: distance });
    }
    /**
     * Publish distance to a bearing source.
     * @param index The source number.
     * @param ident The ident as a string.
     * @param isLoc is this source a loc.
     */
    publishBrgIdent(index, ident, isLoc) {
        this.publish('brg_ident', { index: index, ident: ident, isLoc: isLoc });
    }
    // /**
    //  * Publish distance to a bearing source.
    //  * @param index The source number.
    //  * @param isLoc The ident as a string.
    //  */
    // public publishBrgIsLoc(index: number, isLoc: boolean | null): void {
    //     this.publish('brg_is_loc', { index: index, isLoc: isLoc });
    // }
    /**
     * Publish to/from value for a nav source.
     * @param toFrom The to/from enum value.
     * @param source The nav radio source.
     */
    publishToFrom(toFrom, source) {
        this.publish('vor_to_from', { toFrom: toFrom, source: source });
    }
    /**
     * Publish localizer value for a nav source.
     * @param localizer is the localizer data
     * @param source The nav radio source.
     */
    publishLocalizer(localizer, source) {
        this.publish('localizer', { isValid: localizer.isValid, course: localizer.course, source: source });
    }
    /**
     * Publish if the nav source is tuned to a localizer frequency.
     * @param isLoc is a bool whether or not the nav source is a loc frequency
     * @param source The nav radio source.
     */
    publishIsLocalizerFrequency(isLoc, source) {
        this.publish('is_localizer_frequency', { isLocalizer: isLoc.isLocalizer, source: source });
    }
    /**
     * Publish gliseslope value for a nav source.
     * @param glideslope is the localizer data
     * @param source The nav radio source.
     */
    publishGlideslope(glideslope, source) {
        this.publish('glideslope', { isValid: glideslope.isValid, deviation: glideslope.deviation, gsAngle: glideslope.gsAngle, source: source });
    }
    /**
     * Publish magvar value for a nav source.
     * @param variation is the magnetic variation
     * @param source The nav radio source.
     */
    publishMagvar(variation, source) {
        if (variation !== null) {
            this.publish('mag_variation', { variation: variation, source: source });
        }
    }
    /**
     * Publish marker beacon state value.
     * @param state is the marker beacon state value
     */
    publishMarkerBeacon(state) {
        this.publish('mkr_bcn_state', state);
    }
    /**
     * Publish DME state.
     * @param state is the has_dme state value
     * @param distance is the dme distance value.
     * @param source The nav radio source.
     */
    publishDmeState(state, distance, source) {
        this.publish('dme_state', { hasDme: state, dmeDistance: distance, source: source });
    }
    /**
     * Publish GPS OBS State.
     * @param state is the GPS OBS Active State
     */
    publishGpsObsState(state) {
        this.publish('gps_obs_active', state, true);
    }
    /**
     * Publish GPS OBS Value.
     * @param value is the GPS OBS heading value
     */
    publishGpsObsValue(value) {
        this.publish('gps_obs_value', value, true);
    }
}
/**
 * The core of tne nav processor
 */
export class NavProcessor {
    /**
     * Create a NavProcessor.
     * @param bus The event bus to publish to.
     * @param config A config object defining our radio options.
     */
    constructor(bus, config) {
        this.brgSrcAsoboMap = [-1, 0, 1, 3, 2];
        /**
         * Handle HEvents
         * @param event The hEvent name
         */
        this.eventHandler = (event) => {
            if (this.config.courseIncEvents.has(event)) {
                this.handleCrsInc();
            }
            else if (this.config.courseDecEvents.has(event)) {
                this.handleCrsDec();
            }
            else if (this.config.courseSyncEvents.has(event)) {
                this.handleCrsSync();
            }
        };
        /**
         * Toggles CDI between GPS and NAV1.
         */
        this.onCdiGpsToggle = () => {
            const src = this.navSources[this.cdiSourceIdx];
            if (src.srcId.type === NavSourceType.Gps) {
                this.switchCdiSrc();
            }
            else {
                this.switchCdiSrc(3);
            }
        };
        this.bus = bus;
        this.config = config;
        this.publisher = new NavProcPublisher(bus);
        this.simVarPublisher = config.simVarPublisher ? config.simVarPublisher : new NavProcSimVarPublisher(this.bus);
        this.hEvents = bus.getSubscriber();
        this.controlSubscriber = bus.getSubscriber();
        this.simVarSubscriber = new EventSubscriber(bus);
        this.navComSubscriber = bus.getSubscriber();
        this.navSources = new Array();
        this.bearingSourceIdxs = [-1, -1];
        this.cdiSourceIdx = 0;
    }
    /**
     * Initialize a nav processor
     */
    init() {
        this.publisher.startPublish();
        this.simVarPublisher.startPublish();
        this.hEvents.on('hEvent').handle(this.eventHandler);
        this.controlSubscriber.on('cdi_src_switch').handle(() => {
            this.switchCdiSrc();
        });
        this.controlSubscriber.on('cdi_src_set').handle((src) => {
            if (src.type === NavSourceType.Gps) {
                this.switchCdiSrc(3);
            }
            else if (src.type === NavSourceType.Nav) {
                this.switchCdiSrc(src.index - 1);
            }
        });
        this.controlSubscriber.on('cdi_src_gps_toggle').handle(this.onCdiGpsToggle);
        this.controlSubscriber.on('init_cdi').handle(this.initCdi.bind(this));
        this.controlSubscriber.on('brg_src_switch').handle(this.cycleBrgSrc.bind(this));
        // TODO Determine why this throttle doesn't work but does on the client end.
        this.simVarSubscriber.on('mkr_bcn_state_simvar').whenChanged().handle((state) => {
            this.publisher.publishMarkerBeacon(state);
        });
        this.simVarSubscriber.on('gps_obs_active_simvar').whenChanged().handle((state) => {
            this.publisher.publishGpsObsState(state);
        });
        this.simVarSubscriber.on('gps_obs_value_simvar').whenChangedBy(1).handle((value) => {
            this.publisher.publishGpsObsValue(value);
        });
        for (let i = 1; i <= this.config.numNav; i++) {
            const src = new NavSourceBase({ type: NavSourceType.Nav, index: i });
            src.deviationHandler = this.publisher.publishDeviation.bind(this.publisher);
            src.obsHandler = this.publisher.publishObsHeading.bind(this.publisher);
            src.distHandler = this.onBrgDistance.bind(this);
            src.brgHandler = this.onBrgDirection.bind(this);
            src.identHandler = this.onBrgIdent.bind(this);
            src.toFromHandler = this.publisher.publishToFrom.bind(this.publisher);
            src.localizerCourseHandler = this.onLocalizerCourse.bind(this);
            src.glideslopeDeviationHandler = this.onGlideslopeDeviation.bind(this);
            src.magvarHandler = this.publisher.publishMagvar.bind(this.publisher);
            src.isLocalizerFrequencyHandler = this.onIsLocalizerFrequency.bind(this);
            src.glideslopeAngleHandler = this.onGlideslopeAngle.bind(this);
            src.validHandler = this.onBrgValidity.bind(this);
            this.simVarSubscriber.on(`nav_cdi_${i}`).whenChangedBy(1).handle((deviation) => {
                src.deviation = deviation;
            });
            this.simVarSubscriber.on(`nav_obs_${i}`).whenChangedBy(1).handle((obs) => {
                src.obs = obs;
            });
            this.simVarSubscriber.on(`nav_dme_${i}`).whenChangedBy(0.1).handle((distance) => {
                src.distance = distance;
                // TODO Fold DME logic into the distance handler.
                this.onDme(src.hasDme, src.distance, src.srcId);
            });
            this.simVarSubscriber.on(`nav_radial_${i}`).handle((bearing) => {
                src.bearing = bearing;
            });
            this.simVarSubscriber.on(`nav_ident_${i}`).whenChanged().handle((ident) => {
                src.ident = ident;
            });
            this.simVarSubscriber.on(`nav_signal_${i}`).withPrecision(0).handle((signal) => {
                src.signal = signal;
            });
            this.simVarSubscriber.on(`nav_has_nav_${i}`).whenChanged().handle((valid) => {
                src.valid = !!valid;
            });
            this.simVarSubscriber.on(`nav_has_dme_${i}`).whenChanged().handle((dme) => {
                src.hasDme = !!dme;
                // TODO Fold DME logic into the distance handler.
                this.onDme(src.hasDme, src.distance, src.srcId);
            });
            this.simVarSubscriber.on(`nav_to_from_${i}`).whenChanged().handle((value) => {
                src.toFrom = value;
            });
            this.simVarSubscriber.on(`nav_localizer_${i}`).whenChanged().handle((localizer) => {
                src.hasLocalizer = localizer;
            });
            this.simVarSubscriber.on(`nav_localizer_crs_${i}`).whenChanged().handle((locCourse) => {
                src.localizerCourse = locCourse;
            });
            this.simVarSubscriber.on(`nav_glideslope_${i}`).whenChanged().handle((gs) => {
                src.hasGlideslope = gs;
            });
            this.simVarSubscriber.on(`nav_gs_error_${i}`).whenChanged().handle((gsDev) => {
                src.glideslopeDeviation = gsDev;
            });
            this.simVarSubscriber.on(`nav_raw_gs_${i}`).whenChanged().handle((rawGs) => {
                src.glideslopeAngle = rawGs;
            });
            this.simVarSubscriber.on(`nav_magvar_${i}`).whenChanged().handle((magvar) => {
                src.magneticVariation = magvar;
            });
            this.navComSubscriber.on('set_radio_state').handle((radioState) => {
                if (radioState.radioType === RadioType.Nav && radioState.index == i && radioState.activeFrequency) {
                    src.isLocalizerFrequency = this.frequencyIsLocalizer(radioState.activeFrequency);
                }
            });
            this.navComSubscriber.on('set_frequency').handle((setFrequency) => {
                if (setFrequency.radio.radioType === RadioType.Nav && setFrequency.radio.index == i
                    && setFrequency.bank == FrequencyBank.Active) {
                    src.isLocalizerFrequency = this.frequencyIsLocalizer(setFrequency.frequency);
                    for (let j = 0; j < this.bearingSourceIdxs.length; j++) {
                        if (this.navSources[this.bearingSourceIdxs[j]] !== undefined) {
                            const source = this.navSources[this.bearingSourceIdxs[j]].srcId;
                            if (source.type === NavSourceType.Nav && source.index === i) {
                                this.setBrgSrc(j, this.bearingSourceIdxs[j]);
                            }
                        }
                    }
                }
            });
            this.navSources.push(src);
        }
        // TODO Add support for multiple GPSes
        if (this.config.numGps > 0) {
            // Set the CDI source to the first GPS (which, since we're zero-indexed, is the
            // same as the number of nav radios.
            this.cdiSourceIdx = this.config.numNav;
            const src = new NavSourceBase({ type: NavSourceType.Gps, index: 1 });
            src.valid = true;
            src.deviationHandler = this.publisher.publishDeviation.bind(this.publisher);
            src.obsHandler = this.publisher.publishObsHeading.bind(this.publisher);
            src.distHandler = this.onBrgDistance.bind(this);
            src.brgHandler = this.onBrgDirection.bind(this);
            src.identHandler = this.onBrgIdent.bind(this);
            this.simVarSubscriber.on('gps_xtk').whenChangedBy(1).handle((deviation) => {
                src.deviation = deviation;
            });
            this.simVarSubscriber.on('gps_dtk').whenChangedBy(1).handle((obs) => {
                src.obs = obs;
            });
            this.simVarSubscriber.on('gps_wp_bearing').withPrecision(2).handle((brg) => {
                // The nav source bearing expects to be a radial, not the bearing to the
                // waypoint.  When we get the bearing from the GPS, we need to invert it
                // so the NavSource knows how to handle it correctly.
                // TODO Make bearing handling in NavSourceBase more consistent.
                brg = (brg + Math.PI) % (2 * Math.PI);
                src.bearing = brg;
            });
            this.navSources.push(src);
        }
        if (this.config.numAdf > 0) {
            const src = new NavSourceBase({ type: NavSourceType.Adf, index: 1 });
            src.valid = false;
            src.signal = 0;
            src.brgHandler = this.onBrgDirection.bind(this);
            src.identHandler = this.onBrgIdent.bind(this);
            src.validHandler = this.onBrgValidity.bind(this);
            this.simVarSubscriber.on('adf_signal_1').withPrecision(0).handle((signal) => {
                src.signal = signal;
                if (signal > 0) {
                    if (!src.valid) {
                        src.valid = true;
                    }
                }
                else {
                    if (src.valid) {
                        src.valid = false;
                    }
                }
            });
            this.navComSubscriber.on('adf_active_frequency_1').handle((freq) => {
                if (src.ident !== freq.toFixed(1)) {
                    src.ident = freq.toFixed(1);
                }
            });
            this.simVarSubscriber.on('adf_bearing_1').withPrecision(2).handle((brg) => {
                brg = (brg + Math.PI) % (2 * Math.PI);
                src.bearing = brg;
            });
            this.navSources.push(src);
        }
        for (const source of this.config.additionalSources) {
            this.addNavSource(source);
        }
        // HINT: Initialize cdi source based on FLT
        const initGpsDrivesNav1 = SimVar.GetSimVarValue('GPS DRIVES NAV1', SimVarValueType.Bool);
        this.cdiSourceIdx = initGpsDrivesNav1 ? this.getFirstNavSourceIndexByType(NavSourceType.Gps) : this.getFirstNavSourceIndexByType(NavSourceType.Nav);
        // HINT: Initialize bearing sources based on FLT (compatability with current missions)
        for (let i = 0; i < 2; i++) {
            const fltBrgSrc = SimVar.GetSimVarValue(`L:PFD_BRG${i + 1}_Source`, SimVarValueType.Number);
            this.setBrgSrc(i, this.brgSrcAsoboMap[fltBrgSrc]);
        }
    }
    /**
     * Add a custom nav source to the processor.
     * @param source The implementation of NavSourceBase to add.
     */
    addNavSource(source) {
        // TODO Add remaining handlers here for other custom nav sources.
        if (source.validHandler) {
            source.validHandler = this.onBrgValidity.bind(this);
        }
        if (source.brgHandler) {
            source.brgHandler = this.onBrgDirection.bind(this);
        }
        if (source.distHandler) {
            source.distHandler = this.onBrgDistance.bind(this);
        }
        if (source.identHandler) {
            source.identHandler = this.onBrgIdent.bind(this);
        }
        this.navSources.push(source);
    }
    /**
     * Process a CDI source change event.
     * @param index is specified if a specific cdiSourceIdx is requested
     */
    switchCdiSrc(index) {
        let src = this.navSources[this.cdiSourceIdx];
        src.activeCdi = false;
        if (index !== undefined && index < this.navSources.length && this.navSources[index].hasCdi) {
            this.cdiSourceIdx = index;
        }
        else if (index === undefined) {
            do {
                this.cdiSourceIdx = this.cdiSourceIdx < this.navSources.length - 1 ? this.cdiSourceIdx + 1 : 0;
            } while (!this.navSources[this.cdiSourceIdx].hasCdi);
        }
        else {
            console.warn(`switchCdiSrc: Unable to set CDI Source index ${index}`);
            return;
        }
        src = this.navSources[this.cdiSourceIdx];
        src.activeCdi = true;
        this.publisher.publishCdiSelect(src.srcId);
        if (src.obs) {
            this.publisher.publishObsHeading(src.obs, src.srcId);
        }
        if (src.toFrom) {
            this.publisher.publishToFrom(src.toFrom, src.srcId);
        }
        this.publisher.publishDmeState(src.hasDme, src.distance, src.srcId);
        SimVar.SetSimVarValue('GPS DRIVES NAV1', SimVarValueType.Bool, src.srcId.type === NavSourceType.Gps);
        if (src.srcId.type === NavSourceType.Nav) {
            SimVar.SetSimVarValue('AUTOPILOT NAV SELECTED', SimVarValueType.Number, src.srcId.index);
        }
    }
    /**srcent.
     */
    initCdi() {
        const src = this.navSources[this.cdiSourceIdx];
        src.activeCdi = true;
        this.publisher.publishCdiSelect(src.srcId);
        if (src.obs) {
            this.publisher.publishObsHeading(src.obs, src.srcId);
        }
        if (src.toFrom) {
            this.publisher.publishToFrom(src.toFrom, src.srcId);
        }
        this.publisher.publishDmeState(src.hasDme, src.distance, src.srcId);
        SimVar.SetSimVarValue('GPS DRIVES NAV1', SimVarValueType.Bool, src.srcId.type === NavSourceType.Gps);
    }
    /**
     * Process a bearing source change event.
     * @param index The index of the source to change (1-based).
     */
    cycleBrgSrc(index) {
        index--;
        let newNavSrcIndex = -1;
        if (this.bearingSourceIdxs[index] < this.navSources.length - 1) {
            newNavSrcIndex = this.bearingSourceIdxs[index] + 1;
        }
        this.setBrgSrc(index, newNavSrcIndex);
    }
    /**
     * Set the bearing source to the specified nav source index.
     * @param bearingSrcIndex The index of the bearing source to change (0-based).
     * @param navSrcIndex The index of the nav source to change to (0-based).
     */
    setBrgSrc(bearingSrcIndex, navSrcIndex) {
        if (bearingSrcIndex > this.bearingSourceIdxs.length - 1
            || navSrcIndex > this.navSources.length - 1) {
            console.warn(`setBrgSrc: Unable to set bearing source index ${bearingSrcIndex} and nav source index ${navSrcIndex}`);
            return;
        }
        const oldSrc = this.navSources[this.bearingSourceIdxs[bearingSrcIndex]];
        if (oldSrc !== undefined) {
            oldSrc.activeBrg = false;
        }
        this.bearingSourceIdxs[bearingSrcIndex] = navSrcIndex;
        const newSrc = this.navSources[this.bearingSourceIdxs[bearingSrcIndex]];
        this.publisher.publishBrgSrc(bearingSrcIndex, newSrc !== undefined ? newSrc.srcId : null);
        // HINT setting brg source LVar for mission compatability
        SimVar.SetSimVarValue(`L:PFD_BRG${bearingSrcIndex + 1}_Source`, SimVarValueType.Number, this.brgSrcAsoboMap.indexOf(navSrcIndex));
        if (newSrc !== undefined) {
            newSrc.activeBrg = true;
        }
        newSrc && this.publisher.publishBrgValidity(bearingSrcIndex, newSrc.valid);
        if (newSrc === undefined) {
            this.publisher.publishBrgIdent(bearingSrcIndex, null, false);
            this.publisher.publishBrgDir(bearingSrcIndex, null);
            this.publisher.publishBrgDist(bearingSrcIndex, null);
            //this.publisher.publishBrgIsLoc(index, false);
        }
    }
    /**
     * Handle a course inc event if we have a nav radio as our active CDI source.
     */
    handleCrsInc() {
        if (this.navSources[this.cdiSourceIdx].srcId.type != NavSourceType.Nav) {
            return;
        }
        switch (this.navSources[this.cdiSourceIdx].srcId.index) {
            case 1:
                SimVar.SetSimVarValue('K:VOR1_OBI_INC', 'number', 0);
                break;
            case 2:
                SimVar.SetSimVarValue('K:VOR2_OBI_INC', 'number', 0);
        }
    }
    /**
     * Handle a course dec event if we have a nav radio as our active CDI source.
     */
    handleCrsDec() {
        if (this.navSources[this.cdiSourceIdx].srcId.type != NavSourceType.Nav) {
            return;
        }
        switch (this.navSources[this.cdiSourceIdx].srcId.index) {
            case 1:
                SimVar.SetSimVarValue('K:VOR1_OBI_DEC', 'number', 0);
                break;
            case 2:
                SimVar.SetSimVarValue('K:VOR2_OBI_DEC', 'number', 0);
                break;
        }
    }
    /**
     * Handle a course sync event if we have a nav radio as our active CDI source.
     */
    handleCrsSync() {
        if (this.navSources[this.cdiSourceIdx].srcId.type != NavSourceType.Nav) {
            return;
        }
        switch (this.navSources[this.cdiSourceIdx].srcId.index) {
            case 1:
                SimVar.SetSimVarValue('K:VOR1_SET', 'number', this.navSources[0].bearing);
                break;
            case 2:
                SimVar.SetSimVarValue('K:VOR2_SET', 'number', this.navSources[1].bearing);
                break;
        }
    }
    /**
     * Handle a bearing validity change.
     * @param valid The new bearing validity
     * @param source The source of
     */
    onBrgValidity(valid, source) {
        if (this.bearingSourceIdxs) {
            for (let i = 0; i < this.bearingSourceIdxs.length; i++) {
                if (this.navSources[this.bearingSourceIdxs[i]] &&
                    this.navSources[this.bearingSourceIdxs[i]].srcId == source) {
                    this.publisher.publishBrgValidity(i, valid);
                }
            }
        }
    }
    // TODO Unify the next two functions
    /**
     * Handle a bearing distance change.
     * @param distance The distance to the source.
     * @param source The nav source ID.
     */
    onBrgDistance(distance, source) {
        for (let i = 0; i < this.bearingSourceIdxs.length; i++) {
            if (this.navSources[this.bearingSourceIdxs[i]] &&
                this.navSources[this.bearingSourceIdxs[i]].srcId == source &&
                !this.navSources[this.bearingSourceIdxs[i]].isLocalizerFrequency) {
                this.publisher.publishBrgDist(i, distance);
            }
        }
    }
    /**
     * Handle a bearing direction change.
     * @param direction The distance to the source.
     * @param source The nav source ID.
     */
    onBrgDirection(direction, source) {
        for (let i = 0; i < this.bearingSourceIdxs.length; i++) {
            if (this.navSources[this.bearingSourceIdxs[i]] &&
                this.navSources[this.bearingSourceIdxs[i]].srcId == source &&
                !this.navSources[this.bearingSourceIdxs[i]].isLocalizerFrequency) {
                this.publisher.publishBrgDir(i, direction);
            }
        }
    }
    /**
     * Handle a bearing ident change.
     * @param ident The ident of the source.
     * @param source The nav source ID.
     */
    onBrgIdent(ident, source) {
        for (let i = 0; i < this.bearingSourceIdxs.length; i++) {
            if (this.navSources[this.bearingSourceIdxs[i]] &&
                this.navSources[this.bearingSourceIdxs[i]].srcId == source) {
                this.publisher.publishBrgIdent(i, ident, this.navSources[this.bearingSourceIdxs[i]].isLocalizerFrequency);
                //this.publisher.publishBrgIsLoc(i, this.navSources[this.bearingSourceIdxs[i]].isLocalizerFrequency);
                if (this.navSources[this.bearingSourceIdxs[i]].isLocalizerFrequency) {
                    this.publisher.publishBrgDir(i, null);
                    this.publisher.publishBrgDist(i, null);
                }
                else {
                    this.publisher.publishBrgSrc(i, source);
                }
            }
        }
    }
    /**
     * Handle a localizer course change.
     * @param course The localizer course of the source.
     * @param source The nav source ID.
     */
    onLocalizerCourse(course, source) {
        for (let i = 0; i < this.navSources.length; i++) {
            if (this.navSources[i] && this.navSources[i].srcId == source && this.navSources[i].hasLocalizer && course !== null) {
                const localizer = { isValid: true, course: course, source: source };
                this.publisher.publishLocalizer(localizer, source);
            }
        }
    }
    /**
     * Handle a glideslope deviation change.
     * @param deviation The glideslope deviation of the source.
     * @param source The nav source ID.
     */
    onGlideslopeDeviation(deviation, source) {
        for (let i = 0; i < this.navSources.length; i++) {
            const navSource = this.navSources[i];
            if (navSource && navSource.srcId == source && deviation !== null && navSource.glideslopeAngle) {
                const glideslope = { isValid: this.navSources[i].hasGlideslope, deviation: deviation, gsAngle: navSource.glideslopeAngle, source: source };
                this.publisher.publishGlideslope(glideslope, source);
            }
        }
    }
    /**
     * Handle a glideslope angle change.
     * @param angle The glideslope angle of the source.
     * @param source The nav source ID.
     */
    onGlideslopeAngle(angle, source) {
        for (let i = 0; i < this.navSources.length; i++) {
            const navSource = this.navSources[i];
            if (navSource && navSource.srcId == source && navSource.deviation && angle !== null) {
                const glideslope = { isValid: this.navSources[i].hasGlideslope, deviation: navSource.deviation, gsAngle: angle, source: source };
                this.publisher.publishGlideslope(glideslope, source);
            }
        }
    }
    /**
     * Determine whether a set frequency is a localizer frequency.
     * @param frequency The frequency to evaluate.
     * @returns a bool true if the frequency is a loc freq.
     */
    frequencyIsLocalizer(frequency) {
        const roundedFreq = Math.round(frequency * 100) / 100;
        return RadioUtils.isLocalizerFrequency(roundedFreq);
    }
    /**
     * Publishers whether a set frequency is a localizer frequency.
     * @param isLoc whether the freq is a loc.
     * @param source the selected nav source.
     */
    onIsLocalizerFrequency(isLoc, source) {
        if (isLoc !== null) {
            const loc = { isLocalizer: isLoc, source: source };
            this.publisher.publishIsLocalizerFrequency(loc, source);
        }
    }
    /**
     * Publishers dme distance info.  This should be replaced by a generalization of
     * BearingDistance that provides the distance to any nav source if it has DME.
     * @param hasDme whether the radio has dme.
     * @param distance is the dme distance.
     * @param source the selected nav source.
     */
    onDme(hasDme, distance, source) {
        this.publisher.publishDmeState(hasDme ? hasDme : false, distance ? distance : -1, source);
    }
    /**
     * Gets the index of the first nav source of the given type.
     * @param type The type of nav source to find.
     * @returns The nav source index.
     */
    getFirstNavSourceIndexByType(type) {
        return this.navSources.findIndex(source => source.srcId.type === type);
    }
    /**
     * Perform events for the update loop.
     */
    onUpdate() {
        this.simVarPublisher.onUpdate();
    }
}
