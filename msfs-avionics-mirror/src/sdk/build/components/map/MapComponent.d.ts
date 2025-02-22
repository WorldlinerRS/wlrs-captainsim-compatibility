import { EventBus } from '../../data';
import { ReadonlyFloat64Array } from '../../math/VecMath';
import { Subscribable } from '../../sub/Subscribable';
import { ComponentProps, DisplayComponent, VNode } from '../FSComponent';
import { MapLayer } from './MapLayer';
import { MapModel } from './MapModel';
import { MapProjection } from './MapProjection';
/**
 * Component props for MapComponent.
 */
export interface MapComponentProps<M> extends ComponentProps {
    /** A map model. */
    model: MapModel<M>;
    /** The event bus. */
    bus: EventBus;
    /** The update frequency of the map, in hertz. */
    updateFreq?: Subscribable<number>;
    /** The size, as `[width, height]` in pixels, of the map component's projected window. */
    projectedSize: ReadonlyFloat64Array | Subscribable<ReadonlyFloat64Array>;
    /** A projection to inject. A default will be used if none is provided. */
    projection?: MapProjection;
}
/**
 * A component which displays a map. A map projects geographic coordinates onto a planar pixel grid. Each map component
 * maintains a MapProjection instance which handles the details of the projection. MapLayer objects added to the map
 * as children determine what is drawn on the map.
 */
export declare abstract class MapComponent<P extends MapComponentProps<any> = MapComponentProps<any>> extends DisplayComponent<P> {
    /**
     * This map component's projection model.
     */
    readonly mapProjection: MapProjection;
    private readonly layerEntries;
    private readonly projectedSize;
    private lastUpdateTime;
    private _isAwake;
    private updateCycleSub?;
    private readonly updateCycleHandler;
    private projectedSizeSub?;
    /** @inheritdoc */
    constructor(props: P);
    /**
     * Gets the size of this map's projected window, in pixels.
     * @returns The size of this map's projected window.
     */
    getProjectedSize(): ReadonlyFloat64Array;
    /**
     * Whether this map is awake.
     */
    get isAwake(): boolean;
    /**
     * Puts this map to sleep. While asleep, this map will not be updated.
     */
    sleep(): void;
    /**
     * Wakes this map, allowing it to be updated.
     */
    wake(): void;
    /**
     * Sets this map's awake state. If the new awake state is the same as the current state, nothing will happen.
     * Otherwise, this map's layers will be notified that the map has either been woken or put to sleep.
     * @param isAwake The new awake state.
     */
    private setAwakeState;
    /** @inheritdoc */
    onAfterRender(thisNode: VNode): void;
    /**
     * Scans this component's VNode sub-tree for MapLayer components and attaches them when found. Only the top-most
     * level of MapLayer components are attached; layers that are themselves children of other layers are not attached.
     * @param thisNode This component's VNode.
     */
    protected attachLayers(thisNode: VNode): void;
    /**
     * This method is called when the map is awakened.
     */
    protected onWake(): void;
    /**
     * Calls the onWake() method of this map's layers.
     */
    protected wakeLayers(): void;
    /**
     * This method is called when the map is put to sleep.
     */
    protected onSleep(): void;
    /**
     * Calls the onSleep() method of this map's layers.
     */
    protected sleepLayers(): void;
    /**
     * This method is called when the map projection changes.
     * @param mapProjection This layer's map projection.
     * @param changeFlags The types of changes made to the projection.
     */
    protected onMapProjectionChanged(mapProjection: MapProjection, changeFlags: number): void;
    /**
     * This method is called when the size of this map's projected window changes.
     */
    protected abstract onProjectedSizeChanged(): void;
    /**
     * Attaches a layer to this map component. If the layer is already attached, then this method has no effect.
     * @param layer The layer to attach.
     */
    protected attachLayer(layer: MapLayer): void;
    /**
     * Detaches a layer from this map component.
     * @param layer The layer to detach.
     * @returns Whether the layer was succesfully detached.
     */
    protected detachLayer(layer: MapLayer): boolean;
    /**
     * Updates this map.
     * @param time The current real time as a UNIX timestamp in milliseconds.
     */
    update(time: number): void;
    /**
     * This method is called once every update cycle.
     * @param time The current real time as a UNIX timestamp in milliseconds.
     * @param elapsed The elapsed time, in milliseconds, since the last update.
     */
    protected onUpdated(time: number, elapsed: number): void;
    /**
     * Updates this map's attached layers.
     * @param time The current real time as a UNIX timestamp in milliseconds.
     * @param elapsed The elapsed time, in milliseconds, since the last update.
     */
    protected updateLayers(time: number, elapsed: number): void;
    /** @inheritdoc */
    destroy(): void;
}
//# sourceMappingURL=MapComponent.d.ts.map