import { UpdateCommand, CreateCommand } from '../../lib/firebase-command-queue'
import { omit, merge } from 'ramda'
import { Profiles, ProfileModel } from './models'
import { Users } from '../users/models'

const omitAdminOnly = omit(['isAdmin', 'uid'])

interface ProfilesUpdateCommand extends UpdateCommand<ProfileModel> {}

export async function ProfilesUpdateWorker(data: ProfilesUpdateCommand) {
  if (!await Profiles.matchesUid(data.payload.key, data.uid)) { throw 'Unauthorized ProfilesUpdate' }
  return Profiles.update(
    data.payload.key,
    omitAdminOnly(data.payload.values)
  )
}

interface ProfilesCreateCommand extends CreateCommand<ProfileModel> {}

export async function ProfilesCreateWorker(data: ProfilesCreateCommand) {
  const existingProfile = await Profiles.firstByUid(data.uid)
  if (existingProfile) {
    return Users.set(data.uid, existingProfile.$key)
  } else {
    return Profiles.push(merge(omitAdminOnly(data.payload.values), {uid: data.uid}))
      .then(r => Users.set(data.uid, r))
  }
}