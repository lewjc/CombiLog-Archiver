"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var fileUtil_1 = require("./util/fileUtil");
var index_1 = __importDefault(require("./routes/index"));
var socket_1 = require("./socket");
var app = express_1.default();
dotenv_1.default.config();
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
var port = (_a = process.env.COMBILOG_ARCHIVE_PORT) !== null && _a !== void 0 ? _a : 13338;
if (process.env.COMBILOG_ARCHIVE_ROOT && process.env.COMBILOG_AGGREGATOR_SOCKET_URL) {
    // Initalise directories that may or may not exist on startup.`
    fileUtil_1.createDirectory(process.env.COMBILOG_ARCHIVE_ROOT, "hot");
    fileUtil_1.createDirectory(process.env.COMBILOG_ARCHIVE_ROOT, "service");
    fileUtil_1.createDirectory(process.env.COMBILOG_ARCHIVE_ROOT, "archive");
    fileUtil_1.checkHotRecords();
    var aggregatorUrl_1 = process.env.COMBILOG_AGGREGATOR_SOCKET_URL;
    // Set our hot record archive check to run once per hour.
    setInterval(fileUtil_1.checkHotRecords, 1000 * 60 * 60);
    app.use("/api", index_1.default);
    app.listen(port, function () {
        console.log("Listening on port " + port);
        socket_1.connect(aggregatorUrl_1);
    });
}
else {
    throw new Error("Missing one of [COMBILOG_ARCHIVE_ROOT, COMBILOG_AGGREGATOR_SOCKET_URL] env variables.");
}
