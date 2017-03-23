import * as moment from 'moment'
import { pipe } from 'ramda'

import {
  oppConfirmationRemindTopic,
  OppConfirmationRemindData,
 } from './topics'
import {
  engagementConfirmationRemindTopic,
} from '../engagements/topics'

import {
  Opps,
} from './models'

import { Assignments } from '../assignments/models'
import {
  Engagements,
  filterByApproved,
  filterByConfirmationReminderDue,
  engagementStatus,
} from '../engagements/models'

const filterNeedingRemind = (now: moment.Moment) =>
  pipe(filterByApproved, filterByConfirmationReminderDue(now))

export async function oppSendConfirmationRemindersHandler(data: OppConfirmationRemindData) {
  console.log('* HANDLING: OppConfirmationRemind', data)
  const engs = await Engagements.byOppKey(data.key)
  const filtered = filterNeedingRemind(moment())(engs)
  // const filtered = filter(e => e['$key'] === '-KXxmYCromNWzYvWhw40')(filterNeedingRemind(moment())(engs))

  return Promise.all(filtered.map(({$key}) => engagementConfirmationRemindTopic.publish({key: $key})))
    .then(r => `${r.length} engagement confirmation reminders published`)
}

export async function dailyRemindersHandler(data: any) {
  return Promise.all(
    (await Opps.byConfirmationsOn())
      .map(({$key}) => oppConfirmationRemindTopic.publish({key: $key}))
  )
}
