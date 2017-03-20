import * as pubsub from '@google-cloud/pubsub'

export class Topic<T> {
  constructor(public name: string) {}
  public publish(m:T) { return pubsub().topic(this.name).publish(m) }
}
