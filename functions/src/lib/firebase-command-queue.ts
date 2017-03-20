import * as admin from 'firebase-admin'
import * as Queue from 'firebase-queue'
import * as capitalize from 'capitalize'
import { keys } from 'ramda'

export interface ClientCommand {
  action: string,
  domain: string,
  payload: any,
  uid: string,
}

export interface UpdateCommand<TModel> extends ClientCommand {
  payload: {
    key: string,
    values: TModel,
  }
}

export interface CreateCommand<TModel> extends ClientCommand {
  payload: {
    values: TModel,
  }
}

export function FirebaseCommandQueue(ref: admin.database.Reference, workers) {
  console.log('* Loaded Workers:')
  keys(workers).forEach(k => console.log('  -', k))

  return new Queue(ref, (data, progress, resolve, reject) => {
    const workerName = `${capitalize(data.domain)}${capitalize(data.action)}Worker`
    try {
      workers[workerName](data)
        .then(result => {
          const response = {
            domain: data.domain,
            event: data.action,
            payload: result || null,
          }
          console.log('* Finished task from', workerName)
          return ref.child('responses').child(data.uid).push(response)
        })
        .then(() => resolve())
        .catch(err => {
          console.log('*** WORKER ERROR', workerName, err)
          resolve()
        })
    } catch (err) {
      console.error(`*** NO WORKER FOR COMMAND ${workerName}`, JSON.stringify(data, null, 2))
      resolve()
    }
  })
}