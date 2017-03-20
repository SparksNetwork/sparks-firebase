import * as functions from 'firebase-functions'
import { pubSubContext } from '../../lib/firebase-functions-contexts'

import { sendSMSHandler } from './handlers'
import { smsRequestTopic } from './topics'

export const sendSMS =
  functions.pubsub.topic(smsRequestTopic.name)
    .onPublish(pubSubContext(sendSMSHandler))