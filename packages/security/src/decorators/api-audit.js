const auditApi = () => {

    return (target, key, descriptor) => {

        const origin = descriptor.value;
        descriptor.value = function() {
            const {principalId, organisation} = arguments[0].security;
            const {requestId, sourceIp} = arguments[0].metadata;
            console.log(`AUDIT - Execution: {Class: ${target}, Method: ${key}, Principal: ${principalId}, Organisation: ${organisation}, RequestId: ${requestId}, SourceIP: ${sourceIp}}`);
            return origin.apply(this, arguments);
        };
        return descriptor;
    };
};

export default auditApi;