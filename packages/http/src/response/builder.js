function ResponseBuilder() {
    
    let statusCode = 200;
    let headers = [];
    let body = "";

    return this;
}

ResponseBuilder.prototype.ok = function() {
    this.statusCode = 200;
    return this;
};

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
    this.headers.push({header:value});
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