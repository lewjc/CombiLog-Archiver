"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHotRecords = exports.getLogStructure = exports.getFileContents = exports.createDirectory = exports.writeToLogFile = exports.createLogFile = void 0;
var uuid_1 = require("uuid");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function createLogFile(directory, fileName) {
    var filePath = path_1.default.join(directory, fileName);
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.closeSync(fs_1.default.openSync(filePath, "w"));
    }
}
exports.createLogFile = createLogFile;
function writeToLogFile(directory, fileName, content) {
    var filePath = path_1.default.join(directory, fileName);
    if (!fs_1.default.existsSync(directory)) {
        createDirectory(directory, "");
    }
    if (!fs_1.default.existsSync(filePath)) {
        createLogFile(directory, fileName);
    }
    fs_1.default.appendFileSync(filePath, content + "\n");
}
exports.writeToLogFile = writeToLogFile;
function createDirectory(parent, dir) {
    var directoryPath = path_1.default.join(parent, dir);
    if (!fs_1.default.existsSync(directoryPath)) {
        fs_1.default.mkdirSync(directoryPath);
    }
}
exports.createDirectory = createDirectory;
function getFileContents(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, fs_1.default.promises.readFile(path, { encoding: "utf-8" }).catch(function (err) {
                    console.error(err);
                    return null;
                })];
        });
    });
}
exports.getFileContents = getFileContents;
function getLogStructure(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files, treeStucture_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getFiles(dir)];
                case 1:
                    files = _a.sent();
                    files = files.map(function (file) { return standardisePath(dir, file); });
                    treeStucture_1 = {
                        id: "root",
                        name: "root",
                        children: [],
                    };
                    files.forEach(function (filePath) {
                        var paths = filePath.split("/");
                        var isServiceLog = paths[1] === "service";
                        paths.forEach(function (pathItem, idx) {
                            var ref = treeStucture_1;
                            switch (idx) {
                                case 0: {
                                    ref.name = pathItem;
                                    break;
                                }
                                case 1: {
                                    if (ref.children.filter(function (x) { return x.name === pathItem; }).length === 0) {
                                        ref.children.push({
                                            id: uuid_1.v4(),
                                            name: pathItem,
                                            children: [],
                                        });
                                    }
                                    break;
                                }
                                case 2: {
                                    var parent = ref.children.filter(function (x) { return x.name === paths[idx - 1]; }).pop();
                                    if (parent.children.filter(function (x) { return x.name === pathItem; }).length === 0) {
                                        var treeItem = {
                                            id: uuid_1.v4(),
                                            name: pathItem,
                                        };
                                        if (!isServiceLog) {
                                            treeItem["viewable"] = true;
                                            treeItem["path"] = filePath;
                                        }
                                        else {
                                            treeItem["children"] = [];
                                        }
                                        parent.children.push(treeItem);
                                    }
                                    break;
                                }
                                case 3: {
                                    var treeItem = {
                                        id: uuid_1.v4(),
                                        name: pathItem,
                                    };
                                    treeItem["viewable"] = true;
                                    treeItem["path"] = filePath;
                                    var parent = ref.children
                                        .filter(function (x) { return x.name === paths[idx - 2]; })
                                        .pop()
                                        .children.filter(function (x) { return x.name === paths[idx - 1]; })
                                        .pop();
                                    parent.children.push(treeItem);
                                    break;
                                }
                            }
                        });
                    });
                    return [2 /*return*/, treeStucture_1];
                case 2:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getLogStructure = getLogStructure;
function getFiles(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var dirents, files;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fs_1.default.promises.readdir(dir, { withFileTypes: true })];
                case 1:
                    dirents = _b.sent();
                    return [4 /*yield*/, Promise.all(dirents.map(function (dirent) {
                            var res = path_1.default.resolve(dir, dirent.name);
                            return dirent.isDirectory() ? getFiles(res) : res;
                        }))];
                case 2:
                    files = _b.sent();
                    return [2 /*return*/, (_a = Array.prototype).concat.apply(_a, __spread(files))];
            }
        });
    });
}
function checkHotRecords() {
    // If there is a record hot record is from yesterday, we need to move it into archive
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (process.env.COMBILOG_ARCHIVE_ROOT) {
        var archiveRoot_1 = process.env.COMBILOG_ARCHIVE_ROOT;
        var hotDir_1 = path_1.default.join(archiveRoot_1, "hot");
        var files = fs_1.default.readdirSync(hotDir_1);
        files.forEach(function (file) {
            var dateString = file.replace(".log", "");
            var logDate = new Date(dateString);
            logDate.setDate(logDate.getDate() + 4);
            if (logDate < today) {
                var currentPath = path_1.default.join(hotDir_1, file);
                var newPath = path_1.default.join(archiveRoot_1, "archive", file);
                console.log("Archiving file " + currentPath + " to " + newPath + ". No longer hot.");
                fs_1.default.renameSync(currentPath, newPath);
            }
        });
    }
}
exports.checkHotRecords = checkHotRecords;
function standardisePath(dir, file) {
    var _a;
    return file
        .replace(dir, (_a = dir.replace(/\\\\/g, "\\").split(path_1.default.sep).pop()) !== null && _a !== void 0 ? _a : "")
        .replace(/\\/g, "/");
}
