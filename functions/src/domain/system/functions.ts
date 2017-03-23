import * as functions from 'firebase-functions'
import { httpContext } from '../../lib/firebase-functions-contexts'

import {
  dailyRemindersHandler,
  checkConfigHandler,
  updateAllEngagementStatusHandler,
  decayUnconfirmedAssignmentsHandler,
} from './handlers'

export const dailyReminders =
  functions.https
    .onRequest(httpContext(dailyRemindersHandler))

export const checkConfig =
  functions.https
    .onRequest(httpContext(checkConfigHandler))

export const updateAllEngagementStatus =
  functions.https
    .onRequest(httpContext(updateAllEngagementStatusHandler))

export const decayUnconfirmedAssignments =
  functions.https
    .onRequest(httpContext(decayUnconfirmedAssignmentsHandler))
