import { BitFlags } from '../../math/BitFlags';
import { Subject } from '../../sub';
import { DisplayComponent, FSComponent } from '../FSComponent';
import { MapLayer } from './MapLayer';
import { MapProjection, MapProjectionChangeType } from './MapProjection';
/**
 * A component which displays a map. A map projects geographic coordinates onto a planar pixel grid. Each map component
 * maintains a MapProjection instance which handles the details of the projection. MapLayer objects added to the map
 * as children determine what is drawn on the map.
 */
export class MapComponent extends DisplayComponent {
    /** @inheritdoc */
    constructor(props) {
        var _a;
        super(props);
        this.layerEntries = [];
        this.lastUpdateTime = 0;
        this._isAwake = true;
        this.updateCycleHandler = this.update.bind(this);
        this.projectedSize = 'isSubscribable' in this.props.projectedSize ? this.props.projectedSize : Subject.create(this.props.projectedSize);
        const initialSize = this.projectedSize.get();
        if (this.props.projection !== undefined) {
            this.props.projection.set({ projectedSize: new Float64Array(initialSize) });
        }
        this.mapProjection = (_a = this.props.projection) !== null && _a !== void 0 ? _a : new MapProjection(initialSize[0], initialSize[1]);
    }
    /**
     * Gets the size of this map's projected window, in pixels.
     * @returns The size of this map's projected window.
     */
    getProjectedSize() {
        return this.mapProjection.getProjectedSize();
    }
    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether this map is awake.
     */
    get isAwake() {
        return this._isAwake;
    }
    /**
     * Puts this map to sleep. While asleep, this map will not be updated.
     */
    sleep() {
        this.setAwakeState(false);
    }
    /**
     * Wakes this map, allowing it to be updated.
     */
    wake() {
        this.setAwakeState(true);
    }
    /**
     * Sets this map's awake state. If the new awake state is the same as the current state, nothing will happen.
     * Otherwise, this map's layers will be notified that the map has either been woken or put to sleep.
     * @param isAwake The new awake state.
     */
    setAwakeState(isAwake) {
        if (this._isAwake === isAwake) {
            return;
        }
        this._isAwake = isAwake;
        this._isAwake ? this.onWake() : this.onSleep();
    }
    /** @inheritdoc */
    onAfterRender(thisNode) {
        var _a;
        this.mapProjection.addChangeListener(this.onMapProjectionChanged.bind(this));
        this.projectedSizeSub = this.projectedSize.sub(size => {
            this.mapProjection.set({ projectedSize: size });
        });
        (_a = this.props.updateFreq) === null || _a === void 0 ? void 0 : _a.sub(freq => {
            var _a;
            (_a = this.updateCycleSub) === null || _a === void 0 ? void 0 : _a.destroy();
            this.updateCycleSub = this.props.bus.getSubscriber()
                .on('realTime')
                .whenChanged()
                .atFrequency(freq)
                .handle(this.updateCycleHandler);
        }, true);
        this.attachLayers(thisNode);
    }
    /**
     * Scans this component's VNode sub-tree for MapLayer components and attaches them when found. Only the top-most
     * level of MapLayer components are attached; layers that are themselves children of other layers are not attached.
     * @param thisNode This component's VNode.
     */
    attachLayers(thisNode) {
        FSComponent.visitNodes(thisNode, node => {
            if (node.instance instanceof MapLayer) {
                this.attachLayer(node.instance);
                return true;
            }
            return false;
        });
    }
    /**
     * This method is called when the map is awakened.
     */
    onWake() {
        this.wakeLayers();
    }
    /**
     * Calls the onWake() method of this map's layers.
     */
    wakeLayers() {
        const len = this.layerEntries.length;
        for (let i = 0; i < len; i++) {
            this.layerEntries[i].layer.onWake();
        }
    }
    /**
     * This method is called when the map is put to sleep.
     */
    onSleep() {
        this.sleepLayers();
    }
    /**
     * Calls the onSleep() method of this map's layers.
     */
    sleepLayers() {
        const len = this.layerEntries.length;
        for (let i = 0; i < len; i++) {
            this.layerEntries[i].layer.onSleep();
        }
    }
    /**
     * This method is called when the map projection changes.
     * @param mapProjection This layer's map projection.
     * @param changeFlags The types of changes made to the projection.
     */
    onMapProjectionChanged(mapProjection, changeFlags) {
        if (BitFlags.isAll(changeFlags, MapProjectionChangeType.ProjectedSize)) {
            this.onProjectedSizeChanged();
        }
        const len = this.layerEntries.length;
        for (let i = 0; i < len; i++) {
            this.layerEntries[i].layer.onMapProjectionChanged(mapProjection, changeFlags);
        }
    }
    /**
     * Attaches a layer to this map component. If the layer is already attached, then this method has no effect.
     * @param layer The layer to attach.
     */
    attachLayer(layer) {
        if (this.layerEntries.findIndex(entry => entry.layer === layer) >= 0) {
            return;
        }
        const entry = new LayerEntry(layer);
        this.layerEntries.push(entry);
        entry.attach();
    }
    /**
     * Detaches a layer from this map component.
     * @param layer The layer to detach.
     * @returns Whether the layer was succesfully detached.
     */
    detachLayer(layer) {
        const index = this.layerEntries.findIndex(entry => entry.layer === layer);
        if (index >= 0) {
            const entry = this.layerEntries[index];
            entry.detach();
            this.layerEntries.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Updates this map.
     * @param time The current real time as a UNIX timestamp in milliseconds.
     */
    update(time) {
        if (!this._isAwake) {
            return;
        }
        this.onUpdated(time, time - this.lastUpdateTime);
        this.lastUpdateTime = time;
    }
    /**
     * This method is called once every update cycle.
     * @param time The current real time as a UNIX timestamp in milliseconds.
     * @param elapsed The elapsed time, in milliseconds, since the last update.
     */
    onUpdated(time, elapsed) {
        this.updateLayers(time, elapsed);
    }
    /**
     * Updates this map's attached layers.
     * @param time The current real time as a UNIX timestamp in milliseconds.
     * @param elapsed The elapsed time, in milliseconds, since the last update.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateLayers(time, elapsed) {
        const len = this.layerEntries.length;
        for (let i = 0; i < len; i++) {
            this.layerEntries[i].update(time);
        }
    }
    /** @inheritdoc */
    destroy() {
        var _a, _b;
        super.destroy();
        (_a = this.updateCycleSub) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.projectedSizeSub) === null || _b === void 0 ? void 0 : _b.destroy();
        const len = this.layerEntries.length;
        for (let i = 0; i < len; i++) {
            this.layerEntries[i].destroy();
        }
    }
}
/**
 * An entry for a map layer.
 */
class LayerEntry {
    /**
     * Constructor.
     * @param layer This entry's map layer.
     */
    constructor(layer) {
        this.layer = layer;
        this.updatePeriod = 0;
        this.lastUpdated = 0;
    }
    /**
     * Attaches this layer entry.
     */
    attach() {
        var _a, _b;
        (_a = this.updateFreqSub) === null || _a === void 0 ? void 0 : _a.destroy();
        this.updateFreqSub = (_b = this.layer.props.updateFreq) === null || _b === void 0 ? void 0 : _b.sub((freq) => {
            const clamped = Math.max(0, freq);
            this.updatePeriod = clamped === 0 ? 0 : 1000 / clamped;
        }, true);
        this.layer.onAttached();
    }
    /**
     * Updates this layer entry.
     * @param currentTime The current time as a UNIX timestamp.
     */
    update(currentTime) {
        if (currentTime - this.lastUpdated >= this.updatePeriod) {
            this.layer.onUpdated(currentTime, currentTime - this.lastUpdated);
            this.lastUpdated = currentTime;
        }
    }
    /**
     * Detaches this layer entry.
     */
    detach() {
        var _a;
        (_a = this.updateFreqSub) === null || _a === void 0 ? void 0 : _a.destroy();
        this.layer.onDetached();
    }
    /**
     * Destroys this layer entry. This will detach this entry's layer and destroy it.
     */
    destroy() {
        this.detach();
        this.layer.destroy();
    }
}
