"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAuth = void 0;
const jwt_1 = require("../utils/jwt");
const StatusMessage_1 = require("../enums/StatusMessage");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
class RoleAuth {
    constructor() {
        this.secret = process.env.JWT_SECRET;
    }
    checkRole(roles) {
        return (req, res, next) => {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: StatusMessage_1.StatusMessage.ACCESS_DENIED });
                    return;
                }
                const decoded = (0, jwt_1.verifyToken)(token);
                if (!roles.includes(req.user.role)) {
                    res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({ message: StatusMessage_1.StatusMessage.ACCESS_DENIED });
                    return;
                }
                next();
            }
            catch (err) {
                res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND).json({ message: StatusMessage_1.StatusMessage.INVALID_TOKEN });
                return;
            }
        };
    }
}
exports.RoleAuth = RoleAuth;
// public checkRole(roles: string[]): RequestHandler {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) {
//         console.log(' No token provided !! --- in role auth');
//         res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.ACCESS_DENIED});
//         return;
//       }
//       const decoded = verifyToken(token);
//       console.log('role auth ::', decoded);
//      const user = decoded as IUserPayload;
//       (req as AuthRequest).user = user;
//       if (!roles.includes(user.role)) {
//         console.log('Access denied !! --- in role auth-- invalid role !!', user);
//         res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.ACCESS_DENIED });
//         return;
//       }
//       next();
//     } catch (err) {
//       res.status(HttpStatusCode.NOT_FOUND).json({ message: StatusMessage.INVALID_TOKEN });
//     }
//   };
// }
// }
