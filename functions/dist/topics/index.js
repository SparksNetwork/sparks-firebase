"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub = require("@google-cloud/pubsub");
class Topic {
    constructor(name) {
        this.name = name;
    }
    publish(m) { return pubsub().topic(this.name).publish(m); }
}
exports.smsRequestTopic = new Topic('sms-request');
exports.oppConfirmationRemindTopic = new Topic('opp-confirmationremind');
exports.engagementConfirmationRemindTopic = new Topic('engagement-confirmationremind');
//# sourceMappingURL=index.js.map