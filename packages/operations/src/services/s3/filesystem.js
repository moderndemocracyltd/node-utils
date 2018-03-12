import AWS from 'aws-sdk';

class S3Filesystem {

    constructor(bucket) {
        this.bucket = bucket;
        this.client = new AWS.S3({signatureVersion: 'v4'});
    }

    async readFile(path) {
        return await this.client.getObject({Bucket: this.bucket, Key: path})
            .promise()
            .then((data) => {
                return data.Body.toString();
            })
            .catch((err) => {
                return {statusCode: err.statusCode, message: err.message};
            });

    }

    async writeFile(path, payload) {
        return await this.client.upload({Bucket: this.bucket, Key: path, Body: payload, ContentType: 'application/json'})
            .promise()
            .then((data) => {
                return data;
            })
            .catch((err) => {
                return {err: err};
            });
    }

    async bucketExists() {
        return await this.client.headBucket({Bucket: this.bucket})
            .promise()
            .then(() => {
                return true;
            })
            .catch((err) => {
                if (err.statusCode === 404) {
                    return false;
                }
                else {
                    console.error("An error occurred while checking if bucket exists: ");
                    console.error(err.code);
                    return false;
                }
            });
    }
}

export default S3Filesystem;