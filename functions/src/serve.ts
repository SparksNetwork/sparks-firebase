import * as Queue from 'firebase-queue'
import { keys } from 'ramda'
import * as capitalize from 'capitalize'

import { database } from './environment'

import * as workers from './workers'

console.log('\n', '*** STARTING SERVER')
console.log('* Loaded Workers...')
keys(workers).forEach(k => console.log('  -', k))

console.log('* Starting Queue')
const q = new Queue(database.child('!queue'), (data, progress, resolve, reject) => {
  handleTask(data).then(r => resolve())
})
console.log('* Queue started')

async function handleTask(data) {
  const workerName = `${capitalize(data.domain)}${capitalize(data.action)}Worker`
  console.log('* Task for', workerName)
  if (workers[workerName]) {
    try {
      await workers[workerName](data)
    } catch (err) {
      console.error('*** WORKER ERROR', workerName, err)
    }
  } else {
    console.error(`*** NO WORKER FOR COMMAND ${workerName}`)
    console.error(JSON.stringify(data, null, 2))
  }
  return true
}
