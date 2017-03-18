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
const ramda_1 = require("ramda");
const persist_1 = require("../../persist");
const topics_1 = require("../../topics");
function dailyRemindersHandler(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(ramda_1.keys(yield persist_1.Opps.byConfirmationsOn())
            .map(key => topics_1.oppConfirmationRemindTopic.publish({ key })));
    });
}
exports.dailyRemindersHandler = dailyRemindersHandler;
//# sourceMappingURL=dailyReminders.js.map