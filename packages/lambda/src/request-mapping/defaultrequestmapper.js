class DefaultRequestMapper {
    transform(args) {
        const lambdaBody = { request: {}, security: {}, metadata: {} };
        lambdaBody.request = JSON.parse(args[0].body || "{}");
        lambdaBody.pathParameters = args[0].pathParameters || {};
        lambdaBody.queryStringParameters = args[0].queryStringParameters || {};
        lambdaBody.security.scopes = args[0].requestContext.authorizer.scope || '';
        lambdaBody.security.assignments = JSON.parse(args[0].requestContext.authorizer.assignments || "{}");
        lambdaBody.security.apiKey = args[0].requestContext.identity.apiKey || '';
        lambdaBody.security.principalId = args[0].requestContext.authorizer.principalId || '';
        lambdaBody.security.organisation = args[0].requestContext.authorizer.organisation || '';
        lambdaBody.security.accessToken = parseAuthorizationToken(args[0].headers.Authorization);
        lambdaBody.metadata.requestId = args[0].requestContext.requestId || '';
        lambdaBody.metadata.sourceIp = args[0].requestContext.identity.sourceIp || '';
        args[0] = lambdaBody;
        return args;
    }
}

function parseAuthorizationToken(token) {

    if(!token) {
        return ""
    }

    const matches = token.match(/^Bearer (.*)$/);

    if(!matches || matches.length < 2) {
        return ""
    }

    return matches[1];
}

export default DefaultRequestMapper;