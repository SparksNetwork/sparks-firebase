import { ClientCommand } from '../../lib/firebase-command-queue'
import { Profiles } from '../profiles/models'
import { Users } from './models'

interface UsersMigrateCommand extends ClientCommand {
  payload: {
    fromUid: string,
    profileKey: string,
    toUid: string,
  }
}

export async function UsersMigrateWorker(data: UsersMigrateCommand) {
  return Users.set(data.payload.toUid, data.payload.profileKey)
    .then(r =>
      Profiles.update(
        data.payload.profileKey,
        {uid: data.payload.toUid},
      )
    )
}
