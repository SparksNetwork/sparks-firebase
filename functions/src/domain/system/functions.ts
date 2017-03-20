import * as functions from 'firebase-functions'
import { httpContext } from '../../lib/firebase-functions-contexts'

import {
  dailyRemindersHandler,
  checkConfigHandler,
} from './handlers'

export const dailyReminders =
  functions.https
    .onRequest(httpContext(dailyRemindersHandler))

export const checkConfig =
  functions.https
    .onRequest(httpContext(checkConfigHandler))
