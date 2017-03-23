import * as moment from 'moment'
import { Assignments } from './models'
import { Engagements, engagementStatus } from '../engagements/models'

export async function decayUnconfirmedAssignmentsHandler(data: any) {
  const assignments = await Assignments.by('status', 'APPROVED')
  const expireBefore = moment().subtract(1, 'h')
  const expireThese = assignments.filter(a => {
    if (!a.createdAt) { return true }
    if (moment.unix(a.createdAt).isBefore(expireBefore)) { return true }
    return false
  })
  return Promise.all(
    expireThese.map(({$key}) => Assignments.delete($key))
  )
}

export async function updateAssignmentStatusHandler(data: any) {
    const assignments = await Assignments.all()
    for (let assignment of assignments) {
      const eng = await Engagements.one(assignment.engagementKey)
      Assignments.update(assignment.$key, {status: engagementStatus(eng)})
    }
}