'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ENVIRONMENTS = ['dev', 'test', 'demo', 'prod'];

var REGIONS = ['eu-west-1', 'eu-central-1', 'eu-west-2'];

var CURRENT_TOPICS = {
    'election-manager/election-files/download': {
        "publishMethods": ["iot", "ses"]
    },
    'election-manager/data-import-process/complete': {
        "publishMethods": ["iot", "ses"]
    },
    'election-manager/data-import-process/failed': {
        "publishMethods": ["iot", "ses"]
    }
};

exports.ENVIRONMENTS = ENVIRONMENTS;
exports.REGIONS = REGIONS;
exports.CURRENT_TOPICS = CURRENT_TOPICS;
//# sourceMappingURL=constants.js.map