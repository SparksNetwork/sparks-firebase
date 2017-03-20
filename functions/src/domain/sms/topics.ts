import { Topic } from '../../lib/topic'

export interface SmsRequestData {
  body: string,
  to: string,
}
export const smsRequestTopic = new Topic<SmsRequestData>('sms-request')