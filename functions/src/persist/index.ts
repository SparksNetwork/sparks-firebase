import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as moment from 'moment'
import { keys, merge, filter } from 'ramda'

interface FirebaseRecord {
  $key:string
  [key:string]:any
}

admin.initializeApp(functions.config().firebase)
const database = admin.database().ref('/')

export const Engagements = {
  one: key => fetch('Engagements', key),
  update: (key, values) => database.child('Engagements').child(key).update(values),
  ref: database.child('/Engagements'),
  byOppKey: k => fetchBy('Engagements', 'oppKey', k)
}

export const Opps = {
  one: async key => fetch('Opps', key),
  byConfirmationsOn: async () => fetchBy('Opps', 'confirmationsOn', true)
}

export const Profiles = {
  one: async key => fetch('Profiles', key),
}

export const Projects = {
  one: async key => fetch('Projects', key),
}

export async function fetch(coll: string, key: string) {
  console.log('fetch', coll, key)
  return database.child(coll).child(key).once('value').then(s => s.val())
}

export async function fetchAll(coll: string) {
  console.log('fetch', coll)
  return database.child(coll).once('value').then(s => s.val())
}

export async function fetchBy(coll: string, orderByChild: string, equalTo: any) {
  console.log('fetch', coll, orderByChild, equalTo)
  return database.child(coll).orderByChild(orderByChild).equalTo(equalTo).once('value').then(s => s.val())
}

export function objToRows(obj:any):FirebaseRecord[] {
  return obj && keys(obj).map(key => merge(obj[key], {$key: key})) || []
}

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
