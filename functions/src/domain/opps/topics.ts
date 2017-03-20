import { Topic } from '../../lib/topic'

export interface OppConfirmationRemindData {
  key: string,
}
export const oppConfirmationRemindTopic = new Topic<OppConfirmationRemindData>('opp-confirmationremind')