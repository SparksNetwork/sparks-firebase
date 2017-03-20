import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

class ShiftsCollection extends FirebaseCollection {}

export const Shifts = new ShiftsCollection(database, 'Shifts')
