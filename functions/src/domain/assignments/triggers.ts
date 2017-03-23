import * as functions from 'firebase-functions'
import {
  makeCompoundIndexBuilder,
  makeDuplicateBlocker,
  makeCountUpdater,
  timeStampCreatedOn,
} from '../../lib/firebase-function-builders'

import { Assignments } from './models'

// export const assignmentUpdateEngagementShiftIndex =
//   functions.database.ref(Assignments.keyPath())
//     .onWrite(makeCompoundIndexBuilder(['engagementKey', 'shiftKey']))

// export const assignmentBlockDuplicateForEngagementShiftIndex =
//   functions.database.ref(Assignments.keyPath())
//     .onWrite(makeDuplicateBlocker('engagementKey|shiftKey'))

// export const assignmentCountShiftAssigned =
//   functions.database.ref(Assignments.keyPath())
//     .onWrite(makeCountUpdater('Shifts', 'shiftKey', 'assigned'))

// export const assignmentTimestampCreation =
//   functions.database.ref(Assignments.keyPath())
//     .onWrite(timeStampCreatedOn)

const compoundIndexBuilder = makeCompoundIndexBuilder(['engagementKey', 'shiftKey'])
const blockDuplicatesForEngagementShiftIndex = makeDuplicateBlocker('engagementKey|shiftKey')
const countShiftAssigned = makeCountUpdater('Shifts', 'shiftKey', 'assigned')

export const assignmentWriteTrigger =
  functions.database.ref(Assignments.keyPath())
    .onWrite(async (e) => {
      await compoundIndexBuilder(e)
      await blockDuplicatesForEngagementShiftIndex(e)
      await countShiftAssigned(e)
      await timeStampCreatedOn(e)
      return true
    })
