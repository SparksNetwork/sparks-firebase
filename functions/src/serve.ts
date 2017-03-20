import * as Queue from 'firebase-queue'
import { database } from './environment'

console.log('* Starting Queue')
const q = new Queue(database.child('!queue'), (data, progress, resolve, reject) => {
  console.log('received', data)
  resolve()
})
console.log('* Queue started')

import * as pubsub from '@google-cloud/pubsub'

const t = pubsub().topic('TEST')

console.log('topic', t)

// export class Topic<T> {
//   constructor(public name: string) {}
//   public publish(m:T) { return pubsub().topic(this.name).publish(m) }
// }
