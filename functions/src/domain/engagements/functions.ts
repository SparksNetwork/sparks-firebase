import * as functions from 'firebase-functions'
import { pubSubContext, httpContext } from '../../lib/firebase-functions-contexts'

import { engagementConfirmationRemindTopic } from './topics'
import {
  engagementSendConfirmationRemindersHandler,
  updateAllEngagementStatusHandler,
} from './handlers'

export const engagementSendConfirmationReminders =
  functions.pubsub.topic(engagementConfirmationRemindTopic.name)
    .onPublish(pubSubContext(engagementSendConfirmationRemindersHandler))

export const updateAllEngagementStatus =
  functions.https
    .onRequest(httpContext(updateAllEngagementStatusHandler))


