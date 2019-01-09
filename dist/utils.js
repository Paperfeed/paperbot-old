"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function fetchAsync(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield node_fetch_1.default(url);
        return yield result.json();
    });
}
exports.fetchAsync = fetchAsync;
exports.UrlBuildParams = (obj) => Object.entries(obj).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
//# sourceMappingURL=utils.js.map