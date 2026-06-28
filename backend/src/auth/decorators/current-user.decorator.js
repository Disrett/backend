"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
var common_1 = require("@nestjs/common");
/**
 * Récupère l'utilisateur authentifié dans un contrôleur :
 *   maRoute(@CurrentUser() user: { id: string; username: string }) { ... }
 */
exports.CurrentUser = (0, common_1.createParamDecorator)(function (_data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    return request.user;
});
