'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var S3Filesystem = function () {
    function S3Filesystem(bucket) {
        (0, _classCallCheck3.default)(this, S3Filesystem);

        this.bucket = bucket;
        this.client = new _awsSdk2.default.S3({ signatureVersion: 'v4' });
    }

    (0, _createClass3.default)(S3Filesystem, [{
        key: 'readFile',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(path) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.client.getObject({ Bucket: this.bucket, Key: path }).promise().then(function (data) {
                                    return data.Body.toString();
                                }).catch(function (err) {
                                    return { statusCode: err.statusCode, message: err.message };
                                });

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function readFile(_x) {
                return _ref.apply(this, arguments);
            }

            return readFile;
        }()
    }, {
        key: 'writeFile',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path, payload) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.client.upload({ Bucket: this.bucket, Key: path, Body: payload, ContentType: 'application/json' }).promise().then(function (data) {
                                    return data;
                                }).catch(function (err) {
                                    return { err: err };
                                });

                            case 2:
                                return _context2.abrupt('return', _context2.sent);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function writeFile(_x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return writeFile;
        }()
    }, {
        key: 'bucketExists',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.client.headBucket({ Bucket: this.bucket }).promise().then(function () {
                                    return true;
                                }).catch(function (err) {
                                    if (err.statusCode === 404) {
                                        return false;
                                    } else {
                                        console.error("An error occurred while checking if bucket exists: ");
                                        console.error(err.code);
                                        return false;
                                    }
                                });

                            case 2:
                                return _context3.abrupt('return', _context3.sent);

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function bucketExists() {
                return _ref3.apply(this, arguments);
            }

            return bucketExists;
        }()
    }]);
    return S3Filesystem;
}();

exports.default = S3Filesystem;
//# sourceMappingURL=filesystem.js.map