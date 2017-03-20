import * as functions from 'firebase-functions'
import {
  makeSumUpdater,
} from '../../lib/firebase-function-builders'

import { Shifts } from './models'
import { Teams } from '../teams/models'

export const teamSumShiftAssignmentCount =
  functions.database.ref(Shifts.keyPath())
    .onWrite(makeSumUpdater(Teams.key, 'teamKey', 'assigned', 'shiftAssignmentCount'))

export const teamSumShiftAssignmentRequired =
  functions.database.ref(Shifts.keyPath())
    .onWrite(makeSumUpdater(Teams.key, 'teamKey', 'people', 'shiftAssignmentRequired'))
