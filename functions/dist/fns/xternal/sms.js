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
const functions = require("firebase-functions");
const Twilio = require("twilio");
function sendSMSHandler(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const twilio = Twilio(functions.config().env.twilio_account_sid, functions.config().env.twilio_auth_token);
        return twilio.sendMessage(Object.assign({ from: functions.config().env.twilio_phone_number }, data));
    });
}
exports.sendSMSHandler = sendSMSHandler;
//# sourceMappingURL=sms.js.map