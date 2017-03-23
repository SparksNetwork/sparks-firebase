import * as functions from 'firebase-functions'
import { httpContext } from '../../lib/firebase-functions-contexts'

import {
  checkConfigHandler,
} from './handlers'

export const checkConfig =
  functions.https
    .onRequest(httpContext(checkConfigHandler))
