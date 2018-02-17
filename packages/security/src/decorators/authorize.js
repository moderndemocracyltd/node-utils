const authorize = (requiredScopes) => {
    
    return (target, key, descriptor) => {

        const origin = descriptor.value;
        descriptor.value = function() {

            const {principalId, organisation, scopes} = arguments[0].security;
            const {requestId, sourceIp} = arguments[0].metadata;

            const grantedScopes = scopes.split(' ');
            if(!requiredScopes.every(scope => grantedScopes.includes(scope))) {
                console.log(`AUDIT - Not Authorized: {Class: ${target}, Method: ${key}, Principal: ${principalId}, Organisation: ${organisation}, RequestId: ${requestId}, SourceIP: ${sourceIp}}`);
                throw {name:"AuthorizationError", message: "Unauthorized"};
            }
            return origin.apply(this, arguments);
        };
        return descriptor;
    };
};

export default authorize;