import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

class AssignmentsCollection extends FirebaseCollection {}

export const Assignments = new AssignmentsCollection(database, 'Assignments')
