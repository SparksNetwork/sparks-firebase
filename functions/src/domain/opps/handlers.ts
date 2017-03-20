import * as moment from 'moment'
import { pipe } from 'ramda'

import {
  engagementConfirmationRemindTopic,
} from '../engagements/topics'

import {
  OppConfirmationRemindData,
} from './topics'

import {
  Engagements,
  filterByApproved,
  filterByConfirmationReminderDue,
} from '../engagements/models'

import {
  objToRows,
} from '../../lib/firebase-collections'

const filterNeedingRemind = (now: moment.Moment) =>
  pipe(filterByApproved, filterByConfirmationReminderDue(now))

export async function oppSendConfirmationRemindersHandler(data: OppConfirmationRemindData) {
  console.log('* HANDLING: OppConfirmationRemind', data)
  const engs = objToRows(await Engagements.byOppKey(data.key))
  const filtered = filterNeedingRemind(moment())(engs)
  // const filtered = filter(e => e['$key'] === '-KXxmYCromNWzYvWhw40')(filterNeedingRemind(moment())(engs))

  return Promise.all(filtered.map(({$key}) => engagementConfirmationRemindTopic.publish({key: $key})))
    .then(r => `${r.length} engagement confirmation reminders published`)
}
