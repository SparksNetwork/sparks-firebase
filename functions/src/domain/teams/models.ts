import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

class TeamsCollection extends FirebaseCollection {}

export const Teams = new TeamsCollection(database, 'Teams')
