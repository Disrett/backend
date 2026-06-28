"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var PostsController = function () {
    var _classDecorators = [(0, common_1.Controller)('posts')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _feed_decorators;
    var _create_decorators;
    var _remove_decorators;
    var _like_decorators;
    var _unlike_decorators;
    var _comment_decorators;
    var PostsController = _classThis = /** @class */ (function () {
        function PostsController_1(posts) {
            this.posts = (__runInitializers(this, _instanceExtraInitializers), posts);
        }
        // GET /api/posts?cursor=...
        PostsController_1.prototype.feed = function (cursor) {
            return this.posts.feed(cursor);
        };
        // POST /api/posts
        PostsController_1.prototype.create = function (me, dto) {
            return this.posts.create(me.id, dto);
        };
        // DELETE /api/posts/:id
        PostsController_1.prototype.remove = function (me, id) {
            return this.posts.remove(me.id, id);
        };
        // POST /api/posts/:id/like
        PostsController_1.prototype.like = function (me, id) {
            return this.posts.like(me.id, id);
        };
        // DELETE /api/posts/:id/like
        PostsController_1.prototype.unlike = function (me, id) {
            return this.posts.unlike(me.id, id);
        };
        // POST /api/posts/:id/comments
        PostsController_1.prototype.comment = function (me, id, dto) {
            return this.posts.addComment(me.id, id, dto);
        };
        return PostsController_1;
    }());
    __setFunctionName(_classThis, "PostsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _feed_decorators = [(0, common_1.Get)()];
        _create_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)()];
        _remove_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Delete)(':id')];
        _like_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)(':id/like')];
        _unlike_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Delete)(':id/like')];
        _comment_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)(':id/comments')];
        __esDecorate(_classThis, null, _feed_decorators, { kind: "method", name: "feed", static: false, private: false, access: { has: function (obj) { return "feed" in obj; }, get: function (obj) { return obj.feed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _like_decorators, { kind: "method", name: "like", static: false, private: false, access: { has: function (obj) { return "like" in obj; }, get: function (obj) { return obj.like; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unlike_decorators, { kind: "method", name: "unlike", static: false, private: false, access: { has: function (obj) { return "unlike" in obj; }, get: function (obj) { return obj.unlike; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _comment_decorators, { kind: "method", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsController = _classThis;
}();
exports.PostsController = PostsController;
