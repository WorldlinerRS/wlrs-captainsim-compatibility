import { FSComponent, NodeReference, NumberUnitInterface, Subscribable, UnitFamily, UserSettingManager, VNode } from 'msfssdk';

import { MapUserSettingTypes } from 'garminsdk';

import { UiControlGroup, UiControlGroupProps } from '../../../../Shared/UI/UiControlGroup';
import { ViewService } from '../../../../Shared/UI/ViewService';

import './MFDMapSettingsGroup.css';

/**
 * Component props for MFDMapSettingsGroup.
 */
export interface MFDMapSettingsGroupProps extends UiControlGroupProps {
  /** The View Service. */
  viewService: ViewService;

  /** A map settings manager. */
  settingManager: UserSettingManager<MapUserSettingTypes>;

  /** A subscribable array which provides the current map range values. */
  mapRanges: Subscribable<readonly NumberUnitInterface<UnitFamily.Distance>[]>;
}

/**
 * A component which displays a group of controls to adjust map settings.
 */
export abstract class MFDMapSettingsGroup<P extends MFDMapSettingsGroupProps> extends UiControlGroup<P> {
  private readonly containerRef = FSComponent.createRef<HTMLDivElement>();

  /**
   * Shows this group.
   */
  public show(): void {
    this.containerRef.instance.style.display = '';
  }

  /**
   * Hides this group.
   */
  public hide(): void {
    this.containerRef.instance.style.display = 'none';
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render(): VNode {
    return (
      <div ref={this.containerRef} class='mfd-mapsettings-group' style='display: none;'>
        <div class='mfd-mapsettings-group-rightbg'></div>
        {this.getSettingRows(this.containerRef)}
      </div>
    );
  }

  /**
   * Gets an array of setting rows to render for this group.
   * @param containerRef A node reference to this group's root container.
   */
  protected abstract getSettingRows(containerRef: NodeReference<HTMLElement>): VNode[];
}