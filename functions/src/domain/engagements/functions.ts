import * as functions from 'firebase-functions'
import { pubSubContext } from '../../lib/firebase-functions-contexts'
import { Engagements, engagementStatus } from './models'
import { Assignments } from '../assignments/models'

import { engagementConfirmationRemindTopic } from './topics'
import { engagementSendConfirmationRemindersHandler } from './handlers'

import { makeChildPropogator } from '../../lib/firebase-function-builders'

export const engagementSendConfirmationReminders =
  functions.pubsub.topic(engagementConfirmationRemindTopic.name)
    .onPublish(pubSubContext(engagementSendConfirmationRemindersHandler))

// export const engagementUpdateStatusField =
//   functions.database.ref(Engagements.keyPath())
//     .onWrite(event => {
//       const eng = event.data.val()
//       const newStatus = engagementStatus(eng)
//       if (eng.status === newStatus) {
//         console.log('PASS engagement status unchanged')
//         return false
//       }
//       return event.data.ref.child('status').set(newStatus)
//     })

// export const engagementUpdateAssignmentsWithStatus =
//   functions.database.ref(Engagements.keyPath())
//     .onWrite(makeChildPropogator('status', Assignments, 'engagementKey', 'status'))

