import { Profiles } from './models'

interface ClientCommand {
  action: string,
  domain: string,
  payload: any,
  uid: string,
}

interface ProfilesUpdateCommand extends ClientCommand { 
  payload: {
    key: string,
    values: Object,
  }
}

export async function ProfilesUpdateWorker(data: ProfilesUpdateCommand) {
  console.log(data)
  // Profiles.update()
}