import { BasicConsumer } from './BasicConsumer';
import { Consumer } from './Consumer';
import { EventBus } from './EventBus';

/**
 * A typed container for subscribers interacting with the Event Bus.
 */
export class EventSubscriber<E> {

  /**
   * Creates an instance of an EventSubscriber.
   * @param bus The EventBus that is the parent of this instance.
   */
  constructor(private bus: EventBus) { }

  /**
   * Subscribes to a topic on the bus.
   * @param topic The topic to subscribe to.
   * @returns A consumer to bind the event handler to.
   */
  public on<K extends keyof E & string>(topic: K): Consumer<E[K]> {
    return new BasicConsumer<E[K]>((handler, paused) => {
      return this.bus.on(topic, handler, paused);
    });
  }
}
