"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var argon2 = require("argon2");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwt) {
            this.prisma = prisma;
            this.jwt = jwt;
        }
        /** Inscription : crée l'utilisateur avec un mot de passe haché (argon2). */
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, passwordHash, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: { OR: [{ email: dto.email }, { username: dto.username }] },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException('Email ou nom d’utilisateur déjà utilisé');
                            }
                            return [4 /*yield*/, argon2.hash(dto.password)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email,
                                        username: dto.username,
                                        name: dto.name,
                                        passwordHash: passwordHash,
                                    },
                                })];
                        case 3:
                            user = _a.sent();
                            return [2 /*return*/, this.issueTokens(user.id, user.username)];
                    }
                });
            });
        };
        /** Connexion : vérifie l'email puis le mot de passe. */
        AuthService_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, valid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email },
                            })];
                        case 1:
                            user = _a.sent();
                            // Message volontairement générique pour ne pas révéler si l'email existe
                            if (!user)
                                throw new common_1.UnauthorizedException('Identifiants invalides');
                            return [4 /*yield*/, argon2.verify(user.passwordHash, dto.password)];
                        case 2:
                            valid = _a.sent();
                            if (!valid)
                                throw new common_1.UnauthorizedException('Identifiants invalides');
                            return [2 /*return*/, this.issueTokens(user.id, user.username)];
                    }
                });
            });
        };
        /** Renouvelle l'access token à partir d'un refresh token valide. */
        AuthService_1.prototype.refresh = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var user, matches;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: userId } })];
                        case 1:
                            user = _a.sent();
                            if (!user || !user.hashedRefreshToken) {
                                throw new common_1.UnauthorizedException('Accès refusé');
                            }
                            return [4 /*yield*/, argon2.verify(user.hashedRefreshToken, refreshToken)];
                        case 2:
                            matches = _a.sent();
                            if (!matches)
                                throw new common_1.UnauthorizedException('Accès refusé');
                            return [2 /*return*/, this.issueTokens(user.id, user.username)];
                    }
                });
            });
        };
        /** Déconnexion : invalide le refresh token stocké. */
        AuthService_1.prototype.logout = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.update({
                                where: { id: userId },
                                data: { hashedRefreshToken: null },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        /** Génère access + refresh token et stocke le hash du refresh en base. */
        AuthService_1.prototype.issueTokens = function (userId, username) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, _a, accessToken, refreshToken, _b, _c;
                var _d, _e;
                var _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            payload = { sub: userId, username: username };
                            return [4 /*yield*/, Promise.all([
                                    this.jwt.signAsync(payload, {
                                        secret: process.env.JWT_ACCESS_SECRET,
                                        expiresIn: (_f = process.env.JWT_ACCESS_EXPIRES_IN) !== null && _f !== void 0 ? _f : '15m',
                                    }),
                                    this.jwt.signAsync(payload, {
                                        secret: process.env.JWT_REFRESH_SECRET,
                                        expiresIn: (_g = process.env.JWT_REFRESH_EXPIRES_IN) !== null && _g !== void 0 ? _g : '7d',
                                    }),
                                ])];
                        case 1:
                            _a = _h.sent(), accessToken = _a[0], refreshToken = _a[1];
                            _c = (_b = this.prisma.user).update;
                            _d = {
                                where: { id: userId }
                            };
                            _e = {};
                            return [4 /*yield*/, argon2.hash(refreshToken)];
                        case 2: 
                        // Rotation : on stocke le hash du refresh token courant
                        return [4 /*yield*/, _c.apply(_b, [(_d.data = (_e.hashedRefreshToken = _h.sent(), _e),
                                    _d)])];
                        case 3:
                            // Rotation : on stocke le hash du refresh token courant
                            _h.sent();
                            return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
