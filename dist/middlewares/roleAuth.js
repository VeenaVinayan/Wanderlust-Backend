"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAuth = void 0;
const StatusMessage_1 = require("../enums/StatusMessage");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
class RoleAuth {
    constructor() {
    }
    checkRole(roles) {
        return (req, res, next) => {
            var _a, _b;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: StatusMessage_1.StatusMessage.ACCESS_DENIED });
                    return;
                }
                if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) || !roles.includes(req.user.role)) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: StatusMessage_1.StatusMessage.ACCESS_DENIED });
                    return;
                }
                next();
            }
            catch (err) {
                console.log(err);
                res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.INVALID_TOKEN });
                return;
            }
        };
    }
}
exports.RoleAuth = RoleAuth;
