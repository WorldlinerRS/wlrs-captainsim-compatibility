/**
 * The transition type to which a flight path vector belongs.
 */
export var FlightPathVectorFlags;
(function (FlightPathVectorFlags) {
    FlightPathVectorFlags[FlightPathVectorFlags["None"] = 0] = "None";
    /** A turn to a specific course. */
    FlightPathVectorFlags[FlightPathVectorFlags["TurnToCourse"] = 1] = "TurnToCourse";
    /** An arcing turn to a specific point. */
    FlightPathVectorFlags[FlightPathVectorFlags["Arc"] = 2] = "Arc";
    /** A direct course to a specific point. */
    FlightPathVectorFlags[FlightPathVectorFlags["Direct"] = 4] = "Direct";
    /** A path to intercept a specific course. */
    FlightPathVectorFlags[FlightPathVectorFlags["InterceptCourse"] = 8] = "InterceptCourse";
    /** Inbound leg of a hold. */
    FlightPathVectorFlags[FlightPathVectorFlags["HoldInboundLeg"] = 16] = "HoldInboundLeg";
    /** Outbound leg of a hold. */
    FlightPathVectorFlags[FlightPathVectorFlags["HoldOutboundLeg"] = 32] = "HoldOutboundLeg";
    /** A direct hold entry. */
    FlightPathVectorFlags[FlightPathVectorFlags["HoldDirectEntry"] = 64] = "HoldDirectEntry";
    /** A teardrop hold entry. */
    FlightPathVectorFlags[FlightPathVectorFlags["HoldTeardropEntry"] = 128] = "HoldTeardropEntry";
    /** A parallel hold entry. */
    FlightPathVectorFlags[FlightPathVectorFlags["HoldParallelEntry"] = 256] = "HoldParallelEntry";
    /** A course reversal. */
    FlightPathVectorFlags[FlightPathVectorFlags["CourseReversal"] = 512] = "CourseReversal";
    /** A turn from one leg to another. */
    FlightPathVectorFlags[FlightPathVectorFlags["LegToLegTurn"] = 1024] = "LegToLegTurn";
    /** An anticipated turn from one leg to another. */
    FlightPathVectorFlags[FlightPathVectorFlags["AnticipatedTurn"] = 2048] = "AnticipatedTurn";
    /** A fallback path. */
    FlightPathVectorFlags[FlightPathVectorFlags["Fallback"] = 4096] = "Fallback";
})(FlightPathVectorFlags || (FlightPathVectorFlags = {}));
/**
 * The details of procedures selected in the flight plan.
 */
export class ProcedureDetails {
    constructor() {
        /** The origin runway object, consisting of the index of the origin runway
         * in the origin runway information and the direction */
        this.originRunway = undefined;
        /** The index of the departure in the origin airport information. */
        this.departureIndex = -1;
        /** The index of the departure transition in the origin airport departure information. */
        this.departureTransitionIndex = -1;
        /** The index of the selected runway in the original airport departure information. */
        this.departureRunwayIndex = -1;
        /** The index of the arrival in the destination airport information. */
        this.arrivalIndex = -1;
        /** The index of the arrival transition in the destination airport arrival information. */
        this.arrivalTransitionIndex = -1;
        /** The index of the selected runway transition at the destination airport arrival information. */
        this.arrivalRunwayTransitionIndex = -1;
        /** The index of the apporach in the destination airport information.*/
        this.approachIndex = -1;
        /** The index of the approach transition in the destination airport approach information.*/
        this.approachTransitionIndex = -1;
        /**
         * The destination runway object, consisting of the index of the destination runway
         * in the destination runway information and the direction
         */
        this.destinationRunway = undefined;
    }
}
/**
 * A prototype for signalling application-specific type metadata for plan segments.
 */
export var FlightPlanSegmentType;
(function (FlightPlanSegmentType) {
    FlightPlanSegmentType["Origin"] = "Origin";
    FlightPlanSegmentType["Departure"] = "Departure";
    FlightPlanSegmentType["Enroute"] = "Enroute";
    FlightPlanSegmentType["Arrival"] = "Arrival";
    FlightPlanSegmentType["Approach"] = "Approach";
    FlightPlanSegmentType["Destination"] = "Destination";
    FlightPlanSegmentType["MissedApproach"] = "MissedApproach";
    FlightPlanSegmentType["RandomDirectTo"] = "RandomDirectTo";
})(FlightPlanSegmentType || (FlightPlanSegmentType = {}));
/**
 * A segment of a flight plan.
 */
export class FlightPlanSegment {
    /**
     * Creates a new FlightPlanSegment.
     * @param segmentIndex The index of the segment within the flight plan.
     * @param offset The leg offset within the original flight plan that
     * the segment starts at.
     * @param legs The legs in the flight plan segment.
     * @param segmentType The type of segment this is.
     * @param airway The airway associated with this segment, if any.
     */
    constructor(segmentIndex, offset, legs, segmentType = FlightPlanSegmentType.Enroute, airway) {
        this.segmentIndex = segmentIndex;
        this.offset = offset;
        this.legs = legs;
        this.segmentType = segmentType;
        this.airway = airway;
    }
}
/** An empty flight plan segment. */
FlightPlanSegment.Empty = new FlightPlanSegment(-1, -1, []);
/**
 * Bitflags describing a leg definition.
 */
export var LegDefinitionFlags;
(function (LegDefinitionFlags) {
    LegDefinitionFlags[LegDefinitionFlags["None"] = 0] = "None";
    LegDefinitionFlags[LegDefinitionFlags["DirectTo"] = 1] = "DirectTo";
    LegDefinitionFlags[LegDefinitionFlags["MissedApproach"] = 2] = "MissedApproach";
    LegDefinitionFlags[LegDefinitionFlags["Obs"] = 4] = "Obs";
    LegDefinitionFlags[LegDefinitionFlags["VectorsToFinal"] = 8] = "VectorsToFinal";
})(LegDefinitionFlags || (LegDefinitionFlags = {}));
export var SpeedType;
(function (SpeedType) {
    SpeedType[SpeedType["IAS"] = 0] = "IAS";
    SpeedType[SpeedType["MACH"] = 1] = "MACH";
})(SpeedType || (SpeedType = {}));
