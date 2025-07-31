"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellBookingResult = exports.ResetPasswordResult = void 0;
var ResetPasswordResult;
(function (ResetPasswordResult) {
    ResetPasswordResult[ResetPasswordResult["INVALID_OLD_PASSWORD"] = 1] = "INVALID_OLD_PASSWORD";
    ResetPasswordResult[ResetPasswordResult["SUCCESS"] = 2] = "SUCCESS";
    ResetPasswordResult[ResetPasswordResult["PASSWORDS_DO_NOT_MATCH"] = 3] = "PASSWORDS_DO_NOT_MATCH";
    ResetPasswordResult[ResetPasswordResult["USER_NOT_FOUND"] = 4] = "USER_NOT_FOUND";
})(ResetPasswordResult || (exports.ResetPasswordResult = ResetPasswordResult = {}));
var CancellBookingResult;
(function (CancellBookingResult) {
    CancellBookingResult[CancellBookingResult["SUCCESS"] = 1] = "SUCCESS";
    CancellBookingResult[CancellBookingResult["CONFLICT"] = 2] = "CONFLICT";
    CancellBookingResult[CancellBookingResult["ID_NOT_FOUND"] = 3] = "ID_NOT_FOUND";
    CancellBookingResult[CancellBookingResult["EXCEEDED_CANCELLATION_LIMIT"] = 4] = "EXCEEDED_CANCELLATION_LIMIT";
    CancellBookingResult[CancellBookingResult["ALREADY_CANCELLED"] = 5] = "ALREADY_CANCELLED";
})(CancellBookingResult || (exports.CancellBookingResult = CancellBookingResult = {}));
