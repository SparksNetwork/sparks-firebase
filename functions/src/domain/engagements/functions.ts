import * as functions from 'firebase-functions'
import { pubSubContext } from '../../lib/firebase-functions-contexts'

import { engagementConfirmationRemindTopic } from './topics'
import { engagementSendConfirmationRemindersHandler } from './handlers'

export const engagementSendConfirmationReminders =
  functions.pubsub.topic(engagementConfirmationRemindTopic.name)
    .onPublish(pubSubContext(engagementSendConfirmationRemindersHandler))
