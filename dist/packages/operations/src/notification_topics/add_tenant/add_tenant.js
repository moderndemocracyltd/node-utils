'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('../../services/s3/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ELECTIONS_UPLOAD_BUCKET = 'notifications-topics-subscribers-dev-eu-west-1';
var s3Client = new _index.S3Filesystem(ELECTIONS_UPLOAD_BUCKET);

var addTenant = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(tenant) {
        var notificationTopicsContent;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        console.log("bucket = ", ELECTIONS_UPLOAD_BUCKET);
                        _context.t0 = JSON;
                        _context.next = 4;
                        return s3Client.readFile('notificationTopics.json');

                    case 4:
                        _context.t1 = _context.sent;
                        notificationTopicsContent = _context.t0.parse.call(_context.t0, _context.t1);

                        console.log("notificationTopicsContent = ", JSON.stringify(notificationTopicsContent, null, 4));

                        if (tenant in notificationTopicsContent) {
                            console.log('Tenant ' + tenant + ' already exists');
                        } else {
                            console.log('tenant ' + tenant + ' not found, setting up tenant');
                            notificationTopicsContent[tenant] = '';
                        }

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function addTenant(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = addTenant;


addTenant("2");
//# sourceMappingURL=add_tenant.js.map