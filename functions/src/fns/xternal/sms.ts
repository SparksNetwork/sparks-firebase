import * as functions from 'firebase-functions'
import * as Twilio from 'twilio'
import { smsRequestData } from '../../topics'

export async function sendSMSHandler(data: smsRequestData) {
  const twilio = Twilio(
    functions.config().env.twilio_account_sid,
    functions.config().env.twilio_auth_token
  )
  return twilio.sendMessage({
    from: functions.config().env.twilio_phone_number,
    ...data,
  })
}
