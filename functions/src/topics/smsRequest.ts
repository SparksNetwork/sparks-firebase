import { Topic } from '../lib/topic'

export interface smsRequestData {
  body: string,
  to: string,
}
export const smsRequestTopic = new Topic<smsRequestData>('sms-request')