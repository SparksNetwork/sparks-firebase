import * as functions from 'firebase-functions'
import { pubSubContext } from '../../lib/firebase-functions-contexts'

import { oppConfirmationRemindTopic } from './topics'
import { oppSendConfirmationRemindersHandler } from './handlers'

export const oppSendConfirmationReminders =
  functions.pubsub.topic(oppConfirmationRemindTopic.name)
    .onPublish(pubSubContext(oppSendConfirmationRemindersHandler))
