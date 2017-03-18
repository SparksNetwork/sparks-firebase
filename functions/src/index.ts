import * as functions from 'firebase-functions'

import {
  httpContext,
  pubSubContext,
} from './lib'

import {
  makeConsoleLogHandler,
  sendSMSHandler,
  dailyRemindersHandler,
  oppSendConfirmationRemindersHandler,
  engagementSendConfirmationRemindersHandler,
  makeCompoundIndexBuilder,
  makeDuplicateBlocker,
  makeCountUpdater,
  makeSumUpdater,
} from './fns'

import {
  smsRequestTopic,
  oppConfirmationRemindTopic,
  engagementConfirmationRemindTopic,
} from './topics'

export const dailyReminders =
  functions.https
    .onRequest(httpContext(dailyRemindersHandler))

export const sendSMS =
  functions.pubsub.topic(smsRequestTopic.name)
    .onPublish(pubSubContext(sendSMSHandler))

export const oppSendConfirmationReminders =
  functions.pubsub.topic(oppConfirmationRemindTopic.name)
    .onPublish(pubSubContext(oppSendConfirmationRemindersHandler))

export const engagementSendConfirmationReminders =
  functions.pubsub.topic(engagementConfirmationRemindTopic.name)
    .onPublish(pubSubContext(engagementSendConfirmationRemindersHandler))

export const assignmentUpdateEngagementShiftIndex =
  functions.database.ref('/Assignments/{key}')
    .onWrite(makeCompoundIndexBuilder(['engagementKey', 'shiftKey']))

export const assignmentBlockDuplicateForEngagementShiftIndex =
  functions.database.ref('/Assignments/{key}')
    .onWrite(makeDuplicateBlocker('engagementKey|shiftKey'))

export const assignmentCountShiftAssigned =
  functions.database.ref('/Assignments/{key}')
    .onWrite(makeCountUpdater('Shifts', 'shiftKey', 'assigned'))

// export const teamSumShiftAssignmentRequired =

export const teamSumShiftAssignmentCount =
  functions.database.ref('/Shifts/{key}')
    .onWrite(makeSumUpdater('Teams', 'teamKey', 'assigned', 'shiftAssignmentCount'))

export const teamSumShiftAssignmentRequired =
  functions.database.ref('/Shifts/{key}')
    .onWrite(makeSumUpdater('Teams', 'teamKey', 'people', 'shiftAssignmentRequired'))
