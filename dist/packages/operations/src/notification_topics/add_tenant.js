'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('../services/s3/index');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notificationsAddTenant = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(env, tenant) {
        var bucket_errors, r, NOTIFICATIONS_DATA_BUCKET, S3_CLIENT, TOPICS_FILE_NAME, bucketExists, message, topicsContent, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!_constants.ENVIRONMENTS.includes(env)) {
                            console.error('The supplied environment (' + env + ') is not in the accept list of environments.');
                            console.error("Accepted environments = ", _constants.ENVIRONMENTS);
                            process.exit(1);
                        }

                        bucket_errors = [];

                        // Adds the new tenant to all currently used regions

                        r = 0;

                    case 3:
                        if (!(r < _constants.REGIONS.length)) {
                            _context.next = 43;
                            break;
                        }

                        _context.prev = 4;
                        NOTIFICATIONS_DATA_BUCKET = 'notifications-topics-subscribers-' + env + '-' + _constants.REGIONS[r];
                        S3_CLIENT = new _index.S3Filesystem(NOTIFICATIONS_DATA_BUCKET);
                        TOPICS_FILE_NAME = 'DecsTestNotificationTopics.json';

                        // Checks if bucket exists, if there is an error a message is added to an array for displaying at the end

                        _context.next = 10;
                        return S3_CLIENT.bucketExists();

                    case 10:
                        bucketExists = _context.sent;

                        if (bucketExists) {
                            _context.next = 16;
                            break;
                        }

                        message = 'Bucket ' + NOTIFICATIONS_DATA_BUCKET + ' doesn\'t exist.';

                        console.error(message);
                        bucket_errors.push(message);
                        return _context.abrupt('continue', 40);

                    case 16:
                        _context.next = 18;
                        return S3_CLIENT.readFile(TOPICS_FILE_NAME);

                    case 18:
                        topicsContent = _context.sent;

                        if (typeof topicsContent === 'string') {
                            topicsContent = JSON.parse(topicsContent);
                        }
                        // Ensures the data was retrieved successfully
                        if ('statusCode' in topicsContent) {
                            if (topicsContent.statusCode === 404) {
                                console.log('The supplied file name (' + TOPICS_FILE_NAME + ') does not exist.');
                                console.log("This process will create a new file.");
                                topicsContent = {};
                            } else if (topicsContent.statusCode > 400) {
                                console.error("There was an error while trying to retrieve the file contents: ");
                                console.error(topicsContent);
                                process.exit(1);
                            }
                        }

                        // Does nothing if tenant already exists

                        if (!(tenant in topicsContent)) {
                            _context.next = 25;
                            break;
                        }

                        console.log('Tenant ' + tenant + ' already exists, done.');
                        _context.next = 33;
                        break;

                    case 25:
                        console.log('tenant ' + tenant + ' not found, setting up tenant...');
                        // Adds an empty object for the tenant then adds the topics to the new tenant object
                        topicsContent[tenant] = {};
                        topicsContent[tenant] = _constants.CURRENT_TOPICS;

                        console.log("topicsContent = ", JSON.stringify(topicsContent, null, 2));
                        // Uploads the whole data object to a file in S3 and creates a new file if it doesn't already exist
                        _context.next = 31;
                        return S3_CLIENT.writeFile(TOPICS_FILE_NAME, JSON.stringify(topicsContent, null, 2));

                    case 31:
                        result = _context.sent;


                        if ('err' in result) {
                            console.error(result.err);
                            process.exit(1);
                        } else {
                            console.log('Update Successfully Completed:');
                            console.log('Location = ', result.Location);
                            console.log('Bucket = ', result.Bucket);
                        }

                    case 33:
                        _context.next = 40;
                        break;

                    case 35:
                        _context.prev = 35;
                        _context.t0 = _context['catch'](4);

                        console.error("An error occurred: ");
                        console.error(_context.t0);
                        process.exit(1);

                    case 40:
                        r++;
                        _context.next = 3;
                        break;

                    case 43:

                        if (bucket_errors.length > 0) {
                            console.error("There were errors while trying to access buckets: ");
                            console.error(bucket_errors);
                            process.exit(1);
                        }

                    case 44:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[4, 35]]);
    }));

    return function notificationsAddTenant(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = notificationsAddTenant;
//# sourceMappingURL=add_tenant.js.map