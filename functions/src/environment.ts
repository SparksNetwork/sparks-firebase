/*
TODO: WHY THE SHENANIGANS
Loads firebase and config vars based on execution enviroment.
If this is run in firebase-functions:
  - it loads everything from functions.config(), refer to `firebase functions:config`
Otherwise:
  - it loads default credentials which are either set by:
    - GAE automagically
    - GOOGLE_APPLICATION_CREDENTIALS which is a path to a .credentials.json file somwhere
*/

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { keys, zipObj, toUpper, values, mapObjIndexed } from 'ramda'
// we will eventually need this i think?
// import * as dotenv from 'dot-env'

interface AppConfig {
  TWILIO_ACCOUNT_SID: string,
  TWILIO_AUTH_TOKEN: string,
  TWILIO_PHONE_NUMBER: string,
}

// these get set by the code block below
export var database: admin.database.Reference
export var config: AppConfig

if (isFirebaseFunctions()) {
  const functionsConfig = functions.config()
  // firebase-functions automagically sets config().firebase
  admin.initializeApp(functionsConfig.firebase)
   // uppercase the keys because firebase-functions is a bastard and doesnt let you
  config = upperCaseKeys(functionsConfig) as AppConfig
} else {
  // applicationDefault() will use GOOGLE_APPLICATION_CREDENTIALS to find a credentials.json
  // GAE (deployed) will automagically set this and everything will be fine
  // set GOOGLE_APPLICATION_CREDENTIALS to a path if you want to run it locally
  // i will throw an error if this env var is not set, so dev doesnt get mad
  requireEnv('GOOGLE_APPLICATION_CREDENTIALS', 'Provide path to .credentials.json or this shit won\'t run')
  const credential = admin.credential.applicationDefault()
  // WARNING: brittle, if firebase-admin changes its internals we will eat shit here
  const projectId = credential['credential_']['certificate_']['projectId']
  // wherever you go, there you are
  const databaseURL =  `https://${projectId}.firebaseio.com`
  admin.initializeApp({credential, databaseURL})
  config = process.env
}
// no matter how i initialize firebase, this will export what everyone expects
database = admin.database().ref('/')

// am i living in firebase-functions or somewhere else? only way to tell: try to run firebase.config() and see if it horks
function isFirebaseFunctions(): boolean { try { functions.config(); return true } catch (err) { return false } } 

// throw errors if process.env doesnt have the specified key
function requireEnv(key: string, err: string|null = null) { if (!process.env[key]) { throw(`Need ${key}: ${err}` || `Need ${key}`)} }

// give me an object with all the keys of the source obj uppercased
function upperCaseKeys(cfg: Object) { return zipObj(keys(cfg).map(toUpper), values(cfg) as Array<any>) }
