"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_functions_contexts_1 = require("./lib/firebase-functions-contexts");
const fns_1 = require("./fns");
const smsRequest_1 = require("./topics/smsRequest");
const oppConfirmationRemind_1 = require("./topics/oppConfirmationRemind");
const engagementConfirmationRemind_1 = require("./topics/engagementConfirmationRemind");
exports.dailyReminders = functions.https
    .onRequest(firebase_functions_contexts_1.httpContext(fns_1.dailyRemindersHandler));
exports.checkConfig = functions.https
    .onRequest(firebase_functions_contexts_1.httpContext(fns_1.checkConfigHandler));
exports.sendSMS = functions.pubsub.topic(smsRequest_1.smsRequestTopic.name)
    .onPublish(firebase_functions_contexts_1.pubSubContext(fns_1.sendSMSHandler));
exports.oppSendConfirmationReminders = functions.pubsub.topic(oppConfirmationRemind_1.oppConfirmationRemindTopic.name)
    .onPublish(firebase_functions_contexts_1.pubSubContext(fns_1.oppSendConfirmationRemindersHandler));
exports.engagementSendConfirmationReminders = functions.pubsub.topic(engagementConfirmationRemind_1.engagementConfirmationRemindTopic.name)
    .onPublish(firebase_functions_contexts_1.pubSubContext(fns_1.engagementSendConfirmationRemindersHandler));
exports.assignmentUpdateEngagementShiftIndex = functions.database.ref('/Assignments/{key}')
    .onWrite(fns_1.makeCompoundIndexBuilder(['engagementKey', 'shiftKey']));
exports.assignmentBlockDuplicateForEngagementShiftIndex = functions.database.ref('/Assignments/{key}')
    .onWrite(fns_1.makeDuplicateBlocker('engagementKey|shiftKey'));
exports.assignmentCountShiftAssigned = functions.database.ref('/Assignments/{key}')
    .onWrite(fns_1.makeCountUpdater('Shifts', 'shiftKey', 'assigned'));
// export const teamSumShiftAssignmentRequired =
exports.teamSumShiftAssignmentCount = functions.database.ref('/Shifts/{key}')
    .onWrite(fns_1.makeSumUpdater('Teams', 'teamKey', 'assigned', 'shiftAssignmentCount'));
exports.teamSumShiftAssignmentRequired = functions.database.ref('/Shifts/{key}')
    .onWrite(fns_1.makeSumUpdater('Teams', 'teamKey', 'people', 'shiftAssignmentRequired'));
//# sourceMappingURL=index.js.map