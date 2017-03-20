import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface ProjectModel {
  name?: string,
}
export interface ProjectRecord extends ProjectModel { $key: string }

class ProjectsCollection extends FirebaseCollection<ProjectModel, ProjectRecord> {}

export const Projects = new ProjectsCollection(database, 'Projects')
