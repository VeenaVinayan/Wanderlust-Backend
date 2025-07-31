"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAuth = void 0;
const jwt_1 = require("../utils/jwt");
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
                    console.log(' No token provided !! --- in role auth');
                    res.status(403).json({ message: 'Unauthorized !' });
                    return;
                }
                const decoded = (0, jwt_1.verifyToken)(token);
                console.log('role auth ::', decoded);
                if (!roles.includes(req.user.role)) {
                    console.log(' No token provided !! --- in role auth-- invalid Token !!', req.user);
                    res.status(403).json({ message: 'Forbidden : Accesss denied  !' });
                    return;
                }
                next();
            }
            catch (err) {
                res.status(401).json({ message: 'Invlaid Token !' });
                return;
            }
        };
    }
}
exports.RoleAuth = RoleAuth;
