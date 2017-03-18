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
function makeCompoundIndexBuilder(keys) {
    return function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            const compoundKeyName = keys.join('|');
            console.log('key', event.data.ref.key, 'cKN', compoundKeyName);
            if (!event.data.val()) {
                console.log('PASS no value');
                return;
            }
            const changedKeys = ramda_1.any(ramda_1.identity, keys.map(k => event.data.child(k).val()));
            if (!changedKeys) {
                console.log('PASS not changed');
                return;
            }
            const oldCompoundKeyValue = event.data.child(compoundKeyName).val();
            const newCompoundKeyValue = keys.map(k => event.data.child(k).val()).join('');
            if (oldCompoundKeyValue != newCompoundKeyValue) {
                console.log('TRIGGERED was', `[${oldCompoundKeyValue}]`, 'changed to', `[${newCompoundKeyValue}]`);
                return event.data.ref.child(compoundKeyName).set(newCompoundKeyValue);
            }
            return true;
        });
    };
}
exports.makeCompoundIndexBuilder = makeCompoundIndexBuilder;
function makeDuplicateBlocker(uniqueKey) {
    return function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('key', event.data.ref.key, 'val', event.data.val());
            if (!event.data.val()) {
                console.log('PASS no value');
                return;
            }
            const uniqueKeyValue = event.data.child(uniqueKey).val();
            if (!uniqueKeyValue) {
                console.log('PASS no key value to match');
                return;
            }
            const collection = event.data.ref.parent;
            if (!collection) {
                console.error('NO PARENT REF! SOMETHING HORRIBLY WRONG', event.data.ref.key);
                return;
            }
            const found = yield collection.orderByChild(uniqueKey).equalTo(uniqueKeyValue).once('value').then(s => s.val());
            console.log('found', ramda_1.keys(found).length, 'records with same', uniqueKey);
            if (ramda_1.keys(found).length > 1) {
                console.log('TRIGGERED deleted', event.data.ref.key);
                return event.data.ref.remove();
            }
        });
    };
}
exports.makeDuplicateBlocker = makeDuplicateBlocker;
function makeCountUpdater(parentCollection, foreignKey, targetKey) {
    return function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('key', event.data.ref.key, 'val', event.data.val());
            if (event.data.current.val() && event.data.previous.val()) {
                console.log('PASS existing record');
                return;
            }
            const foreignKeyValue = event.data.child(foreignKey).val() || event.data.previous.child(foreignKey).val();
            if (!foreignKeyValue) {
                console.log('PASS no foreign key', foreignKey);
            }
            const collection = event.data.ref.parent;
            if (!collection) {
                console.error('NO PARENT REF! SOMETHING HORRIBLY WRONG', event.data.ref.key);
                return;
            }
            const childs = yield collection.orderByChild(foreignKey).equalTo(foreignKeyValue).once('value').then(s => s.val());
            const count = ramda_1.keys(childs).length;
            console.log('TRIGGERED updating count', parentCollection, foreignKeyValue, count);
            return event.data.ref.root.child(parentCollection).child(foreignKeyValue).child(targetKey).set(count);
        });
    };
}
exports.makeCountUpdater = makeCountUpdater;
function makeSumUpdater(parentCollection, foreignKey, sumKey, targetKey) {
    return function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('key', event.data.ref.key, 'val', event.data.val());
            if (event.data.current.child(sumKey).val() === event.data.previous.child(sumKey).val()) {
                console.log('PASS summed field has not changed');
                return;
            }
            const foreignKeyValue = event.data.child(foreignKey).val() || event.data.previous.child(foreignKey).val();
            if (!foreignKeyValue) {
                console.log('PASS no foreign key', foreignKey);
            }
            const collection = event.data.ref.parent;
            if (!collection) {
                console.error('NO PARENT REF! SOMETHING HORRIBLY WRONG', event.data.ref.key);
                return;
            }
            const childs = yield collection.orderByChild(foreignKey).equalTo(foreignKeyValue).once('value').then(s => s.val());
            const total = ramda_1.sum(ramda_1.values(childs).map(c => c[sumKey]));
            console.log('TRIGGERED updating sum', parentCollection, foreignKeyValue, total);
            return event.data.ref.root.child(parentCollection).child(foreignKeyValue).child(targetKey).set(total);
        });
    };
}
exports.makeSumUpdater = makeSumUpdater;
//# sourceMappingURL=index.js.map