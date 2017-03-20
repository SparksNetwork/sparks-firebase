import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

class ProjectsCollection extends FirebaseCollection {}

export const Projects = new ProjectsCollection(database, 'Projects')
