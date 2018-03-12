const ENVIRONMENTS = ['dev', 'test', 'demo', 'prod'];

const REGIONS = ['eu-west-1', 'eu-central-1', 'eu-west-2'];

const CURRENT_TOPICS = {
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

export {ENVIRONMENTS, REGIONS, CURRENT_TOPICS};