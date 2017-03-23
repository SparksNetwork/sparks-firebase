import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'
import * as moment from 'moment'
import { filter } from 'ramda'

export interface EngagementModel {
  confirmReminderSMSLast?: string,
  confirmReminderSMSCount?: number,
  oppKey?: string,
  profileKey?: string,
  status?: string,
}
export interface EngagementRecord extends EngagementModel { $key: string }

class EngagementsCollection extends FirebaseCollection<EngagementModel, EngagementRecord> {
  public async byOppKey(oppKey: string) { return this.by('oppKey', oppKey) }
}

export const Engagements = new EngagementsCollection(database, 'Engagements')

export const filterByApproved = filter(r => engagementStatus(r) === 'APPROVED')

export const isConfirmationReminderDue = (now: moment.Moment, eng) => {
  if (!eng.confirmReminderSMSLast) { return true }
  const daysFromLast = (eng.confirmReminderSMSCount || 0) * 2
  const next = moment(eng.confirmReminderSMSLast).add(daysFromLast, 'd')
  return now.isAfter(next)
}

export const filterByConfirmationReminderDue = (now: moment.Moment) => filter(r => isConfirmationReminderDue(now, r))

export function engagementStatus(engagement) {
  const {
    isApplied = false,
    isAccepted = false,
    isConfirmed = false,
    declined = false,
  } = engagement

  if (declined) {
    return 'REJECTED'
  }

  if (isApplied) {
    if (isAccepted) {
      if (isConfirmed) {
        return 'CONFIRMED'
      }
      return 'APPROVED'
    }
    return 'APPLIED'
  }
  return 'INCOMPLETE'
}
