import { UpdateCommand, CreateCommand } from '../../lib/firebase-command-queue'
import { Projects, ProjectModel } from './models'
import { Profiles } from '../profiles/models'

interface ProjectsUpdateCommand extends UpdateCommand<ProjectModel> {}

export async function ProjectsUpdateWorker(data: ProjectsUpdateCommand) {
  if (!await Profiles.isAdmin(data.uid)) { throw 'Unauthorized ProjectsUpdateCommand' }
  return Projects.update(
    data.payload.key,
    data.payload.values
  )
}

interface ProjectsCreateCommand extends CreateCommand<ProjectModel> {}

export async function ProjectsCreateWorker(data: ProjectsCreateCommand) {
  if (!await Profiles.isAdmin(data.uid)) { throw 'Unauthorized ProjectsCreateCommand' }
  return Projects.push(data.payload.values)
}
