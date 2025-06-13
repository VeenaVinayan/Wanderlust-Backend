"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
;
const auth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || "travel123456";
        if (!token) {
            res.status(401).json({ error: 'Unauthorized - Token not provided !!' });
            return;
        }
        let decodedToken;
        try {
            decodedToken = (0, jwt_1.verifyToken)(token, jwtSecret);
            next();
        }
        catch (err) {
            console.error('JWT Verfication Error !', err);
            res.status(401).json({ message: 'Unauthorized Invalid Token !' });
        }
    }
    catch (err) {
        throw err;
    }
};
exports.default = auth;
