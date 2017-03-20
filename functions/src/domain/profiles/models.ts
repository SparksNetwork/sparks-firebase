import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

class ProfilesCollection extends FirebaseCollection {}

export const Profiles = new ProfilesCollection(database, 'Profiles')
