const authorize = (scopes) => {
    
    return (target, key, descriptor) => {

        const origin = descriptor.value;
        descriptor.value = function() {
            const grantedScopes = arguments[0].security.scopes.split(' ');
            if(!scopes.every(scope => grantedScopes.includes(scope))) {
                throw new Error("Forbidden");
            }
            return origin.apply(this, arguments);
        };
        return descriptor;
    };
};

export default authorize;