function ResponseBuilder() {
    
    let statusCode = 200;
    let body = "";

    // Enable CORS for all requests
    
    if (!this.headers) {
        this.headers = {};
    }
    
    this.headers["Access-Control-Allow-Headers"] = 'Content-Type,Authorization';
    this.headers["Access-Control-Allow-Methods"] = "'*'";
    this.headers["Access-Control-Allow-Origin"] = "'*'";

    return this;
}

ResponseBuilder.prototype.ok = function() {
    this.statusCode = 200;
    return this;
};

ResponseBuilder.prototype.status = function(httpStatus) {
    this.statusCode = httpStatus;
    return this;
}

ResponseBuilder.prototype.conflict = function () {
    this.statusCode = 409;
    return this;
};

ResponseBuilder.prototype.missing = function() {
    this.statusCode = 404;
    return this;
};

ResponseBuilder.prototype.error = function() {
    this.statusCode = 503;
    return this;
};

ResponseBuilder.prototype.header = function(header, value) {
    
    if(!this.headers) {
        this.headers = {};
    }

    this.headers[header] = value;
    return this;
};

ResponseBuilder.prototype.body = function(object) {
    this.body = JSON.stringify(object);
    return this;
};

ResponseBuilder.prototype.get = function () {

    return {statusCode, headers, body};
};

export default ResponseBuilder;