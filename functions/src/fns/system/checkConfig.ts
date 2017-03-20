import * as functions from 'firebase-functions'
import { config } from '../../environment'

export async function checkConfigHandler(data: any) {
  return `<pre>${JSON.stringify(config,null,2)}</pre>`
}
