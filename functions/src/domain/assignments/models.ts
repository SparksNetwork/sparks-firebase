import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface AssignmentModel {
  createdAt?: number,
}
export interface AssignmentsRecord extends AssignmentModel { $key: string }

class AssignmentsCollection extends FirebaseCollection<AssignmentModel, AssignmentsRecord> {
  public async byEngagementKey(key: string) { return this.by('engagementKey', key) }
}

export const Assignments = new AssignmentsCollection(database, 'Assignments')
