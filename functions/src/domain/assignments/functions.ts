import * as functions from 'firebase-functions'
import {
  makeCompoundIndexBuilder,
  makeDuplicateBlocker,
  makeCountUpdater,
  timeStampCreatedOn,
} from '../../lib/firebase-function-builders'

import { Assignments } from './models'

export const assignmentUpdateEngagementShiftIndex =
  functions.database.ref(Assignments.keyPath())
    .onWrite(makeCompoundIndexBuilder(['engagementKey', 'shiftKey']))

export const assignmentBlockDuplicateForEngagementShiftIndex =
  functions.database.ref(Assignments.keyPath())
    .onWrite(makeDuplicateBlocker('engagementKey|shiftKey'))

export const assignmentCountShiftAssigned =
  functions.database.ref(Assignments.keyPath())
    .onWrite(makeCountUpdater('Shifts', 'shiftKey', 'assigned'))

export const assignmentTimestampCreation =
  functions.database.ref(Assignments.keyPath())
    .onWrite(timeStampCreatedOn)