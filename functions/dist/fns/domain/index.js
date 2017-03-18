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
const moment = require("moment");
const ramda_1 = require("ramda");
const topics_1 = require("../../topics");
const persist_1 = require("../../persist");
const filterNeedingRemind = (now) => ramda_1.pipe(persist_1.filterByApproved, persist_1.filterByConfirmationReminderDue(now));
function oppSendConfirmationRemindersHandler(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('* HANDLING: OppConfirmationRemind', data);
        const engs = persist_1.objToRows(yield persist_1.Engagements.byOppKey(data.key));
        const filtered = filterNeedingRemind(moment())(engs);
        // const filtered = filter(e => e['$key'] === '-KXxmYCromNWzYvWhw40')(filterNeedingRemind(moment())(engs))
        return Promise.all(filtered.map(({ $key }) => topics_1.engagementConfirmationRemindTopic.publish({ key: $key })))
            .then(r => `${r.length} engagement confirmation reminders published`);
    });
}
exports.oppSendConfirmationRemindersHandler = oppSendConfirmationRemindersHandler;
function engagementSendConfirmationRemindersHandler(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('* HANDLING: EngagementConfirmationRemind', data);
        const eng = yield persist_1.Engagements.one(data.key);
        if (persist_1.isConfirmationReminderDue(moment(), eng)) {
            const profile = yield persist_1.Profiles.one(eng.profileKey);
            const opp = yield persist_1.Opps.one(eng.oppKey);
            const project = yield persist_1.Projects.one(opp.projectKey);
            const body = `${project.name}: Confirm your volunteer spot NOW, first-come first-serve while shifts remain! http://app.sparks.network on a computer.`;
            return persist_1.Engagements.update(data.key, {
                confirmReminderSMSLast: moment().toISOString(),
                confirmReminderSMSCount: (eng.confirmReminderSMSCount || 0) + 1,
            }).then(() => topics_1.smsRequestTopic.publish({
                body,
                to: profile.phone,
            }));
        }
        return true;
    });
}
exports.engagementSendConfirmationRemindersHandler = engagementSendConfirmationRemindersHandler;
//# sourceMappingURL=index.js.map