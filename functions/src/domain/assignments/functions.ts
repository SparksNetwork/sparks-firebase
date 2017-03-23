import * as functions from 'firebase-functions'
import { httpContext } from '../../lib/firebase-functions-contexts'

import {
  updateAssignmentStatusHandler,
  decayUnconfirmedAssignmentsHandler,
} from './handlers'

export const updateAssignmentStatus =
  functions.https
    .onRequest(httpContext(updateAssignmentStatusHandler))

export const decayUnconfirmedAssignments =
  functions.https
    .onRequest(httpContext(decayUnconfirmedAssignmentsHandler))
