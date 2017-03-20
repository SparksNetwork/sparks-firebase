import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface AssignmentModel {}
export interface AssignmentsRecord extends AssignmentModel { $key: string }

class AssignmentsCollection extends FirebaseCollection<AssignmentModel, AssignmentsRecord> {}

export const Assignments = new AssignmentsCollection(database, 'Assignments')
