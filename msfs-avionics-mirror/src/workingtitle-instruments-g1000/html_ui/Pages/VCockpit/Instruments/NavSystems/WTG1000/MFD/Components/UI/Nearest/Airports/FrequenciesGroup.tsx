import { AirportFacility, ArraySubject, ControlPublisher, FacilityFrequency, FacilityFrequencyType, FSComponent, VNode } from 'msfssdk';

import { G1000ControlList, G1000UiControl, G1000UiControlProps } from '../../../../../Shared/UI/G1000UiControl';
import { GroupBox } from '../../GroupBox';

import './FrequenciesGroup.css';

/**
 * Props on the FrequenciesGroup component.
 */
export interface NearestAirportFrequenciesGroupProps extends G1000UiControlProps {
  /** A control publisher used to send radio update commands. */
  controlPublisher: ControlPublisher;
}

/**
 * A component that displays a list of selectable radio frequencies
 * on the MFD nearest airports page.
 */
export class NearestAirportFrequenciesGroup extends G1000UiControl<NearestAirportFrequenciesGroupProps> {

  private readonly frequencies = ArraySubject.create<FacilityFrequency>();
  private readonly frequencyList = FSComponent.createRef<G1000ControlList<FacilityFrequency>>();

  /**
   * Sets the currently displayed facility.
   * @param facility The airport facility whose frequencies should be displayed.
   */
  public set(facility: AirportFacility | null): void {
    this.frequencies.clear();
    if (facility !== null) {
      this.frequencies.set([...facility.frequencies]);
    }
  }

  /**
   * Builds a frequency list item from a provided frequency.
   * @param frequency The frequency to build the list item from.
   * @returns A new list item node.
   */
  private buildFrequencyItem(frequency: FacilityFrequency): VNode {
    return (
      <FrequencyItem frequency={frequency} onSelected={this.onFrequencySelected.bind(this)} innerKnobScroll />
    );
  }

  /**
   * A callback called when a frequency is selected using the ENT key.
   * @param frequency The frequency that was selected.
   */
  private onFrequencySelected(frequency: FacilityFrequency): void {
    if (frequency.type === FacilityFrequencyType.None) {
      this.props.controlPublisher.publishEvent('standby_nav_freq', frequency.freqMHz.toFixed(3));
    } else {
      this.props.controlPublisher.publishEvent('standby_com_freq', frequency.freqMHz.toFixed(3));
    }
  }

  /** @inheritdoc */
  public render(): VNode {
    return (
      <GroupBox title='Frequencies'>
        <G1000ControlList
          innerKnobScroll
          class='mfd-nearest-airport-frequencies'
          data={this.frequencies}
          renderItem={this.buildFrequencyItem.bind(this)}
          ref={this.frequencyList} />
      </GroupBox>
    );
  }
}

/**
 * Props on the FrequencyItem component.
 */
interface FrequencyItemProps extends G1000UiControlProps {
  /** The frequency that this item will display. */
  frequency: FacilityFrequency;

  /** A callback called when a frequency is selected. */
  onSelected: (frequency: FacilityFrequency) => void;
}

/**
 * A component that represent a single row in the nearest airport
 * frequency list.
 */
class FrequencyItem extends G1000UiControl<FrequencyItemProps> {
  private readonly number = FSComponent.createRef<HTMLDivElement>();

  /** @inheritdoc */
  protected onFocused(source: G1000UiControl): void {
    this.number.instance.classList.add('highlight-select');
    super.onFocused(source);
  }

  /** @inheritdoc */
  protected onBlurred(source: G1000UiControl): void {
    this.number.instance.classList.remove('highlight-select');
    super.onBlurred(source);
  }

  /** @inheritdoc */
  public onEnter(): boolean {
    this.props.onSelected(this.props.frequency);
    this.scroll('forward');

    return true;
  }

  /**
   * Builds the display name for the frequency from the given frequency type.
   * @returns The display name for the frequency.
   */
  private buildName(): string {
    switch (this.props.frequency.type) {
      case FacilityFrequencyType.ASOS:
        return 'ASOS';
      case FacilityFrequencyType.ATIS:
        return 'ATIS';
      case FacilityFrequencyType.AWOS:
        return 'AWOS';
      case FacilityFrequencyType.Approach:
        return 'APPROACH';
      case FacilityFrequencyType.CPT:
      case FacilityFrequencyType.Clearance:
        return 'CLEARANCE';
      case FacilityFrequencyType.CTAF:
        return 'CTAF';
      case FacilityFrequencyType.Center:
        return 'CENTER';
      case FacilityFrequencyType.Departure:
        return 'DEPARTURE';
      case FacilityFrequencyType.FSS:
        return 'FSS';
      case FacilityFrequencyType.GCO:
        return 'GCO';
      case FacilityFrequencyType.Ground:
        return 'GROUND';
      case FacilityFrequencyType.Multicom:
        return 'MULTICOM';
      case FacilityFrequencyType.Tower:
        return 'TOWER';
      case FacilityFrequencyType.Unicom:
        return 'UNICOM';
      default:
        return this.props.frequency.name;
    }
  }

  /** @inheritdoc */
  public render(): VNode {
    return (
      <div class='mfd-nearest-airport-frequency'>
        <div class='mfd-nearest-airport-frequency-name'>{this.buildName()}</div>
        <div class='mfd-nearest-airport-frequency-number' ref={this.number}>{this.props.frequency.freqMHz.toFixed(3)}</div>
      </div>
    );
  }
}