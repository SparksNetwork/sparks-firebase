import * as admin from 'firebase-admin'
import { keys, merge } from 'ramda'

export class FirebaseCollection {
  public ref: admin.database.Reference

  constructor(public root: admin.database.Reference, public key: string) {
    this.ref = root.child(key)
  }

  public async one(key: string) {
    console.log('FBC one', this.ref.key, key)
    return this.ref.child(key).once('value').then(s => s.val())
  }

  public async all() {
    console.log('FBC all', this.ref.key)
    return this.ref.once('value').then(s => s.val())
  }

  public async by(orderByChild: string, equalTo: any) {
    console.log('FBC by', this.ref.key, orderByChild, equalTo)
    return this.ref.orderByChild(orderByChild).equalTo(equalTo).once('value').then(s => s.val())
  }

  public async update(key: string, values: Object) {
    return this.ref.child(key).update(values)
  }

  public path(s: string): string {
    return `/${this.ref.key}${s}`
  }

  public keyPath(): string { return this.path('/{key}')}
}

interface FirebaseRecord {
  $key:string
  [key:string]:any
}

export function objToRows(obj:any):FirebaseRecord[] {
  return obj && keys(obj).map(key => merge(obj[key], {$key: key})) || []
}