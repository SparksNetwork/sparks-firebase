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
const Twilio = require("twilio");
const twilio = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// export async function sendSMSHandler(data: sendSMSData) {
//   console.log('sendSMS', data)
//   return true
//   // return twilio.message.create({
//   //   from: process.env.TWILIO_PHONE_NUMBER,
//   //   ...data,
//   // })
// }
function sendSMSHandler(message) {
    return __awaiter(this, void 0, void 0, function* () {
        return 'Hello World';
    });
}
exports.sendSMSHandler = sendSMSHandler;
//# sourceMappingURL=sms.js.map