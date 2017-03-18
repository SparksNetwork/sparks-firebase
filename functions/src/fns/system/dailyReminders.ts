import * as pubsub from '@google-cloud/pubsub'
import { keys } from 'ramda'

import {
  Opps,
  objToRows
} from '../../persist'

import {
  oppConfirmationRemindTopic,
} from '../../topics'

export async function dailyRemindersHandler(data: any) {
  return Promise.all(
    keys(await Opps.byConfirmationsOn())
      .map(key => oppConfirmationRemindTopic.publish({key}))
  )
}

