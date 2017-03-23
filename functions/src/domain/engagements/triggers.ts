import * as functions from 'firebase-functions'
import { Engagements, engagementStatus } from './models'
import { Assignments } from '../assignments/models'

import { makeChildPropogator } from '../../lib/firebase-function-builders'

async function updateStatus(event) {
  const eng = event.data.val()
  const newStatus = engagementStatus(eng)
  if (eng.status === newStatus) {
    console.log('PASS engagement status unchanged')
    return false
  }
  return event.data.ref.child('status').set(newStatus)
}

const updateAssignmentsWithStatus = makeChildPropogator('status', Assignments, 'engagementKey', 'status')

export const engagementWriteTrigger =
  functions.database.ref(Engagements.keyPath())
    .onWrite(async (e) => {
      await updateStatus(e)
      await updateAssignmentsWithStatus(e)
      return true
    })
