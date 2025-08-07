"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const agentRoute_1 = __importDefault(require("./routes/agentRoute"));
const morgan_1 = __importDefault(require("morgan"));
const socket_1 = require("./socket/socket");
const http_1 = __importDefault(require("http"));
const error_1 = __importDefault(require("./middlewares/error"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(server);
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(error_1.default);
const PORT = parseInt(process.env.PORT || '8001', 10);
morgan_1.default.token("body", (req) => JSON.stringify(req.body) || "No Body");
app.use((0, morgan_1.default)("Request Body: :body"));
const logDirectory = path_1.default.join(process.cwd(), 'src', 'logs');
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory);
}
console.log('Directory ::', __dirname);
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(logDirectory, 'access.log'), { flags: 'a' });
app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
app.use('/admin', adminRoute_1.default);
app.use('/auth', authRoute_1.default);
app.use('/user', userRoute_1.default);
app.use('/agent', agentRoute_1.default);
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
