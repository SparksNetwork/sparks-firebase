import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface AssignmentModel {
  createdAt?: number,
  engagementKey?: string,
  status?: string,
}
export interface AssignmentsRecord extends AssignmentModel { $key: string }

class AssignmentsCollection extends FirebaseCollection<AssignmentModel, AssignmentsRecord> {
  public async byEngagementKey(key: string) { return this.by('engagementKey', key) }
  public async byOppKey(key: string) { return this.by('oppKey', key) }
}

export const Assignments = new AssignmentsCollection(database, 'Assignments')
