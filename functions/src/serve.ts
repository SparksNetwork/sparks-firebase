import {FirebaseCommandQueue } from './lib/firebase-command-queue'

import { database } from './environment'

import * as workers from './workers'

console.log('\n', '*** STARTING SERVER')

console.log('* Starting Queue')
const q = FirebaseCommandQueue(database.child('!queue'), workers)
console.log('* Queue started')

