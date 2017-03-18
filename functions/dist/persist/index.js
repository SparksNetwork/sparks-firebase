"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const moment = require("moment");
const ramda_1 = require("ramda");
admin.initializeApp(functions.config().firebase);
const database = admin.database().ref('/');
exports.Engagements = {
    one: key => fetch('Engagements', key),
    update: (key, values) => database.child('Engagements').child(key).update(values),
    ref: database.child('/Engagements'),
    byOppKey: k => fetchBy('Engagements', 'oppKey', k)
};
exports.Opps = {
    one: (key) => __awaiter(this, void 0, void 0, function* () { return fetch('Opps', key); }),
    byConfirmationsOn: () => __awaiter(this, void 0, void 0, function* () { return fetchBy('Opps', 'confirmationsOn', true); })
};
exports.Profiles = {
    one: (key) => __awaiter(this, void 0, void 0, function* () { return fetch('Profiles', key); }),
};
exports.Projects = {
    one: (key) => __awaiter(this, void 0, void 0, function* () { return fetch('Projects', key); }),
};
function fetch(coll, key) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('fetch', coll, key);
        return database.child(coll).child(key).once('value').then(s => s.val());
    });
}
exports.fetch = fetch;
function fetchAll(coll) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('fetch', coll);
        return database.child(coll).once('value').then(s => s.val());
    });
}
exports.fetchAll = fetchAll;
function fetchBy(coll, orderByChild, equalTo) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('fetch', coll, orderByChild, equalTo);
        return database.child(coll).orderByChild(orderByChild).equalTo(equalTo).once('value').then(s => s.val());
    });
}
exports.fetchBy = fetchBy;
function objToRows(obj) {
    return obj && ramda_1.keys(obj).map(key => ramda_1.merge(obj[key], { $key: key })) || [];
}
exports.objToRows = objToRows;
exports.filterByApproved = ramda_1.filter(r => engagementStatus(r) === 'APPROVED');
exports.isConfirmationReminderDue = (now, eng) => {
    if (!eng.confirmReminderSMSLast) {
        return true;
    }
    const daysFromLast = (eng.confirmReminderSMSCount || 0) * 2;
    const next = moment(eng.confirmReminderSMSLast).add(daysFromLast, 'd');
    return now.isAfter(next);
};
exports.filterByConfirmationReminderDue = (now) => ramda_1.filter(r => exports.isConfirmationReminderDue(now, r));
function engagementStatus(engagement) {
    const { isApplied = false, isAccepted = false, isConfirmed = false, declined = false, } = engagement;
    if (declined) {
        return 'REJECTED';
    }
    if (isApplied) {
        if (isAccepted) {
            if (isConfirmed) {
                return 'CONFIRMED';
            }
            return 'APPROVED';
        }
        return 'APPLIED';
    }
    return 'INCOMPLETE';
}
exports.engagementStatus = engagementStatus;
//# sourceMappingURL=index.js.map