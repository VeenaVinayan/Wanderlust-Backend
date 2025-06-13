"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordResult = void 0;
var ResetPasswordResult;
(function (ResetPasswordResult) {
    ResetPasswordResult[ResetPasswordResult["INVALID_OLD_PASSWORD"] = 1] = "INVALID_OLD_PASSWORD";
    ResetPasswordResult[ResetPasswordResult["SUCCESS"] = 2] = "SUCCESS";
    ResetPasswordResult[ResetPasswordResult["PASSWORDS_DO_NOT_MATCH"] = 3] = "PASSWORDS_DO_NOT_MATCH";
    ResetPasswordResult[ResetPasswordResult["USER_NOT_FOUND"] = 4] = "USER_NOT_FOUND";
})(ResetPasswordResult || (exports.ResetPasswordResult = ResetPasswordResult = {}));
