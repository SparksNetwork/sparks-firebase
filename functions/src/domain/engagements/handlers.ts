import * as moment from 'moment'

import {
  smsRequestTopic,
} from '../sms/topics'

import {
  EngagementConfirmationRemindData,
} from './topics'

import {
  Engagements,
  isConfirmationReminderDue,
  engagementStatus,
} from './models'

import { Opps } from '../opps/models'
import { Profiles } from '../profiles/models'
import { Projects } from '../projects/models'

export async function engagementSendConfirmationRemindersHandler(data: EngagementConfirmationRemindData) {
  console.log('* HANDLING: EngagementConfirmationRemind', data)
  const eng = await Engagements.one(data.key)
  if (isConfirmationReminderDue(moment(), eng)) {
    const profile = await Profiles.one(eng.profileKey)
    const opp = await Opps.one(eng.oppKey)
    const project = await Projects.one(opp.projectKey)
    const body = `${project.name}: Confirm your volunteer spot NOW, first-come first-serve while shifts remain! http://app.sparks.network on a computer.`

    const to = profile.phone
    if (!to) { throw 'engagementSendConfirmationRemindersHandler requires profile.phone'}
    return Engagements.update(data.key, {
      confirmReminderSMSLast: moment().toISOString(),
      confirmReminderSMSCount: (eng.confirmReminderSMSCount || 0) + 1,
    }).then(() =>
      smsRequestTopic.publish({
        body,
        to,
      })
    )
  }
  return true
}

export async function updateAllEngagementStatusHandler(data: any) {
  const engs = await Engagements.all()
  return Promise.all(engs.map(e => Engagements.update(e.$key, {status: engagementStatus(e)})))
}