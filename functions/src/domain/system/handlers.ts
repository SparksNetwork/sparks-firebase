import { config } from '../../environment'
import { Opps } from '../opps/models'

export async function checkConfigHandler(data: any) {
  return `<pre>${JSON.stringify(config,null,2)}</pre>`
}

import { oppConfirmationRemindTopic } from '../opps/topics'

export async function dailyRemindersHandler(data: any) {
  return Promise.all(
    (await Opps.byConfirmationsOn())
      .map(({$key}) => $key && oppConfirmationRemindTopic.publish({key: $key}))
  )
}

export const makeConsoleLogHandler = name =>
  async function consoleLogHandler(message) {
    console.log(message)
    return true
  }
