"use strict";
// libs/shared-types/src/interfaces/dating.interfaces.ts
/**
 * Dating App Specific Types
 * Shared between frontend and backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthView = void 0;
// UI Component Types
var AuthView;
(function (AuthView) {
    AuthView["LOGIN"] = "login";
    AuthView["SIGNUP"] = "signup";
    AuthView["FORGOT_PASSWORD"] = "forgotPassword";
})(AuthView || (exports.AuthView = AuthView = {}));
