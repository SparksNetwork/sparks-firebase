import * as admin from 'firebase-admin'
import { keys, merge } from 'ramda'

export interface FirebaseRecord {
  $key?: string
}

export class FirebaseCollection<TModel, TRecord> {
  public ref: admin.database.Reference

  constructor(public root: admin.database.Reference, public key: string) {
    this.ref = root.child(key)
  }

  public async one(key?: string): Promise<TRecord> {
    if (!key) { throw 'FirebaseCollection.one requires key'}
    console.log('FBC one', this.ref.key, key)
    return this.ref.child(key).once('value').then(s => rowWithKey(s.val(), key))
  }

  public async all(): Promise<Array<TRecord>> {
    console.log('FBC all', this.ref.key)
    return this.ref.once('value').then(s => toRows(s.val()))
  }

  public async by(orderByChild: string, equalTo: any): Promise<Array<TRecord>> {
    console.log('FBC by', this.ref.key, orderByChild, equalTo)
    return this.ref.orderByChild(orderByChild).equalTo(equalTo).once('value').then(s => toRows(s.val()))
  }

  public async firstBy(orderByChild: string, equalTo: any): Promise<TRecord | null> {
    console.log('FBC by', this.ref.key, orderByChild, equalTo)
    return this.ref.orderByChild(orderByChild).equalTo(equalTo).once('value')
      .then(s => toRows(s.val()))
      .then(rows => (rows && rows.length > 0) ? rows[0] : null)
  }

  public async update(key?: string, values?: TModel) {
    if (!key) { throw 'FirebaseCollection.update requires key'}
    if (!values) { throw 'FirebaseCollection.update requires values'}
    console.log('FBC update', this.ref.key)
    return this.ref.child(key).update(values)
  }

  public async push(values?: TModel): Promise<string> {
    if (!values) { throw 'FirebaseCollection.push requires values'}
    return this.ref.push(values)
      .then(r => {
        console.log('FBC pushed new', this.key, r.key)
        return r.key
      })
  }

  public async set(key?: string, values?: TModel) {
    if (!key) { throw 'FirebaseCollection.update requires key'}
    if (!values) { throw 'FirebaseCollection.update requires values'}
    return this.ref.child(key).set(values)
      .then(r => {
        console.log('FBC set existing', this.key, key)
        return r
      })
  }

  public async delete(key?: string) {
    if (!key) { throw 'FirebaseCollection.delete requires key'}
    return this.ref.child(key).remove()
  }

  public path(s: string): string {
    return `/${this.ref.key}${s}`
  }

  public keyPath(): string { return this.path('/{key}')}
}

const rowWithKey = (obj: Object, $key: string): FirebaseRecord => merge(obj, {$key})

function toRows(obj: any):Array<FirebaseRecord> {
  return obj && keys(obj).map(key => rowWithKey(obj[key], key))
}
