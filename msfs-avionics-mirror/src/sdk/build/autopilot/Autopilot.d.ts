import { EventBus } from '../data';
import { FlightPlanner } from '../flightplan';
import { NavSourceId } from '../instruments';
import { APAltitudeModes, APConfig, APLateralModes, APValues, APVerticalModes } from './APConfig';
import { PlaneDirector } from './directors/PlaneDirector';
import { APModePressEvent, APStateManager } from './managers/APStateManager';
import { NavToNavManager } from './managers/NavToNavManager';
import { VNavManager } from './managers/VNavManager';
import { VNavAltCaptureType } from './VerticalNavigation';
/**
 * A collection of autopilot plane directors.
 */
export declare type APDirectors = {
    /** The autopilot's heading mode director. */
    readonly headingDirector?: PlaneDirector;
    /** The autopilot's roll mode director. */
    readonly rollDirector?: PlaneDirector;
    /** The autopilot's wings level mode director. */
    readonly wingLevelerDirector?: PlaneDirector;
    /** The autopilot's GPS LNAV mode director. */
    readonly gpssDirector?: PlaneDirector;
    /** The autopilot's VOR mode director. */
    readonly vorDirector?: PlaneDirector;
    /** The autopilot's LOC  mode director. */
    readonly locDirector?: PlaneDirector;
    /** The autopilot's back-course mode director. */
    readonly bcDirector?: PlaneDirector;
    /** The autopilot's pitch mode director. */
    readonly pitchDirector?: PlaneDirector;
    /** The autopilot's vertical speed mode director. */
    readonly vsDirector?: PlaneDirector;
    /** The autopilot's flight level change mode director. */
    readonly flcDirector?: PlaneDirector;
    /** The autopilot's altitude hold mode director. */
    readonly altHoldDirector?: PlaneDirector;
    /** The autopilot's wings altitude capture director. */
    readonly altCapDirector?: PlaneDirector;
    /** The autopilot's VNAV path mode director. */
    readonly vnavPathDirector?: PlaneDirector;
    /** The autopilot's GPS glidepath mode director. */
    readonly gpDirector?: PlaneDirector;
    /** The autopilot's ILS glideslope mode director. */
    readonly gsDirector?: PlaneDirector;
};
/**
 * An Autopilot.
 */
