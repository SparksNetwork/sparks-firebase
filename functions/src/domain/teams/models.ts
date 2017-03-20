import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface TeamModel {
  isAdmin?: string,
}
export interface TeamRecord extends TeamModel { $key: string }

class TeamsCollection extends FirebaseCollection<TeamModel, TeamRecord> {}

export const Teams = new TeamsCollection(database, 'Teams')
