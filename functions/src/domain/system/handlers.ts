import * as moment from 'moment'
import { config } from '../../environment'
import { Opps } from '../opps/models'
import { Assignments } from '../assignments/models'
import { Engagements, engagementStatus } from '../engagements/models'

export async function checkConfigHandler(data: any) {
  return `<pre>${JSON.stringify(config,null,2)}</pre>`
}

import { oppConfirmationRemindTopic } from '../opps/topics'

export async function dailyRemindersHandler(data: any) {
  return Promise.all(
    (await Opps.byConfirmationsOn())
      .map(({$key}) => oppConfirmationRemindTopic.publish({key: $key}))
  )
}

export async function decayUnconfirmedAssignmentsHandler(data: any) {
  const assignments = await Assignments.by('status', 'ACCEPTED')
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

export async function updateAllEngagementStatusHandler(data: any) {
  return Promise.all(
    (await Engagements.all())
      .map(e => Engagements.update(e.$key, {status: engagementStatus(e)}))
  )
}