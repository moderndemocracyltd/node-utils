const lambda = (requestMapper) => {
    return (target, key, descriptor) => {
        const origin = descriptor.value;
        descriptor.value = function() {
            const newArguments = requestMapper.transform(arguments);
            return origin.apply(this, newArguments);
        };
        return descriptor;
    };
};

export default lambda;