import { Topic } from '../lib/topic'

export interface oppConfirmationRemindData {
  key: string,
}
export const oppConfirmationRemindTopic = new Topic<oppConfirmationRemindData>('opp-confirmationremind')