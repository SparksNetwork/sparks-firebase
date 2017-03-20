import { Topic } from '../lib/topic'

export interface engagementConfirmationRemindData {
  key: string,
}
export const engagementConfirmationRemindTopic = new Topic<engagementConfirmationRemindData>('engagement-confirmationremind')
