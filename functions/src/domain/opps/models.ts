import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface OppModel {
  projectKey?: string,
}
export interface OppRecord extends OppModel { $key: string }

class OppsCollection extends FirebaseCollection<OppModel, OppRecord> {
  public async byConfirmationsOn() { return this.by('confirmationsOn', true) }
}

export const Opps = new OppsCollection(database, 'Opps')