export declare class Autopilot {
    protected readonly bus: EventBus;
    protected readonly flightPlanner: FlightPlanner;
    protected readonly config: APConfig;
    readonly stateManager: APStateManager;
    /** This autopilot's plane directors. */
    readonly directors: APDirectors;
    /** This autopilot's nav-to-nav transfer manager. */
    readonly navToNavManager: NavToNavManager | undefined;
    /** This autopilot's VNav Manager. */
    readonly vnavManager: VNavManager | undefined;
    /** This autopilot's variable bank angle Manager. */
    readonly variableBankManager: Record<any, any> | undefined;
    protected cdiSource: NavSourceId;
    protected lateralModes: Map<APLateralModes, PlaneDirector>;
    protected verticalModes: Map<APVerticalModes, PlaneDirector>;
    protected verticalAltitudeArmed: APAltitudeModes;
    protected verticalApproachArmed: APVerticalModes;
    protected altCapArmed: boolean;
    protected lateralModeFailed: boolean;
    protected inClimb: boolean;
    protected currentAltitude: number;
    protected vnavCaptureType: VNavAltCaptureType;
    protected flightPlanSynced: boolean;
    /** Can be set to false in child classes to override behavior for certain aircraft. */
    protected requireApproachIsActiveForNavToNav: boolean;
    readonly apValues: APValues;
    protected autopilotInitialized: boolean;
    /**
     * Creates an instance of the Autopilot.
     * @param bus The event bus.
     * @param flightPlanner This autopilot's associated flight planner.
     * @param config This autopilot's configuration.
     * @param stateManager This autopilot's state manager.
     */
    constructor(bus: EventBus, flightPlanner: FlightPlanner, config: APConfig, stateManager: APStateManager);
    /**
     * Creates this autopilot's directors.
     * @param config This autopilot's configuration.
     * @returns This autopilot's directors.
     */
    private createDirectors;
    /**
     * Update method for the Autopilot.
     */
    update(): void;
    /**
     * This method runs each update cycle before the update occurs.
     */
    protected onBeforeUpdate(): void;
    /**
     * This method runs each update cycle after the update occurs.
     */
    protected onAfterUpdate(): void;
    /**
     * This method runs whenever the initialized state of the Autopilot changes.
     */
    protected onInitialized(): void;
    /**
     * Handles input from the State Manager when a lateral mode button is pressed.
     * @param data is the AP Lateral Mode Event Data
     */
    protected lateralPressed(data: APModePressEvent): void;
    /**
     * Handles input from the State Manager when a vertical mode button is pressed.
     * @param data is the AP Vertical Mode Event Data
     */
    protected verticalPressed(data: APModePressEvent): void;
    /**
     * Checks if a mode is active or armed and optionally deactivates it.
     * @param mode is the AP Mode to check.
     * @returns whether this mode was active or armed and subsequently disabled.
     */
    protected isLateralModeActivatedOrArmed(mode: APLateralModes): boolean;
    /**
     * Checks if a mode is active or armed and deactivates it.
     * @param mode is the AP Mode to check.
     * @returns whether this mode was active or armed and subsequently disabled.
     */
    protected deactivateArmedOrActiveVerticalMode(mode: APVerticalModes): boolean;
    /**
     * Handles input from the State Manager when the APPR button is pressed.
     * @param set is whether this event commands a specific set
     */
    protected approachPressed(set?: boolean): void;
    /**
     * Returns the AP Lateral Mode that can be armed.
     * @returns The AP Lateral Mode that can be armed.
     */
    protected getArmableApproachType(): APLateralModes;
    /**
     * Callback to set the lateral active mode.
     * @param mode is the mode being set.
     */
    protected setLateralActive(mode: APLateralModes): void;
    /**
     * Callback to set the lateral armed mode.
     * @param mode is the mode being set.
     */
    private setLateralArmed;
    /**
     * Callback to set the vertical active mode.
     * @param mode is the mode being set.
     */
    private setVerticalActive;
    /**
     * Callback to set the vertical armed mode.
     * @param mode is the mode being set.
     */
    private setVerticalArmed;
    /**
     * Callback to set the vertical approach armed mode.
     * @param mode is the mode being set.
     */
    private setVerticalApproachArmed;
    /**
     * Method called when the ALT button is pressed.
     */
    protected setAltHold(): void;
    /**
     * Initializes the Autopilot with the available lateral modes from the config.
     */
    private initLateralModes;
    /**
     * Initializes the Autopilot with the available Nav To Nav Manager.
     */
    private initNavToNavManager;
    /**
     * Initializes the Autopilot with the available VNav Manager.
     */
    protected initVNavManager(): void;
    /**
     * Initializes the Autopilot with the available vertical modes from the config.
     */
    private initVerticalModes;
    /**
     * Checks if all the active and armed modes are still in their proper state
     * and takes corrective action if not.
     */
    private checkModes;
    /**
     * Runs update on each of the active and armed modes.
     */
    private updateModes;
    /**
     * Checks and sets the proper armed altitude mode.
     */
    protected manageAltitudeCapture(): void;
    /**
     * Monitors subevents and bus events.
     */
    private monitorEvents;
    /**
     * Additional events to be monitored (to be overridden).
     */
    protected monitorAdditionalEvents(): void;
    /**
     * Manages the FD state and the modes when AP/FD are off.
     */
    protected handleApFdStateChange(): void;
    /**
     * Sets a sim AP mode.
     * @param mode The mode to set.
     * @param enabled Whether or not the mode is enabled or disabled.
     */
    private setSimAP;
    /**
     * Checks if the sim AP is in roll mode and sets it if not.
     */
    protected checkRollModeActive(): void;
    /**
     * Checks if the sim AP is in pitch mode and sets it if not.
     */
    private checkPitchModeActive;
}
//# sourceMappingURL=Autopilot.d.ts.map