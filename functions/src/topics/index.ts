import * as pubsub from '@google-cloud/pubsub'

class Topic<T> {
  constructor(public name: string) {}
  public publish(m:T) { return pubsub().topic(this.name).publish(m) }
}

export interface smsRequestData {
  body: string,
  to: string,
}
export const smsRequestTopic = new Topic<smsRequestData>('sms-request')

export interface oppConfirmationRemindData {
  key: string,
}
export const oppConfirmationRemindTopic = new Topic<oppConfirmationRemindData>('opp-confirmationremind')

export interface engagementConfirmationRemindData {
  key: string,
}
export const engagementConfirmationRemindTopic = new Topic<engagementConfirmationRemindData>('engagement-confirmationremind')
