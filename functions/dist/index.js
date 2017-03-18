"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const lib_1 = require("./lib");
const fns_1 = require("./fns");
const topics_1 = require("./topics");
exports.dailyReminders = functions.https
    .onRequest(lib_1.httpContext(fns_1.dailyRemindersHandler));
exports.sendSMS = functions.pubsub.topic(topics_1.smsRequestTopic.name)
    .onPublish(lib_1.pubSubContext(fns_1.sendSMSHandler));
exports.oppSendConfirmationReminders = functions.pubsub.topic(topics_1.oppConfirmationRemindTopic.name)
    .onPublish(lib_1.pubSubContext(fns_1.oppSendConfirmationRemindersHandler));
exports.engagementSendConfirmationReminders = functions.pubsub.topic(topics_1.engagementConfirmationRemindTopic.name)
    .onPublish(lib_1.pubSubContext(fns_1.engagementSendConfirmationRemindersHandler));
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