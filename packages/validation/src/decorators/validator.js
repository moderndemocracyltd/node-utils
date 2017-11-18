const validate = (validator) => {
    return function decorator(target, key, descriptor) {

        const originalDescriptorValue = descriptor.value;

        descriptor.value = function() {

            const validationResults = validator.validate(arguments);

            if(validationResults.length > 0) {
                throw {name:"ValidationError", message: "Invalid validation target", errors: validationResults};
            }
            
            return originalDescriptorValue.apply(this, arguments);
        };

        return descriptor;
    };
};

export default validate;