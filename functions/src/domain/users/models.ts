import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export type UserModel = string

export interface UserRecord { $key: string }

class UsersCollection extends FirebaseCollection<UserModel, UserRecord> {}

export const Users = new UsersCollection(database, 'Users')
