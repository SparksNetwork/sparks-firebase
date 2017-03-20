import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface ProfileModel {
  isAdmin?: string,
  phone?: string,
  uid?: string,
}
export interface ProfileRecord extends ProfileModel { $key: string }

class ProfilesCollection extends FirebaseCollection<ProfileModel, ProfileRecord> {
  public async firstByUid(uid: string) { return this.firstBy('uid', uid) }

  public async matchesUid(key: string, uid: string) {
    return this.ref.child(key).child('uid').once('value').then(s => s.val() === uid)
  }

  public async isAdmin(uid: string) {
    const profile = await this.firstByUid(uid)
    return profile && profile.isAdmin
  }
}

export const Profiles = new ProfilesCollection(database, 'Profiles')
