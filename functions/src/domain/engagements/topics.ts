import { Topic } from '../../lib/topic'

export interface EngagementConfirmationRemindData {
  key: string,
}
export const engagementConfirmationRemindTopic = new Topic<EngagementConfirmationRemindData>('engagement-confirmationremind')
