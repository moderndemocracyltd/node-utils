class DefaultRequestMapper {
    transform(args) {
        const lambdaBody = { request: {}, security: {}, metadata: {} };
        lambdaBody.request = JSON.parse(args[0].body);
        lambdaBody.pathParameters = args[0].pathParameters;
        lambdaBody.queryStringParameters = args[0].queryStringParameters;
        lambdaBody.security.scopes = args[0].requestContext.authorizer.scope || '';
        lambdaBody.security.apiKey = args[0].requestContext.identity.apiKey || '';
        lambdaBody.security.principalId = args[0].requestContext.authorizer.principalId || '';
        lambdaBody.security.organisation = args[0].requestContext.authorizer.organisation || '';
        lambdaBody.metadata.requestId = args[0].requestContext.requestId || '';
        lambdaBody.metadata.sourceIp = args[0].requestContext.identity.sourceIp || '';
        args[0] = lambdaBody;
        return args;
    }
}

export default DefaultRequestMapper;