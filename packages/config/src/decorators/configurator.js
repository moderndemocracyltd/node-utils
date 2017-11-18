const configure = (configurator) => {
    return function decorator(target, key, descriptor) {
        const originalDescriptorValue = descriptor.value;
        descriptor.value = async function() {
            const configurationOptions = await configurator.configure();
            const newArgs = Array.from(arguments);
            newArgs.push(configurationOptions);
            return originalDescriptorValue.apply(this, newArgs);
        };
        
        return descriptor;
    };
};

export default configure;