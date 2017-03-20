import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

class OppsCollection extends FirebaseCollection {
  public async byConfirmationsOn() { return this.by('confirmationsOn', true) }
}

export const Opps = new OppsCollection(database, 'Opps')
