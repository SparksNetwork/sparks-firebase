import * as functions from 'firebase-functions'
import { FirebaseCollection } from './firebase-collections'

import { keys, values, identity, any, sum } from 'ramda'
import * as moment from 'moment'

export function makeCompoundIndexBuilder(keys: Array<string>) {
  return async function(event: functions.Event<functions.database.DeltaSnapshot>) {
    const compoundKeyName = keys.join('|')
    console.log('key', event.data.ref.key, 'cKN', compoundKeyName)
    if (!event.data.val()) {
      console.log('PASS no value')
      return
    }
    const changedKeys = any(identity, keys.map(k => event.data.child(k).val()))
    if (!changedKeys) {
      console.log('PASS not changed')
      return
    }
    const oldCompoundKeyValue = event.data.child(compoundKeyName).val()
    const newCompoundKeyValue = keys.map(k => event.data.child(k).val()).join('')
    if (oldCompoundKeyValue != newCompoundKeyValue) {
      console.log('TRIGGERED was', `[${oldCompoundKeyValue}]`, 'changed to', `[${newCompoundKeyValue}]`)
      return event.data.ref.child(compoundKeyName).set(newCompoundKeyValue)
    }
    return true
  }
}

export function makeDuplicateBlocker(uniqueKey: string) {
  return async function(event: functions.Event<functions.database.DeltaSnapshot>) {
    console.log('key', event.data.ref.key, 'val', event.data.val())
    if (!event.data.val()) {
      console.log('PASS no value')
      return
    }
    const uniqueKeyValue = event.data.child(uniqueKey).val()
    if (!uniqueKeyValue) {
      console.log('PASS no key value to match')
      return
    }
    const collection = event.data.ref.parent
    if (!collection) {
      console.error('NO PARENT REF! SOMETHING HORRIBLY WRONG', event.data.ref.key)
      return
    }
    const found = await collection.orderByChild(uniqueKey).equalTo(uniqueKeyValue).once('value').then(s => s.val())
    console.log('found', keys(found).length, 'records with same', uniqueKey)
    if (keys(found).length > 1) {
      console.log('TRIGGERED deleted', event.data.ref.key)
      return event.data.ref.remove()
    }
  }
}

export function makeCountUpdater(parentCollection: string, foreignKey: string, targetKey: string) {
  return async function(event: functions.Event<functions.database.DeltaSnapshot>) {
    console.log('key', event.data.ref.key, 'val', event.data.val())
    if (event.data.current.val() && event.data.previous.val()) {
      console.log('PASS existing record')
      return
    }
    const foreignKeyValue = event.data.child(foreignKey).val() || event.data.previous.child(foreignKey).val()
    if (!foreignKeyValue) {
      console.log('PASS no foreign key', foreignKey)
    }
    const collection = event.data.ref.parent
    if (!collection) {
      console.error('NO PARENT REF! SOMETHING HORRIBLY WRONG', event.data.ref.key)
      return
    }
    const childs = await collection.orderByChild(foreignKey).equalTo(foreignKeyValue).once('value').then(s => s.val())
    const count = keys(childs).length
    console.log('TRIGGERED updating count', parentCollection, foreignKeyValue, count)
    return event.data.ref.root.child(parentCollection).child(foreignKeyValue).child(targetKey).set(count)
  }
}

export function makeSumUpdater(parentCollection: string, foreignKey: string, sumKey: string, targetKey: string) {
  return async function(event: functions.Event<functions.database.DeltaSnapshot>) {
    console.log('key', event.data.ref.key, 'val', event.data.val())
    if (event.data.current.child(sumKey).val() === event.data.previous.child(sumKey).val()) {
      console.log('PASS summed field has not changed')
      return
    }
    const foreignKeyValue = event.data.child(foreignKey).val() || event.data.previous.child(foreignKey).val()
    if (!foreignKeyValue) {
      console.log('PASS no foreign key', foreignKey)
    }
    const collection = event.data.ref.parent
    if (!collection) {
      console.error('NO PARENT REF! SOMETHING HORRIBLY WRONG', event.data.ref.key)
      return
    }
    const childs = await collection.orderByChild(foreignKey).equalTo(foreignKeyValue).once('value').then(s => s.val())
    const total = sum(values(childs).map(c => c[sumKey] || 0))
    console.log('TRIGGERED updating sum', parentCollection, foreignKeyValue, total)
    return event.data.ref.root.child(parentCollection).child(foreignKeyValue).child(targetKey).set(total)
  }
}

export const makeConsoleLogHandler = name =>
  async function consoleLogHandler(message) {
    console.log(message)
    return true
  }

export function timeStampCreatedOn(event: functions.Event<functions.database.DeltaSnapshot>) {
  console.log('key', event.data.ref.key, 'val', event.data.val())
  if (event.data.previous.val()) {
    console.log('PASS existing record')
    return
  }
  event.data.ref.child('createdAt').set(moment().unix())
}

export function makeChildPropogator(srcField: string, collection: FirebaseCollection<any,any>, foreignKey: string, destField: string) {
  return async function(event: functions.Event<functions.database.DeltaSnapshot>) {
    const newVal = event.data.current.val()[srcField]
    if (newVal === event.data.previous.val()[srcField]) {
      console.log('PASS unchanged', srcField)
      return false
    }
    return Promise.all(
      (await collection.by(foreignKey, event.data.key))
        .map(({$key}) => collection.update($key, {[destField]: newVal}) )
    )
  }
}
