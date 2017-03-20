import * as Twilio from 'twilio'
import { config } from '../../environment'

import { SmsRequestData } from './topics'

export async function sendSMSHandler(data: SmsRequestData) {
  const twilio = Twilio(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN
  )
  return twilio.sendMessage({
    from: config.TWILIO_PHONE_NUMBER,
    ...data,
  })
}
