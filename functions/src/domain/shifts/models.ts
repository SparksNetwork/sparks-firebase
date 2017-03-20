import { FirebaseCollection } from '../../lib/firebase-collections'
import { database } from '../../environment'

export interface ShiftModel {

}
export interface ShiftRecord extends ShiftModel { $key: string }

class ShiftsCollection extends FirebaseCollection<ShiftModel, ShiftRecord> {}

export const Shifts = new ShiftsCollection(database, 'Shifts')
