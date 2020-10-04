"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
var ws_1 = __importDefault(require("ws"));
var fileUtil_1 = require("./util/fileUtil");
var path_1 = __importDefault(require("path"));
var request_1 = __importDefault(require("request"));
var requestUtil_1 = require("./util/requestUtil");
function connect(aggregatorSocketUrl) {
    var socket = null;
    var url = aggregatorSocketUrl + "?connectionType=consumer";
    function start() {
        try {
            console.log(process.memoryUsage());
            socket = new ws_1.default(url);
            socket.onopen = function () {
                console.info("Connected to aggregator @ " + aggregatorSocketUrl);
            };
            socket.on("message", function (data) {
                try {
                    var message = JSON.parse(data.toString());
                    if (message) {
                        console.log("Recieved message");
                        archiveMessage(message);
                    }
                }
                catch (e) {
                    if (e instanceof SyntaxError) {
                        console.error("Failed to parse message. Incorrect format... " + e);
                    }
                }
            });
            socket.on("close", function (code, reason) {
                // TODO: Handle closure codes and display appropritae messages to the logs.
                console.error("Connection to aggregator closed. CODE " + code + ". REASON " + (reason !== null && reason !== void 0 ? reason : "NULL") + " Reconnection attempt will occur in 5 seconds...");
            });
            socket.on("error", function (error) {
                // TODO: Handle closure codes and display appropritae messages to the logs.
                console.error("Connection to aggregator failed. ERROR: " + error);
            });
        }
        catch (e) {
            setTimeout(function () {
                connect(url);
            }, 5000);
        }
    }
    function check() {
        if (!socket || socket.readyState === ws_1.default.CLOSED) {
            start();
        }
    }
    start();
    setInterval(check, 5000);
}
exports.connect = connect;
function archiveMessage(message) {
    var today = new Date().toISOString().slice(0, 10);
    if (process.env.COMBILOG_ARCHIVE_ROOT) {
        var hotDir = path_1.default.join(process.env.COMBILOG_ARCHIVE_ROOT, "hot");
        fileUtil_1.writeToLogFile(hotDir, today + ".log", message.content);
        // Once we have written to the 'hot' file, then we write to the specific folder for something else.
        var serviceDir = path_1.default.join(process.env.COMBILOG_ARCHIVE_ROOT, "service", message.service.friendlyName);
        fileUtil_1.writeToLogFile(serviceDir, today + ".log", message.content);
        setTimeout(function () {
            var _a;
            request_1.default.delete("" + process.env.COMBILOG_AGGREGATOR_API_URL + requestUtil_1.endpoints.aggreagtor.message.delete.replace("{messageId}", (_a = message.id) !== null && _a !== void 0 ? _a : ""), {}, function (error, response, body) {
                if (error) {
                    console.error("Failed to remove message " + message.id + ". Error: " + error);
                }
                else {
                    if (response.statusCode !== 200) {
                        console.error(body);
                    }
                    else {
                        console.log(JSON.parse(body).message);
                    }
                }
            });
        }, 5000);
    }
    else {
        throw new Error("COMBILOG_ARCHIVE_ROOT not set.");
    }
}
