'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.notificationsDeleteTenant = exports.notificationsAddTenant = undefined;

var _add_tenant = require('./notification_topics/add_tenant');

var _add_tenant2 = _interopRequireDefault(_add_tenant);

var _delete_tenant = require('./notification_topics/delete_tenant');

var _delete_tenant2 = _interopRequireDefault(_delete_tenant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.notificationsAddTenant = _add_tenant2.default;
exports.notificationsDeleteTenant = _delete_tenant2.default;


(0, _add_tenant2.default)("dev", "2").then();

(0, _delete_tenant2.default)("dev", "2").then();
//# sourceMappingURL=index.js.map