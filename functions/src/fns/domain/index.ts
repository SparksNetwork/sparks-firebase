import * as functions from 'firebase-functions'
import * as moment from 'moment'
import { filter, pipe } from 'ramda'

import { smsRequestTopic } from '../../topics/smsRequest'
import { oppConfirmationRemindData } from '../../topics/oppConfirmationRemind'
import { engagementConfirmationRemindTopic, engagementConfirmationRemindData } from '../../topics/engagementConfirmationRemind'

import {
  Engagements,
  Profiles,
  Opps,
  Projects,
  objToRows,
  filterByApproved,
  filterByConfirmationReminderDue,
  isConfirmationReminderDue,
} from '../../persist'

const filterNeedingRemind = (now: moment.Moment) =>
  pipe(filterByApproved, filterByConfirmationReminderDue(now))

export async function oppSendConfirmationRemindersHandler(data: oppConfirmationRemindData) {
  console.log('* HANDLING: OppConfirmationRemind', data)
  const engs = objToRows(await Engagements.byOppKey(data.key))
  const filtered = filterNeedingRemind(moment())(engs)
  // const filtered = filter(e => e['$key'] === '-KXxmYCromNWzYvWhw40')(filterNeedingRemind(moment())(engs))

  return Promise.all(filtered.map(({$key}) => engagementConfirmationRemindTopic.publish({key: $key})))
    .then(r => `${r.length} engagement confirmation reminders published`)
}

export async function engagementSendConfirmationRemindersHandler(data: engagementConfirmationRemindData) {
  console.log('* HANDLING: EngagementConfirmationRemind', data)
  const eng = await Engagements.one(data.key)
  if (isConfirmationReminderDue(moment(), eng)) {
    const profile = await Profiles.one(eng.profileKey)
    const opp = await Opps.one(eng.oppKey)
    const project = await Projects.one(opp.projectKey)
    const body = `${project.name}: Confirm your volunteer spot NOW, first-come first-serve while shifts remain! http://app.sparks.network on a computer.`

    return Engagements.update(data.key, {
      confirmReminderSMSLast: moment().toISOString(),
      confirmReminderSMSCount: (eng.confirmReminderSMSCount || 0) + 1,
    }).then(() =>
      smsRequestTopic.publish({
        body,
        to: profile.phone,
      })
    )
  }
  return true
}
