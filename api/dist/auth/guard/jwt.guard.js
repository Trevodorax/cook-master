"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaulJwtGuard = void 0;
const passport_1 = require("@nestjs/passport");
class PaulJwtGuard extends (0, passport_1.AuthGuard)('paul-jwt') {
    constructor() {
        super();
    }
}
exports.PaulJwtGuard = PaulJwtGuard;
//# sourceMappingURL=jwt.guard.js.map