import { config } from '../../environment'
import { keys } from 'ramda'
import { objToRows } from '../../lib/firebase-collections'
import { Opps } from '../opps/models'

export async function checkConfigHandler(data: any) {
  return `<pre>${JSON.stringify(config,null,2)}</pre>`
}

import { oppConfirmationRemindTopic } from '../opps/topics'

export async function dailyRemindersHandler(data: any) {
  return Promise.all(
    keys(await Opps.byConfirmationsOn())
      .map(key => oppConfirmationRemindTopic.publish({key}))
  )
}

export const makeConsoleLogHandler = name =>
  async function consoleLogHandler(message) {
    console.log(message)
    return true
  }
